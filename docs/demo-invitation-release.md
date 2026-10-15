# Demo invitation and analytics release — 2026-10-15

The original [implementation plan](demo-invitation-plan.md) is included alongside the code. This release implements the approved colorful pop-up, its compact mobile banner, and the website analytics changes together. The existing Calendra logo is unchanged. The desktop card is 580px wide to accommodate the approved calendar illustration; mobile has no illustration or modal backdrop.

## Website behavior

- `src/components/marketing/DemoInvitation.tsx`, its scoped CSS and `src/lib/demo-invitation.ts` provide the invitation. `App.tsx` mounts it once inside the router. The illustration is native SVG, with no additional bitmap or external service.
- The timer starts on the first eligible route and preserves its original deadline through SPA navigation and reloads in the same session. It never appears before ten seconds. Scrolling only rechecks whether a primary CTA would be covered after that deadline.
- Explicit eligibility: home, pricing and the eight existing feature-detail routes, in Slovenian and English. Booking/manage, portals, contact, legal, blog and unknown routes are excluded.
- Cookie consent, another dialog, an open navigation/account menu, an inactive tab and an active/edited form defer the prompt. A mobile CTA collision or a very short viewport also defers it. A new competing interaction ends an already displayed invitation for that session.
- Closing or following the CTA records seven-day suppression. Display alone prevents repetition for the browser session. Versioned storage keys contain timestamps/flags only; in-memory behavior remains available when storage is blocked. Cross-reload persistence cannot be guaranteed when a browser disallows storage.
- Desktop uses a native modal dialog plus explicit Tab containment, Escape dismissal, scroll locking and focus restoration. Mobile is a nonmodal labeled region, with safe-area padding and a 44px close target. Both respect reduced motion.
- Existing sales/pricing sticky bars are hidden while the invitation or cookie UI is visible and return afterwards.
- The CTA opens the existing localized `/predstavitev` or `/en/demo` flow. No new booking form, database or third-party pop-up service was introduced.

## Duration verification

On 2026-10-15 the production public profile returned `enabled: true`, `durationMinutes: 15`, `Europe/Ljubljana`, `GOOGLE_MEET`. A read-only availability query for 2026-10-15 through 2026-11-14 returned 651 available slots, all 15 minutes long. No Platform Admin change was necessary.

The invitation checks the public profile before display and fails closed on an unavailable, disabled or non-15-minute offer. The existing booking page displays API-provided duration, including the duration on existing managed bookings. Static SEO, answer-summary and pricing copy no longer advertises an obsolete 30-minute duration.

Local contract tests validate the 15-minute confirmation and downloaded ICS start/end times. Production email delivery, video meeting creation and host-calendar conflict handling were not exercised by creating a live booking; the existing backend booking engine and buffers are unchanged.

## Measurement

| Event | Meaning | Allowed additional values |
| --- | --- | --- |
| `demo_prompt_impression` | Invitation becomes visible | `placement`: `demo_popup_desktop` / `demo_banner_mobile`; `language`: `sl` / `en` |
| `demo_prompt_dismissed` | Close button or Escape | Same placements and languages |
| `demo_booking_cta_clicked` | Invitation CTA followed | Same placements and languages; existing event reused |
| `demo_booking_confirmed` | Existing API confirmation returns confirmed status and an ID | Optional `entry_point`: `popup_desktop` / `banner_mobile`; existing provider/language fields |
| `trial_cta_click` | Existing trial CTA clicked | Added `homepage_final` and feature-page buttons; sticky values normalized to `feature_page_sticky` / `industry_page_sticky` |

The source travels in router history state, not an internal UTM or arbitrary query string. Only the two explicit entry values survive sanitization. It persists on ordinary reload/back within the same history entry; a copied link or a new-tab navigation may have no source. No name, email, booking ID, token or appointment time is sent in these events.

Existing GA4 and Umami initialization is reused. GA4 custom events require granted consent; old events are never replayed on consent changes. Cookieless Umami remains conditional on its existing build configuration. Failed/retried submissions and duplicate clicks do not create extra successful conversion events.

## GA4 configuration completed

