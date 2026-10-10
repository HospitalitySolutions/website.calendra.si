# Repeatable visibility reporting

Generate the local baseline with `node scripts/report-visibility.mjs`. Pass another reviewed snapshot and output path as the first and second arguments for a later report. The JSON schema is illustrated by `visibility-baseline-2026-10-10.json`; preserve `null` for unavailable measurements. Raw exports stay outside Git.

## Monthly and release comparisons

1. Record the actual website/app release dates separately. Export GA4 **Traffic acquisition** (session source/medium), **Landing page** (sessions) and **Events / Key events** for the same 28 complete days and preceding 28 days. Preserve property, stream, timezone, filter, export time and report-total metadata. Include the full source/medium breakdown in a private export; the committed baseline lists selected diagnostic rows only.
2. Export the signup funnel and reconcile completed trials and first paid subscriptions with authorized aggregate backend results. A form start, email draft, checkout visit or unpaid invoice is never a success. Qualified inquiries require a real qualification step; `generate_lead` alone is a received inquiry. Do not sum lead, signup and purchase events into a count of unique customers. Report each stage's rate only with its verified, matching population/denominator.
3. Export GSC queries and pages with the same date bounds and Web search. Keep non-brand filtering explicit (`calendra` and agreed spelling variants), calculate CTR from clicks/impressions in that filtered scope, and disclose anonymized query omissions. Preserve all commercially legitimate IT-service pages; segment booking-software and IT results in reporting.
4. Keep AI referrals (ChatGPT, Perplexity and other observed sources) separate from Google organic, Search Console Generative AI reports when available, and the answer sample below. Two versus one referral visits does not demonstrate growth caused by this release.
5. Export indexing classifications and sitemap status. Compare against `gsc-url-baseline-2026-10-10.json`; do not count expected account noindex, redirects or canonical alternatives as broken pages. `node scripts/audit-gsc-urls.mjs` records fresh HTTP evidence locally. Revalidate only resolved failures after deployment.
6. Create a dated snapshot; regenerate the HTML report. Evaluate at 28 and 90 days after release, noting seasonality, campaigns, reporting delays and instrumentation changes. Do not claim causal SEO gains from one before/after comparison.

## Slovenian AI answer sample

These prompts are a **protocol, not fabricated results**. No 60-run baseline has been executed. Once a month, use three clean conversations for each unchanged prompt (60 observations); use the same model and search mode, no preceding brand context, no personal memory, and no leading follow-ups. Record failed/no-search runs rather than silently replacing them. Do not create a paid tool subscription to run this sample.

Record columns: `month,prompt_id,repeat,utc_time,model,search_mode,language,brand_mentioned,recommended,cited,citation_url,answer_evidence,qualified_downstream_leads,limitations`. Mention, recommendation and citation are separate booleans. A source citation is the actual linked URL, not the model's assertion that it searched. Record aggregate downstream leads only; never insert customer identities into prompts or analytics.

| ID | Prompt |
| --- | --- |
| 01 | Kateri program za naročanje strank je primeren za samostojnega podjetnika v Sloveniji? |
| 02 | Kako naj majhen frizerski salon izbere program za spletno naročanje? |
| 03 | Kateri programi povezujejo termine, stranke in račune za kozmetični salon v Sloveniji? |
| 04 | Kaj potrebujem za spletne prijave na jogo z omejenim številom mest? |
| 05 | Kako izbrati program za pilates s kartami za več obiskov? |
| 06 | Kateri program podpira skupinske vadbe, članstva in čakalno vrsto? |
| 07 | Kako urediti interne termine za psihološko svetovalnico brez javnega naročanja? |
| 08 | Na kaj moram paziti pri programu za naročanje za več svetovalcev in prostorov? |
| 09 | Kako povezati spletno naročanje, SMS opomnike in izdajo računov? |
| 10 | Koliko stane program za naročanje strank za tri zaposlene v Sloveniji? |
| 11 | Kako primerjati ceno naročnine z dodatnimi uporabniki, SMS sporočili in davčno blagajno? |
| 12 | Kateri program za termine lahko dodam na obstoječo spletno stran WordPress? |
| 13 | Kako lahko maser zmanjša število pozabljenih terminov? |
| 14 | Kaj je treba preveriti pred prenosom strank iz Excela v program za naročanje? |
| 15 | Kako pri izbiri programa preverim povezavo z Google Koledarjem in Zoomom? |
| 16 | Kateri programi za naročanje so smiselni za manjši fizioterapevtski center? |
| 17 | Kakšna je razlika med veljavnostjo karte in omejitvijo naročanja dni vnaprej? |
| 18 | Katere slovenske rešitve za termine ponujajo brezplačen preizkus in jasen cenik? |
| 19 | Kaj je Calendra in za katere dejavnosti je primerna? |
| 20 | Kakšne so cene Calendre in kaj moram preveriti pred izbiro paketa? |

Keep 01–18 non-brand discovery separate from branded prompts 19–20. Report counts with denominators and citation URLs. This is an observed sample of answers, not a universal ChatGPT ranking or guaranteed placement metric. No recurring automation has been scheduled.
