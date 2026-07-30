import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const templatePath = path.join(distDir, 'index.html');
const serverEntryCandidates = [
  path.join(distDir, 'server', 'entry-server.js'),
  path.join(distDir, 'server', 'entry-server.mjs'),
];

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const escapeJsonForHtml = (value) =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

/**
 * DNS TXT verification is preferred because it survives redeploys, but these
 * meta-tag fallbacks let verification be recovered without DNS access.
 */
const buildVerificationMeta = () => {
  const tags = [];
  const google = process.env.VITE_GOOGLE_SITE_VERIFICATION;
  const bing = process.env.VITE_BING_SITE_VERIFICATION;

  if (google) tags.push(`<meta name="google-site-verification" content="${escapeHtml(google)}" />`);
  if (bing) tags.push(`<meta name="msvalidate.01" content="${escapeHtml(bing)}" />`);

  return tags.length > 0 ? `\n    ${tags.join('\n    ')}` : '';
};

const verificationMeta = buildVerificationMeta();

const buildSeoHead = (seo, defaultOgImage, routePath) => {
  const robots = seo.noindex ? 'noindex, follow' : 'index, follow';
  const locale = seo.language === 'sl' ? 'sl_SI' : 'en_US';
  const alternateLocale = seo.language === 'sl' ? 'en_US' : 'sl_SI';
  const htmlLanguage = seo.language === 'sl' ? 'sl-SI' : 'en';

  // Blog posts are `article`, not `website`, and carry publication timestamps
  // that LinkedIn and X surface next to the shared card.
  const isArticle = Boolean(seo.articleDates);
  const ogType = isArticle ? 'article' : 'website';
  const articleMeta = isArticle
    ? `
    <meta property="article:published_time" content="${escapeHtml(seo.articleDates.published)}" />
    <meta property="article:modified_time" content="${escapeHtml(seo.articleDates.modified)}" />
    <meta property="article:author" content="David Mirc" />`
    : '';

  return `<!-- CALENDRA_SEO_START -->
    <title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}" />
    <meta name="author" content="${isArticle ? 'David Mirc' : 'Calendra'}" />
    <meta name="robots" content="${robots}" />${verificationMeta}
    <link rel="canonical" href="${escapeHtml(seo.canonicalUrl)}" />
    <link rel="alternate" hreflang="sl-SI" href="${escapeHtml(seo.alternateUrls?.sl ?? seo.canonicalUrl)}" />
    <link rel="alternate" hreflang="en" href="${escapeHtml(seo.alternateUrls?.en ?? seo.canonicalUrl)}" />
    <link rel="alternate" hreflang="x-default" href="${escapeHtml(seo.alternateUrls?.xDefault ?? seo.canonicalUrl)}" />
    <meta property="og:title" content="${escapeHtml(seo.ogTitle ?? seo.title)}" />
    <meta property="og:description" content="${escapeHtml(seo.ogDescription ?? seo.description)}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:url" content="${escapeHtml(seo.canonicalUrl)}" />${articleMeta}
    <meta property="og:site_name" content="Calendra" />
    <meta property="og:locale" content="${locale}" />
    <meta property="og:locale:alternate" content="${alternateLocale}" />
    <meta property="og:image" content="${escapeHtml(seo.ogImage ?? defaultOgImage)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(seo.ogTitle ?? seo.title)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(seo.ogTitle ?? seo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(seo.ogDescription ?? seo.description)}" />
    <meta name="twitter:image" content="${escapeHtml(seo.ogImage ?? defaultOgImage)}" />
    <script type="application/ld+json" data-seo="calendra" data-seo-route="${escapeHtml(routePath)}">${escapeJsonForHtml(seo.structuredData ?? {})}</script>
    <!-- CALENDRA_SEO_END -->`.replace('<!--HTML_LANGUAGE-->', htmlLanguage);
};

const writeRouteHtml = async (routePath, html) => {
  if (routePath === '/') {
    await fs.writeFile(path.join(distDir, 'index.html'), html);
    return;
  }

  const outputDir = path.join(distDir, routePath.replace(/^\//, ''));
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, 'index.html'), html);
};

const template = await fs.readFile(templatePath, 'utf8');
const serverEntryPath = (await Promise.all(
  serverEntryCandidates.map(async (candidate) => {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      return undefined;
    }
  }),
)).find(Boolean);

