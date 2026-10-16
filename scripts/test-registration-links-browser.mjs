// Local production-build checks; no account or external write is performed.
import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { startDistServer } from './serve-dist.mjs';

const server = await startDistServer(0);
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
const html = await readFile('dist/cenik/index.html', 'utf8');
const catalog = JSON.parse(html.match(/<script[^>]*id="calendra-pricing-catalog"[^>]*>([\s\S]*?)<\/script>/)[1]);
const attribution = 'via=sales-owner&ref=friend&utm_campaign=registration-test';
try {
  for (const width of [1440, 390]) for (const locale of ['sl', 'en']) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    await context.addInitScript(() => localStorage.setItem('calendra-google-analytics-consent', 'denied'));
    await context.route('**/api/**', route => route.fulfill({ json: route.request().url().includes('/register/public-pricing') ? catalog : {} }));
    await context.route(/googletagmanager\.com|google-analytics\.com/, route => route.fulfill({ body: '' }));
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const registrationPath = locale === 'sl' ? '/registriraj' : '/register';
    const homepage = locale === 'sl' ? '/' : '/en';
    await page.goto(server.origin + homepage + '?' + attribution);
    const links = page.locator('a[href^="https://calendra.si' + registrationPath + '"]');
    await expect(links.first()).toHaveAttribute('href', /utm_campaign=registration-test/);
    for (const href of await links.evaluateAll(elements => elements.map(element => element.href))) {
      const target = new URL(href);
      assert.equal(target.pathname, registrationPath);
      assert.equal(target.searchParams.get('locale'), locale);
      assert.equal(target.searchParams.get('flow'), 'trial');
      assert.equal(target.searchParams.get('via'), 'sales-owner');
      assert.equal(target.searchParams.get('ref'), 'friend');
    }
    await page.goto(server.origin + (locale === 'sl' ? '/cenik' : '/en/pricing') + '?plan=pro&billing=annual&' + attribution);
    const signup = page.locator('.pricing-summary-card [data-pricing-signup]');
    await expect(signup).toHaveAttribute('href', /utm_campaign=registration-test/);
    const target = new URL(await signup.getAttribute('href'));
    assert.equal(target.pathname, registrationPath);
    assert.equal(target.searchParams.get('locale'), locale);
    assert.equal(target.searchParams.get('billing'), 'annual');
    assert.equal(target.searchParams.get('package'), 'PROFESSIONAL');
    assert.equal(target.searchParams.get('users'), '1');
    assert.equal(target.searchParams.get('ref'), 'friend');
    assert.equal(target.searchParams.get('via'), 'sales-owner');
    assert.deepEqual(errors, []);
    await context.close();
    console.log(width + 'px ' + locale + ': public signup CTAs, pricing and attribution passed');
  }
} finally { await browser.close(); await server.close(); }
