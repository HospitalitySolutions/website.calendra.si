// Real production assets; API fixtures and analytics are intercepted. No signup,
// invoice, email or production tracking request is submitted by this check.
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
import { startDistServer } from './serve-dist.mjs';

const html = await readFile('dist/cenik/index.html', 'utf8');
const catalog = JSON.parse(html.match(/<script[^>]*id="calendra-pricing-catalog"[^>]*>([\s\S]*?)<\/script>/)[1]);
const notice = 'Vse navedene cene na spletnem mestu in v aplikaciji so brez DDV. Skladno z Zakonom o davku na dodano vrednost (ZDDV-1) se tako na vse cene obračuna DDV v višini 22,00 %.';
assert.ok(html.includes(notice));
assert.ok(html.includes('"valueAddedTaxIncluded":false'));
assert.ok(html.includes('"vatID":"SI10550631"'));
assert.ok(!html.includes('Ponudnik ni zavezanec'));
const server = await startDistServer(0);
const browser = await chromium.launch();
const output = 'output/vat-pricing';
await mkdir(output, { recursive: true });
const results = [];
const round = n => Math.round((n + Number.EPSILON) * 100) / 100;
const gross = net => round(round(net) + round(round(net) * .22));
const compact = text => text.replace(/\s/g, '');
try {
  for (const [language, width] of [['sl', 1440], ['sl', 1024], ['sl', 768], ['sl', 390], ['sl', 320], ['en', 1440], ['en', 390]]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, locale: language === 'sl' ? 'sl-SI' : 'en-IE', reducedMotion: 'reduce' });
    await context.addInitScript(lang => {
      localStorage.setItem('calendra-site-language', lang);
      localStorage.setItem('calendra-google-analytics-consent', 'denied');
    }, language);
    await context.route(/googletagmanager\.com|google-analytics\.com|analytics\.google\.com|\/stats\//, route => route.fulfill({ status: 200, body: '' }));
    await context.route(/\/api\//, route => route.fulfill({ status: 503, json: {} }));
    // The still-deployed legacy API flag must not reverse the approved net basis.
    await context.route('**/api/register/public-pricing', route => route.fulfill({ json: { ...catalog, vatIncluded: true } }));
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const path = language === 'sl' ? '/cenik' : '/en/pricing';
    const format = value => compact(new Intl.NumberFormat(language === 'sl' ? 'sl-SI' : 'en-IE', { style: 'currency', currency: catalog.currency }).format(value));
    await page.goto(server.origin + path, { waitUntil: 'networkidle' });
    const cookieButton = page.getByRole('button', { name: language === 'sl' ? 'Samo nujni' : 'Necessary only', exact: true });
    if (await cookieButton.isVisible()) await cookieButton.click();
    if (language === 'sl') await expect(page.locator('.pricing-tax-note')).toHaveText(notice);
    else await expect(page.locator('.pricing-tax-note')).toContainText('All prices listed on the website and in the application exclude VAT.');
    for (const plan of catalog.plans) {
      const key = { basic: 'basic', pro: 'professional', business: 'premium' }[plan.key];
      const card = page.locator(`[data-plan="${key}"]`);
      assert.equal(compact(await card.locator('.pricing-plan-price strong').innerText()), format(plan.monthlyGross));
      // VAT is stated once in the pricing note and in the calculator totals, not per card.
      assert.doesNotMatch(await card.innerText(), /DDV|VAT/);
    }
    assert.doesNotMatch(await page.locator('.pricing-controls').innerText(), /DDV|VAT/);
    assert.doesNotMatch(await page.locator('.pricing-info-grid').first().innerText(), /DDV|VAT/);
    const summary = page.locator('.pricing-summary-card');
    const pro = catalog.plans.find(p => p.key === 'pro');
    await expect.poll(async () => compact(await summary.locator('[data-pricing-total]').innerText())).toBe(format(gross(pro.monthlyGross)));
    await page.locator('#pricing-configurator').scrollIntoViewIfNeeded();
    await expect(page.locator('.pricing-sticky-summary')).toBeVisible();
    assert.equal(compact(await page.locator('.pricing-sticky-total strong').innerText()), format(gross(pro.monthlyGross)));
    const dimensions = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - innerWidth, stickyHeight: document.querySelector('.pricing-sticky-summary').getBoundingClientRect().height }));
    assert.ok(dimensions.overflow <= 1, `${language}/${width}: horizontal overflow`);
    assert.ok(dimensions.stickyHeight <= 140, `${width}: sticky summary too tall (${dimensions.stickyHeight})`);
    if ([1440, 390].includes(width)) {
      await page.locator('.pricing-calculator-band').screenshot({ path: `${output}/calculator-${language}-${width}.png`, style: '.site-navbar-editorial,.pricing-sticky-summary{visibility:hidden}' });
      await page.locator('.pricing-sticky-summary').screenshot({ path: `${output}/sticky-${language}-${width}.png` });
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `${output}/cards-${language}-${width}.png` });
    }
    const annualButton = page.getByRole('button', { name: language === 'sl' ? 'Letno' : 'Yearly', exact: true });
    await annualButton.click();
    await expect(summary.locator('.pricing-total span')).toHaveText(language === 'sl' ? 'Letno skupaj z DDV' : 'Annual total incl. VAT');
    assert.equal(compact(await summary.locator('[data-pricing-total]').innerText()), format(gross(pro.annualGross)));
    // Changing monthly SMS must not be treated as a prepaid yearly subscription.
    const smsInput = page.getByRole('spinbutton', { name: language === 'sl' ? 'Število dodatnih SMS sporočil' : 'Number of additional SMS messages', exact: true });
    await smsInput.fill('100');
    assert.equal(compact(await summary.locator('[data-pricing-total]').innerText()), format(gross(pro.annualGross)));
    await page.getByRole('button', { name: language === 'sl' ? 'Mesečno' : 'Monthly', exact: true }).click();
    await page.getByRole('button', { name: language === 'sl' ? 'Dodaj uporabnika' : 'Add a user', exact: true }).click();
    const net = round(pro.monthlyGross + catalog.additionalUserRules[0].monthlyGrossPerUser + 100 * catalog.smsPerMessageGross);
    await expect(summary.locator('[data-pricing-net]')).toContainText(new Intl.NumberFormat(language === 'sl' ? 'sl-SI' : 'en-IE', { style: 'currency', currency: catalog.currency }).format(net));
    assert.equal(compact(await summary.locator('[data-pricing-vat]').innerText()), format(round(net * .22)));
    assert.equal(compact(await summary.locator('[data-pricing-total]').innerText()), format(gross(net)));
    const signup = new URL(await summary.locator('[data-pricing-signup]').getAttribute('href'));
    const estimate = JSON.parse(signup.searchParams.get('summary'));
    assert.equal(estimate.priceBasis, 'net');
    assert.equal(estimate.periodNet, net);
    assert.equal(estimate.periodVat, round(net * .22));
    assert.equal(estimate.monthlyTotal, gross(net));
    assert.equal(signup.searchParams.get('billing'), 'monthly');
    assert.equal(signup.searchParams.get('users'), String(catalog.includedUsers + 1));
    await page.goto(server.origin + (language === 'sl' ? '/' : '/en'), { waitUntil: 'networkidle' });
    await expect(page.locator('.home-price-period')).toHaveText(language === 'sl' ? '/ mesec' : '/ month');
    assert.doesNotMatch(await page.locator('#cenik').innerText(), /DDV|VAT/);
    assert.deepEqual(errors, []);
    results.push({ language, width, ...dimensions, passed: true });
    await context.close();
  }
  await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
  console.log(`PASS: ${results.length} SL/EN desktop/mobile VAT layouts, exact copy, net/VAT/gross totals, annual/SMS distinction, legacy API refresh, registration estimates, homepage and SEO.`);
} finally {
  await browser.close();
  await server.close();
}
