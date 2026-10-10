# Website visibility and measurement review — 10 October 2026

This is a review candidate, not a deployed release. It extends existing draft PR #1. The owner confirmed that Hospit, David Mirc s.p. is **not VAT registered**, and chose to **queue signup/payment conversion work after the calendar migration**.

## Repository and release baseline

- Website main: `1fee4bc3d594bb8c715a7f9133d4e719d169ca49`; reused draft [PR #1](https://github.com/HospitalitySolutions/website.calendra.si/pull/1), original head `e326f35486c92af83ecf917df1eef3ffb14aba1e`.
- App main inspected: `3ed2220709d522a5c96438705dd5788b275804e9`, repository `HospitalitySolutions/calendra.si`. Work is in an isolated checkout. The owner's staged app changes, including calendar V71, were not changed or published.
- Production SHA is **not established**. Live copy and redirect differences demonstrate unreleased fixes, not a specific production commit. No merge or deployment was performed.
- The candidate retains the earlier homepage/pricing design and single-row industry carousel, route registry, prerendering, real testimonials and customer-booking behavior.

## Findings and changes

| Priority | Confirmed evidence | Candidate action / remaining limit |
| --- | --- | --- |
| P0 | `ContactPage.tsx` and `Pricing.tsx` previously counted opening a mailto draft as an inquiry | Use the existing rate-limited, CSRF-protected app endpoint. Emit one `generate_lead` only on `{sent:true}`. Failed or ambiguous responses produce no success event; synchronous locking prevents double submission. Delivery to a mail server does not prove the recipient read the message. |
| P0 | App contact service treated a failed courtesy reply as failure even after the admin inquiry was delivered | Return success for the delivered inquiry; log acknowledgement failure separately. Two backend tests cover admin failure and acknowledgement failure. |
| P0 | Demo confirmation analytics contained a private booking ID and precise appointment timestamp | Keep only allowed language/provider values; require a confirmed API result and guard double submits. Token-based management pages have no marketing tracking. |
| P0 | Actual Google tag emitted `view_search_results` with free text from `q`, independently of sanitized page_location | Disabled **Site search** in GA4 enhanced measurement, saved and reopened to verify off on 10 October. A code guard also excludes search-bearing URLs while cached tag settings propagate. Other enhanced measurements remain unchanged. Local test collection was intercepted. |
| P0 | Pricing custom event used `source: pricing_page` | Rename to `placement`; whitelist event names/values and accepted external source/medium pairs; remove arbitrary campaign labels, emails, click IDs, search text and referrer paths from custom payloads/page fields. Only explicitly configured public campaign names survive. |
| P0 | App onboarding reset SMS selection and could downgrade a preselected Professional/Premium plan | Preserve plan, billing interval, users, SMS and add-ons across company → features → account → signup request. The backend still provisions the existing Basic trial. Website copy now distinguishes requested paid selection from trial entitlements. |
| P1 | 16 table-bearing articles overflowed on mobile; demo API-error screen had two H1s | Constrain the article grid, keep table scrolling inside the content column, and give each demo state one meaningful heading. All 130 candidate routes now pass desktop/mobile rendering checks. |
| P1 | GSC's four duplicate-without-canonical examples are tenant booking URLs with indexable HTTP responses | Add edge `X-Robots-Tag: noindex` for transactional booking routes and frontend noindex for registration. Public `/narocanje` remains available/indexable. Real Caddy rules tested with local stub upstreams. |
| P1 | Homepage advertised PayPal, but released app source filters it out of guest payment options | Replace that claim with Google Meet, whose integration exists in inspected main; add connection/permission/package conditions. Deployment configuration still needs operational verification. |
| P1 | Tax-registration status was previously inferred from a tax-number prefix/catalog flag | Use the owner's explicit non-VAT status in pricing wording and organization/offer schema. Keep domestic tax identification; omit VAT ID and VAT-included assertions. |
| P1 | Web-vitals collection had no once-per-initialization/metric guard | Emit each metric-name/id pair at most once per document, tied to the initial marketing path. No raw metric ID is sent. Five metric types can legitimately exceed page views; historical counts alone do not establish duplicates. |
| P1 | Optional Umami automatically used the raw URL on every SPA fallback | Load it only on known marketing routes; disable its automatic collection and send sanitized explicit page/event payloads. Existing cookieless behavior is retained. |

## GA4: verified versus unresolved

Signed-in Admin was inspected through Codex's in-app browser. Account `397286432`, property `540841362`, web stream `15415747049`, measurement ID `G-DVDT4W7BYS`. This is the only active web stream; the three mobile guest streams had no activity in 48 hours. Website source uses direct gtag, not a discovered GTM container. No app marketing GA emitter was found or added in the independent app changes.

Before the change, all seven enhanced measurements were on, including browser-history page views. There were no event-modification rules, no custom generated events and zero connected site tags. Email redaction was on; URL-query-key redaction was off. The Google tag identified one destination and an urgent quality issue; its embedded settings controls could not be opened through the browser tools, so the specific warning and linker settings remain unverified. No linker was added speculatively.

Key-event Admin showed seven configured events: app_store_subscription_convert, app_store_subscription_renew, close_convert_lead, first_open, in_app_purchase, purchase, qualify_lead. Each showed no recent stream data. The 16 recent web events included the old unstarred `calendra_inquiry_submitted`, clicks and demo starts, but no confirmed demo, sign_up or purchase. Internal Traffic is Exclude / **Testing**, not an active exclusion. These settings were left unchanged. Site search is the sole Admin change in this review.

The `pricing_page / (not set)` **root cause is still unproven**. Source/history checks found no internal UTM campaign overrides. A real-tag probe serialized the old parameter as `ep.source=pricing_page`, not `cs`; that does not establish how historical GA processing classified it. The absence of current modification rules does not reconstruct past configuration. No historical data repair is claimed.

The real-tag browser test covers Google-tagged, Google-referral, ChatGPT-referral, ChatGPT-tagged, social, direct, malformed internal-source and sensitive-search entries under both consent choices. All Google collection endpoints are intercepted locally. Allowed entries produce one initial view and one actual pricing navigation, with stable client/session identifiers when consented; consent updates do not add views. Search-bearing entries are deliberately not measured until safe navigation. No synthetic visits from these tests reach GA4. Wire correctness is not proof of processed server-side acquisition reports.

The existing denied-default Advanced Consent Mode remains: limited cookieless pings may occur with denied analytics storage. Custom events require granted consent. Revocation clears host/parent-domain GA cookies. This technical preservation is not a legal opinion on GDPR/ePrivacy. Origin-to-origin consent/session correlation and server conversions are **queued**, not enabled.

## Search Console and exact URL disposition

Signed-in coverage report updated **4 October**: 126 indexed, 81 excluded. Exact examples are saved in `gsc-url-baseline-2026-10-10.json`; every example was requested over HTTP, including redirect chains. The 404 validation started 11 August and failed 15 August (13 failed, two pending legacy English booking URLs).

Sitemaps on **10 October** show Success, last read 10 October, **130 discovered URLs**. This reconciles the older screenshot's 128 with the current 130-route registry; no artificial sitemap edits are needed. GSC Core Web Vitals shows **No data** on desktop and mobile, so lab measurements are not presented as field CWV.

- **27 noindex**: intended account/login/registration/deletion pages and unpublished provider profiles. Preserve exclusions; do not request indexing.
- **22 alternate canonical**: mostly filtered blog/contact URLs and booking aliases. Keep query-free editorial canonicals and the existing genuine booking redirects.
- **7 redirects**: expected HTTP/www normalization plus some still-missing live legacy legal/directory aliases already handled in the website candidate. Verify actual edge responses after deployment.
- **4 duplicates**: transactional tenant booking URLs. Exclude via app edge headers, not a homepage canonical.
- **3 discovered, not indexed**: valid self-canonical commercial pages; improve useful copy/internal links and allow recrawl rather than create duplicates.
- **3 crawled, not indexed**: English homepage, English no-shows article and favicon. The favicon is not a missing commercial page; no indexing guarantee is possible for the editorial pages.
- **15 not found**: disposition table below. Do not redirect unrelated or unavailable business profiles to the homepage.

## Product truth and useful content

Source verification uses the app main SHA above, not the unpublished calendar work. This is implementation evidence; production provider credentials and deployment flags are separate release checks.

- `auth/SignupService.java` explicitly provisions self-serve trials as Basic/monthly without paid add-ons. Pricing now says so, while preserving the paid selection in registration.
- `google/calendar/GoogleCalendarConfig.java`, sync-direction/services, Zoom and Google Meet services exist; public copy now states connection, permissions and enabled-feature prerequisites. No new calendar behavior is promised from V71.
- `guest/common/GuestSettingsService.java` filters PAYPAL out. The homepage no longer advertises it as available checkout.
- `ReservationRulesSettingsSection.tsx` and `guest/catalog/GuestCatalogService.java` implement Maximum days in advance independently of entitlement validity. Yoga/Pilates and group-booking copy now explains capacity, passes, validity, advance limits, waiting-list conditions and conditional cross-service rescheduling.
- `account/ClientImportController.java` and `ClientImportService.java` implement contact CSV preview, validation, duplicates and confirmation. New copy limits scope to supported contacts; it does not promise automatic appointment/invoice/pass/clinical-record migration.
- Psychology/counselling copy explicitly offers internal staff scheduling or optional public self-booking, permissions, video prerequisites and a separate clinical-documentation system. Approved Avisensa testimony remains intact. Depilacije UG's WordPress embed is a separate deployment and was not changed or claimed fixed.
- Earlier PR pricing corrections (€17.90 / €28.90 / €47.90), grammar/security revisions, authentic evidence and IT-service segmentation remain. No new compliance audit, restore-drill claim, fabricated testimonial or paid AI placement was added.

## Local verification

- Website TypeScript: pass; **133 tests / 20 files** pass; lint has zero errors and four existing Fast Refresh warnings.
- Production build/prerender: 130 indexable routes. Sitemap/internal-link check: 130 routes and 132 targets return 200; unknown route returns 404. Redirect-rule and bundle-budget checks pass.
- Live and candidate rendered crawls: 130 × two viewports each. Live had 16 mobile article overflows; the final candidate has no overflow, broken above-fold image, missing canonical/description, invalid JSON-LD, duplicate/missing H1 or uncaught page error in this check.
- Inquiry/demo contract browser tests: desktop/mobile × granted/denied; failed sends generate no success, retry produces one success, simultaneous submits produce one POST, private fields/tokens are excluded. All API writes are mocked; production mail delivery, provider confirmation and database creation are not claimed tested.
- App: TypeScript and focused lint pass; five selection unit tests pass; six backend tests pass (three signup billing-isolation, two inquiry delivery, one real PostgreSQL/Flyway V1–V70 baseline). Six browser flows cover three packages × two widths through the intercepted signup request. No real tenant is created.
- App Caddy: production ALB, HA, staging and frontend configurations are adapted and run locally with stub upstreams. Fifteen private route cases return noindex, and the public booking overview remains unexcluded.
- Desktop/mobile performance reports are saved locally; see the final performance table below. Scores are a single lab run per route/device, not a field assessment or proof of ranking improvement. Corrected test emulation and compressed preview are recorded in the script.

## Release gates and work deliberately queued

1. Review website PR #1 and the independent app PR. The attached implementation plan explicitly requires approval before merging/deploying. No approval is assumed from earlier design pushes.
2. Deploy inquiry delivery/indexing fixes and website through the standard pipelines when approved. Verify the real public catalog, CORS/CSRF path, genuine booking redirects and transactional noindex headers on production. Confirm deployed SHAs and ALB/HA upstream consistency.
3. In an authorized staging environment, perform one real inquiry, confirmed demo, tenant signup and first paid test subscription; reconcile database/email/payment records with event counts and failure/refresh behavior. Do not send paid test transactions or create live customer records merely to populate reports.
4. After the success triggers have been verified, GA4 Admin → Data display → Events: mark **generate_lead**, **demo_booking_confirmed**, and later **sign_up** as key events. Purchase is already configured. Do not star the old mailto event, CTA clicks or form starts. Record counting method, take a screenshot and verify Realtime/DebugView plus next-day acquisition. This has not yet been done.
5. **Conversions follow calendar V71**, per the owner. The V72 prototype and dependent app/website changes are preserved in a local queue, outside both review commits. It is not production-ready: rebase after V71, confirm the next unused version, review consent revocation/dispatch races, stable eligibility windows, at-most-once dispatch/lost-response recovery, retention and first-paid versus renewal semantics. Run changed-behavior PostgreSQL tests, a populated upgrade and mandatory migration safety checks before publishing. No Measurement Protocol secret was created and no server event was sent.
6. Inspect the remaining Google tag quality/linker settings, production demo provider/logs, real cross-origin consent/session continuity, WAF/infrastructure logs and genuine OAI-SearchBot IP access. A robots allowance or forged user-agent response does not prove genuine crawler access. GPTBot training permission is separate.
7. Reporting is reproducible via `node scripts/report-visibility.mjs`; baseline and interpretation rules are committed. The objective 20-prompt Slovenian sample and monthly three-repeat protocol are documented, but a 60-run AI baseline is not fabricated or claimed executed. No recurring automation was scheduled.

Raw exports, full network traces, browser screenshots and Lighthouse JSON stay in ignored `output/visibility-audit/`. The full implementation plan remains partially gated on calendar work, staging evidence, deployment approval and production verification.

## Exact 404-group dispositions

| GSC URL | Live status chain | Disposition |
| --- | --- | --- |
| https://calendra.si/en/businesses/institut-avisensa | 404 | Candidate alias to the confirmed Avisensa booking route; keep destination noindex |
| https://calendra.si/ponudniki | 404 | Existing candidate directory alias to the public booking overview; /za-stranke stays unpublished while marketplace is off |
| https://calendra.si/za-stranke | 404 | Existing candidate directory alias to the public booking overview; /za-stranke stays unpublished while marketplace is off |
| https://calendra.si/en/businesses/beauty-lounge | 404 | Keep missing/unpublished profile excluded; do not invent an equivalent homepage destination |
| https://calendra.si/en/providers | 404 | Existing candidate directory alias to the public booking overview; /za-stranke stays unpublished while marketplace is off |
| https://calendra.si/podjetja/beauty-lounge | 404 | Keep missing/unpublished profile excluded; do not invent an equivalent homepage destination |
| https://calendra.si/podjetja/institut-avisensa | 404 | Candidate alias to the confirmed Avisensa booking route; keep destination noindex |
| https://calendra.si/podjetja | 404 | Existing candidate directory alias to the public booking overview; /za-stranke stays unpublished while marketplace is off |
| https://calendra.si/ponudniki/institut-avisensa | 308 → 200 | Candidate alias to the confirmed Avisensa booking route; keep destination noindex |
| https://www.calendra.si/stranke | 301 → 404 | Existing candidate directory alias to the public booking overview; /za-stranke stays unpublished while marketplace is off |
| https://calendra.si/stranke | 404 | Existing candidate directory alias to the public booking overview; /za-stranke stays unpublished while marketplace is off |
| https://calendra.si/en/businesses | 404 | Existing candidate directory alias to the public booking overview; /za-stranke stays unpublished while marketplace is off |
| https://calendra.si/en/providers/institut-avisensa | 404 | Candidate alias to the confirmed Avisensa booking route; keep destination noindex |
| https://calendra.si/en/booking/institut-avisensa | 404 | Candidate 308 to equivalent /narocanje/{tenant}; verify edge after release |
| https://calendra.si/en/booking/beauty-lounge | 404 | Candidate 308 to equivalent /narocanje/{tenant}; verify edge after release |

## Performance evidence

| Build | Device | Route | Performance | Accessibility | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| Candidate | desktop | / | 98 | 100 | 1.03 s | 0.000 |
| Candidate | desktop | /blog/kako-zmanjsati-pozabljene-termine | 99 | 100 | 0.91 s | 0.000 |
| Candidate | desktop | /cenik | 99 | 100 | 0.96 s | 0.000 |
| Candidate | mobile | / | 80 | 100 | 4.61 s | 0.000 |
| Candidate | mobile | /blog/kako-zmanjsati-pozabljene-termine | 82 | 100 | 4.23 s | 0.000 |
| Candidate | mobile | /cenik | 81 | 100 | 4.23 s | 0.000 |
| Live | desktop | / | 100 | 96 | 0.77 s | 0.000 |
| Live | desktop | /blog/kako-zmanjsati-pozabljene-termine | 100 | 100 | 0.77 s | 0.000 |
| Live | desktop | /cenik | 77 | 100 | 0.85 s | 0.605 |
| Live | mobile | / | 88 | 96 | 3.67 s | 0.000 |
| Live | mobile | /blog/kako-zmanjsati-pozabljene-termine | 87 | 100 | 3.77 s | 0.000 |
| Live | mobile | /cenik | 69 | 100 | 3.63 s | 0.400 |

Candidate uses a compressed local HTTP preview; live uses its production network/CDN. These are lab diagnostics, not controlled causal comparisons. The candidate eliminates the measured pricing layout shift and the sampled accessibility failures. Mobile LCP still needs work (approximately 4.2–4.6 s in this local profile); the target is not claimed achieved. Prioritizing CSS ahead of preloads did not measurably improve it and was not retained. Confirm mobile performance on the approved staging/production infrastructure; no field CWV is available in GSC. Local catalog requests can log CORS errors because the preview origin is not a production-allowed origin.
