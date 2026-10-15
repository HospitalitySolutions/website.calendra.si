// Exercise the booking redesign against local production assets. All API
// requests are intercepted: this runner cannot reserve or email a real demo.
import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { startDistServer } from './serve-dist.mjs';

const server = await startDistServer(0);
const browser = await chromium.launch();
const output = 'output/visibility-audit/demo-booking';
await mkdir(output, { recursive: true });
const results = [];
const gate = () => { let release; const promise = new Promise(resolve => { release = resolve; }); return { promise, release }; };
const dates = ['2026-10-16', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30'];
const slots = date => Array.from({ length: 9 }, (_, index) => {
  const start = new Date(`${date}T12:45:00Z`);
  start.setUTCMinutes(start.getUTCMinutes() + index * 15);
  return { startAt: start.toISOString(), endAt: new Date(start.getTime() + 900000).toISOString() };
});
const selected = slots(dates[0])[1];
const profile = { enabled: true, durationMinutes: 15, timeZone: 'Europe/Ljubljana', meetingProvider: 'GOOGLE_MEET', bookingHorizonDays: 30, minimumNoticeMinutes: 1440 };
const booking = { ...selected, id: 123, status: 'CONFIRMED', title: 'Demo', durationMinutes: 15, timeZone: 'Europe/Ljubljana', guestTimeZone: 'Europe/Ljubljana', guestName: 'Test', guestEmail: 'test@example.invalid', companyName: 'Test', meetingProvider: 'GOOGLE_MEET', manageToken: 'test-token', canModify: true };

async function fixture(width, language = 'sl', mode = 'normal') {
  const context = await browser.newContext({ viewport: { width, height: 1000 }, timezoneId: 'Europe/Ljubljana', reducedMotion: 'reduce' });
  await context.addInitScript(() => localStorage.setItem('calendra-google-analytics-consent', 'denied'));
  await context.route(/googletagmanager\.com|google-analytics\.com|analytics\.google\.com/, route => route.fulfill({ status: 200, body: '' }));
  const first = gate(), later = gate(), ranges = [];
  let availabilityCalls = 0, holdCalls = 0, profileCalls = 0;
  if (mode !== 'normal') { first.release(); later.release(); }
  await context.route(/\/api\//, async route => {
    const url = new URL(route.request().url());
    let body = {}, status = 200;
    if (url.pathname.endsWith('/profile')) {
      profileCalls++;
      body = { ...profile, enabled: mode !== 'disabled' };
      if (mode === 'profile-error' && profileCalls === 1) { status = 503; body = { message: 'Temporarily unavailable' }; }
    } else if (url.pathname.endsWith('/availability')) {
      availabilityCalls++;
      const from = url.searchParams.get('from'), to = url.searchParams.get('to');
      ranges.push({ from, to });
      assert.ok((new Date(to) - new Date(from)) / 86400000 <= 6, 'only one week per request');
      await (availabilityCalls === 1 ? first.promise : later.promise);
      if (mode === 'availability-error' && availabilityCalls === 1) { status = 503; body = { message: 'Unavailable' }; }
      else body = { timeZone: 'Europe/Ljubljana', days: mode === 'empty' ? [] : dates.filter(date => date >= from && date <= to).map(date => ({ date, slots: slots(date) })) };
    } else if (url.pathname.endsWith('/holds')) {
      holdCalls++;
      const { startAt } = route.request().postDataJSON();
      body = { startAt, endAt: new Date(new Date(startAt).getTime() + 900000).toISOString(), holdToken: 'test-hold', expiresAt: '2026-10-15T13:10:00Z' };
      if (mode === 'hold-error' && holdCalls === 1) { status = 409; body = { message: 'Termin ni več na voljo.' }; }
    } else if (url.pathname.endsWith('/reschedule')) body = booking;
    else if (url.pathname.includes('/manage/')) body = booking;
    else if (url.pathname.endsWith('/confirm')) body = booking;
    else { status = 503; body = { message: 'Unexpected API request' }; }
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
  });
  const page = await context.newPage();
  await page.clock.install({ time: new Date('2026-10-15T12:00:00Z') });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  const path = language === 'sl' ? '/predstavitev' : '/en/demo';
  return { context, page, first, later, ranges, pageErrors, path, get availabilityCalls() { return availabilityCalls; } };
}

