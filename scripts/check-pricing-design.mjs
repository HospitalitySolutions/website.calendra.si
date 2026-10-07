import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from '@playwright/test';

// Run against `npm run build` + `node scripts/serve-dist.mjs 5176`.
// Reuse the build's public catalogue so external updates cannot make this flaky.
const base = process.env.PRICING_URL || 'http://127.0.0.1:5176';
const output = 'output/pricing-implementation';
const html = await fs.readFile('dist/cenik/index.html', 'utf8');
const island = html.match(/<script[^>]*id="calendra-pricing-catalog"[^>]*>([\s\S]*?)<\/script>/);
assert.ok(island, 'The prerendered page must contain a pricing catalogue');
const catalog = JSON.parse(island[1]);
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'sl-SI', timezoneId: 'Europe/Ljubljana', reducedMotion: 'reduce' });
await context.route('**/api/register/public-pricing', route => route.fulfill({ json: catalog }));
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const money = value => new Intl.NumberFormat('sl-SI', { style: 'currency', currency: 'EUR' }).format(value).replace(/\s/g, '');
const compact = value => value.replace(/\s/g, '');
const summary = () => page.locator('.pricing-summary-card');
const signupData = async () => {
  const url = new URL(await summary().locator('[data-pricing-signup]').getAttribute('href'));
  return { url, data: JSON.parse(url.searchParams.get('summary')) };
};

