/**
 * Fails the build when the JavaScript a first-time visitor has to download
 * grows past an agreed ceiling.
 *
 * The number that matters is not the total size of `dist/assets`, which grows
 * every time a page is added, but the entry chunk plus everything it statically
 * imports — that is what blocks hydration on the homepage. Budgets are on gzip
 * sizes because that is what crosses the network.
 *
 * When a change legitimately needs more, raise the budget in the same commit so
 * the increase is reviewed rather than discovered months later.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');

const BUDGETS = {
  /** Entry chunk and its static imports: the JS required before the homepage is interactive. */
  initialJs: 210,
  /** Stylesheet linked from every page. */
  css: 16,
  /** Largest single lazily loaded route chunk, as an early warning for a runaway page. */
  largestRouteChunk: 50,
};

const kb = (bytes) => Math.round((bytes / 1024) * 10) / 10;

const gzipSize = async (file) => gzipSync(await fs.readFile(file), { level: 9 }).length;

const manifestPath = path.join(distDir, '.vite', 'manifest.json');

let manifest;
try {
  manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
} catch {
  console.error(
    `Missing ${path.relative(root, manifestPath)}. Set build.manifest in vite.config.ts and run the build first.`,
  );
  process.exit(1);
}

const entry = Object.values(manifest).find((chunk) => chunk.isEntry);
if (!entry) {
  console.error('No entry chunk in the build manifest.');
  process.exit(1);
}

/** Walk `imports` transitively: those are the chunks the browser must have before running the entry. */
const collectStatic = (key, seen = new Set()) => {
  if (seen.has(key)) return seen;
  seen.add(key);
  for (const imported of manifest[key]?.imports ?? []) collectStatic(imported, seen);
  return seen;
};

const initialKeys = collectStatic(Object.keys(manifest).find((key) => manifest[key] === entry));

let initialJs = 0;
for (const key of initialKeys) {
  initialJs += await gzipSize(path.join(distDir, manifest[key].file));
}

let css = 0;
for (const file of new Set(Object.values(manifest).flatMap((chunk) => chunk.css ?? []))) {
  css += await gzipSize(path.join(distDir, file));
}

let largestRouteChunk = 0;
let largestRouteChunkName = '';
for (const [key, chunk] of Object.entries(manifest)) {
  if (initialKeys.has(key)) continue;
  const size = await gzipSize(path.join(distDir, chunk.file));
  if (size > largestRouteChunk) {
    largestRouteChunk = size;
    largestRouteChunkName = chunk.file;
  }
}

const measured = {
  initialJs: kb(initialJs),
  css: kb(css),
  largestRouteChunk: kb(largestRouteChunk),
};

const labels = {
  initialJs: 'initial JS (entry + static imports)',
  css: 'CSS',
  largestRouteChunk: `largest route chunk (${largestRouteChunkName})`,
};

const failures = [];
for (const [name, budget] of Object.entries(BUDGETS)) {
  const actual = measured[name];
  const status = actual > budget ? 'OVER' : 'ok';
  console.log(`${labels[name].padEnd(48)} ${String(actual).padStart(7)} KB / ${budget} KB gzip  ${status}`);
  if (actual > budget) failures.push(`${labels[name]} is ${actual} KB gzip, over the ${budget} KB budget`);
}

if (failures.length > 0) {
  console.error(`\nBundle budget exceeded:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
