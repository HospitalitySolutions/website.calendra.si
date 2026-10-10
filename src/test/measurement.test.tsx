import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sanitizeAcquisition, safeReferrer } from "@/lib/acquisition";
import { isMarketingPath, sanitizeAnalyticsEvent } from "@/lib/analytics-policy";
import { sendInquiry } from "@/lib/inquiry";

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("acquisition and customer privacy", () => {
  it.each([
    ["?utm_source=google&utm_medium=cpc", "utm_source=google&utm_medium=cpc"],
    ["?utm_source=chatgpt.com&utm_medium=ai-assistant", "utm_source=chatgpt.com&utm_medium=ai-assistant"],
    ["?utm_source=ig&utm_medium=social", "utm_source=ig&utm_medium=social"],
    ["?utm_source=pricing_page&utm_medium=referral", ""],
    ["?utm_source=google&utm_medium=(not+set)", ""],
    ["?utm_source=someone%40example.com&utm_medium=email", ""],
    ["?utm_source=google", ""],
    ["", ""],
  ])("only retains recognized complete external campaign pairs: %s", (search, expected) => {
    expect(sanitizeAcquisition(search).toString()).toBe(expected);
  });
  it("drops arbitrary campaign labels, search terms, private IDs and referrer paths", () => {
    expect(sanitizeAcquisition("?utm_source=google&utm_medium=cpc&utm_campaign=Jane-Doe&utm_term=therapy&email=jane@example.com&gclid=private").toString())
      .toBe("utm_source=google&utm_medium=cpc");
    expect(safeReferrer("https://chatgpt.com/c/private-conversation?q=private")).toBe("https://chatgpt.com/");
    expect(safeReferrer("javascript:alert(1)")).toBe("");
  });
  it.each(["/racun/profil", "/narocanje/3DAV", "/za-stranke/institut-avisensa", "/en/for-customers/beauty-lounge", "/predstavitev/upravljanje/private-token", "/unknown-private-id"])("excludes customer/unknown routes: %s", path => {
    expect(isMarketingPath(path)).toBe(false);
  });
  it("drops private event fields and reserved attribution fields", () => {
    expect(sanitizeAnalyticsEvent("demo_booking_confirmed", {
      language: "sl", meeting_provider: "ZOOM", booking_id: 123, email: "a@example.com", source: "pricing_page",
      page_location: "https://calendra.si/?token=secret", start_at: "2026-10-10T12:00:00Z",
    })).toEqual({ event: "demo_booking_confirmed", data: { language: "sl", meeting_provider: "ZOOM" } });
    expect(sanitizeAnalyticsEvent("public_booking_started", { tenant_code: "private" })).toBeNull();
    expect(sanitizeAnalyticsEvent("generate_lead", { lead_type: "a@example.com" })?.data).toEqual({});
  });
});

