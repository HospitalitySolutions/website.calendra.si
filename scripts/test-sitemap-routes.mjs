import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startDistServer } from './serve-dist.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const sitemapPath = path.join(distDir, 'sitemap.xml');

const sitemapXml = await fs.readFile(sitemapPath, 'utf8');
const locations = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

if (locations.length === 0) {
  throw new Error('No URLs were found in dist/sitemap.xml.');
}

const sitemapBlocks = [...sitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
for (const block of sitemapBlocks) {
  if (!/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/.test(block)) {
    throw new Error('Every sitemap URL must include an explicit meaningful <lastmod> date.');
  }
}

const server = await startDistServer();
const { origin } = server;
const failures = [];

/**
 * AI crawlers (OAI-SearchBot, PerplexityBot, Claude-SearchBot and friends) do
 * not execute JavaScript, so they only ever see the prerendered HTML. Measuring
 * the visible text of the served document is the only way to catch a regression
 * where prerendering silently degrades to an empty SPA shell.
 */
const MINIMUM_VISIBLE_WORDS = 150;

const visibleWordCount = (html) => {
  const body = html.slice(html.indexOf('<div id="root">'));
  const text = body
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ');

  return text.split(/\s+/).filter(Boolean).length;
};

/**
 * Internal links are collected while crawling and verified afterwards. Prose
 * written by hand is where broken internal links actually come from, and a 404
 * reached from a published article wastes both crawl budget and a reader.
 */
const internalLinks = new Map();

/**
 * Paths that this repository does not serve. Per-tenant booking URLs under
 * /narocanje/<tenantCode> are handled by the Calendra application deployment
 * rather than by the prerendered marketing site, so they cannot be resolved
 * against dist/.
 */
const EXTERNALLY_ROUTED = [/^\/narocanje\/[^/]+$/, /^\/stats(\/|$)/];

const collectInternalLinks = (route, html) => {
  const body = html.slice(html.indexOf('<div id="root">'));
  for (const [, href] of body.matchAll(/href="(\/[^"]*)"/g)) {
    const target = href.split('#')[0].split('?')[0].replace(/\/+$/, '') || '/';
    if (target.startsWith('/assets/') || target.startsWith('//')) continue;
    if (EXTERNALLY_ROUTED.some((pattern) => pattern.test(target))) continue;
    if (!internalLinks.has(target)) internalLinks.set(target, route);
  }
};

const checkImageAltText = (route, html) => {
  const body = html.slice(html.indexOf('<div id="root">'));
  for (const [tag] of body.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="/.test(tag)) failures.push(`${route}: an <img> element has no alt attribute`);
  }
};

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
    const route = productionUrl.pathname;

    collectInternalLinks(route, html);
    checkImageAltText(route, html);

    if (/name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) {
      failures.push(`${route}: sitemap URL is marked noindex`);
    }

    if (!/<script type="application\/ld\+json" data-seo="calendra"[^>]*>/.test(html)) {
      failures.push(`${route}: missing JSON-LD structured data`);
    }

    if (/"@type"\s*:\s*"FAQPage"/.test(html)) {
      failures.push(`${route}: obsolete FAQPage structured data is still present`);
    }

    if (/"@type"\s*:\s*"SpeakableSpecification"/.test(html)) {
      failures.push(`${route}: irrelevant SpeakableSpecification structured data is still present`);
    }

    // SeoManager skips its first run when this matches, so a wrong value would
    // silently leave a stale head after the visitor's first in-app navigation.
    if (!html.includes(`data-seo-route="${route}"`)) {
      failures.push(`${route}: JSON-LD is missing the matching data-seo-route marker`);
    }

    if (!/<link rel="canonical" href="/.test(html)) {
      failures.push(`${route}: missing canonical link`);
    }

    // The prerender script does several independent block replacements on the
    // same template. Nesting one placeholder inside another silently drops it,
    // which is how the analytics snippet went missing once already.
    for (const marker of ['CALENDRA_ANALYTICS', 'CALENDRA_PRICING', 'CALENDRA_ROUTE_PRELOADS']) {
      if (!html.includes(`<!-- ${marker}_START -->`)) {
        failures.push(`${route}: the ${marker} placeholder was consumed by another replacement`);
      }
    }

    if (!/<h1[\s>]/i.test(html)) {
      failures.push(`${route}: prerendered HTML has no h1`);
    }

    const words = visibleWordCount(html);
    if (words < MINIMUM_VISIBLE_WORDS) {
      failures.push(`${route}: only ${words} words of prerendered body text (expected at least ${MINIMUM_VISIBLE_WORDS})`);
    }
  }

  for (const [target, foundOn] of internalLinks) {
    const linkResponse = await fetch(`${origin}${target}`, { method: 'GET', redirect: 'manual' });
    if (linkResponse.status !== 200) {
      failures.push(`broken internal link ${target} (linked from ${foundOn}): received ${linkResponse.status}`);
    }
  }

  const missingResponse = await fetch(`${origin}/__seo-route-that-must-not-exist__`, { redirect: 'manual' });
  if (missingResponse.status !== 404) {
    failures.push(`unknown route: expected 404, received ${missingResponse.status}`);
  }

  const robotsResponse = await fetch(`${origin}/robots.txt`);
  const robotsTxt = await robotsResponse.text();
  for (const agent of ['OAI-SearchBot', 'PerplexityBot', 'Claude-SearchBot', 'Google-Extended']) {
    if (!robotsTxt.includes(`User-agent: ${agent}`)) {
      failures.push(`robots.txt: missing an explicit rule for ${agent}`);
    }
  }
  if (/^Disallow: \/$/m.test(robotsTxt)) {
    failures.push('robots.txt: contains a site-wide Disallow rule');
  }

  const llmsResponse = await fetch(`${origin}/llms.txt`);
  if (llmsResponse.status !== 200) {
    failures.push(`llms.txt: expected 200, received ${llmsResponse.status}`);
  }
} finally {
  await server.close();
}

if (failures.length > 0) {
  console.error('Sitemap route test failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(
    `Verified ${locations.length} sitemap URLs and ${internalLinks.size} internal link targets return HTTP 200, and an unknown route returns HTTP 404.`,
  );
}
