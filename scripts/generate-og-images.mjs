/**
 * Renders a 1200x630 social card per blog article at build time.
 *
 * Articles shared without a card get a blank preview in Slack, LinkedIn and X,
 * which measurably suppresses click-through. Generating them from the same
 * frontmatter that builds the page means a retitled article cannot keep an old
 * card, and no image needs to be committed by hand.
 *
 * Usage: `node scripts/generate-og-images.mjs <serverEntry> <distDir>`
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

const [serverEntryArg, distDirArg] = process.argv.slice(2);

if (!serverEntryArg || !distDirArg) {
  console.error('Usage: node scripts/generate-og-images.mjs <serverEntry> <distDir>');
  process.exit(1);
}

const serverEntry = path.resolve(serverEntryArg);
const distDir = path.resolve(distDirArg);

const { ogImageJobs } = await import(pathToFileURL(serverEntry));

if (!Array.isArray(ogImageJobs) || ogImageJobs.length === 0) {
  console.log('No blog articles found. Skipping OG image generation.');
  process.exit(0);
}

const FONT_SOURCES = [
  { weight: 400, url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-ext-400-normal.ttf' },
  { weight: 700, url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-ext-700-normal.ttf' },
  { weight: 800, url: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-ext-800-normal.ttf' },
];

const cacheDir = path.resolve('node_modules/.cache/calendra-og-fonts');

/**
 * Fonts are fetched once and cached in node_modules so repeat builds and
 * offline builds do not depend on the network.
 */
const loadFont = async ({ weight, url }) => {
  const cachePath = path.join(cacheDir, `inter-${weight}.ttf`);

  try {
    return { name: 'Inter', weight, style: 'normal', data: await fs.readFile(cachePath) };
  } catch {
    // Not cached yet.
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not download the Inter ${weight} font: HTTP ${response.status}`);

  const data = Buffer.from(await response.arrayBuffer());
  await fs.mkdir(cacheDir, { recursive: true });
  await fs.writeFile(cachePath, data);

  return { name: 'Inter', weight, style: 'normal', data };
};

let fonts;
try {
  fonts = await Promise.all(FONT_SOURCES.map(loadFont));
} catch (error) {
  console.warn(`Skipping OG image generation: ${error.message}`);
  process.exit(0);
}

const BRAND = '#1f6feb';

const card = ({ title, category, readingMinutes, language }) => ({
  type: 'div',
  props: {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '1200px',
      height: '630px',
      padding: '68px 72px',
      backgroundColor: '#ffffff',
      backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #f5f7fb 55%, #e8effc 100%)',
      fontFamily: 'Inter',
    },
    children: [
      {
        type: 'div',
        props: {
          style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
          children: [
            {
              type: 'div',
              props: {
                style: { display: 'flex', fontSize: '38px', fontWeight: 800, color: BRAND, letterSpacing: '-0.02em' },
                children: 'Calendra',
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  padding: '10px 22px',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(31,111,235,0.10)',
                  color: BRAND,
                  fontSize: '22px',
                  fontWeight: 700,
                },
                children: category,
              },
            },
          ],
        },
      },
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            fontSize: title.length > 78 ? '52px' : '62px',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            color: '#0f172a',
          },
          children: title,
        },
      },
      {
        type: 'div',
        props: {
          style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '24px', color: '#475569' },
          children: [
            {
              type: 'div',
              props: { style: { display: 'flex', fontWeight: 700, color: '#0f172a' }, children: 'David Mirc' },
            },
            {
              type: 'div',
              props: {
                style: { display: 'flex' },
                children: `${readingMinutes} ${language === 'sl' ? 'min branja' : 'min read'}  ·  calendra.si`,
              },
            },
          ],
        },
      },
    ],
  },
});

let generated = 0;

for (const job of ogImageJobs) {
  const svg = await satori(card(job), { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

  const outputPath = path.join(distDir, job.outputPath);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, png);
  generated += 1;
}

console.log(`Generated ${generated} blog OG image${generated === 1 ? '' : 's'}.`);
