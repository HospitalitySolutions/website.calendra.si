/**
 * Static server for the prerendered `dist/` output.
 *
 * It resolves `/some/route` to `dist/some/route/index.html` the way Caddy does
 * in production, so what the SEO crawl test and Lighthouse CI measure is what
 * the deployment actually serves. Run directly to serve on a fixed port:
 *
 *   node scripts/serve-dist.mjs 4173
 */
import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(projectRoot, 'dist');

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

const contentTypeFor = (filePath) => CONTENT_TYPES[path.extname(filePath)] ?? 'application/octet-stream';

const safeFileCandidates = (pathname) => {
  const normalized = path.normalize(decodeURIComponent(pathname).replace(/^\/+/, ''));

  if (normalized.startsWith('..') || path.isAbsolute(normalized)) return [];
  if (!normalized || normalized === '.') return [path.join(distDir, 'index.html')];

  return [path.join(distDir, normalized, 'index.html'), path.join(distDir, normalized)];
};

const resolvePublicFile = async (pathname) => {
  for (const candidate of safeFileCandidates(pathname)) {
    try {
      if ((await fs.stat(candidate)).isFile()) return candidate;
    } catch {
      // Try the next candidate.
    }
  }
  return undefined;
};

export const startDistServer = async (port = 0) => {
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

  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));

  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Could not start the dist server.');

  return {
    origin: `http://127.0.0.1:${address.port}`,
    close: () => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))),
  };
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { origin } = await startDistServer(Number(process.argv[2]) || 4173);
  console.log(`Serving dist on ${origin}`);
}