if (!serverEntryPath) {
  throw new Error(`Could not find SSR entry. Checked: ${serverEntryCandidates.join(', ')}`);
}

const {
  DEFAULT_OG_IMAGE,
  HERO_IMAGE,
  PRICING_CATALOG_SCRIPT_ID,
  PUBLIC_PRICING_ENDPOINT,
  buildLlmsFullTxt,
  buildLlmsTxt,
  getSitemapEntries,
  normalizePublicPricingCatalog,
  renderPage,
  routesToPrerender,
  setPrerenderedPricingCatalog,
} = await import(pathToFileURL(serverEntryPath));

const seoBlockPattern = /<!-- CALENDRA_SEO_START -->[\s\S]*?<!-- CALENDRA_SEO_END -->/;
const routePreloadsPattern = /<!-- CALENDRA_ROUTE_PRELOADS_START -->[\s\S]*?<!-- CALENDRA_ROUTE_PRELOADS_END -->/;
const analyticsBlockPattern = /<!-- CALENDRA_ANALYTICS_START -->[\s\S]*?<!-- CALENDRA_ANALYTICS_END -->/;
const pricingBlockPattern = /<!-- CALENDRA_PRICING_START -->[\s\S]*?<!-- CALENDRA_PRICING_END -->/;

/**
 * Snapshot the live pricing catalog into every page.
 *
 * The configurator otherwise renders the committed fallback and then swaps in
 * the fetched catalog after mount; when the two differ the tier grid changes
 * height and the page visibly reflows. Embedding the catalog makes the
 * prerendered markup, the Product/Offer JSON-LD and the first client render
 * agree, so there is nothing left to shift. A build without network access
 * simply keeps the fallback, which is the behaviour we had before.
 */
const loadPricingCatalog = async () => {
  try {
    const response = await fetch(PUBLIC_PRICING_ENDPOINT, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) throw new Error(`Pricing endpoint returned ${response.status}`);

    const catalog = normalizePublicPricingCatalog(await response.json());
    setPrerenderedPricingCatalog(catalog);
    console.log(`Embedded live pricing catalog (version ${catalog.catalogVersion}) into the prerendered HTML`);
    return catalog;
  } catch (error) {
    console.warn(`Could not reach ${PUBLIC_PRICING_ENDPOINT}; prerendering with the built-in fallback catalog.`, error.message);
    return undefined;
  }
};

const pricingCatalog = await loadPricingCatalog();

const pricingBlock = pricingCatalog
  ? `<!-- CALENDRA_PRICING_START -->
    <script type="application/json" id="${PRICING_CATALOG_SCRIPT_ID}">${escapeJsonForHtml(pricingCatalog)}</script>
    <!-- CALENDRA_PRICING_END -->`
  : '<!-- CALENDRA_PRICING_START --><!-- CALENDRA_PRICING_END -->';

/**
 * The cookieless Umami tracker is injected as a plain deferred script rather
 * than bundled, so it never blocks hydration and stays out of the JS graph.
 * Serving it from a first-party path keeps content blockers from dropping it.
 */
const buildAnalyticsBlock = () => {
  const websiteId = process.env.VITE_UMAMI_WEBSITE_ID ?? '';
  if (!websiteId) return '<!-- CALENDRA_ANALYTICS_START --><!-- CALENDRA_ANALYTICS_END -->';

  const scriptUrl = process.env.VITE_UMAMI_SCRIPT_URL ?? '/stats/script.js';
  const hostUrl = (process.env.VITE_UMAMI_HOST_URL ?? '/stats').replace(/\/+$/, '');

  return `<!-- CALENDRA_ANALYTICS_START -->
    <script defer src="${escapeHtml(scriptUrl)}" data-website-id="${escapeHtml(websiteId)}" data-host-url="${escapeHtml(hostUrl)}"></script>
    <!-- CALENDRA_ANALYTICS_END -->`;
};

const analyticsBlock = buildAnalyticsBlock();

