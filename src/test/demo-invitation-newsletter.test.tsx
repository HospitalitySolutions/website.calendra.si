import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NewsletterForm } from "@/components/marketing/DemoInvitationCard";
import { GOOGLE_ANALYTICS_CONSENT_KEY } from "@/lib/google-analytics";
import { isNewsletterSignupEnabled, isValidNewsletterEmail, subscribeToNewsletter } from "@/lib/newsletter";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

/** CSRF handshake, then the newsletter POST. */
const newsletterFetch = (result: Response | Error) => vi.fn(async (input: RequestInfo | URL) => {
  const url = String(input);
  if (url.endsWith("/api/auth/csrf")) return json({ token: "csrf-token" });
  if (url.endsWith("/api/register/newsletter")) { if (result instanceof Error) throw result; return result; }
  if (url.endsWith("/api/public/demo-bookings/profile")) return json({ enabled: true, durationMinutes: 15, slug: "demo", title: "Demo", timeZone: "Europe/Ljubljana", meetingProvider: "GOOGLE_MEET", bookingHorizonDays: 30, minimumNoticeMinutes: 60 });
  throw new Error(`unexpected ${url}`);
});

const CONSENT = "S prijavo soglašate s prejemanjem e-novic in obvestil o novostih Calendre. Odjava je mogoča kadar koli.";

const renderForm = (compact = false) => render(<MemoryRouter><NewsletterForm language="sl" compact={compact} /></MemoryRouter>);

beforeEach(() => { localStorage.clear(); sessionStorage.clear(); });
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("newsletter client", () => {
  it("is off unless explicitly enabled", () => {
    expect(isNewsletterSignupEnabled()).toBe(false);
    vi.stubEnv("VITE_NEWSLETTER_SIGNUP_ENABLED", "true");
    expect(isNewsletterSignupEnabled()).toBe(true);
  });

  it("validates addresses before any request", () => {
    expect(isValidNewsletterEmail(" ana@salon.si ")).toBe(true);
    for (const value of ["", "ana@salon", "ana salon@x.si", "@salon.si"]) expect(isValidNewsletterEmail(value)).toBe(false);
  });

  it("posts explicit consent through the CSRF-protected app endpoint and holds no MailerLite credential", async () => {
    const fetch = newsletterFetch(json({ subscribed: true }));
    vi.stubGlobal("fetch", fetch);
    await subscribeToNewsletter({ email: " Ana@Salon.si ", locale: "en", consentText: "By subscribing you agree." });
    const [url, init] = fetch.mock.calls[1] as unknown as [string, RequestInit];
    expect(url).toMatch(/\/api\/register\/newsletter$/);
    expect(init.method).toBe("POST");
    expect(init.credentials).toBe("include");
    expect((init.headers as Record<string, string>)["X-XSRF-TOKEN"]).toBe("csrf-token");
    expect(JSON.parse(String(init.body))).toEqual({ email: "Ana@Salon.si", locale: "en", consent: true, consentText: "By subscribing you agree." });
    expect(JSON.stringify(fetch.mock.calls).toLowerCase()).not.toMatch(/mailerlite|bearer|authorization/);
  });

  it("maps provider rejection and outages to stable errors", async () => {
    vi.stubGlobal("fetch", newsletterFetch(json({ message: "bad" }, 400)));
    await expect(subscribeToNewsletter({ email: "ana@salon.si", locale: "sl", consentText: CONSENT })).rejects.toThrow("newsletter_invalid");
    vi.stubGlobal("fetch", newsletterFetch(json({}, 503)));
    await expect(subscribeToNewsletter({ email: "ana@salon.si", locale: "sl", consentText: CONSENT })).rejects.toThrow("newsletter_unavailable");
    vi.stubGlobal("fetch", newsletterFetch(new TypeError("offline")));
    await expect(subscribeToNewsletter({ email: "ana@salon.si", locale: "sl", consentText: CONSENT })).rejects.toThrow("newsletter_unavailable");
  });
});

