import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const sitemapPath = path.join(distDir, 'sitemap.xml');

const contentTypeFor = (filePath) => {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.xml')) return 'application/xml; charset=utf-8';
  if (filePath.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.webp')) return 'image/webp';
  if (filePath.endsWith('.ico')) return 'image/x-icon';
  return 'application/octet-stream';
};

const safeFileCandidates = (pathname) => {
  const decoded = decodeURIComponent(pathname);
  const relativePath = decoded.replace(/^\/+/, '');
  const normalized = path.normalize(relativePath);

  if (normalized.startsWith('..') || path.isAbsolute(normalized)) return [];
  if (!normalized || normalized === '.') return [path.join(distDir, 'index.html')];

  return [path.join(distDir, normalized, 'index.html'), path.join(distDir, normalized)];
};

const resolvePublicFile = async (pathname) => {
  for (const candidate of safeFileCandidates(pathname)) {
    try {
      const stats = await fs.stat(candidate);
      if (stats.isFile()) return candidate;
    } catch {
      // Try the next candidate.
    }
  }
  return undefined;
};

const sitemapXml = await fs.readFile(sitemapPath, 'utf8');
const locations = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

if (locations.length === 0) {
  throw new Error('No URLs were found in dist/sitemap.xml.');
}

const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url ?? '/', 'http://127.0.0.1');
    const filePath = await resolvePublicFile(requestUrl.pathname);

    if (!filePath) {
      response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    response.writeHead(200, { 'content-type': contentTypeFor(filePath) });
    createReadStream(filePath).pipe(response);
  } catch (error) {
    response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    response.end(error instanceof Error ? error.message : String(error));
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
if (!address || typeof address === 'string') throw new Error('Could not start the sitemap route test server.');

const origin = `http://127.0.0.1:${address.port}`;
const failures = [];

try {
  for (const location of locations) {
    const productionUrl = new URL(location);
    const testUrl = `${origin}${productionUrl.pathname}${productionUrl.search}`;
    const response = await fetch(testUrl, { redirect: 'manual' });

    if (response.status !== 200) {
      failures.push(`${productionUrl.pathname}: expected 200, received ${response.status}`);
      continue;
    }

    const html = await response.text();
    if (/name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) {
      failures.push(`${productionUrl.pathname}: sitemap URL is marked noindex`);
    }
  }

  const missingResponse = await fetch(`${origin}/__seo-route-that-must-not-exist__`, { redirect: 'manual' });
  if (missingResponse.status !== 404) {
    failures.push(`unknown route: expected 404, received ${missingResponse.status}`);
  }
} finally {
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
}

if (failures.length > 0) {
  console.error('Sitemap route test failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Verified ${locations.length} sitemap URLs return HTTP 200 and an unknown route returns HTTP 404.`);
}
