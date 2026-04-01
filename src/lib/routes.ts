/**
 * Central route & URL configuration for CTA buttons.
 *
 * LOGIN_ROUTE — points to your Calendra app login page.
 *   If your app is on the same domain, use a relative path like "/login".
 *   If it's on a different domain, use the full URL.
 *
 * Update these constants to match your deployment.
 */

// ── App routes (change these to match your deployment) ──────────────
export const APP_BASE_URL = "https://staging.calendra.si";
export const LOGIN_ROUTE = `${APP_BASE_URL}/login`;
export const REGISTER_ROUTE = `${APP_BASE_URL}/signup`;

// ── Landing page anchor sections ────────────────────────────────────
export const FEATURES_SECTION = "#funkcionalnosti";
export const PRICING_SECTION = "#cenik";
