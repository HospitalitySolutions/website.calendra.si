// A local, dependency-free report. Input is a reviewed aggregate snapshot; never
// pass customer records, raw URLs with tokens, or unredacted exports to this file.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
const input=process.argv[2]||'docs/visibility-baseline-2026-10-10.json';
const output=process.argv[3]||'output/visibility-audit/report.html';
const snapshot=JSON.parse(await readFile(input,'utf8'));
if(snapshot.schemaVersion!==1||!Array.isArray(snapshot.metrics))throw Error('Expected visibility snapshot v1');
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=value=>value===null?'Not available':typeof value==='number'&&Number.isFinite(value)?new Intl.NumberFormat('en-IE').format(value):escape(value);
const rows=snapshot.metrics.map(metric=>`<tr><th scope="row">${escape(metric.label)}</th><td>${number(metric.current)}</td><td>${number(metric.previous)}</td><td>${escape(metric.source)}</td></tr>`).join('');
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Calendra visibility review</title><style>
*{box-sizing:border-box}body{margin:0;background:#f5f8fc;color:#172438;font:16px/1.6 system-ui,sans-serif}main{max-width:1180px;margin:auto;padding:56px 24px}h1{font-size:clamp(30px,5vw,48px);line-height:1.15;letter-spacing:-.04em;margin:12px 0 20px}h2{font-size:24px;margin:0 0 16px}.eyebrow{color:#1262df;font-weight:700}p{max-width:850px;color:#526177}.card{background:white;border:1px solid #dce5f0;border-radius:20px;padding:28px;margin:28px 0}.table{overflow:auto}table{border-collapse:collapse;min-width:720px;width:100%}th,td{text-align:left;padding:14px;border-bottom:1px solid #e4eaf3;vertical-align:top}thead th{background:#eaf2ff}tbody th{font-weight:600;width:32%}td:last-child{font-size:14px;color:#586579;width:40%}li{margin:10px 0}button{border:0;background:#1262df;color:white;border-radius:10px;padding:12px 18px;font:inherit;cursor:pointer}@media print{body{background:white}main{padding:0}button{display:none}.card{break-inside:avoid;border:0;padding:0}.table{overflow:visible}table{min-width:0;font-size:12px}}</style>
<main><div class="eyebrow">CALENDRA · VISIBILITY REVIEW · ${escape(snapshot.observed)}</div><h1>Traffic, search and real business outcomes</h1><p>${escape(snapshot.scope)}</p><p>GA4 current: ${escape(snapshot.ga4Period.current)}<br>Comparison: ${escape(snapshot.ga4Period.previous)}<br>GSC: ${escape(snapshot.gscPeriod)}<br>Release: ${escape(snapshot.releaseDate||'Not deployed')}</p><button onclick="print()">Print / save PDF</button><section class="card table"><h2>Measurement baseline</h2><table><thead><tr><th>Metric</th><th>Current</th><th>Previous</th><th>Evidence and limits</th></tr></thead><tbody>${rows}</tbody></table></section><section class="card"><h2>Interpretation</h2><ul>${snapshot.limitations.map(note=>`<li>${escape(note)}</li>`).join('')}</ul></section></main></html>`;
await mkdir(dirname(output),{recursive:true});await writeFile(output,html);
console.log(`Wrote ${output} from ${input}`);
