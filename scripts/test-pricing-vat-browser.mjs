// Real production assets; API fixtures and analytics are intercepted. No signup,
// invoice, email or production tracking request is submitted by this check.
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
import { startDistServer } from './serve-dist.mjs';

const html = await readFile('dist/cenik/index.html', 'utf8');
// The regular pass runs without an offer even while the app publishes one; the
// Black Friday pass below supplies its own promotion.
const { promotion: livePromotion, ...catalog } = JSON.parse(html.match(/<script[^>]*id="calendra-pricing-catalog"[^>]*>([\s\S]*?)<\/script>/)[1]);
// The offer is client-only and never part of the prerendered page.
assert.doesNotMatch(html.replace(/<script[^>]*id="calendra-pricing-catalog"[^>]*>[\s\S]*?<\/script>/, ''), /Black Friday|pricing-promo|bf-banner/);
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
      // Polled: a prerendered offer, if any, is removed once the refreshed catalog arrives.
      await expect.poll(async () => compact(await card.locator('.pricing-plan-price strong').innerText())).toBe(format(plan.monthlyGross));
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

  // Black Friday: an app promotion appears after hydration only, keeps VAT out of the
  // cards and discounts only the plan in the calculator. Synthetic test promotion:
  // half the monthly plan price for 6 months, so a year costs 6 × half + 6 × full.
  const half = value => round(value / 2);
  const promotion = {
    code: 'BLACKFRIDAY50', percentOff: 50, discountedMonths: 6,
    validUntil: new Date(Date.now() + 30 * 864e5).toISOString(),
    plans: catalog.plans.map(plan => ({ key: plan.key, monthlyPrice: half(plan.monthlyGross), annualPrice: round(6 * half(plan.monthlyGross) + 6 * plan.monthlyGross) })),
  };
  const promoResults = [];
  for (const [language, width] of [['sl', 1440], ['sl', 390], ['en', 1440], ['en', 390]]) {
    const sl = language === 'sl';
    const context = await browser.newContext({ viewport: { width, height: 1000 }, locale: sl ? 'sl-SI' : 'en-IE', reducedMotion: 'reduce' });
    await context.addInitScript(() => localStorage.setItem('calendra-google-analytics-consent', 'denied'));
    await context.route(/googletagmanager\.com|google-analytics\.com|analytics\.google\.com|\/stats\//, route => route.fulfill({ status: 200, body: '' }));
    await context.route(/\/api\//, route => route.fulfill({ status: 503, json: {} }));
    await context.route('**/api/register/public-pricing', route => route.fulfill({ json: { ...catalog, promotion } }));
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const format = value => compact(new Intl.NumberFormat(sl ? 'sl-SI' : 'en-IE', { style: 'currency', currency: catalog.currency }).format(value));
    const pricingPath = sl ? '/cenik' : '/en/pricing';
    await page.goto(`${server.origin}${pricingPath}?plan=premium&code=${promotion.code.toLowerCase()}`, { waitUntil: 'networkidle' });
    const cookieButton = page.getByRole('button', { name: sl ? 'Samo nujni' : 'Necessary only', exact: true });
    if (await cookieButton.isVisible()) await cookieButton.click();

    const banner = page.locator('.bf-banner');
    await expect(banner).toBeVisible();
    assert.equal(await banner.locator('a').getAttribute('href'), `${pricingPath}?code=${promotion.code}`);
    const offer = page.locator('#black-friday');
    await expect(offer).toBeVisible();
    if (width > 800) {
      const [block, grid] = await Promise.all([offer.boundingBox(), page.locator('.pricing-plan-grid').boundingBox()]);
      assert.ok(Math.abs(block.x - grid.x) <= 1 && Math.abs(block.width - grid.width) <= 1, `${language}/${width}: offer block is not as wide as the cards`);
    }
    for (const plan of catalog.plans) {
      const card = page.locator(`[data-plan="${{ basic: 'basic', pro: 'professional', business: 'premium' }[plan.key]}"]`);
      await expect.poll(async () => compact(await card.locator('.pricing-plan-price strong').innerText())).toBe(format(half(plan.monthlyGross)));
      assert.equal(compact(await card.locator('.pricing-promo-old').innerText()), format(plan.monthlyGross));
      assert.doesNotMatch(await card.innerText(), /DDV|VAT/);
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${output}/black-friday-cards-${language}-${width}.png` });

    const premium = catalog.plans.find(plan => plan.key === 'business');
    const summary = page.locator('.pricing-summary-card');
    await expect(summary.locator('.pricing-promo-code-ok')).toBeVisible();
    await page.getByRole('button', { name: sl ? 'Dodaj uporabnika' : 'Add a user', exact: true }).click();
    await page.getByRole('spinbutton', { name: sl ? 'Število dodatnih SMS sporočil' : 'Number of additional SMS messages', exact: true }).fill('100');
    const extras = catalog.additionalUserRules[0].monthlyGrossPerUser + 100 * catalog.smsPerMessageGross;
    const net = round(half(premium.monthlyGross) + extras);
    await expect.poll(async () => compact(await summary.locator('[data-pricing-net]').innerText())).toBe(format(net));
    assert.equal(compact(await summary.locator('[data-pricing-discount]').innerText()), `−${format(premium.monthlyGross - half(premium.monthlyGross))}`);
    assert.equal(compact(await summary.locator('[data-pricing-vat]').innerText()), format(round(net * .22)));
    assert.equal(compact(await summary.locator('[data-pricing-total]').innerText()), format(gross(net)));
    assert.ok(compact(await summary.locator('[data-pricing-regular-total]').innerText()).includes(format(gross(premium.monthlyGross + extras))));
    assert.equal(new URL(await summary.locator('[data-pricing-signup]').getAttribute('href')).searchParams.get('code'), promotion.code);
    await summary.screenshot({ path: `${output}/black-friday-calculator-${language}-${width}.png`, style: '.site-navbar-editorial,.pricing-sticky-summary{visibility:hidden}' });

    await page.getByRole('button', { name: sl ? 'Letno' : 'Yearly', exact: true }).click();
    for (const plan of catalog.plans) {
      const card = page.locator(`[data-plan="${{ basic: 'basic', pro: 'professional', business: 'premium' }[plan.key]}"]`);
      const annual = promotion.plans.find(item => item.key === plan.key).annualPrice;
      assert.equal(compact(await card.locator('.pricing-plan-price strong').innerText()), format(round(annual / 12)));
      assert.doesNotMatch(await card.innerText(), /DDV|VAT/);
    }
    await expect(page.locator('.pricing-faq details').first()).toHaveClass(/pricing-promo-faq/);
    await expect(page.locator('.pricing-faq details').first()).toHaveAttribute('open', '');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    assert.ok(overflow <= 1, `${language}/${width}: horizontal overflow with the offer`);

    // Closing the banner is remembered on the next page.
    await banner.getByRole('button').click();
    await expect(banner).toHaveCount(0);
    await page.goto(server.origin + (sl ? '/' : '/en'), { waitUntil: 'networkidle' });
    await expect(page.locator('.home-promo-line')).toBeVisible();
    assert.doesNotMatch(await page.locator('#cenik').innerText(), /DDV|VAT/);
    await expect(page.locator('.bf-banner')).toHaveCount(0);
    const trial = page.locator(`a[href*="${sl ? '/registriraj' : '/register'}"]`).first();
    await expect.poll(async () => new URL(await trial.getAttribute('href')).searchParams.get('code')).toBe(promotion.code);
    assert.deepEqual(errors, []);
    promoResults.push({ language, width, overflow, passed: true });
    await context.close();
  }

  await writeFile(`${output}/results.json`, JSON.stringify({ regular: results, blackFriday: promoResults }, null, 2));
  console.log(`PASS: ${results.length} SL/EN desktop/mobile VAT layouts, exact copy, net/VAT/gross totals, annual/SMS distinction, legacy API refresh, registration estimates, homepage and SEO; ${promoResults.length} Black Friday layouts (client-only offer, VAT-free cards, plan-only discount, trial code).${livePromotion ? ' The live catalog carries a promotion.' : ''}`);
} finally {
  await browser.close();
  await server.close();
}