try {
  for (const [width, language] of [[1440, 'sl'], [1024, 'sl'], [390, 'sl'], [320, 'sl'], [1440, 'en'], [390, 'en']]) {
    const f = await fixture(width, language);
    const { page, context, first, later } = f;
    await page.goto(server.origin + f.path);
    await expect(page.locator('.demo-date-skeleton')).toHaveCount(5);
    await expect(page.locator('.demo-time-skeleton')).toHaveCount(9);
    await expect(page.locator('.demo-continue')).toBeDisabled();
    if (width === 1440 && language === 'sl') await page.screenshot({ path: `${output}/loading-desktop.png`, fullPage: true });
    first.release();
    await expect(page.locator('.demo-date')).toHaveCount(5);
    assert.equal(f.availabilityCalls, 2, 'first week is usable while next week is still pending');
    await page.getByRole('button', { name: '15:00', exact: true }).click();
    await expect(page.locator('.demo-selection-time')).toHaveText('15:00–15:15');
    await expect(page.locator('.demo-continue')).toBeEnabled();
    const style = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      headingWeight: getComputedStyle(document.querySelector('h1')).fontWeight,
      dateWeight: getComputedStyle(document.querySelector('.demo-selection-date')).fontWeight,
      timeWeight: getComputedStyle(document.querySelector('.demo-selection-time')).fontWeight,
      footerColor: getComputedStyle(document.querySelector('footer')).backgroundColor,
      dateRows: new Set([...document.querySelectorAll('.demo-date')].map(el => Math.round(el.getBoundingClientRect().top))).size,
    }));
    assert.deepEqual(style, { overflow: false, headingWeight: '400', dateWeight: '400', timeWeight: '400', footerColor: 'rgb(255, 255, 255)', dateRows: 1 });
    await expect(page.locator('footer nav')).toHaveCount(6);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${output}/${language}-${width}.png`, fullPage: true });
    later.release();
    await expect(page.locator('.demo-loading-more')).toHaveCount(0);
    await expect(page.locator('.demo-selection-time')).toHaveText('15:00–15:15');
    await page.getByRole('button', { name: language === 'sl' ? 'Naslednji datumi' : 'Next dates', exact: true }).click();
    await expect(page.locator('.demo-date').first()).toContainText('23');
    await expect(page.locator('.demo-continue')).toBeDisabled();
    await page.getByRole('button', { name: language === 'sl' ? 'Prejšnji datumi' : 'Previous dates', exact: true }).click();
    await page.getByRole('button', { name: '15:00', exact: true }).click();
    await page.locator('.demo-continue').click();
    await expect(page.locator('#demo-name')).toBeVisible();
    await expect(page.locator('.demo-steps [aria-current="step"]')).toContainText(language === 'sl' ? 'Vaši podatki' : 'Your details');
    await page.locator('#demo-name').fill('Test');
    await page.locator('#demo-email').fill('test@example.invalid');
    await page.locator('#demo-company').fill('Test');
    await page.locator('form button[type="submit"]').click();
    await expect(page.locator('.demo-steps [aria-current="step"]')).toContainText(language === 'sl' ? 'Potrditev' : 'Confirmation');
    await expect(page.locator('h1')).toHaveCount(1);
    assert.deepEqual(f.pageErrors, []);
    results.push({ width, language, ...style, requests: f.ranges });
    await context.close();
  }

  for (const mode of ['profile-error', 'availability-error', 'hold-error', 'empty', 'disabled']) {
    const f = await fixture(390, 'sl', mode);
    await f.page.goto(server.origin + f.path);
    if (mode.endsWith('error') && mode !== 'hold-error') await f.page.getByRole('button', { name: 'Poskusi znova', exact: true }).click();
    if (mode === 'empty') {
      await expect(f.page.getByText(/V tem obdobju ni prostih terminov/)).toBeVisible();
      assert.equal(f.availabilityCalls, 5);
    } else if (mode === 'disabled') {
      await expect(f.page.getByText('Spletno naročanje predstavitve trenutno ni na voljo.', { exact: true })).toBeVisible();
      assert.equal(f.availabilityCalls, 0);
    } else {
      await f.page.getByRole('button', { name: '15:00', exact: true }).click();
      if (mode === 'hold-error') {
        await expect(f.page.getByRole('alert')).toContainText('Termin ni več na voljo.');
        await expect(f.page.locator('.demo-continue')).toBeDisabled();
        await f.page.getByRole('button', { name: '15:00', exact: true }).click();
      }
      await expect(f.page.locator('.demo-continue')).toBeEnabled();
    }
    results.push({ mode, passed: true });
    await f.context.close();
  }

  const manage = await fixture(390, 'sl', 'management');
  await manage.page.goto(`${server.origin}/predstavitev/upravljanje/test-token`);
  await expect(manage.page.getByRole('button', { name: 'Prestavi termin', exact: true })).toBeVisible();
  await expect(manage.page).toHaveTitle('Vaša predstavitev Calendre');
  await expect(manage.page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  assert.ok(!(await manage.page.locator('head').innerHTML()).includes('test-token'));
  assert.equal(await manage.page.locator('script[data-calendra-google-analytics]').count(), 0);
  assert.equal(manage.availabilityCalls, 0);
  await manage.page.getByRole('button', { name: 'Prestavi termin', exact: true }).click();
  await manage.page.getByRole('button', { name: '15:00', exact: true }).click();
  await manage.page.getByRole('button', { name: 'Potrdi novi termin', exact: true }).click();
  await expect(manage.page.getByRole('button', { name: 'Prestavi termin', exact: true })).toBeVisible();
  results.push({ mode: 'management-reschedule', passed: true });
  await manage.context.close();
} finally {
  await browser.close();
  await server.close();
}
await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
console.log(`Demo booking: ${results.length} desktop/mobile, localization, loading, retry and rescheduling scenarios passed. All API writes intercepted.`);
