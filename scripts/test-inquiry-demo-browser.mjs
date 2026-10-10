// Local contract tests. API writes and analytics are intercepted: no email,
// booking or Google event is created in production.
import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const origin=process.env.AUDIT_ORIGIN||'http://127.0.0.1:4173';
const browser=await chromium.launch();
const results=[];
const events=page=>page.evaluate(()=>Array.from(window.dataLayer||[],args=>Array.from(args)).filter(args=>args[0]==='event'));
const count=async(page,name)=>(await events(page)).filter(args=>args[1]===name).length;
try {
  for (const width of [1440,390]) for (const consent of ['granted','denied']) {
    const context=await browser.newContext({viewport:{width,height:900},timezoneId:'Europe/Ljubljana'});
    await context.addInitScript(consent=>localStorage.setItem('calendra-google-analytics-consent',consent),consent);
    await context.route(/googletagmanager\.com|google-analytics\.com|analytics\.google\.com/,route=>route.fulfill({status:200,body:''}));
    let inquiries=0,confirmations=0;
    const date=new Date(Date.now()+2*86400000).toISOString().slice(0,10);
    const slot={startAt:`${date}T12:00:00Z`,endAt:`${date}T12:30:00Z`};
    const booking={...slot,id:123,status:'CONFIRMED',title:'Demo',durationMinutes:30,timeZone:'Europe/Ljubljana',guestTimeZone:'Europe/Ljubljana',guestName:'Test person',guestEmail:'private@example.invalid',companyName:'Test company',meetingProvider:'ZOOM',manageToken:'private-test-token',canModify:true};
    await context.route(/\/api\//,async route=>{
      const pathname=new URL(route.request().url()).pathname;
      let body={},status=200;
      if(pathname==='/api/auth/csrf')body={token:'test-csrf'};
      else if(pathname==='/api/register/contact') {inquiries++;status=inquiries===1?503:200;body={sent:inquiries>1};}
      else if(pathname.endsWith('/demo-bookings/profile'))body={enabled:true,durationMinutes:30,timeZone:'Europe/Ljubljana',meetingProvider:'ZOOM',bookingHorizonDays:30};
      else if(pathname.endsWith('/demo-bookings/availability'))body={timeZone:'Europe/Ljubljana',days:[{date,slots:[slot]}]};
      else if(pathname.endsWith('/demo-bookings/holds'))body={...slot,holdToken:'private-hold',expiresAt:new Date(Date.now()+600000).toISOString()};
      else if(pathname.endsWith('/demo-bookings/confirm')) {confirmations++;status=confirmations===1?503:200;body=confirmations===1?{message:'Test failure'}:booking;}
      else if(pathname.includes('/demo-bookings/manage/'))body=booking;
      else status=503;
      await route.fulfill({status,contentType:'application/json',body:JSON.stringify(body)});
    });
    const page=await context.newPage();
    await page.goto(`${origin}/kontakt?type=calendra`);
    await page.locator('#contact-name').fill('Test person');
    await page.locator('#contact-email').fill('private@example.invalid');
    await page.locator('#contact-message').fill('A test inquiry that is never sent.');
    await page.locator('form button[type="submit"]').click();
    await expect(page.getByText(/Pošiljanje ni bilo potrjeno/)).toBeVisible();
    assert.equal(await count(page,'generate_lead'),0);
    await page.locator('form').evaluate(form=>{form.requestSubmit();form.requestSubmit();});
    await expect(page.getByText('Hvala. Vaše sporočilo smo prejeli.',{exact:true})).toBeVisible();
    assert.equal(inquiries,2,'one failure and one successful POST, no double submit');
    assert.equal(await count(page,'generate_lead'),consent==='granted'?1:0);
    await page.goto(`${origin}/predstavitev`);
    const time=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Ljubljana',hour:'2-digit',minute:'2-digit'}).format(new Date(slot.startAt));
    await page.getByRole('button',{name:time,exact:true}).click();
    await page.getByRole('button',{name:'Nadaljuj s podatki',exact:true}).click();
    await page.locator('#demo-name').fill('Test person');
    await page.locator('#demo-email').fill('private@example.invalid');
    await page.locator('#demo-company').fill('Test company');
    await page.locator('form button[type="submit"]').click();
    await expect(page.getByRole('alert')).toBeVisible();
    assert.equal(await count(page,'demo_booking_confirmed'),0);
    await page.locator('form').evaluate(form=>{form.requestSubmit();form.requestSubmit();});
    await expect(page.locator('form')).toHaveCount(0);
    assert.equal(confirmations,2);
    assert.equal(await count(page,'demo_booking_confirmed'),consent==='granted'?1:0);
    const wire=JSON.stringify(await events(page));
    for(const privateValue of ['private@example.invalid','private-test-token','private-hold','Test person',slot.startAt])assert.ok(!wire.includes(privateValue));
    await expect(page.locator('h1')).toHaveCount(1);
    const privatePage=await context.newPage();
    await privatePage.goto(`${origin}/predstavitev/upravljanje/private-test-token`);
    assert.equal(await privatePage.locator('script[data-calendra-google-analytics]').count(),0);
    results.push({width,consent,inquiryPosts:inquiries,demoPosts:confirmations,successEvents:consent==='granted'?2:0});
    await context.close();
  }
} finally {await browser.close();}
await mkdir('output/visibility-audit',{recursive:true});
await writeFile('output/visibility-audit/inquiry-demo-browser.json',JSON.stringify(results,null,2));
console.log('Inquiry/demo desktop + mobile, granted + denied: passed. All API writes intercepted.');
