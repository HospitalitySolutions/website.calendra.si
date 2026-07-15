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

const buildSeoHead = (seo, defaultOgImage) => {
  const robots = seo.noindex ? 'noindex, follow' : 'index, follow';
  const locale = seo.language === 'sl' ? 'sl_SI' : 'en_US';
  const alternateLocale = seo.language === 'sl' ? 'en_US' : 'sl_SI';
  const htmlLanguage = seo.language === 'sl' ? 'sl-SI' : 'en';

  return `<!-- CALENDRA_SEO_START -->
    <title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}" />
    <meta name="author" content="Calendra" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${escapeHtml(seo.canonicalUrl)}" />
    <link rel="alternate" hreflang="sl-SI" href="${escapeHtml(seo.alternateUrls?.sl ?? seo.canonicalUrl)}" />
    <link rel="alternate" hreflang="en" href="${escapeHtml(seo.alternateUrls?.en ?? seo.canonicalUrl)}" />
    <link rel="alternate" hreflang="x-default" href="${escapeHtml(seo.alternateUrls?.xDefault ?? seo.canonicalUrl)}" />
    <meta property="og:title" content="${escapeHtml(seo.ogTitle ?? seo.title)}" />
    <meta property="og:description" content="${escapeHtml(seo.ogDescription ?? seo.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHtml(seo.canonicalUrl)}" />
    <meta property="og:site_name" content="Calendra" />
    <meta property="og:locale" content="${locale}" />
    <meta property="og:locale:alternate" content="${alternateLocale}" />
    <meta property="og:image" content="${escapeHtml(defaultOgImage)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(seo.ogTitle ?? seo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(seo.ogDescription ?? seo.description)}" />
    <meta name="twitter:image" content="${escapeHtml(defaultOgImage)}" />
    <script type="application/ld+json" data-seo="calendra">${escapeJsonForHtml(seo.structuredData ?? {})}</script>
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

const { DEFAULT_OG_IMAGE, getSitemapEntries, renderPage, routesToPrerender } = await import(pathToFileURL(serverEntryPath));

const seoBlockPattern = /<!-- CALENDRA_SEO_START -->[\s\S]*?<!-- CALENDRA_SEO_END -->/;
const routePreloadsPattern = /<!-- CALENDRA_ROUTE_PRELOADS_START -->[\s\S]*?<!-- CALENDRA_ROUTE_PRELOADS_END -->/;

const buildRoutePreloads = (routePath) => {
  if (routePath !== '/' && routePath !== '/en') return '';

  return `<!-- CALENDRA_ROUTE_PRELOADS_START -->
    <link rel="preload" as="image" href="/hero/calendra-calendar.webp" type="image/webp" fetchpriority="high" />
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
  const head = buildSeoHead(seo, DEFAULT_OG_IMAGE);
  const htmlLanguage = seo.language === 'sl' ? 'sl' : 'en';
  const output = template
    .replace('<html lang="sl">', `<html lang="${htmlLanguage}">`)
    .replace(routePreloadsPattern, buildRoutePreloads(routePath))
    .replace(seoBlockPattern, head)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  await writeRouteHtml(routePath, output);
  console.log(`Prerendered ${routePath}`);
}

const sitemapEntries = getSitemapEntries();
await fs.writeFile(path.join(distDir, 'sitemap.xml'), buildSitemapXml(sitemapEntries));
console.log(`Generated sitemap.xml with ${sitemapEntries.length} indexable URLs`);

await fs.rm(path.join(distDir, 'server'), { recursive: true, force: true });
console.log('Removed temporary SSR bundle from dist/server');