describe("newsletter form states", () => {
  it("shows the consent text and privacy link before submitting, without promising a confirmation email", () => {
    renderForm();
    expect(screen.getByText(/S prijavo soglašate s prejemanjem e-novic/)).toHaveTextContent(`${CONSENT} Politika zasebnosti`);
    expect(document.body).not.toHaveTextContent(/potrd/i);
    expect(screen.getByRole("link", { name: "Politika zasebnosti" })).toHaveAttribute("href", "/zasebnost");
    expect(screen.getByLabelText("E-poštni naslov")).toHaveAccessibleDescription(/S prijavo soglašate/);
  });

  it("rejects an invalid address locally without calling the server", () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    renderForm();
    fireEvent.change(screen.getByLabelText("E-poštni naslov"), { target: { value: "ana@salon" } });
    fireEvent.click(screen.getByRole("button", { name: "Prijava" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Vnesite veljaven e-poštni naslov.");
    expect(screen.getByLabelText("E-poštni naslov")).toHaveAttribute("aria-invalid", "true");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("shows loading, then confirms the subscription straight away", async () => {
    let release: (value: Response) => void = () => undefined;
    const fetch = vi.fn(async (input: RequestInfo | URL) => String(input).endsWith("/csrf")
      ? json({ token: "csrf-token" })
      : new Promise<Response>(resolve => { release = resolve; }));
    vi.stubGlobal("fetch", fetch);
    renderForm(true);
    fireEvent.change(screen.getByLabelText("E-poštni naslov"), { target: { value: "ana@salon.si" } });
    fireEvent.click(screen.getByRole("button", { name: "Prijava na e-novice" }));
    const busy = await screen.findByRole("button", { name: /Prijavljam/ });
    expect(busy).toBeDisabled();
    expect(screen.getByLabelText("E-poštni naslov")).toBeDisabled();
    await act(async () => release(json({ subscribed: true })));
    const status = await screen.findByRole("status");
    expect(status).toHaveTextContent("Prijava uspela! Hvala, odslej boste prejemali e-novice Calendre.");
    expect(status).not.toHaveTextContent(/potrd|e-pošto/i);
    expect(screen.queryByLabelText("E-poštni naslov")).toBeNull();
  });

  it("sends the consent wording the visitor saw, with the privacy policy address", async () => {
    const fetch = newsletterFetch(json({ subscribed: true }));
    vi.stubGlobal("fetch", fetch);
    renderForm();
    fireEvent.change(screen.getByLabelText("E-poštni naslov"), { target: { value: "ana@salon.si" } });
    fireEvent.click(screen.getByRole("button", { name: "Prijava" }));
    await screen.findByRole("status");
    const body = JSON.parse(String((fetch.mock.calls[1] as unknown as [string, RequestInit])[1].body));
    expect(body).toMatchObject({ email: "ana@salon.si", locale: "sl", consent: true });
    expect(body.consentText).toBe(`${CONSENT} Politika zasebnosti (https://calendra.si/zasebnost)`);
  });

  it("confirms in English too", async () => {
    vi.stubGlobal("fetch", newsletterFetch(json({ subscribed: true })));
    render(<MemoryRouter><NewsletterForm language="en" compact={false} /></MemoryRouter>);
    expect(screen.getByText(/By subscribing you agree/)).not.toHaveTextContent(/confirm/i);
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "ana@salon.si" } });
    fireEvent.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(await screen.findByRole("status")).toHaveTextContent("You're subscribed!");
  });

  it("keeps the address and offers a retry after a server error", async () => {
    vi.stubGlobal("fetch", newsletterFetch(json({}, 503)));
    renderForm();
    fireEvent.change(screen.getByLabelText("E-poštni naslov"), { target: { value: "ana@salon.si" } });
    fireEvent.click(screen.getByRole("button", { name: "Prijava" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Prijava trenutno ni uspela.");
    expect(screen.getByLabelText("E-poštni naslov")).toHaveValue("ana@salon.si");
    expect(screen.getByRole("button", { name: "Prijava" })).toBeEnabled();
  });

  it("sends the hidden honeypot value so the server can drop automated sign-ups", async () => {
    const fetch = newsletterFetch(json({ subscribed: true }));
    vi.stubGlobal("fetch", fetch);
    const { container } = renderForm();
    fireEvent.change(container.querySelector("input[name=website]")!, { target: { value: "https://spam.test" } });
    fireEvent.change(screen.getByLabelText("E-poštni naslov"), { target: { value: "bot@spam.test" } });
    fireEvent.click(screen.getByRole("button", { name: "Prijava" }));
    await screen.findByRole("status");
    expect(JSON.parse(String((fetch.mock.calls[1] as unknown as [string, RequestInit])[1].body)).website).toBe("https://spam.test");
  });
});

describe("demo invitation with e-novice", () => {
  const showInvitation = async () => {
    localStorage.setItem(GOOGLE_ANALYTICS_CONSENT_KEY, "granted");
    HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) { this.setAttribute("open", ""); };
    HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) { this.removeAttribute("open"); };
    // The session controller is a module singleton: load a fresh one per test.
    vi.resetModules();
    const { default: DemoInvitation } = await import("@/components/marketing/DemoInvitation");
    vi.useFakeTimers({ shouldAdvanceTime: true });
    render(<MemoryRouter initialEntries={["/"]}><DemoInvitation /></MemoryRouter>);
    await act(async () => { await vi.advanceTimersByTimeAsync(11_000); });
    vi.useRealTimers();
    return screen.findByRole("heading", { name: /Spoznajte Calendro v 15 minutah/ });
  };

  it("keeps the demo booking as the primary action and hides e-novice while disabled", async () => {
    vi.stubGlobal("fetch", newsletterFetch(json({ subscribed: true })));
    await showInvitation();
    expect(screen.getByRole("link", { name: /Rezervirajte brezplačno predstavitev/ })).toHaveAttribute("href", "/predstavitev");
    expect(screen.queryByLabelText("E-poštni naslov")).toBeNull();
  });

  it("stays open while the visitor types an email, then confirms the sign-up", async () => {
    vi.stubEnv("VITE_NEWSLETTER_SIGNUP_ENABLED", "true");
    const fetch = newsletterFetch(json({ subscribed: true }));
    vi.stubGlobal("fetch", fetch);
    await showInvitation();
    const input = screen.getByLabelText("E-poštni naslov");
    act(() => input.focus());
    fireEvent.input(input, { target: { value: "ana@salon.si" } });
    fireEvent.change(input, { target: { value: "ana@salon.si" } });
    await act(async () => { await Promise.resolve(); });
    expect(document.querySelector("[data-demo-invitation]")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Prijava" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Prijava uspela!");
    expect(document.querySelector("[data-demo-invitation]")).not.toBeNull();
    await waitFor(() => expect(fetch.mock.calls.some(([url]) => String(url).endsWith("/api/register/newsletter"))).toBe(true));
  });
});
