// Build the homepage WebP assets without altering the supplied screenshots.
// Sources are kept in src/assets/homepage so this does not depend on temp files.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "src/assets/homepage");
const output = path.join(root, "public/homepage");
await fs.mkdir(output, { recursive: true });

for (const name of ["calendar-desktop", "calendar-mobile", "booking", "billing", "notifications", "clients", "service-scenes"]) {
  const input = path.join(source, `${name}.png`);
  const { width, height } = await sharp(input).metadata();
  const options = name === "service-scenes" ? { quality: 86 } : { lossless: true };
  await sharp(input).webp(options).toFile(path.join(output, `${name}.webp`));
  if (name === "calendar-desktop") {
    for (const size of [640, 960, 1280]) {
      await sharp(input).resize({ width: size }).webp({ quality: 90 }).toFile(path.join(output, `${name}-${size}.webp`));
    }
  }
  const { size } = await fs.stat(path.join(output, `${name}.webp`));
  console.log(`${name}: ${width} × ${height}, ${(size / 1024).toFixed(1)} KB`);
}
