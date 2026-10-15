// Read-only tag reproduction: every analytics collection request is intercepted.
// No synthetic event reaches the production GA4 property.
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ headless: true });
try {
  const results = [];
  for (const mode of ['source', 'placement', 'demo_prompt']) {
    const context = await browser.newContext();
    const requests = [];
    await context.route(/(google-analytics\.com|analytics\.google\.com|\/g\/collect|\/collect\?)/, async route => {
      const request = route.request();
      requests.push({ url: request.url(), body: request.postData() });
      await route.fulfill({ status: 204, body: '' });
    });
    await context.route('https://calendra.si/__tag-audit', route => route.fulfill({
      contentType: 'text/html', body: '<!doctype html><title>Tag audit</title>',
    }));
    const page = await context.newPage();
    await page.goto('https://calendra.si/__tag-audit');
    await page.evaluate(() => {
      window.dataLayer = [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      window.gtag('js', new Date());
      window.gtag('config', 'G-DVDT4W7BYS');
    });
    await page.addScriptTag({ url: 'https://www.googletagmanager.com/gtag/js?id=G-DVDT4W7BYS' });
    await page.evaluate(mode => {
      if (mode === 'demo_prompt') {
        window.gtag('event', 'demo_prompt_impression', { placement: 'demo_popup_desktop', language: 'sl' });
        window.gtag('event', 'demo_booking_confirmed', { entry_point: 'popup_desktop', language: 'sl', meeting_provider: 'GOOGLE_MEET' });
      } else window.gtag('event', 'pricing_package_selected', { [mode]: 'pricing_page', package_type: 'PRO' });
    }, mode);
    await page.waitForTimeout(2200);
    results.push({ mode, requests: requests.map(request => {
      const params = new URL(request.url).searchParams;
      const body = new URLSearchParams(request.body ?? '');
      const selected = {};
      for (const [key, value] of [...params, ...body]) {
        if (/^(en|cs|cm|cn|dl|dr|ep\.(source|placement|package_type|entry_point|language|meeting_provider))$/.test(key)) selected[key] = value;
      }
      return selected;
    }) });
    if (mode === 'demo_prompt') {
      const requests = results.at(-1).requests;
      assert.ok(requests.some(event => event.en === 'demo_prompt_impression' && event['ep.placement'] === 'demo_popup_desktop'));
      assert.ok(requests.some(event => event.en === 'demo_booking_confirmed' && event['ep.entry_point'] === 'popup_desktop'));
      assert.ok(requests.every(event => !event.cs && !event.cm), 'internal placement must not override acquisition');
    }
    await context.close();
  }
  await mkdir('output/visibility-audit', { recursive: true });
  await writeFile('output/visibility-audit/tag-reproduction.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
