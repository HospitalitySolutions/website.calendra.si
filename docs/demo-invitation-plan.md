# Codex Implementation Plan — 10-Second Demo Invitation

## Objective

Implement a timed invitation on the Calendra marketing website encouraging visitors to book a free 15-minute product demonstration.

Primary repository: `HospitalitySolutions/website.calendra.si`

Related repository (demo configuration and registration): `HospitalitySolutions/calendra.si`

**Do not implement a scroll trigger.** Show the invitation after 10 seconds.

Reuse the existing booking flow and analytics infrastructure. Do not introduce a third-party popup service, new form, database, or separate booking engine.

## Phase 1 — Demo booking configuration

The existing website currently advertises 30-minute demonstrations.

The backend's `DemoBookingProfile` defaults to 30 minutes, but the Platform Admin interface already allows configuring the duration down to 15 minutes.

Implementation:

1. Verify the active demo profile and its actual duration via the public profile API.
2. Make the public demo offer consistently 15 minutes. The preferred approach is updating the existing profile through Platform Admin, rather than adding another backend booking system.
3. Update hardcoded Slovenian and English 30-minute text in `src/pages/DemoBookingPage.tsx`. Prefer displaying the actual duration from the API rather than hardcoding it again.
4. Verify availability, calendar invitations, meeting times and confirmation details reflect 15 minutes.
5. Keep existing availability constraints, host-calendar conflicts and buffers working correctly.
6. If existing 30-minute demonstrations must remain a separate offering, report that requirement before changing the global profile.

Do not deploy the popup advertising 15 minutes until the destination actually accepts 15-minute bookings.

## Phase 2 — Popup and mobile banner

Create a reusable component:

`src/components/marketing/DemoInvitation.tsx`

Mount it at the application level in `src/App.tsx`, within the existing router and language provider.

### Desktop

- Show after 10 seconds.
- Centered modal, maximum width approximately 440px.
- Use existing Calendra branding, typography, colors and UI components.
- Light background, subtle overlay and rounded corners.
- Clear close button in the upper-right corner.
- Smooth entrance animation, respecting reduced-motion preferences.
- Close via the X button or Escape.
- Proper dialog accessibility, keyboard focus handling and focus restoration.

Slovenian:

**Title:** Spoznajte Calendro v 15 minutah

**Description:** Odkrijte, kako vam Calendra poenostavi naročanje strank, upravljanje terminov in poslovanje.

**CTA:** Rezervirajte brezplačno predstavitev

**Supporting text:** Brez obveznosti • 15 minut • Prek spleta

English:

**Title:** Discover Calendra in 15 minutes

**Description:** See how Calendra simplifies appointment booking, scheduling and business management.

**CTA:** Book a free 15-minute demo

**Supporting text:** No obligation • 15 minutes • Online

### Mobile

- Use a compact bottom banner rather than a modal.
- Appear after the same 10-second delay.
- Include a shortened headline, CTA and close button.
- Respect mobile safe-area insets.
- Avoid covering the main website navigation or primary CTAs.
- Ensure the banner never overlaps the existing `StickySalesCtaBar` or cookie-consent interface.

### Navigation

Use existing localized routes:

- Slovenian: `/predstavitev`
- English: `/en/demo`

Do not build a separate booking form inside the popup.

## Phase 3 — Triggering and frequency

Settings:

| Property | Value |
|---|---|
| Delay | 10 seconds |
| Scroll trigger | None |
| Desktop presentation | Modal |
| Mobile presentation | Bottom banner |
| Dismissal suppression | 7 days |
| CTA-click suppression | 7 days |
| Repeated display | At most once per browser session |
| Default visibility | Enabled through feature flag |

Use a versioned, timestamp-based localStorage entry for seven-day suppression, plus session-level state to prevent the invitation from reappearing repeatedly during one visit.

Handle blocked storage gracefully.

The 10-second timer should be mounted only once and should not restart when the visitor navigates between eligible website routes.

Do not display the invitation while another modal or cookie-consent banner is open. Defer presentation until the blocking interface closes.

Do not show the invitation on an inactive browser tab.

### Page eligibility

Include:

- Homepage `/` and `/en`
- Pricing `/cenik` and `/en/pricing`
- Existing feature-detail pages in both languages

Exclude:

- Demo booking and booking-management pages
- Login and registration flows
- Customer/provider portals
- Contact forms being actively completed
- Legal and privacy pages
- Blog pages and unsupported routes

Use `getRouteKeyFromPathname()` and explicit permitted route keys rather than broad URL substring matching.

Keep existing sticky CTA functionality, but prevent competing banners from displaying at the same time.

## Phase 4 — Analytics improvements

Reuse:

- `src/lib/analytics.ts`
- `src/lib/google-analytics.ts`
- `src/lib/analytics-policy.ts`
- `src/lib/marketing-events.ts`