describe("confirmed inquiries", () => {
  const inquiry = { name: "Test", email: "test@example.invalid", message: "Testing", locale: "sl" as const };
  const response = (body: unknown, ok = true) => ({ ok, json: async () => body });
  it("uses CSRF protection and accepts only a positive server confirmation", async () => {
    const fetch = vi.fn().mockResolvedValueOnce(response({ token: "csrf-test" })).mockResolvedValueOnce(response({ sent: true }));
    vi.stubGlobal("fetch", fetch);
    await expect(sendInquiry(inquiry)).resolves.toBeUndefined();
    expect(fetch.mock.calls[1][1]).toMatchObject({ method: "POST", credentials: "include", headers: { "X-XSRF-TOKEN": "csrf-test" } });
  });
  it.each([response({ sent: false }), response({}), response({ sent: true }, false)])("does not accept failed or ambiguous responses", async result => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(response({ token: "csrf-test" })).mockResolvedValueOnce(result));
    await expect(sendInquiry(inquiry)).rejects.toThrow();
  });
  it("does not count double submission or retries after success as additional leads", async () => {
    window.history.replaceState({}, "", "/kontakt");
    localStorage.setItem("calendra-google-analytics-consent", "granted");
    window.gtag = vi.fn();
    const fetch = vi.fn().mockResolvedValueOnce(response({ token: "csrf-test" })).mockResolvedValueOnce(response({ sent: true }));
    vi.stubGlobal("fetch", fetch);
    const { useInquiry } = await import("@/lib/use-inquiry");
    const { result } = renderHook(() => useInquiry("sl"));
    await act(async () => { await Promise.all([result.current.submit(inquiry, "calendra"), result.current.submit(inquiry, "calendra")]); });
    await act(async () => { await result.current.submit(inquiry, "calendra"); });
    expect(fetch).toHaveBeenCalledTimes(2); // CSRF + one POST.
    const events = vi.mocked(window.gtag).mock.calls.filter(call => call[0] === "event");
    expect(events).toHaveLength(1);
    expect(events[0][1]).toBe("generate_lead");
    expect(JSON.stringify(events)).not.toContain(inquiry.email);
    expect(result.current.status).toBe("sent");
  });
  it("emits no lead on failure and permits a deliberate retry", async () => {
    window.history.replaceState({}, "", "/kontakt");
    localStorage.setItem("calendra-google-analytics-consent", "granted");
    window.gtag = vi.fn();
    const fetch = vi.fn()
      .mockResolvedValueOnce(response({ token: "csrf-test" }))
      .mockResolvedValueOnce(response({ sent: false }, false))
      .mockResolvedValueOnce(response({ token: "csrf-test" }))
      .mockResolvedValueOnce(response({ sent: true }));
    vi.stubGlobal("fetch", fetch);
    const { useInquiry } = await import("@/lib/use-inquiry");
    const { result } = renderHook(() => useInquiry("sl"));
    await act(async () => { await result.current.submit(inquiry, "calendra"); });
    expect(result.current.status).toBe("error");
    expect(vi.mocked(window.gtag).mock.calls.filter(call => call[0] === "event")).toHaveLength(0);
    await act(async () => { await result.current.submit(inquiry, "calendra"); });
    expect(result.current.status).toBe("sent");
    expect(vi.mocked(window.gtag).mock.calls.filter(call => call[0] === "event")).toHaveLength(1);
  });
  it("keeps a delivered inquiry locked when the optional analytics library throws", async () => {
    window.history.replaceState({}, "", "/kontakt");
    localStorage.setItem("calendra-google-analytics-consent", "granted");
    window.gtag = vi.fn(() => { throw new Error("tracker unavailable"); });
    const fetch = vi.fn().mockResolvedValueOnce(response({token:"csrf-test"})).mockResolvedValueOnce(response({sent:true}));
    vi.stubGlobal("fetch",fetch);
    const { useInquiry } = await import("@/lib/use-inquiry");
    const { result } = renderHook(() => useInquiry("sl"));
    await act(async () => { await result.current.submit(inquiry,"calendra"); });
    await act(async () => { await result.current.submit(inquiry,"calendra"); });
    expect(result.current.status).toBe("sent");
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});

describe("optional tracker failures", () => {
  it("does not throw from a confirmed demo when Google tracking fails", async () => {
    vi.resetModules();
    window.history.replaceState({}, "", "/predstavitev");
    localStorage.setItem("calendra-google-analytics-consent", "granted");
    window.gtag = vi.fn(() => { throw new Error("tracker unavailable"); });
    const { trackMarketingEvent } = await import("@/lib/marketing-events");
    expect(() => trackMarketingEvent("demo_booking_confirmed", { language: "sl", meeting_provider: "ZOOM" })).not.toThrow();
    expect(window.gtag).toHaveBeenCalled();
  });
});

