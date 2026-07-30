/**
 * Submits the freshly built URL set to IndexNow.
 *
 * IndexNow is shared by Bing, Yandex, Seznam and Naver. Bing's index is what
 * backs Copilot and ChatGPT search, so prompt submission here matters more for
 * AI visibility than it does for classic search rankings.
 *
 * Usage: `node scripts/indexnow-ping.mjs` after a build, with INDEXNOW_KEY set.
 * Google does not participate in IndexNow and discovers URLs from the sitemap.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const sitemapPath = path.join(projectRoot, 'dist', 'sitemap.xml');

const ENDPOINT = 'https://api.indexnow.org/IndexNow';
const MAX_URLS_PER_REQUEST = 10_000;

const key = process.env.INDEXNOW_KEY;
if (!key) {
  console.log('INDEXNOW_KEY is not set. Skipping IndexNow submission.');
  process.exit(0);
}

let sitemap;
try {
  sitemap = await fs.readFile(sitemapPath, 'utf8');
} catch {
  console.error(`Could not read ${sitemapPath}. Run the build first.`);
  process.exit(1);
}

const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) =>
  url.replace(/&amp;/g, '&').trim(),
);

if (urls.length === 0) {
  console.error('No <loc> entries found in the sitemap. Nothing to submit.');
  process.exit(1);
}

const host = new URL(urls[0]).host;
const siteOrigin = new URL(urls[0]).origin;

// Every submitted URL must share the host that owns the key file, otherwise the
// whole batch is rejected.
const offHostUrls = urls.filter((url) => new URL(url).host !== host);
if (offHostUrls.length > 0) {
  console.error(`Refusing to submit: ${offHostUrls.length} URL(s) do not belong to ${host}.`);
  process.exit(1);
}

const batches = [];
for (let index = 0; index < urls.length; index += MAX_URLS_PER_REQUEST) {
  batches.push(urls.slice(index, index + MAX_URLS_PER_REQUEST));
}

let failed = false;

for (const [index, batch] of batches.entries()) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `${siteOrigin}/${key}.txt`,
      urlList: batch,
    }),
  });

  // 200 accepted, 202 accepted but key still being validated.
  if (response.ok || response.status === 202) {
    console.log(`IndexNow batch ${index + 1}/${batches.length}: submitted ${batch.length} URLs (HTTP ${response.status}).`);
  } else {
    failed = true;
    console.error(
      `IndexNow batch ${index + 1}/${batches.length} failed with HTTP ${response.status}: ${await response.text()}`,
    );
  }
}

process.exit(failed ? 1 : 0);
