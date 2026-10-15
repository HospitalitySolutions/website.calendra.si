import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { createDemoInvitationSession, DEMO_PROMPT_DELAY, DEMO_PROMPT_KEYS, DEMO_PROMPT_SUPPRESSION, isDemoInvitationPath, safeDemoEntry } from "@/lib/demo-invitation";
import { canonicalRoutes } from "@/lib/localized-routes";
import { sanitizeAnalyticsEvent } from "@/lib/analytics-policy";

beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });
afterEach(() => vi.restoreAllMocks());

describe("demo invitation frequency", () => {
  it("retains the original ten-second deadline across navigation and reloads", () => {
    const first = createDemoInvitationSession();
    expect(first.deadline(100_000)).toBe(100_000 + DEMO_PROMPT_DELAY);
    expect(first.deadline(104_000)).toBe(110_000);
    expect(createDemoInvitationSession().deadline(107_000)).toBe(110_000);
  });
  it("does not repeat in a session, even without a dismissal", () => {
    const session = createDemoInvitationSession();
    session.markSeen();
    expect(session.allowed()).toBe(false);
    expect(createDemoInvitationSession().allowed()).toBe(false);
    sessionStorage.clear();
    expect(createDemoInvitationSession().allowed()).toBe(true);
  });
  it("suppresses close and CTA actions for exactly seven days, including a fresh visit", () => {
    createDemoInvitationSession().suppress(100_000);
    sessionStorage.clear();
    const next = createDemoInvitationSession();
    expect(next.allowed(100_000 + DEMO_PROMPT_SUPPRESSION - 1)).toBe(false);
    expect(next.allowed(100_000 + DEMO_PROMPT_SUPPRESSION)).toBe(true);
  });
  it("still works when all browser storage access throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    const session = createDemoInvitationSession();
    expect(session.deadline(100_000)).toBe(110_000);
    expect(session.deadline(105_000)).toBe(110_000);
    expect(session.allowed()).toBe(true);
    session.suppress();
    expect(session.allowed()).toBe(false);
  });
  it("recovers from invalid or future start timestamps", () => {
    sessionStorage.setItem(DEMO_PROMPT_KEYS.started, "Infinity");
    localStorage.setItem(DEMO_PROMPT_KEYS.suppressed, "broken");
    expect(createDemoInvitationSession().deadline(100_000)).toBe(110_000);
    expect(createDemoInvitationSession().allowed(100_000)).toBe(true);
  });
});

describe("explicit invitation routes", () => {
  const eligible = ["home", "pricing", "calendar", "invoicing", "clientManagement", "reminders", "integrations", "materialManagement", "fiscalCashRegister", "groupBookings"];
  for (const [key, paths] of Object.entries(canonicalRoutes)) {
    it(`${eligible.includes(key) ? "includes" : "excludes"} both ${key} locales`, () => {
      for (const path of Object.values(paths)) expect(isDemoInvitationPath(path)).toBe(eligible.includes(key));
    });
  }
  it.each(["/predstavitev/upravljanje/private", "/en/demo/manage/private", "/prijava", "/register", "/narocanje/tenant", "/blog/private", "/unknown"])("excludes %s", path => {
    expect(isDemoInvitationPath(path)).toBe(false);
  });
});

describe("bounded prompt analytics", () => {
  it.each(["demo_prompt_impression", "demo_prompt_dismissed", "demo_booking_cta_clicked"])("keeps only approved fields for %s", name => {
    expect(sanitizeAnalyticsEvent(name, { placement: "demo_popup_desktop", language: "sl", email: "private@example.invalid", token: "secret" }))
      .toEqual({ event: name, data: { placement: "demo_popup_desktop", language: "sl" } });
  });
  it("preserves safe attribution and stable CTA placements", () => {
    expect(sanitizeAnalyticsEvent("demo_booking_confirmed", { entry_point: "banner_mobile" })?.data).toEqual({ entry_point: "banner_mobile" });
    for (const placement of ["feature_page_sticky", "industry_page_sticky", "homepage_final", "feature_page"]) {
      expect(sanitizeAnalyticsEvent("trial_cta_click", { placement })?.data).toEqual({ placement });
    }
    expect(safeDemoEntry("popup_desktop")).toBe("popup_desktop");
    expect(safeDemoEntry("banner_mobile")).toBe("banner_mobile");
    for (const privateValue of ["private@example.invalid", "?token=secret", {}, null]) expect(safeDemoEntry(privateValue)).toBeUndefined();
    expect(sanitizeAnalyticsEvent("demo_booking_confirmed", { entry_point: "private@example.invalid" })?.data).toEqual({});
  });
});
