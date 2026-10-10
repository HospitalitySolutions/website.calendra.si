// Real Google tag, isolated browser, all collection requests blocked locally.
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  const entries = [
    { name: 'google-tagged', query: 'utm_source=google&utm_medium=cpc' },
    { name: 'google-organic', query: '', referrer: 'https://www.google.com/search?q=private-search' },
    { name: 'chatgpt-referral', query: '', referrer: 'https://chatgpt.com/c/private-conversation' },
    { name: 'chatgpt-tagged', query: 'utm_source=chatgpt.com&utm_medium=ai-assistant' },
    { name: 'social', query: 'utm_source=ig&utm_medium=social' },
    { name: 'direct', query: '' },
    { name: 'invalid-internal-source', query: 'utm_source=pricing_page&utm_medium=' },
    { name: 'private-site-search', query: 'q=private-search', excludedEntry: true },
  ];
  for (const consent of ['granted', 'denied']) for (const entry of entries) {
    const context = await browser.newContext();
    const requests = [];
    await context.route(/(google-analytics\.com|analytics\.google\.com|\/g\/collect|\/collect\?)/, async route => {
      const request = route.request();
      for (const line of (request.postData() || '').split('\n')) {
        const params = new URLSearchParams(new URL(request.url()).search);
        for (const [key, value] of new URLSearchParams(line)) params.set(key, value);
        const selected = Object.fromEntries([...params].filter(([key]) => /^(en|cs|cm|cn|dl|dr|dt|gcs|cid|sid|ep\.|epn\.)/.test(key)));
        requests.push(selected);
      }
      await route.fulfill({ status: 204, body: '' });
    });
    await context.route(/\/api\//, route => route.fulfill({ status: 503, body: '{}' }));
    await context.addInitScript(consent => localStorage.setItem('calendra-google-analytics-consent', consent), consent);
    const page = await context.newPage();
    await page.goto(`${origin}/?${entry.query}&email=private@example.invalid`, {referer:entry.referrer});
    await page.waitForTimeout(1800);
    await page.getByRole('link', { name: 'Cenik', exact: true }).first().click();
    await page.waitForTimeout(1800);
    // Consent updates must not replay page views or conversions.
    const before = requests.filter(r => r.en === 'page_view').length;
    await page.evaluate(consent => window.gtag?.('consent', 'update', { analytics_storage: consent }), consent);
    await page.waitForTimeout(600);
    const pageviews = requests.filter(r => r.en === 'page_view');
    results.push({ entry:entry.name, consent, requests, pageviewsBeforeConsentUpdate: before });
    assert.equal(pageviews.length, entry.excludedEntry ? 1 : 2, 'one view per allowed navigation; search-bearing entry excluded');
    assert.equal(before, pageviews.length, 'consent update does not replay a page view');
    assert.equal(new URL(pageviews.at(-1).dl).pathname, '/cenik');
    assert.ok(!JSON.stringify(requests).includes('private@example.invalid'), 'private URL fields must be stripped');
    assert.ok(!JSON.stringify(requests).includes('private-search'), 'search text must not reach GA');
    assert.ok(!JSON.stringify(requests).includes('private-conversation'), 'referrer paths must be stripped');
    assert.ok(!requests.some(r => r.cs === 'pricing_page'), 'internal placement never becomes source');
    if (consent === 'granted' && !entry.excludedEntry) {
      assert.equal(pageviews[0].cid,pageviews[1].cid,'client identity stays stable across pricing navigation');
      assert.equal(pageviews[0].sid,pageviews[1].sid,'session stays stable across pricing navigation');
    }
    await context.close();
  }
} finally {
  await mkdir('output/visibility-audit', { recursive: true });
  await writeFile('output/visibility-audit/analytics-browser.json', JSON.stringify(results, null, 2));
  await browser.close();
}
console.log('Analytics browser checks passed; no collection request reached Google.');
