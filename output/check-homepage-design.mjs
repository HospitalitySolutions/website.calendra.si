import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "@playwright/test";

const base = process.env.HOMEPAGE_URL || "http://127.0.0.1:5174";
const output = "output/homepage-implementation";
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
const errors = [];
page.on("pageerror", error => errors.push(error.message));

try {
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.locator(".home-feature-grid").waitFor();
    const necessaryCookies = page.getByRole('button', { name: 'Samo nujni', exact: true });
    if (await necessaryCookies.isVisible()) await necessaryCookies.click();
    await page.evaluate(() => document.fonts.ready);
    for (const section of await page.locator(".homepage > section").all()) await section.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll('.home-feature-screen img')].every(img => img.complete && img.naturalWidth > 0));
    const layout = await page.evaluate(() => {
      const slides = [...document.querySelectorAll('#za-koga .audience-carousel-card')].map(el => el.getBoundingClientRect());
      return {
        viewport: innerWidth,
        bodyWidth: document.documentElement.scrollWidth,
        slideCount: slides.length,
        slideRows: [...new Set(slides.map(rect => Math.round(rect.top)))],
        bands: [...document.querySelectorAll('.editorial-pricing-band, .connect-promo-editorial, .final-cta-editorial')].map(el => ({ left: el.getBoundingClientRect().left, width: el.getBoundingClientRect().width, background: getComputedStyle(el).backgroundColor })),
        images: [...document.querySelectorAll('.home-feature-screen img')].map(img => ({ src: img.getAttribute('src'), natural: img.naturalWidth / img.naturalHeight, rendered: img.getBoundingClientRect().width / img.getBoundingClientRect().height })),
      };
    });
    assert.ok(layout.bodyWidth <= width + 1, `Horizontal page overflow at ${width}: ${layout.bodyWidth}`);
    assert.equal(layout.slideCount, 12);
    assert.equal(layout.slideRows.length, 1, `Carousel wrapped at ${width}`);
    assert.equal(layout.bands.length, 3);
    for (const band of layout.bands) {
      assert.ok(Math.abs(band.left) < 1 && Math.abs(band.width - width) < 1, `Blue band is not full width at ${width}`);
      assert.notEqual(band.background, 'rgb(255, 255, 255)');
    }
    assert.deepEqual(layout.images.map(img => img.src), ['/homepage/booking.webp', '/homepage/billing.webp', '/homepage/notifications.webp', '/homepage/calendar-mobile.webp', '/homepage/clients.webp']);
    // object-fit: contain preserves image content even when the image box is constrained.
    assert.equal(await page.locator('.home-sms-preview').count(), 1);
    assert.match(await page.locator('h1').innerText(), /Program za naročanje strank, termine in račune na enem mestu\./);
    const carousel = page.locator('#za-koga [aria-roledescription="carousel"]');
    await carousel.scrollIntoViewIfNeeded();
    const firstCard = page.locator('#za-koga .audience-carousel-card').first();
    const before = (await firstCard.boundingBox()).x;
    await page.getByRole('button', { name: 'Naslednje dejavnosti', exact: true }).click();
    await page.waitForFunction(x => Math.abs(document.querySelector('#za-koga .audience-carousel-card').getBoundingClientRect().x - x) > 30, before);
    await page.getByRole('button', { name: 'Prejšnje dejavnosti', exact: true }).click();
    if (width === 1440 || width === 390) {
      const xBeforeKeyboard = (await firstCard.boundingBox()).x;
      await page.getByRole('button', { name: 'Prejšnje dejavnosti', exact: true }).press('ArrowRight');
      await page.waitForFunction(x => Math.abs(document.querySelector('#za-koga .audience-carousel-card').getBoundingClientRect().x - x) > 30, xBeforeKeyboard);
      await page.getByRole('button', { name: 'Prejšnje dejavnosti', exact: true }).click();
    }
    const faq = page.locator('.home-faq-item').nth(1);
    await faq.locator('summary').click();
    assert.equal(await faq.getAttribute('open'), '');
    await faq.locator('summary').click();
    assert.equal(await faq.getAttribute('open'), null);
    await page.evaluate(() => scrollTo(0, 0));
    if (width === 1440 || width === 390) {
      await page.screenshot({ path: `${output}/homepage-${width}.png`, fullPage: true });
      if (width === 1440) {
        await page.locator('.home-hero').screenshot({ path: `${output}/hero-desktop.png` });
        await page.locator('#funkcionalnosti').screenshot({ path: `${output}/features-desktop.png`, style: '.site-navbar-editorial { visibility: hidden; }' });
        await page.locator('#za-koga').screenshot({ path: `${output}/carousel-desktop.png` });
        await page.locator('.connect-promo-editorial').screenshot({ path: `${output}/connect-desktop.png`, style: '.site-navbar-editorial { visibility: hidden; }' });
      } else {
        await page.locator('.home-hero').screenshot({ path: `${output}/hero-mobile.png`, style: '.site-navbar-editorial { visibility: hidden; }' });
        await page.locator('.connect-promo-editorial').screenshot({ path: `${output}/connect-mobile.png`, style: '.site-navbar-editorial { visibility: hidden; }' });
        await page.locator('.site-footer-editorial').screenshot({ path: `${output}/footer-mobile.png`, style: '.site-navbar-editorial { visibility: hidden; }' });
      }
    }
    console.log(JSON.stringify({ width, carouselRows: layout.slideRows.length, slides: layout.slideCount, bands: layout.bands.length, horizontalOverflow: layout.bodyWidth - width, browserErrors: errors.length }));
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/en`, { waitUntil: 'networkidle' });
  assert.match(await page.locator('h1').innerText(), /Appointment booking/);
  assert.equal(await page.getByRole('button', { name: 'Next industries', exact: true }).count(), 1);
  assert.match(await page.locator('.home-sms-preview').innerText(), /Your appointment is confirmed/);
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.locator('#za-koga').scrollIntoViewIfNeeded();
  const dragTarget = page.locator('#za-koga .audience-service-scene').first();
  const dragBounds = await dragTarget.boundingBox();
  const dragStart = (await page.locator('#za-koga .audience-carousel-card').first().boundingBox()).x;
  await page.mouse.move(dragBounds.x + dragBounds.width * 0.8, dragBounds.y + dragBounds.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(dragBounds.x + 15, dragBounds.y + dragBounds.height * 0.5, { steps: 16 });
  await page.mouse.up();
  await page.waitForFunction(x => Math.abs(document.querySelector('#za-koga .audience-carousel-card').getBoundingClientRect().x - x) > 30, dragStart);
  assert.equal(page.url(), `${base}/`, 'Dragging a service card must not open its link');
  assert.equal(errors.length, 0, errors.join('\n'));
  console.log('PASS: responsive layout, single-row carousel arrows, keyboard and dragging, all five image mappings, full-width bands, FAQ interaction, English route, no browser errors.');
} finally {
  await browser.close();
}