try {
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${base}/cenik`, { waitUntil: 'networkidle' });
    const cookies = page.getByRole('button', { name: 'Samo nujni', exact: true });
    if (await cookies.isVisible()) await cookies.click();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    assert.match(await page.locator('h1').innerText(), /Cenik programa za naročanje strank Calendra/);
    assert.equal(await page.locator('.pricing-plan').count(), 3);
    assert.equal(await page.locator('.pricing-comparison tbody tr').count(), catalog.features.length);
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - innerWidth,
      bands: [...document.querySelectorAll('.pricing-calculator-band, .pricing-it-band')].map(el => ({ left: el.getBoundingClientRect().left, width: el.getBoundingClientRect().width })),
      footer: getComputedStyle(document.querySelector('.site-footer-editorial')).backgroundColor,
    }));
    assert.ok(layout.overflow <= 1, `Horizontal overflow at ${width}: ${layout.overflow}`);
    assert.equal(layout.bands.length, 2);
    for (const band of layout.bands) assert.ok(Math.abs(band.left) < 1 && Math.abs(band.width - width) < 1, `Band is not full width at ${width}`);
    assert.equal(layout.footer, 'rgb(255, 255, 255)');
    const faq = page.locator('.pricing-faq details').nth(1);
    await faq.locator('summary').click();
    assert.equal(await faq.getAttribute('open'), '');
    await faq.locator('summary').click();
    assert.equal(await faq.getAttribute('open'), null);
    await page.locator('#pricing-configurator').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => !!document.querySelector('.pricing-sticky-summary'));
    const stickyHeight = await page.locator('.pricing-sticky-summary').evaluate(el => el.getBoundingClientRect().height);
    assert.ok(stickyHeight < 135, `Sticky summary is too tall at ${width}: ${stickyHeight}`);
    if (width === 1440 || width === 390) {
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `${output}/pricing-${width}.png`, fullPage: true });
      await page.locator('.pricing-plan-grid').screenshot({ path: `${output}/plans-${width}.png`, style: '.site-navbar-editorial,.pricing-sticky-summary{visibility:hidden}' });
      await page.locator('.pricing-calculator-band').screenshot({ path: `${output}/calculator-${width}.png`, style: '.site-navbar-editorial,.pricing-sticky-summary{visibility:hidden}' });
    }
    console.log(JSON.stringify({ width, ...layout, stickyHeight }));
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/cenik?plan=basic&billing=annual#pricing-configurator`, { waitUntil: 'networkidle' });
  assert.equal(await page.getByRole('button', { name: 'Letno', exact: true }).getAttribute('aria-pressed'), 'true');
  assert.match(await summary().locator('h3').innerText(), /Osnovno/);
  const basic = catalog.plans.find(plan => plan.key === 'basic');
  assert.equal(compact(await summary().locator('[data-pricing-total]').innerText()), money(Math.round(basic.annualGross / 12 * 100) / 100));
  await page.getByRole('button', { name: 'Mesečno', exact: true }).click();
  await page.getByRole('button', { name: 'Izberi Profesionalno', exact: true }).click();
  const professional = catalog.plans.find(plan => plan.key === 'pro');
  assert.equal(compact(await summary().locator('[data-pricing-total]').innerText()), money(professional.monthlyGross));
  await page.getByRole('button', { name: 'Dodaj uporabnika', exact: true }).click();
  await page.getByRole('spinbutton', { name: 'Število dodatnih SMS sporočil', exact: true }).fill('100');
  const addon = catalog.addOns.find(item => item.code === 'FISCAL');
  assert.ok(addon, 'The public catalogue should offer the fiscal add-on used by the design');
  await page.getByRole('checkbox', { name: /Davčna blagajna/ }).check();
  const expected = Math.round((professional.monthlyGross + 5.9 + 100 * catalog.smsPerMessageGross + addon.monthlyGross) * 100) / 100;
  assert.equal(compact(await summary().locator('[data-pricing-total]').innerText()), money(expected));
  const selected = await signupData();
  assert.equal(selected.url.searchParams.get('package'), 'PROFESSIONAL');
  assert.equal(selected.url.searchParams.get('billing'), 'monthly');
  assert.equal(selected.data.totalUsers, 2);
  assert.equal(selected.data.additionalSms, 100);
  assert.equal(selected.data.fiscalCashRegister, true);
  assert.deepEqual(selected.data.selectedAddOnKeys, [addon.key]);
  assert.ok(Math.abs(selected.data.monthlyTotal - expected) < .001);
  await page.getByRole('slider', { name: 'Število uporabnikov', exact: true }).press('ArrowRight');
  assert.equal(await page.getByRole('spinbutton', { name: 'Število uporabnikov', exact: true }).inputValue(), '3');
  await page.getByRole('spinbutton', { name: 'Število uporabnikov', exact: true }).fill('999');
  assert.equal(await page.getByRole('spinbutton', { name: 'Število uporabnikov', exact: true }).inputValue(), '20');
  await page.getByRole('spinbutton', { name: 'Število uporabnikov', exact: true }).fill('0');
  assert.equal(await page.getByRole('spinbutton', { name: 'Število uporabnikov', exact: true }).inputValue(), String(catalog.includedUsers));
  await page.getByRole('button', { name: 'Pošljite povpraševanje', exact: true }).first().click();
  assert.match(await page.locator('.pricing-form-actions').innerText(), /Enterprise/);
  assert.equal(await page.locator('.pricing-sticky-summary').count(), 0);
  assert.equal(await page.getByLabel('E-pošta', { exact: true }).getAttribute('type'), 'email');
  assert.equal(await page.getByLabel('Ime in priimek', { exact: true }).getAttribute('autocomplete'), 'name');
  assert.equal(await page.locator('.pricing-contact-form').evaluate(form => form.checkValidity()), false, 'Empty contact form must not submit');

  // Switching to a plan that does not support a chosen module removes it from the total and signup payload.
  await context.route('**/api/register/public-pricing', route => route.fulfill({ json: { ...catalog, addOns: catalog.addOns.map(item => ({ ...item, availablePlans: ['business'] })) } }));
  await page.goto(`${base}/cenik?plan=premium#pricing-configurator`, { waitUntil: 'networkidle' });
  await page.getByRole('checkbox', { name: /Davčna blagajna/ }).check();
  await page.locator('.pricing-package-selector').getByRole('button', { name: 'Osnovno', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('.pricing-addons'));
  assert.deepEqual((await signupData()).data.selectedAddOnKeys, []);

  await page.evaluate(() => localStorage.setItem('calendra-site-language', 'en'));
  await page.goto(`${base}/en/pricing`, { waitUntil: 'networkidle' });
  assert.match(await page.locator('h1').innerText(), /Pricing for Calendra/);
  assert.equal(await page.getByRole('button', { name: 'Monthly', exact: true }).count(), 1);
  assert.equal(await page.getByRole('spinbutton', { name: 'Number of users', exact: true }).count(), 1);
  assert.equal(await page.locator('.pricing-related-links a[href^="/en/"]').count(), await page.locator('.pricing-related-links a').count());
  assert.equal(errors.length, 0, errors.join('\n'));
  console.log('PASS: five viewport sizes, full-width bands, FAQ, monthly/yearly billing, query selection, user/SMS controls, add-ons, signup payload, Enterprise, module eligibility, English, no browser errors.');
} finally {
  await browser.close();
}