On 2026-10-15, the Calendra GA4 property (540841362) was inspected through its signed-in Admin UI. Both `demo_booking_confirmed` and `generate_lead` were missing from key events and were added using **Create with code**, with **Once per event** counting and **no default monetary value**. Both now appear starred in the key-events table. No page-view-derived conversion rule was created, and no synthetic conversion was sent to the property. Prompt events, CTA clicks and the old mailto event were not marked as key events. Existing unrelated key events were preserved.

Local evidence: `output/visibility-audit/ga4-key-events-2026-10-15.png` (ignored, not uploaded to GitHub).

Completed tenant registration remains a separate application change: `sign_up` is absent from the inspected application source and from GA4's recent events. Do not equate a website trial click with a completed signup. The previously queued server conversion work remains separate; see [the visibility audit's dependency and migration notes](visibility-audit-2026-10-10.md#release-gates-and-work-deliberately-queued). This website release does not publish that prototype or introduce an application migration.

## Validation

- `npm run lint`: zero errors; five pre-existing Fast Refresh warnings.
- `npx tsc --noEmit`: pass.
- `npm test`: 223 tests / 24 files pass, including route eligibility, suppression, blocked storage, disabled feature flag and consent-denied Umami behavior.
- `npm run build`: production client, SSR and 130 prerendered indexable URLs pass.
- `node scripts/check-bundle-budget.mjs`: pass; initial JS approximately 202.3KB gzip and CSS 18.7KB gzip, within existing limits.
- `node scripts/test-sitemap-routes.mjs`: 130 sitemap URLs and 132 internal targets return 200; unknown route returns 404.
- `node scripts/test-caddy-seo.mjs`: 100 HTTP cases pass with both marketplace settings, including redirects, private routes and security/cache headers.
- `node scripts/test-demo-invitation-browser.mjs`: 19 browser scenarios pass, including both languages at 1280/390/320px, timing, SPA navigation, storage, focus, reduced motion, consent/sticky interference, inactive tabs, forms and CTA collisions. Screenshots are under ignored `output/visibility-audit/demo-invitation/`.
- `node scripts/test-inquiry-demo-browser.mjs`: desktop/mobile × granted/denied consent pass. Covers the invitation-to-confirmation source, failed POST/retry/double-submit behavior, one success event, private-route exclusion, PII filtering and the 15-minute calendar export. All API writes are intercepted.
- `node scripts/audit-google-tag.mjs`: real Google tag serialization accepts the safe placement and entry-point fields; collection requests are intercepted, with no synthetic event sent to production.
- The invitation and booking browser scripts are also included in GitHub CI, after the production build.
- Lighthouse: all existing assertions pass for six routes × three desktop runs (18 runs). Performance 98–100, accessibility/SEO 100, best practices 96–100; maximum LCP 1.04s and CLS 0 in these lab runs. The normal Windows CLI hit a Chrome temporary-profile cleanup `EPERM`; the same routes/configuration were collected through the Lighthouse API using the bundled Chromium and an explicitly owned audit profile, then checked by `lhci assert` (six URLs, 18 reports). Analytics collection was blocked and no report was publicly uploaded. These are lab results, not field Core Web Vitals.

## Release and follow-up

The website flag `VITE_DEMO_PROMPT_ENABLED` defaults to `true` in Vite and Docker. To disable the invitation, set it to `false` in the deployment `.env` and rebuild the website. The Dockerfile, compose arguments and `.env.example` all expose the flag. Disabling it stops invitation timers and profile requests; the existing demo page remains available.

This change is for the website repository. Production deployment is a separate operation: pull the published main commit in the website checkout, then rebuild/recreate the website service through the existing deployment process. No production container or application database was changed during this implementation.

After deployment, verify genuine, consented activity in GA4 Realtime/DebugView and the configured Umami instance; confirm the deployed SHA and the public profile again. Check email/video delivery in an authorized staging booking or the next genuine booking. The key-event table currently reports no stream data for these success events; that is not proof of a broken trigger or a completed production conversion. Assess results only after enough real traffic accumulates. No recurring monitoring job was created.
