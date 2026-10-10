import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:4173';
const label = origin.includes('127.0.0.1') ? 'candidate' : 'live';
const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).pathname);
const directory = `output/visibility-audit/${label}`;
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const [device, viewport] of [['desktop', {width:1440,height:1000}], ['mobile', {width:390,height:844}]]) {
    const queue = [...paths];
    await Promise.all(Array.from({length:3}, async () => {
      const context = await browser.newContext({viewport});
      await context.addInitScript(() => localStorage.setItem('calendra-google-analytics-consent','denied'));
      await context.route(/(googletagmanager\.com|google-analytics\.com|analytics\.google\.com)/, route => route.fulfill({status:200,body:''}));
      const page = await context.newPage();
      while (queue.length) {
        const path = queue.shift();
        const errors = [];
        const onError = error => errors.push(error.message);
        page.on('pageerror', onError);
        try {
          const response = await page.goto(`${origin}${path}`, {waitUntil:'load',timeout:30000});
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(150);
          const state = await page.evaluate(() => ({
            title: document.title,
            canonical: document.querySelector('link[rel="canonical"]')?.href,
            description: document.querySelector('meta[name="description"]')?.content,
            robots: document.querySelector('meta[name="robots"]')?.content,
            h1: [...document.querySelectorAll('h1')].map(n=>n.textContent.trim()),
            language: document.documentElement.lang,
            overflow: document.documentElement.scrollWidth>innerWidth+2,
            brokenImages: [...document.images].filter(i=>i.getBoundingClientRect().top<innerHeight && i.complete && !i.naturalWidth).map(i=>new URL(i.src).pathname),
            alternates: [...document.querySelectorAll('link[hreflang]')].map(n=>({language:n.hreflang,url:n.href})),
            schemaValid: [...document.querySelectorAll('script[type="application/ld+json"]')].every(n=>{try{JSON.parse(n.textContent);return true}catch{return false}}),
          }));
          const result={path,device,status:response.status(),...state,errors};
          results.push(result);
          if (['/','/cenik','/kontakt','/za-jogo-in-pilates','/za-psihologijo-in-svetovanje','/integracije'].includes(path) || state.overflow || errors.length) {
            await page.screenshot({path:`${directory}/${device}-${path.replaceAll('/','_')||'home'}.png`,fullPage:true});
          }
        } catch(error) {results.push({path,device,error:error.message});}
        page.off('pageerror',onError);
      }
      await context.close();
    }));
    console.log(`${label}: rendered ${paths.length} ${device} pages`);
  }
} finally {await browser.close();}
await writeFile(`${directory}/rendered.json`,JSON.stringify(results,null,2));
const failures=results.filter(r=>r.error || r.status!==200 || r.overflow || r.h1?.length!==1 || !r.canonical || !r.description || !r.schemaValid || r.errors?.length || r.brokenImages?.length);
console.log(JSON.stringify({origin,routes:paths.length,renders:results.length,failures},null,2));
if(failures.length) process.exitCode=1;
