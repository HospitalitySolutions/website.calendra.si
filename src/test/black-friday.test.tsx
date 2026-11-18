import { act, cleanup, fireEvent, render, renderHook, screen, waitFor, within } from "@testing-library/react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Pricing from "@/components/landing/Pricing";
import { PricingOverview } from "@/components/landing/HomepageSections";
import { TrialSignupLink } from "@/components/TrialSignupLink";
import PromotionBanner from "@/components/marketing/PromotionBanner";
import { sanitizeAnalyticsEvent } from "@/lib/analytics-policy";
import { buildLlmsFullTxt, buildLlmsTxt } from "@/lib/llms-txt";
import { calculatePricingQuote } from "@/lib/pricing-tax";
import { PROMOTION_BANNER_DISMISS_KEY, PROMOTION_BANNER_DISMISS_MS } from "@/lib/promotion-banner";
import { formatPromotionDate } from "@/lib/promotion";
import {
  FALLBACK_PUBLIC_PRICING,
  fetchPublicPricingCatalog,
  normalizePublicPricingCatalog,
  PUBLIC_PRICING_ENDPOINT,
  setPrerenderedPricingCatalog,
  type PublicPricingCatalog,
} from "@/lib/public-pricing";
import { buildPackageSignupRoute, buildTrialSignupRoute } from "@/lib/routes";
import { SiteLanguageProvider, type SiteLanguage } from "@/lib/site-language";
import { resetPromotionConfirmation, useActivePromotion } from "@/lib/use-active-promotion";
import {
  BLACK_FRIDAY_VALID_UNTIL,
  blackFridayCatalog,
  blackFridayPromotion,
  DURING_BLACK_FRIDAY,
  novemberCatalog,
} from "@/test/fixtures/black-friday-catalog";

const text = (element: Element | null | undefined) => element?.textContent?.replace(/\s+/g, " ").trim() ?? "";
const AFTER_BLACK_FRIDAY = Date.parse(BLACK_FRIDAY_VALID_UNTIL) + 1;

const events: Array<Record<string, unknown>> = [];
const recordEvent = (event: Event) => events.push((event as CustomEvent<Record<string, unknown>>).detail);

const loadCatalog = (catalog: PublicPricingCatalog) => setPrerenderedPricingCatalog(catalog);
const atPath = (path: string) => window.history.replaceState(null, "", path);

beforeEach(() => {
  // Pin the clock inside the offer so these tests do not depend on today's date.
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(DURING_BLACK_FRIDAY);
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  loadCatalog(blackFridayCatalog);
  window.localStorage.clear();
  events.length = 0;
  window.addEventListener("calendra:marketing-event", recordEvent);
});

afterEach(() => {
  cleanup();
  window.removeEventListener("calendra:marketing-event", recordEvent);
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  resetPromotionConfirmation();
  atPath("/");
  loadCatalog(FALLBACK_PUBLIC_PRICING);
});

describe("promotion in the app pricing catalog", () => {
  it("keeps a well-formed promotion and survives re-normalization of snapshots", () => {
    expect(blackFridayCatalog.promotion).toEqual(blackFridayPromotion);
    expect(normalizePublicPricingCatalog(blackFridayCatalog)).toEqual(blackFridayCatalog);
    expect(normalizePublicPricingCatalog(JSON.parse(JSON.stringify(blackFridayCatalog)))).toEqual(blackFridayCatalog);
  });

  it("leaves a catalog without an offer in its previous shape", () => {
    expect("promotion" in novemberCatalog).toBe(false);
    expect("promotion" in normalizePublicPricingCatalog({ ...novemberCatalog, promotion: null })).toBe(false);
  });

  it("stores the code upper-case and trimmed", () => {
    const catalog = normalizePublicPricingCatalog({ ...novemberCatalog, promotion: { ...blackFridayPromotion, code: " blackFriday50 " } });
    expect(catalog.promotion?.code).toBe("BLACKFRIDAY50");
  });

  const plans = blackFridayPromotion.plans;
  it.each([
    ["not an object", "BLACKFRIDAY50"],
    ["an empty code", { ...blackFridayPromotion, code: "" }],
    ["a code with spaces", { ...blackFridayPromotion, code: "BLACK FRIDAY" }],
    ["a zero discount", { ...blackFridayPromotion, percentOff: 0 }],
    ["a discount above 100 %", { ...blackFridayPromotion, percentOff: 120 }],
    ["more than 12 discounted months", { ...blackFridayPromotion, discountedMonths: 13 }],
    ["fractional months", { ...blackFridayPromotion, discountedMonths: 6.5 }],
    ["an unreadable end", { ...blackFridayPromotion, validUntil: "31. 12. 2026" }],
    ["an end without a time", { ...blackFridayPromotion, validUntil: "2026-12-31" }],
    ["no plans", { ...blackFridayPromotion, plans: [] }],
    ["an unknown plan", { ...blackFridayPromotion, plans: [...plans, { key: "gold", monthlyPrice: 1, annualPrice: 12 }] }],
    ["a duplicated plan", { ...blackFridayPromotion, plans: [...plans, plans[0]] }],
    ["a price above the regular price", { ...blackFridayPromotion, plans: [{ ...plans[0], monthlyPrice: 99 }] }],
    ["a missing yearly price", { ...blackFridayPromotion, plans: [{ key: "business", monthlyPrice: 19.95 }] }],
  ])("drops a promotion with %s and keeps every regular price", (_, promotion) => {
    const catalog = normalizePublicPricingCatalog({ ...novemberCatalog, promotion });
    expect(catalog.promotion).toBeUndefined();
    expect(catalog).toEqual(novemberCatalog);
  });
});

