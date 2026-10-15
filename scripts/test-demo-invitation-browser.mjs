// Production-build browser contracts. Network writes and analytics never leave this runner.
import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { startDistServer } from './serve-dist.mjs';

const server = process.env.AUDIT_ORIGIN ? null : await startDistServer(0);
const origin = process.env.AUDIT_ORIGIN || server.origin;
const browser = await chromium.launch();
const results = [];
const output = 'output/visibility-audit/demo-invitation';
await mkdir(output, { recursive: true });
const prompt = page => page.locator('[data-demo-invitation]');
const events = page => page.evaluate(() => window.__marketingEvents || []);
const gaEvents = page => page.evaluate(() => Array.from(window.dataLayer || [], args => Array.from(args)).filter(args => args[0] === 'event'));

async function setup({ width = 1280, consent = 'granted', duration = 15, enabled = true, path = '/', storageBlocked = false } = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  await context.addInitScript(({ consent, storageBlocked }) => {
    if (consent) localStorage.setItem('calendra-google-analytics-consent', consent);
    if (storageBlocked) {
      Storage.prototype.setItem = () => { throw new Error('Storage blocked'); };
      Storage.prototype.getItem = () => { throw new Error('Storage blocked'); };
    }
    window.__marketingEvents = [];
    window.addEventListener('calendra:marketing-event', event => window.__marketingEvents.push(event.detail));
  }, { consent, storageBlocked });
  await context.route(/googletagmanager\.com|google-analytics\.com|analytics\.google\.com/, route => route.fulfill({ status: 200, body: '' }));
  await context.route(/\/api\//, route => route.fulfill({ status: route.request().url().endsWith('/demo-bookings/profile') ? 200 : 503,
    contentType: 'application/json', body: JSON.stringify({ enabled, durationMinutes: duration, timeZone: 'Europe/Ljubljana', meetingProvider: 'GOOGLE_MEET' }) }));
  const page = await context.newPage();
  await page.clock.install({ time: new Date('2026-10-15T12:00:00Z') });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${origin}${path}`);
  await expect(page.locator('h1')).toBeVisible();
  return { context, page, errors };
}
const navigate = async (page, path) => {
  await page.evaluate(path => { history.pushState(null, '', path); dispatchEvent(new PopStateEvent('popstate')); }, path);
  await expect(page.locator('h1')).toBeVisible();
};

try {
  for (const width of [1280, 390, 320]) for (const language of ['sl', 'en']) {
    const { page, context, errors } = await setup({ width, path: language === 'sl' ? '/' : '/en' });
    // Avoid primary CTA collision on the initial narrow viewport. Scrolling must never advance time.
    await page.evaluate(() => scrollTo(0, 1200));
    await page.clock.runFor(9_900);
    await expect(prompt(page)).toHaveCount(0);
    await page.clock.runFor(101);
    await expect(prompt(page)).toBeVisible();
    assert.equal(await prompt(page).getAttribute('data-demo-invitation'), width < 640 ? 'mobile' : 'desktop');
    assert.equal(await prompt(page).evaluate(el => getComputedStyle(el).animationName), 'none');
    const box = await prompt(page).boundingBox();
    assert.ok(box.x >= 0 && box.x + box.width <= width && box.y >= 0 && box.y + box.height <= 901, 'prompt fits viewport');
    await page.screenshot({ path: `${output}/${language}-${width}.png` });
    assert.equal((await events(page)).filter(event => event.event === 'demo_prompt_impression').length, 1);
    if (width >= 640) {
      await expect(prompt(page).locator('button')).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(prompt(page).locator('a')).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(prompt(page).locator('button')).toBeFocused();
    }
    await prompt(page).locator('a').click();
    await expect(page).toHaveURL(new RegExp(`${language === 'sl' ? '/predstavitev' : '/en/demo'}$`));
    const routerState = await page.evaluate(() => history.state.usr);
    assert.equal(routerState.demoEntry, width < 640 ? 'banner_mobile' : 'popup_desktop');
    assert.equal((await events(page)).filter(event => event.event === 'demo_booking_cta_clicked').length, 1);
    const until = await page.evaluate(() => Number(localStorage.getItem('calendra:demo-invitation:v1:suppressed-until')));
    assert.ok(until > await page.evaluate(() => Date.now() + 6.99 * 86400000));
    await navigate(page, '/cenik');
    await page.clock.runFor(20_000);
    await expect(prompt(page)).toHaveCount(0);
    assert.deepEqual(errors, []);
    results.push({ width, language, timing: true, navigation: true, attribution: true });
    await context.close();
  }

  {
    const { page, context } = await setup();
    const previous = page.locator('main a').first();
    await previous.focus();
    await page.clock.runFor(4_000);
    await navigate(page, '/koledar-terminov');
    await page.clock.runFor(6_001);
    await expect(prompt(page)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(prompt(page)).toHaveCount(0);
    assert.equal((await events(page)).filter(event => event.event === 'demo_prompt_dismissed').length, 1);
    await page.reload();
    await page.clock.runFor(20_000);
    await expect(prompt(page)).toHaveCount(0);
    await context.close();
    results.push({ spaTimerAndEscapeSuppression: true });
  }

  for (const storageBlocked of [false, true]) {
    const { page, context } = await setup({ consent: null, storageBlocked });
    await page.clock.runFor(20_000);
    await expect(prompt(page)).toHaveCount(0);
    await page.getByRole('button', { name: 'Samo nujni', exact: true }).click();
    await expect(prompt(page)).toBeVisible();
    assert.equal((await gaEvents(page)).filter(args => args[1] === 'demo_prompt_impression').length, 0);
    await prompt(page).locator('button').click();
    await navigate(page, '/cenik');
    await page.clock.runFor(20_000);
    await expect(prompt(page)).toHaveCount(0);
    assert.equal((await events(page)).filter(event => event.event === 'demo_prompt_impression').length, 1);
    await page.evaluate(() => dispatchEvent(new Event('calendra:open-cookie-settings')));
    await page.getByRole('button', { name: 'Dovoli analitiko', exact: true }).click();
    assert.equal((await gaEvents(page)).filter(args => args[1].startsWith('demo_prompt')).length, 0, 'no replay after consent');
    await context.close();
    results.push({ cookieDeferral: true, deniedConsent: true, storageBlocked });
  }

  for (const options of [{ duration: 30 }, { enabled: false }, { path: '/kontakt' }, { path: '/piskotki' }, { path: '/en/demo' }]) {
    const { page, context } = await setup(options);
    await page.clock.runFor(20_000);
    await expect(prompt(page)).toHaveCount(0);
    assert.equal((await events(page)).filter(event => event.event === 'demo_prompt_impression').length, 0);
    await context.close();
    results.push({ excluded: options });
  }

  {
    const { page, context } = await setup({ width: 390, path: '/koledar-terminov' });
    await page.evaluate(() => scrollTo(0, 1700));
    await page.clock.runFor(5_000);
    await expect(page.locator('[data-sales-sticky]')).toBeVisible();
    await page.clock.runFor(5_001);
    await expect(prompt(page)).toBeVisible();
    await expect(page.locator('[data-sales-sticky]')).toBeHidden();
    await page.evaluate(() => dispatchEvent(new Event('calendra:open-cookie-settings')));
    await expect(page.getByRole('dialog', { name: 'Nastavitve analitike' })).toBeVisible();
    await expect(prompt(page)).toHaveCount(0);
    await expect(page.locator('[data-sales-sticky]')).toBeHidden();
    await page.getByRole('button', { name: 'Samo nujni', exact: true }).click();
    await expect(page.locator('[data-sales-sticky]')).toBeVisible();
    await expect(prompt(page)).toHaveCount(0);
    await context.close();
    results.push({ competingBanners: true });
  }

  {
    const { page, context } = await setup();
    await page.evaluate(() => {
      const dialog = document.createElement('dialog'); dialog.id = 'audit-modal'; dialog.textContent = 'Other dialog';
      document.body.append(dialog); dialog.showModal();
    });
    await page.clock.runFor(12_000);
    await expect(prompt(page)).toHaveCount(0);
    await page.evaluate(() => document.getElementById('audit-modal').remove());
    await expect(prompt(page)).toBeVisible();
    await context.close();
    results.push({ modalDeferral: true });
  }

  {
    const { page, context } = await setup({ path: '/cenik' });
    const field = page.locator('form input').first();
    await field.fill('In-progress inquiry');
    await page.clock.runFor(20_000);
    await expect(prompt(page)).toHaveCount(0);
    await page.locator('h1').click();
    await expect(prompt(page)).toHaveCount(0);
    await context.close();
    results.push({ activeFormDeferral: true });
  }

  {
    const { page, context } = await setup();
    const previous = page.locator('main a').first();
    await previous.focus();
    await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
    await page.clock.runFor(12_000);
    await expect(prompt(page)).toHaveCount(0);
    await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' }); document.dispatchEvent(new Event('visibilitychange')); });
    await expect(prompt(page)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(previous).toBeFocused();
    await context.close();
    results.push({ inactiveTabDeferral: true, focusRestoration: true });
  }

  {
    const { page, context } = await setup({ width: 390 });
    await page.evaluate(() => {
      scrollTo(0, 1200);
      const link = document.createElement('a'); link.href = '/predstavitev'; link.textContent = 'Primary demo CTA';
      link.id = 'audit-primary'; link.style.cssText = 'position:fixed;bottom:0;left:0;padding:20px;background:white';
      document.querySelector('main').append(link);
    });
    await page.clock.runFor(12_000);
    await expect(prompt(page)).toHaveCount(0);
    await page.evaluate(() => document.getElementById('audit-primary').remove());
    await expect(prompt(page)).toBeVisible();
    await context.close();
    results.push({ primaryCtaCollisionDeferral: true });
  }
} finally {
  await browser.close();
  await server?.close();
}
await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
console.log(`Demo invitation: ${results.length} browser scenarios passed. Screenshots: ${output}`);