const buildRoutePreloads = (routePath) => {
  // Only the homepage has an above-the-fold image worth preloading. The empty
  // marker pair is kept so the placeholder is verifiably still in the output.
  if (routePath !== '/' && routePath !== '/en') {
    return '<!-- CALENDRA_ROUTE_PRELOADS_START --><!-- CALENDRA_ROUTE_PRELOADS_END -->';
  }

  // imagesrcset/imagesizes must mirror the <img> exactly, otherwise the browser
  // preloads one candidate and then downloads a second one for the element.
  return `<!-- CALENDRA_ROUTE_PRELOADS_START -->
    <link rel="preload" as="image" href="${escapeHtml(HERO_IMAGE.src)}" imagesrcset="${escapeHtml(HERO_IMAGE.srcSet)}" imagesizes="${escapeHtml(HERO_IMAGE.sizes)}" type="${escapeHtml(HERO_IMAGE.type)}" fetchpriority="high" />
    <!-- CALENDRA_ROUTE_PRELOADS_END -->`;
};

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const buildSitemapXml = (entries) => {
  const urls = entries
    .map((entry) => {
      const lastModified = entry.lastModified ? `\n    <lastmod>${escapeXml(entry.lastModified)}</lastmod>` : '';
      return `  <url>
    <loc>${escapeXml(entry.location)}</loc>${lastModified}
    <changefreq>${escapeXml(entry.changeFrequency)}</changefreq>
    <priority>${Number(entry.priority).toFixed(1)}</priority>
    <xhtml:link rel="alternate" hreflang="sl-SI" href="${escapeXml(entry.alternateUrls.sl)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(entry.alternateUrls.en)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(entry.alternateUrls.xDefault)}" />
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
};

if (!seoBlockPattern.test(template)) {
  throw new Error('SEO marker block was not found in dist/index.html.');
}

for (const routePath of routesToPrerender) {
  const { appHtml, seo } = renderPage(routePath);
  const head = buildSeoHead(seo, DEFAULT_OG_IMAGE, routePath);
  const htmlLanguage = seo.language === 'sl' ? 'sl' : 'en';
  const output = template
    .replace('<html lang="sl">', `<html lang="${htmlLanguage}">`)
    .replace(routePreloadsPattern, buildRoutePreloads(routePath))
    .replace(analyticsBlockPattern, analyticsBlock)
    .replace(pricingBlockPattern, pricingBlock)
    .replace(seoBlockPattern, head)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  await writeRouteHtml(routePath, output);
  console.log(`Prerendered ${routePath}`);
}

const sitemapEntries = getSitemapEntries();
await fs.writeFile(path.join(distDir, 'sitemap.xml'), buildSitemapXml(sitemapEntries));
console.log(`Generated sitemap.xml with ${sitemapEntries.length} indexable URLs`);

// llms.txt gives AI assistants a curated map of the site instead of making them
// infer one from navigation; llms-full.txt lets them ground an answer in our own
// wording from a single fetch.
await fs.writeFile(path.join(distDir, 'llms.txt'), buildLlmsTxt());
await fs.writeFile(path.join(distDir, 'llms-full.txt'), buildLlmsFullTxt());
console.log('Generated llms.txt and llms-full.txt');

// IndexNow proves ownership by serving the key as a plaintext file at the site
// root. Without it, submissions from scripts/indexnow-ping.mjs are rejected.
const indexNowKey = process.env.INDEXNOW_KEY;
if (indexNowKey) {
  if (!/^[A-Za-z0-9-]{8,128}$/.test(indexNowKey)) {
    throw new Error('INDEXNOW_KEY must be 8-128 characters of [A-Za-z0-9-].');
  }
  await fs.writeFile(path.join(distDir, `${indexNowKey}.txt`), indexNowKey);
  console.log(`Generated IndexNow key file ${indexNowKey}.txt`);
} else {
  console.log('Skipped IndexNow key file (INDEXNOW_KEY not set)');
}

// Runs in a child process so a native-module failure in @resvg/resvg-js cannot
// take down the rest of the build.
const ogImages = spawnSync(
  process.execPath,
  [path.join(__dirname, 'generate-og-images.mjs'), serverEntryPath, distDir],
  { stdio: 'inherit' },
);
if (ogImages.status !== 0) {
  console.warn('Blog OG image generation did not complete. Articles will fall back to the default card.');
}

await fs.rm(path.join(distDir, 'server'), { recursive: true, force: true });
console.log('Removed temporary SSR bundle from dist/server');