describe("useActivePromotion", () => {
  const Probe = () => <span>{useActivePromotion()?.code ?? "none"}</span>;

  it("is null on the server", () => {
    expect(renderToString(<Probe />)).toBe("<span>none</span>");
  });

  it("is null on the first client render and appears after mount", () => {
    const seen: Array<string | null> = [];
    const Recorder = () => {
      seen.push(useActivePromotion()?.code ?? null);
      return null;
    };
    render(<Recorder />);
    expect(seen[0]).toBeNull();
    expect(seen.at(-1)).toBe("BLACKFRIDAY50");
  });

  it("is null once validUntil has passed", () => {
    vi.setSystemTime(AFTER_BLACK_FRIDAY);
    expect(renderHook(() => useActivePromotion()).result.current).toBeNull();
  });

  it("switches off at validUntil on an open page", () => {
    // Re-install the fake clock with timers (vitest keeps the first configuration otherwise).
    vi.useRealTimers();
    vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout"] });
    vi.setSystemTime(Date.parse(BLACK_FRIDAY_VALID_UNTIL) - 5_000);
    const { result } = renderHook(() => useActivePromotion());
    expect(result.current?.code).toBe("BLACKFRIDAY50");
    act(() => { vi.advanceTimersByTime(6_000); });
    expect(result.current).toBeNull();
  });

  it("follows the app when a refresh no longer carries the offer", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => novemberCatalog }));
    const { result } = renderHook(() => useActivePromotion());
    expect(result.current?.code).toBe("BLACKFRIDAY50");
    await act(async () => { await fetchPublicPricingCatalog(); });
    expect(result.current).toBeNull();
  });
});

describe("site-wide banner", () => {
  const renderBanner = (path = "/") => {
    atPath(path);
    const language: SiteLanguage = path.startsWith("/en") ? "en" : "sl";
    return render(
      <SiteLanguageProvider initialLanguage={language}>
        <MemoryRouter initialEntries={[path]}><PromotionBanner /></MemoryRouter>
      </SiteLanguageProvider>,
    );
  };
  const findBanner = () => screen.findByRole("region", { name: "Black Friday" });
  const settle = () => act(async () => { await Promise.resolve(); });

  it("shows the Slovenian line with a link to the price list and the code", async () => {
    renderBanner("/");
    const banner = await findBanner();
    expect(text(banner)).toBe("Black Friday: −50 % na paket prvih 6 mesecev s kodo BLACKFRIDAY50. Velja do 31. 12. 2026. Poglej cenik →");
    expect(within(banner).getByRole("link")).toHaveAttribute("href", "/cenik?code=BLACKFRIDAY50");
  });

  it("shows the English line on English pages", async () => {
    renderBanner("/en/blog");
    const banner = await findBanner();
    expect(text(banner)).toBe("Black Friday: 50% off your plan for the first 6 months with code BLACKFRIDAY50. Valid until 31 Dec 2026. See pricing →");
    expect(within(banner).getByRole("link")).toHaveAttribute("href", "/en/pricing?code=BLACKFRIDAY50");
    expect(within(banner).getByRole("button", { name: "Close notice" })).toBeInTheDocument();
  });

  it("asks the app once whether the prerendered offer still runs", async () => {
    renderBanner("/");
    await findBanner();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe(PUBLIC_PRICING_ENDPOINT);
  });

  it("renders nothing without an offer, after it ends, and sends no request", async () => {
    loadCatalog(novemberCatalog);
    const { unmount } = renderBanner("/");
    await settle();
    expect(screen.queryByRole("region", { name: "Black Friday" })).toBeNull();
    unmount();
    loadCatalog(blackFridayCatalog);
    vi.setSystemTime(AFTER_BLACK_FRIDAY);
    renderBanner("/");
    await settle();
    expect(screen.queryByRole("region", { name: "Black Friday" })).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("is not shown on customer marketplace routes", async () => {
    renderBanner("/za-stranke");
    await settle();
    expect(screen.queryByRole("region", { name: "Black Friday" })).toBeNull();
  });

  it("remembers closing for 7 days", async () => {
    const first = renderBanner("/");
    fireEvent.click(within(await findBanner()).getByRole("button", { name: "Zapri obvestilo" }));
    expect(screen.queryByRole("region", { name: "Black Friday" })).toBeNull();
    expect(Number(window.localStorage.getItem(PROMOTION_BANNER_DISMISS_KEY))).toBe(DURING_BLACK_FRIDAY.getTime() + PROMOTION_BANNER_DISMISS_MS);
    first.unmount();

    const second = renderBanner("/cenik");
    await settle();
    expect(screen.queryByRole("region", { name: "Black Friday" })).toBeNull();
    second.unmount();

    vi.setSystemTime(DURING_BLACK_FRIDAY.getTime() + PROMOTION_BANNER_DISMISS_MS + 60_000);
    renderBanner("/");
    expect(await findBanner()).toBeInTheDocument();
  });

  it("still shows and closes when browser storage throws", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new DOMException("blocked", "SecurityError"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("blocked", "SecurityError"); });
    renderBanner("/");
    fireEvent.click(within(await findBanner()).getByRole("button", { name: "Zapri obvestilo" }));
    expect(screen.queryByRole("region", { name: "Black Friday" })).toBeNull();
  });
});