describe("consent and tag initialization", () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    window.history.replaceState({}, "", "/cenik?email=private@example.com&utm_source=pricing_page");
    window.gtag = vi.fn();
    document.querySelectorAll("script[data-calendra-google-analytics]").forEach(script => script.remove());
  });
  it("loads Advanced Consent Mode with denied default, one config and clean page fields", async () => {
    const ga = await import("@/lib/google-analytics");
    ga.initializeGoogleAnalytics();
    ga.initializeGoogleAnalytics();
    ga.trackGoogleAnalyticsEvent("trial_cta_click");
    const calls = vi.mocked(window.gtag!).mock.calls;
    expect(calls.filter(call => call[0] === "config")).toHaveLength(1);
    expect(calls.filter(call => call[0] === "event")).toHaveLength(0);
    expect(calls.find(call => call[0] === "consent")).toEqual(["consent", "default", expect.objectContaining({ analytics_storage: "denied", ad_storage: "denied" })]);
    expect(JSON.stringify(calls)).not.toContain("private@example.com");
    expect(JSON.stringify(calls)).not.toContain("pricing_page");
  });
  it("never loads a tag on guest/private routes, even with stored consent", async () => {
    window.history.replaceState({}, "", "/narocanje/3DAV?locationId=3");
    localStorage.setItem("calendra-google-analytics-consent", "granted");
    const ga = await import("@/lib/google-analytics");
    ga.initializeGoogleAnalytics();
    ga.trackGoogleAnalyticsEvent("trial_cta_click");
    expect(window.gtag).not.toHaveBeenCalled();
    expect(document.querySelector("script[data-calendra-google-analytics]")).toBeNull();
  });
  it("does not load a cached search collector on a URL containing free text", async () => {
    window.history.replaceState({}, "", "/blog?q=private-search");
    const ga = await import("@/lib/google-analytics");
    ga.initializeGoogleAnalytics();
    ga.setGoogleAnalyticsConsent("granted");
    ga.trackGoogleAnalyticsEvent("trial_cta_click");
    expect(document.querySelector("script[data-calendra-google-analytics]")).toBeNull();
    expect(vi.mocked(window.gtag!).mock.calls.filter(call => call[0] === "event")).toHaveLength(0);
    expect(isMarketingPath("/narocanje")).toBe(true);
  });
  it("consent updates never configure the tag twice or replay a conversion", async () => {
    const ga = await import("@/lib/google-analytics");
    ga.initializeGoogleAnalytics();
    ga.setGoogleAnalyticsConsent("granted");
    ga.setGoogleAnalyticsConsent("denied");
    ga.trackGoogleAnalyticsEvent("generate_lead", { lead_type: "calendra" });
    const calls = vi.mocked(window.gtag!).mock.calls;
    expect(calls.filter(call => call[0] === "config")).toHaveLength(1);
    expect(calls.filter(call => call[0] === "event")).toHaveLength(0);
  });
});

describe("optional first-party analytics", () => {
  it("sends sanitized explicit payloads, deduplicates hydration and excludes private routes", async () => {
    vi.resetModules();
    vi.stubEnv("VITE_UMAMI_WEBSITE_ID", "test-website");
    window.umami = { track: vi.fn() };
    window.history.replaceState({}, "", "/cenik?email=private@example.invalid");
    const analytics = await import("@/lib/analytics");
    analytics.trackUmamiPageView();
    analytics.trackUmamiPageView();
    analytics.trackAnalyticsEvent("trial_cta_click", { placement: "pricing_page", email: "private@example.invalid" });
    expect(window.umami.track).toHaveBeenCalledTimes(2);
    const payloads = vi.mocked(window.umami.track).mock.calls;
    expect(payloads[0][0]).toMatchObject({ website: "test-website", url: "/cenik", title: "Calendra /cenik" });
    expect(JSON.stringify(payloads)).not.toContain("private@example.invalid");
    window.history.replaceState({}, "", "/narocanje/private-tenant");
    analytics.trackUmamiPageView();
    analytics.trackAnalyticsEvent("trial_cta_click");
    expect(window.umami.track).toHaveBeenCalledTimes(2);
    delete window.umami;
  });
});
