import lighthouse from 'lighthouse';
import {launch} from 'chrome-launcher';
import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import assert from 'node:assert/strict';
const origins=(process.env.AUDIT_ORIGINS||'http://127.0.0.1:4173,https://calendra.si').split(',');
const paths=(process.env.AUDIT_PATHS||'/,/cenik,/blog/kako-zmanjsati-pozabljene-termine').split(',');
const directory='output/visibility-audit/performance';
await mkdir(directory,{recursive:true});
const results=[];
for(const origin of origins)for(const formFactor of (process.env.AUDIT_DEVICES||'desktop,mobile').split(','))for(const path of paths){
  const chrome=await launch({chromePath:chromium.executablePath(),chromeFlags:['--headless','--no-first-run','--disable-dev-shm-usage']});
  try{
    const {lhr}=await lighthouse(origin+path,{
      port:chrome.port,output:'json',logLevel:'error',
      onlyCategories:['performance','accessibility','best-practices','seo'],
      blockedUrlPatterns:['*googletagmanager.com/*','*google-analytics.com/*','*analytics.google.com/*','*/stats/*'],
      skipAudits:origin.includes('127.0.0.1')?['canonical','is-crawlable','uses-http2','redirects-http']:[],
    },formFactor==='desktop'?desktopConfig:undefined);
    assert.equal(lhr.configSettings.formFactor,formFactor,'report label must match actual emulation');
    const row={origin,path,formFactor,scores:Object.fromEntries(Object.entries(lhr.categories).map(([key,value])=>[key,value.score])),
      lcp:lhr.audits['largest-contentful-paint'].numericValue,cls:lhr.audits['cumulative-layout-shift'].numericValue,tbt:lhr.audits['total-blocking-time'].numericValue,
      failedAudits:Object.entries(lhr.audits).filter(([,v])=>v.score!==null&&v.score<1&&['binary','numeric'].includes(v.scoreDisplayMode)).map(([key,v])=>({id:key,title:v.title,score:v.score,display:v.displayValue}))};
    results.push(row);
    const name=`${origin.includes('127.0.0.1')?'candidate':'live'}-${formFactor}-${path.replaceAll('/','_')||'home'}`;
    await writeFile(`${directory}/${name}.json`,JSON.stringify(lhr));
    console.log(JSON.stringify(row));
  }finally{await chrome.kill();}
}
await writeFile(`${directory}/summary.json`,JSON.stringify({observed:new Date().toISOString(),runsPerPage:1,collectionBlocked:true,results},null,2));