describe("pricing page with the offer", () => {
  const renderPricing = (search = "", language: SiteLanguage = "sl") => {
    atPath(`${language === "sl" ? "/cenik" : "/en/pricing"}${search}`);
    return render(<MemoryRouter><SiteLanguageProvider initialLanguage={language}><Pricing standalone /></SiteLanguageProvider></MemoryRouter>);
  };
  const card = (container: HTMLElement, plan: string) => container.querySelector(`[data-plan="${plan}"]`);

  it("adds the offer block between the intro and the cards", async () => {
    const { container } = renderPricing();
    await waitFor(() => expect(container.querySelector("#black-friday")).not.toBeNull());
    const offer = container.querySelector("#black-friday")!;
    expect(offer.previousElementSibling?.matches(".pricing-intro")).toBe(true);
    expect(offer.nextElementSibling?.matches(".pricing-plan-grid")).toBe(true);
    expect(text(offer.querySelector("h2"))).toBe("Black Friday: prvih 6 mesecev za pol cene");
    expect(text(offer.querySelector(".pricing-promo-copy p"))).toBe("Ob registraciji vnesite kodo BLACKFRIDAY50 in prvih 6 mesecev plačujete 50 % cene paketa. Za nove stranke, mesečni ali letni obračun. Dodatki po rednem ceniku, po 6 mesecih redna cena. Velja do 31. 12. 2026.");
    expect(text(offer.querySelector(".pricing-promo-valid"))).toBe("Velja do 31. 12. 2026");
  });

  it("copies the code from the chip and reports it", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    try {
      renderPricing();
      const button = await screen.findByRole("button", { name: "Kopiraj kodo BLACKFRIDAY50" });
      expect(text(button)).toBe("Kopiraj");
      await act(async () => { fireEvent.click(button); });
      expect(writeText).toHaveBeenCalledWith("BLACKFRIDAY50");
      expect(text(button)).toBe("Kopirano");
      expect(events).toContainEqual({ event: "promo_code_copied", coupon: "BLACKFRIDAY50", placement: "pricing_page" });
    } finally {
      Reflect.deleteProperty(navigator, "clipboard");
    }
  });

  it("shows the monthly price with the code next to the struck regular price", async () => {
    const { container } = renderPricing();
    await waitFor(() => expect(container.querySelector(".pricing-promo-old")).not.toBeNull());
    for (const [plan, regular, promo] of [["basic", "15,90 €", "7,95 €"], ["professional", "26,90 €", "13,45 €"], ["premium", "39,90 €", "19,95 €"]]) {
      const item = card(container, plan);
      expect(text(item?.querySelector(".pricing-promo-old"))).toBe(regular);
      expect(text(item?.querySelector(".pricing-plan-price strong"))).toBe(promo);
      expect(text(item?.querySelector(".pricing-promo-then"))).toBe(`−50 % prvih 6 mesecev, nato ${regular}`);
      // The tax note above the cards covers VAT; the cards never mention it.
      expect(text(item)).not.toMatch(/DDV|VAT/);
    }
  });

  it("shows the yearly price with the code in the Letno view", async () => {
    const { container } = renderPricing();
    await waitFor(() => expect(container.querySelector(".pricing-promo-old")).not.toBeNull());
    fireEvent.click(screen.getByRole("button", { name: "Letno" }));
    const premium = card(container, "premium");
    expect(text(premium?.querySelector(".pricing-promo-old"))).toBe("33,92 €");
    expect(text(premium?.querySelector(".pricing-plan-price strong"))).toBe("29,93 €");
    expect(text(premium?.querySelector(".pricing-annual-price"))).toBe("Letno za paket: 406,98 € 359,10 €");
    expect(text(premium?.querySelector(".pricing-annual-price s"))).toBe("406,98 €");
    expect(text(premium?.querySelector(".pricing-promo-then"))).toBe("prvo leto s kodo, nato 406,98 € na leto");
    expect(premium?.querySelector(".pricing-promo-pill")).toBeNull();
    const basic = card(container, "basic");
    expect(text(basic?.querySelector(".pricing-plan-price strong"))).toBe("11,93 €");
    expect(text(basic?.querySelector(".pricing-annual-price"))).toBe("Letno za paket: 162,18 € 143,10 €");
    for (const plan of ["basic", "professional", "premium"]) expect(text(card(container, plan))).not.toMatch(/DDV|VAT/);
  });

  it("uses the English copy and price format", async () => {
    const { container } = renderPricing("", "en");
    await waitFor(() => expect(container.querySelector(".pricing-promo-old")).not.toBeNull());
    expect(text(container.querySelector("#black-friday h2"))).toBe("Black Friday: your first 6 months at half price");
    expect(text(container.querySelector("#black-friday .pricing-promo-copy p"))).toBe("Enter code BLACKFRIDAY50 when you sign up and pay 50% of the plan price for the first 6 months. For new customers, monthly or yearly billing. Add-ons at regular prices; regular price after 6 months. Valid until 31 Dec 2026.");
    expect(text(card(container, "premium")?.querySelector(".pricing-plan-price strong"))).toBe("€19.95");
    expect(text(card(container, "premium")?.querySelector(".pricing-promo-then"))).toBe("−50% first 6 months, then €39.90");
  });

  it("applies the code from ?code= to the plan only and recalculates VAT and totals", async () => {
    const { container } = renderPricing("?plan=premium&code=%20blackfriday50%20");
    await waitFor(() => expect(text(container.querySelector(".pricing-promo-code-ok"))).toBe("Koda BLACKFRIDAY50 je upoštevana: −50 % na paket prvih 6 plačanih mesecev."));
    expect(screen.getByLabelText<HTMLInputElement>("Koda za popust").value).toBe("BLACKFRIDAY50");
    fireEvent.click(screen.getByRole("button", { name: "Dodaj uporabnika" }));
    fireEvent.change(container.querySelector(".pricing-sms-input")!, { target: { value: "100" } });

    const summary = container.querySelector(".pricing-summary-card")!;
    await waitFor(() => expect(text(summary.querySelector("[data-pricing-net]"))).toBe("30,85 €"));
    const rows = Array.from(summary.querySelectorAll(".pricing-breakdown > div")).map((row) => `${text(row.querySelector("dt"))} ${text(row.querySelector("dd"))}`);
    expect(rows.slice(0, 3)).toEqual(["Paket 39,90 €", "Black Friday popust (−50 % na paket, prvih 6 mesecev) −19,95 €", "Dodatni uporabniki 5,90 €"]);
    expect(rows).toContain("SMS sporočila 5,00 €");
    expect(text(summary.querySelector("[data-pricing-vat]"))).toBe("6,79 €");
    expect(text(summary.querySelector("[data-pricing-total]"))).toBe("37,64 €");
    expect(text(summary.querySelector("[data-pricing-regular-total]"))).toBe("Prvih 6 mesecev. Nato 61,98 € na mesec z DDV.");

    const signup = new URL(summary.querySelector<HTMLAnchorElement>("[data-pricing-signup]")!.href);
    expect(signup.searchParams.get("code")).toBe("BLACKFRIDAY50");
    expect(signup.searchParams.get("package")).toBe("PREMIUM");
    expect(JSON.parse(signup.searchParams.get("summary")!)).toMatchObject({ periodNet: 30.85, periodVat: 6.79, periodTotal: 37.64 });
    expect(events.filter((event) => event.event === "coupon_applied")).toEqual([
      { event: "coupon_applied", coupon: "BLACKFRIDAY50", plan: "premium", billing: "monthly", step: "pricing_calculator" },
    ]);

    fireEvent.click(summary.querySelector("[data-pricing-signup]")!);
    expect(events).toContainEqual({ event: "trial_cta_click", placement: "pricing_page", plan: "premium", billing: "monthly", coupon: "BLACKFRIDAY50" });
  });

  it("takes the yearly price with the code off the yearly plan price", async () => {
    const { container } = renderPricing("?plan=premium&billing=annual&code=BLACKFRIDAY50");
    const summary = container.querySelector(".pricing-summary-card")!;
    await waitFor(() => expect(text(summary.querySelector("[data-pricing-discount]"))).toBe("−47,88 €"));
    expect(text(summary.querySelector("[data-pricing-net]"))).toBe("359,10 €");
    expect(text(summary.querySelector("[data-pricing-vat]"))).toBe("79,00 €");
    expect(text(summary.querySelector("[data-pricing-total]"))).toBe("438,10 €");
    expect(text(summary.querySelector("[data-pricing-regular-total]"))).toBe("Prvo leto s kodo. Nato 496,52 € na leto z DDV.");
  });

  it("turns down an unknown code, keeps regular totals and lets the visitor remove it", async () => {
    const { container } = renderPricing("?plan=premium");
    const input = await screen.findByLabelText<HTMLInputElement>("Koda za popust");
    fireEvent.change(input, { target: { value: "blackfriday" } });
    // Nothing is judged while typing.
    expect(container.querySelector(".pricing-promo-code-error")).toBeNull();
    fireEvent.blur(input);
    expect(text(container.querySelector(".pricing-promo-code-error"))).toBe("Te kode ne poznamo. Preverite zapis ali nadaljujte brez nje.");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(container.querySelector("[data-pricing-discount]")).toBeNull();
    expect(text(container.querySelector("[data-pricing-total]"))).toBe("48,68 €");
    expect(new URL(container.querySelector<HTMLAnchorElement>("[data-pricing-signup]")!.href).searchParams.has("code")).toBe(false);
    expect(events).toContainEqual({ event: "coupon_rejected", coupon: "BLACKFRIDAY", reason: "unknown_code" });

    fireEvent.click(screen.getByRole("button", { name: "Odstrani" }));
    expect(input.value).toBe("");
    expect(container.querySelector(".pricing-promo-code-error")).toBeNull();

    fireEvent.change(input, { target: { value: " BlackFriday50" } });
    expect(text(container.querySelector("[data-pricing-total]"))).toBe("24,34 €");
    expect(text(container.querySelector(".pricing-promo-code-ok"))).toContain("BLACKFRIDAY50");
  });

  it("does not pass a code to registration when none was entered", async () => {
    const { container } = renderPricing("?plan=premium");
    await screen.findByLabelText("Koda za popust");
    expect(new URL(container.querySelector<HTMLAnchorElement>("[data-pricing-signup]")!.href).searchParams.has("code")).toBe(false);
  });

  it("puts the three offer questions first, the first one open", async () => {
    const { container } = renderPricing();
    await waitFor(() => expect(container.querySelectorAll(".pricing-promo-faq")).toHaveLength(3));
    const details = Array.from(container.querySelectorAll<HTMLDetailsElement>(".pricing-faq details"));
    expect(details.slice(0, 3).map((item) => text(item.querySelector(".pricing-promo-faq-tag")))).toEqual(["Black Friday", "Black Friday", "Black Friday"]);
    expect(details.slice(0, 3).map((item) => item.querySelector("h3")?.lastChild?.textContent)).toEqual([
      "Kako uveljavim Black Friday popust?",
      "Ali popust velja tudi za letni obračun?",
      "Za kaj popust ne velja?",
    ]);
    expect(details.map((item) => item.open)).toEqual(details.map((_, index) => index === 0));
    expect(details.slice(0, 3).map((item) => text(item.querySelector("p")))).toEqual([
      "Ob registraciji ali do 31. 12. 2026 v Nastavitve → Naročnina vnesite kodo BLACKFRIDAY50. Najprej imate 14 dni brezplačnega preizkusa, popust pa velja za prvih 6 plačanih mesecev.",
      "Da. Plačate 6 mesecev za pol cene in 6 mesecev po polni ceni paketa. Letni popust 15 % se ne sešteva, a je cena s kodo nižja: Premium 359,10 € namesto 406,98 € na leto brez DDV.",
      "Za dodatne uporabnike, prostore, SMS sporočila in dodatne module, kot je davčna blagajna. Ponudba velja za nove stranke, enkrat na podjetje.",
    ]);
  });

  it("has the English questions", async () => {
    const { container } = renderPricing("", "en");
    await waitFor(() => expect(container.querySelectorAll(".pricing-promo-faq")).toHaveLength(3));
    expect(Array.from(container.querySelectorAll(".pricing-promo-faq p")).map(text)).toEqual([
      "Enter BLACKFRIDAY50 when you sign up, or by 31 Dec 2026 in Settings → Subscription. Your 14-day free trial comes first; the discount covers your first 6 paid months.",
      "Yes: 6 months at half price and 6 at full price. The 15% yearly discount does not stack, but the code price is lower: Premium €359.10 instead of €406.98 a year excl. VAT.",
      "Extra users, rooms, SMS and add-on modules such as the fiscal cash register. New customers only, once per company.",
    ]);
  });

  it("shows none of it without an active offer", async () => {
    for (const setup of [() => loadCatalog(novemberCatalog), () => vi.setSystemTime(AFTER_BLACK_FRIDAY)]) {
      setup();
      const { container, unmount } = renderPricing("?plan=premium&code=BLACKFRIDAY50");
      await act(async () => { await Promise.resolve(); });
      expect(container.querySelector("#black-friday, .pricing-promo-old, .pricing-promo-code, .pricing-promo-faq, [data-pricing-discount]")).toBeNull();
      expect(text(card(container, "premium")?.querySelector(".pricing-plan-price strong"))).toBe("39,90 €");
      expect(container.querySelector(".pricing-faq details")).toHaveProperty("open", true);
      expect(new URL(container.querySelector<HTMLAnchorElement>("[data-pricing-signup]")!.href).searchParams.has("code")).toBe(false);
      unmount();
      loadCatalog(blackFridayCatalog);
    }
  });
});

