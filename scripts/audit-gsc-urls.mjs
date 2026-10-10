import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const baseline = JSON.parse(await readFile('docs/gsc-url-baseline-2026-10-10.json', 'utf8'));
const results = [];
for (const [group, urls] of Object.entries(baseline.groups)) {
  for (const url of urls) {
    const chain = [];
    let target = url;
    try {
      for (let hop = 0; hop < 6; hop++) {
        const response = await fetch(target, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
        chain.push({ url: target, status: response.status });
        const location = response.headers.get('location');
        if (response.status >= 300 && response.status < 400 && location) {
          target = new URL(location, target).href;
          await response.body?.cancel();
          continue;
        }
        const html = response.headers.get('content-type')?.includes('text/html') ? await response.text() : '';
        const document = new JSDOM(html).window.document;
        results.push({ group, url, chain, canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
          robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null,
          robotsHeader: response.headers.get('x-robots-tag'), title: document.title });
        break;
      }
    } catch (error) { results.push({ group, url, chain, error: String(error) }); }
  }
}
await mkdir('output/visibility-audit', { recursive: true });
await writeFile('output/visibility-audit/gsc-live-responses.json', JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));
console.log(JSON.stringify(results.map(({ group, url, chain, robots, robotsHeader, error }) => ({ group, url, statuses: chain.map(v => v.status), robots, robotsHeader, error })), null, 2));
