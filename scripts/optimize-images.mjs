/**
 * Regenerates the derived image assets in `public/` from their sources.
 *
 * Run this after replacing a source image, then commit the output. It is not
 * part of `npm run build`: the inputs change a few times a year, and keeping
 * `sharp` off the deployment build keeps the Docker image and CI fast.
 *
 *   node scripts/optimize-images.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = path.join(root, 'public');

/** Widths the hero is actually rendered at, doubled for high-density screens. */
const HERO_WIDTHS = [640, 960, 1280, 1920, 2400];

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const report = async (label, file) => {
  const { size } = await fs.stat(file);
  console.log(`${label.padEnd(46)} ${kb(size).padStart(10)}`);
};

const buildWordmark = async () => {
  const source = path.join(root, 'src', 'assets', 'calendra-logo.png');
  const output = path.join(publicDir, 'calendra-wordmark.webp');

  await sharp(source).webp({ quality: 90 }).toFile(output);
  await report('public/calendra-wordmark.webp', output);
};

const buildHeroSrcset = async () => {
  const source = path.join(publicDir, 'hero', 'calendra-calendar-aug-2026.webp');
  const { width: sourceWidth } = await sharp(source).metadata();

  for (const width of HERO_WIDTHS) {
    if (width > sourceWidth) continue;

    const output = path.join(publicDir, 'hero', `calendra-calendar-aug-2026-${width}.webp`);
    await sharp(source).resize({ width }).webp({ quality: 78 }).toFile(output);
    await report(`public/hero/calendra-calendar-aug-2026-${width}.webp`, output);
  }
};

await buildWordmark();
await buildHeroSrcset();