describe("client-only rendering", () => {
  it("keeps the offer out of prerendered markup", () => {
    const html = renderToStaticMarkup(
      <SiteLanguageProvider initialLanguage="sl"><StaticRouter location="/cenik?code=BLACKFRIDAY50">
        <PromotionBanner /><Pricing standalone /><PricingOverview /><TrialSignupLink>Preizkusi</TrialSignupLink>
      </StaticRouter></SiteLanguageProvider>,
    );
    expect(html).not.toMatch(/BLACKFRIDAY50|Black Friday|pricing-promo|home-promo|bf-banner/);
  });

  it("hydrates the prerendered page without a mismatch, then shows the offer", async () => {
    atPath("/cenik");
    const server = (
      <SiteLanguageProvider initialLanguage="sl"><StaticRouter location="/cenik"><Pricing standalone /></StaticRouter></SiteLanguageProvider>
    );
    const container = document.createElement("div");
    container.innerHTML = renderToString(server);
    document.body.appendChild(container);
    // Server rendering warns about third-party layout effects; only hydration messages count below.
    vi.mocked(console.error).mockClear();
    const recoverable: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot> | undefined;
    try {
      await act(async () => {
        root = hydrateRoot(container, (
          <SiteLanguageProvider initialLanguage="sl"><MemoryRouter initialEntries={["/cenik"]}>
            <PromotionBanner /><Pricing standalone />
          </MemoryRouter></SiteLanguageProvider>
        ), { onRecoverableError: (error) => recoverable.push(error) });
      });
      await waitFor(() => expect(container.querySelector("#black-friday")).not.toBeNull());
      await waitFor(() => expect(container.querySelector(".bf-banner")).not.toBeNull());
      expect(recoverable).toEqual([]);
      const hydrationErrors = vi.mocked(console.error).mock.calls.map((call) => String(call[0])).filter((message) => /hydrat|did not match|server HTML/i.test(message));
      expect(hydrationErrors).toEqual([]);
      // The banner sits before the page, outside the prerendered route markup.
      expect(container.firstElementChild?.matches(".bf-banner")).toBe(true);
    } finally {
      act(() => root?.unmount());
      container.remove();
    }
  });
});

