// Verify the actual prerendered page and hydrated layouts. This test never
// submits bookings or registrations and never sends analytics to production.
import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { startDistServer } from './serve-dist.mjs';

const server = await startDistServer(0);
const browser = await chromium.launch();
const results = [];
const output = 'output/fitness-landing';
const sections = ['fitness-hero', 'fitness-activities', 'funkcionalnosti-panoge', 'fitness-challenges', 'fitness-workflow', 'fitness-faq', 'fitness-cta'];
await mkdir(output, { recursive: true });
try {
  for (const [language, path, demoPath] of [
    ['sl', '/za-fitnes-in-osebno-trenerstvo', '/predstavitev'],
    ['en', '/en/for-fitness-and-personal-training', '/en/demo'],
  ]) {
    const response = await fetch(`${server.origin}${path}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    for (const id of sections) assert.ok(html.includes(`id="${id}"`), `SSR missing ${id}`);
    for (const width of [360, 768, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, timezoneId: 'Europe/Ljubljana' });
      await context.addInitScript(() => localStorage.setItem('calendra-google-analytics-consent', 'denied'));
      // Optional APIs use their committed fallback; no external requests or writes.
      await context.route(/\/api\//, (route) => route.fulfill({ status: 503, contentType: 'application/json', body: '{}' }));
      await context.route(/googletagmanager\.com|google-analytics\.com|analytics\.google\.com/, (route) => route.fulfill({ status: 200, body: '' }));
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto(`${server.origin}${path}?utm_source=fitness-test`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('h1')).toHaveCount(1);
      assert.deepEqual(await page.locator('main > section').evaluateAll((items) => items.map((item) => item.id)), sections);
      assert.deepEqual(await page.locator('#fitness-workflow h3').allTextContents(), language === 'sl'
        ? ['Nastavite urnik', 'Stranke se naročijo', 'Spremljajte obiske in pakete']
        : ['Set up your schedule', 'Clients book a session', 'Track visits and passes']);
      await expect(page.locator('#fitness-activities article')).toHaveCount(4);
      await expect(page.locator('#funkcionalnosti-panoge article')).toHaveCount(6);
      for (const id of ['fitness-hero', 'fitness-cta']) {
        const links = page.locator(`#${id} .group-bookings-actions a`);
        await expect(links).toHaveCount(2);
        assert.equal(await links.nth(1).getAttribute('href'), demoPath);
        const trialHref = await links.nth(0).getAttribute('href');
        assert.ok(trialHref && !trialHref.startsWith('#'));
        assert.ok(trialHref.includes('utm_source=fitness-test'), 'trial preserves campaign attribution');
      }
      // Bring lazy images into view before checking them or taking full-page shots.
      for (const image of await page.locator('main img').all()) {
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `horizontal overflow: ${language} / ${width}`);
      const summary = page.locator('#fitness-faq summary').first();
      await summary.click();
      await expect(page.locator('#fitness-faq details').first()).toHaveAttribute('open', '');
      await summary.click();
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(page.locator('[data-sales-sticky]')).toHaveCount(0);
      await page.screenshot({ path: `${output}/${language}-${width}.png`, fullPage: true, animations: 'disabled' });
      assert.deepEqual(errors, [], `browser errors: ${language} / ${width}`);
      results.push({ language, width, ssr: true, images: true, overflow: false, workflow: true, links: true });
      await context.close();
    }
  }
} finally {
  await browser.close();
  await server.close();
}
await writeFile(`${output}/checks.json`, JSON.stringify(results, null, 2));
console.log('Fitness landing: SL/EN, 360/768/1440px, SSR, workflow, CTA attribution, FAQ and images passed.');