Do not install another analytics SDK or initialize Google Analytics a second time.

### Events

| Event | Trigger | Parameters |
|---|---|---|
| `demo_prompt_impression` | Invitation becomes visible | placement, language |
| `demo_booking_cta_clicked` | CTA clicked | placement, language |
| `demo_prompt_dismissed` | Visitor closes invitation | placement, language |
| `demo_booking_confirmed` | Existing successful booking confirmation | Existing parameters; optional safe entry point |

Use `demo_popup_desktop` and `demo_banner_mobile` as explicit placement values.

Reuse `demo_booking_cta_clicked` instead of inventing another event for the same action.

Update `sanitizeAnalyticsEvent()` to allow the new event names and safe placement values. Its current strict allowlist would otherwise discard them.

Also fix existing CTA placement inconsistencies, including the dynamic sticky CTA placement values. Normalize those to stable, allowlisted categories.

Add missing `trial_cta_click` tracking to important untracked trial buttons, such as the homepage final CTA and feature-page primary buttons.

### Conversion attribution

Where practical, carry a safe, non-identifying source value from popup click to confirmed demo booking, such as `popup_desktop` or `banner_mobile`.

Use an explicit allowlisted value, not arbitrary query strings, email addresses, names, booking tokens or personal data.

Honor existing analytics consent rules:

- GA4 custom events are sent only with granted analytics consent.
- Preserve the existing cookieless Umami integration where configured.
- Never replay old conversion events after consent changes.
- Do not duplicate successful conversion events.

### GA4 key events

Confirm that these are configured as key events in the GA4 property:

- `demo_booking_confirmed`
- `generate_lead`

Do not mark popup impressions, CTA clicks or dismissals as key events.

Check completed trial-registration measurement separately. The website currently measures trial CTA clicks, but completed registration occurs in the main application. Never treat a trial click as a successful registration.

If `sign_up` is not measured after successful application registration, document that as a separate change in `HospitalitySolutions/calendra.si`. Preserve consent and cross-domain attribution rules.

## Phase 5 — Testing

Extend the existing Vitest and Playwright tests.

Required cases:

1. Invitation is absent before 10 seconds.
2. Invitation appears after 10 seconds on eligible pages.
3. Scrolling never triggers it early.
4. Dismissing hides the invitation for seven days.
5. Clicking its CTA also suppresses repeated prompts.
6. Navigation between eligible routes does not restart the timer or create duplicate prompts.
7. No invitation appears on excluded routes.
8. Desktop displays the modal and mobile displays the bottom banner.
9. The cookie-consent banner and mobile sticky CTA never overlap the invitation.
10. Both languages lead to the correct demo booking route.
11. Analytics events fire once per genuine interaction.
12. Consent-denied behavior remains correct.
13. No personal data, tokens or booking details leak into analytics.
14. Successful demo bookings remain the only trigger for `demo_booking_confirmed`.
15. Failed and duplicate booking submissions are not counted as successful conversions.
16. Keyboard, screen-reader and reduced-motion accessibility work correctly.

Run:

- `npm run lint`
- `npx tsc --noEmit`
- `npm test`
- `npm run build`
- `node scripts/check-bundle-budget.mjs`

Also extend and run the existing analytics and demo-booking Playwright audit scripts.

Maintain the website's existing SEO/prerender setup, Core Web Vitals and mobile performance.

## Phase 6 — Release and measurement

Add a simple build-time feature flag, such as `VITE_DEMO_PROMPT_ENABLED`, allowing the popup to be disabled without reverting code.

After deployment:

1. Validate the actual demo booking duration.
2. Verify real events in GA4 Realtime/DebugView with analytics consent granted.
3. Verify the optional Umami event path.
4. Confirm GA4 key-event configuration manually.
5. Monitor invitation impressions, clicks, dismissals and confirmed demo bookings.
6. Review results after sufficient traffic has accumulated, rather than assuming early results are statistically conclusive.

Do not silently alter unrelated registration, billing, CRM or customer booking functionality.

## Acceptance criteria

The implementation is complete when:

- A visitor on an eligible marketing page receives the invitation after 10 seconds.
- Desktop and mobile render the correct respective experiences.
- No scroll trigger exists.
- Seven-day suppression works.
- The invitation never interferes with cookie consent, login, registration or demo booking.
- Its CTA opens the existing localized demo booking page.
- The advertised 15-minute duration matches the actual available booking duration.
- Analytics events are recorded correctly when permitted.
- Existing GA4 and Umami behavior remains intact.
- All required automated tests and production build checks pass.

**Deliverable:** Implement the website changes, provide a summary of modified files, test results, the analytics events added, and any manual Platform Admin or GA4 configuration required. Do not deploy directly to production without verification.