describe("registration links", () => {
  const renderTrialLink = () => render(
    <SiteLanguageProvider initialLanguage="sl"><MemoryRouter initialEntries={["/?via=sales-owner"]}><TrialSignupLink>Preizkusi</TrialSignupLink></MemoryRouter></SiteLanguageProvider>,
  );
  const href = () => new URL(screen.getByRole("link", { name: "Preizkusi" }).getAttribute("href")!);

  it("adds the code to trial links while the offer runs", async () => {
    renderTrialLink();
    await waitFor(() => expect(href().searchParams.get("code")).toBe("BLACKFRIDAY50"));
    expect(href().searchParams.get("flow")).toBe("trial");
    expect(href().searchParams.get("via")).toBe("sales-owner");
  });

  it("leaves the code out without an offer and after it ends", async () => {
    loadCatalog(novemberCatalog);
    const first = renderTrialLink();
    await act(async () => { await Promise.resolve(); });
    expect(href().searchParams.has("code")).toBe(false);
    first.unmount();
    loadCatalog(blackFridayCatalog);
    vi.setSystemTime(AFTER_BLACK_FRIDAY);
    renderTrialLink();
    await act(async () => { await Promise.resolve(); });
    expect(href().searchParams.has("code")).toBe(false);
  });

  it("forwards only the code it is given, never one from the visitor's URL", () => {
    expect(new URL(buildTrialSignupRoute("sl", "?code=FREE100")).searchParams.has("code")).toBe(false);
    expect(new URL(buildTrialSignupRoute("en", "", "BLACKFRIDAY50")).searchParams.get("code")).toBe("BLACKFRIDAY50");
    expect(new URL(buildPackageSignupRoute("premium", undefined, "sl", "?code=FREE100")).searchParams.has("code")).toBe(false);
    expect(new URL(buildPackageSignupRoute("premium", undefined, "sl", "", "BLACKFRIDAY50")).searchParams.get("code")).toBe("BLACKFRIDAY50");
  });
});

describe("homepage pricing teaser", () => {
  it("links to the price list with the code while the offer runs, without VAT text", async () => {
    const { container } = render(<SiteLanguageProvider initialLanguage="sl"><MemoryRouter><PricingOverview /></MemoryRouter></SiteLanguageProvider>);
    const line = await waitFor(() => {
      const element = container.querySelector<HTMLAnchorElement>(".home-promo-line");
      expect(element).not.toBeNull();
      return element!;
    });
    expect(line).toHaveAttribute("href", "/cenik?code=BLACKFRIDAY50");
    expect(text(line)).toBe("Black Friday: −50 % prvih 6 mesecev s kodo BLACKFRIDAY50");
    expect(text(container.querySelector("#cenik"))).not.toMatch(/DDV|VAT/);
  });

  it("uses the English line on /en", async () => {
    atPath("/en");
    const { container } = render(<SiteLanguageProvider initialLanguage="en"><MemoryRouter><PricingOverview /></MemoryRouter></SiteLanguageProvider>);
    await waitFor(() => expect(text(container.querySelector(".home-promo-line"))).toBe("Black Friday: 50% off for 6 months with code BLACKFRIDAY50"));
    expect(container.querySelector(".home-promo-line")).toHaveAttribute("href", "/en/pricing?code=BLACKFRIDAY50");
  });
});

describe("calculator arithmetic", () => {
  const premium = { monthlyPlan: 39.9, annualPlan: 406.98, annualBilledMonths: 10.2, monthlyUsers: 5.9, monthlyAddOns: 0, smsCount: 100, smsUnit: .05 };
  it("discounts only the plan: 19,95 + 5,90 + 5,00 = 30,85 € excl. VAT", () => {
    expect(calculatePricingQuote({ ...premium, annual: false, planDiscount: 19.95 })).toMatchObject({
      plan: 39.9, discount: 19.95, users: 5.9, total: { net: 30.85, vat: 6.79, gross: 37.64 },
    });
    expect(calculatePricingQuote({ ...premium, annual: false }).total.gross).toBe(61.98);
  });
  it("never discounts more than the plan or below zero", () => {
    expect(calculatePricingQuote({ ...premium, annual: false, planDiscount: 100 }).discount).toBe(39.9);
    expect(calculatePricingQuote({ ...premium, annual: false, planDiscount: -5 }).discount).toBe(0);
  });
});

describe("llms.txt and llms-full.txt", () => {
  const during = DURING_BLACK_FRIDAY.getTime();
  const sl = "- Ponudba Black Friday 2026: s kodo BLACKFRIDAY50 nove stranke do 31. 12. 2026 dobijo 50 % popusta na ceno paketa za prvih 6 plačanih mesecev (mesečni ali letni obračun; letni popust 15 % se ne sešteva; dodatki po rednem ceniku).";
  const en = "- Black Friday 2026 offer: with code BLACKFRIDAY50, new customers who sign up by 31 Dec 2026 get 50% off the plan price for their first 6 paid months (monthly or yearly billing; does not stack with the 15% yearly discount; add-ons at regular prices).";

  it("states the offer under Key facts when the build snapshot's offer is still valid", () => {
    for (const output of [buildLlmsTxt(during), buildLlmsFullTxt(during)]) {
      expect(output).toContain(sl);
      expect(output).toContain(en);
      expect(output.indexOf(sl)).toBeGreaterThan(output.indexOf("## Ključna dejstva"));
      expect(output.indexOf(en)).toBeGreaterThan(output.indexOf("## Key facts"));
    }
  });

  it("leaves it out after the end and without an offer", () => {
    expect(`${buildLlmsTxt(AFTER_BLACK_FRIDAY)}${buildLlmsFullTxt(AFTER_BLACK_FRIDAY)}`).not.toMatch(/BLACKFRIDAY50|Black Friday/);
    loadCatalog(novemberCatalog);
    expect(`${buildLlmsTxt(during)}${buildLlmsFullTxt(during)}`).not.toMatch(/BLACKFRIDAY50|Black Friday/);
  });

  it("keeps the offer questions out of llms-full.txt", () => {
    const full = buildLlmsFullTxt(during);
    for (const question of ["Kako uveljavim Black Friday popust?", "Ali popust velja tudi za letni obračun?", "How do I get the Black Friday discount?", "What is not discounted?"]) {
      expect(full).not.toContain(question);
    }
  });

  it("says that waiting lists are in the Premium plan wherever it presents them", () => {
    const slNote = "Čakalne vrste so vključene v paket Premium.";
    const enNote = "Waiting lists are included in the Premium plan.";
    const llms = buildLlmsTxt(during);
    const mentions = llms.split("\n").filter((line) => /čakaln|waiting[ -]?list|waitlist/i.test(line));
    expect(mentions.length).toBeGreaterThan(4);
    for (const line of mentions) expect(line.includes(slNote) || line.includes(enNote)).toBe(true);
    expect(llms.split("\n").find((line) => line.includes("/skupinske-rezervacije)"))).toContain(slNote);
    expect(llms.split("\n").find((line) => line.includes("/en/group-bookings)"))).toContain(enNote);

    const full = buildLlmsFullTxt(during);
    expect(full).toContain(`Da. Ko je skupinski termin zapolnjen, lahko dodatni interesenti ostanejo povezani prek čakalne vrste. Ko se mesto sprosti, ga je mogoče ponuditi naslednjemu interesentu glede na nastavljen potek. ${slNote}`);
    expect(full).toContain(enNote);
    // Page meta descriptions themselves are unchanged.
    expect(llms).toContain("Upravljajte skupinske termine, kapacitete, spletne prijave, čakalne vrste, ponovitve, udeležence, članstva in pakete obiskov na enem mestu.");
  });

  it("follows the catalog for the plan name and says nothing when the catalog has no such feature", () => {
    loadCatalog(FALLBACK_PUBLIC_PRICING);
    expect(buildLlmsTxt(during)).not.toMatch(/Čakalne vrste so vključene|Waiting lists are included/);
  });
});

describe("analytics allowlist", () => {
  it("accepts the offer events and drops free text typed as a code", () => {
    expect(sanitizeAnalyticsEvent("promo_code_copied", { coupon: "BLACKFRIDAY50", placement: "pricing_page" })?.data)
      .toEqual({ coupon: "BLACKFRIDAY50", placement: "pricing_page" });
    expect(sanitizeAnalyticsEvent("coupon_applied", { coupon: "BLACKFRIDAY50", plan: "premium", billing: "annual", step: "pricing_calculator" })?.data)
      .toEqual({ coupon: "BLACKFRIDAY50", plan: "premium", billing: "annual", step: "pricing_calculator" });
    expect(sanitizeAnalyticsEvent("coupon_rejected", { coupon: "BLACKFRIDAY", reason: "unknown_code" })?.data)
      .toEqual({ coupon: "BLACKFRIDAY", reason: "unknown_code" });
    for (const coupon of ["ANA@EXAMPLE.COM", "041 123 456", "041123456", "blackfriday50", "MOJE IME"]) {
      expect(sanitizeAnalyticsEvent("coupon_rejected", { coupon, reason: "unknown_code" })?.data).toEqual({ reason: "unknown_code" });
    }
  });

  it("keeps the placements and package keys the site already sends", () => {
    expect(sanitizeAnalyticsEvent("trial_cta_click", { placement: "industry_page" })?.data).toEqual({ placement: "industry_page" });
    expect(sanitizeAnalyticsEvent("trial_cta_click", { placement: "pricing_page_sticky", plan: "professional" })?.data)
      .toEqual({ placement: "pricing_page_sticky", plan: "professional" });
    for (const key of ["professional", "custom", "premium", "basic"]) {
      expect(sanitizeAnalyticsEvent("pricing_package_selected", { package_key: key })?.data).toEqual({ package_key: key });
    }
  });
});

describe("offer dates", () => {
  it("names the last valid day in Ljubljana", () => {
    expect(formatPromotionDate("2026-12-31T22:59:59Z", "sl")).toBe("31. 12. 2026");
    expect(formatPromotionDate("2026-12-31T22:59:59Z", "en")).toBe("31 Dec 2026");
    // An end at local midnight still names the previous day.
    expect(formatPromotionDate("2026-12-31T23:00:00Z", "sl")).toBe("31. 12. 2026");
  });
});
