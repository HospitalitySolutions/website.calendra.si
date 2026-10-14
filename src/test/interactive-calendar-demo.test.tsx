import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import InteractiveCalendarDemo from "@/components/landing/InteractiveCalendarDemo";
import Hero from "@/components/landing/Hero";
import { SiteLanguageProvider } from "@/lib/site-language";
import { generateDemoAppointments } from "@/components/landing/interactive-preview-data";

afterEach(() => cleanup());

describe("homepage interactive calendar preview", () => {
  it("generates fictional, repeatable demo bookings independently of tenant data", () => {
    const fixedDate = new Date(2026, 9, 14);
    const first = generateDemoAppointments("studio", fixedDate);
    const second = generateDemoAppointments("studio", fixedDate);
    expect(first).toEqual(second);
    expect(first.length).toBeGreaterThan(50);
    expect(first.some((booking) => booking.participants?.length === 7)).toBe(true);
    expect(generateDemoAppointments("salon", fixedDate).every((booking) => !booking.participants)).toBe(true);
    expect(generateDemoAppointments("counselling", fixedDate).some((booking) => booking.customer === "Stranka 001")).toBe(true);
  });

  it("opens booking details and can switch to the mobile preview", () => {
    render(<InteractiveCalendarDemo initialDevice="desktop" language="sl" onClose={vi.fn()} />);
    const dialog = screen.getByRole("dialog", { name: "Preizkusite Calendra koledar" });
    expect(within(dialog).getByText(/To je prikaz z izmišljenimi podatki/)).toBeInTheDocument();

    const booking = within(dialog).getAllByRole("button", { name: /Pilates – skupinska vadba/ })[0];
    fireEvent.click(booking);
    expect(within(dialog).getByRole("heading", { name: "Podrobnosti termina" })).toBeInTheDocument();
    expect(within(dialog).getByText("Nina M.")).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole("button", { name: "Telefon" }));
    expect(within(dialog).getByRole("button", { name: "Nov termin" })).toBeInTheDocument();
  });

  it("creates and removes a sample booking, and resets when the business changes", () => {
    render(<InteractiveCalendarDemo initialDevice="desktop" language="sl" onClose={vi.fn()} />);
    const dialog = screen.getByRole("dialog");
    fireEvent.change(within(dialog).getByLabelText("Vrsta dejavnosti"), { target: { value: "salon" } });
    expect(within(dialog).getAllByText("Salon Studio").length).toBeGreaterThan(0);

    fireEvent.click(within(dialog).getAllByRole("button", { name: /Dodaj termin/ })[0]);
    expect(within(dialog).getByRole("heading", { name: "Nov termin" })).toBeInTheDocument();
    fireEvent.change(within(dialog).getByPlaceholderText("Ime vzorčne stranke"), { target: { value: "Testna stranka" } });
    fireEvent.click(within(dialog).getByRole("button", { name: "Dodaj vzorčni termin" }));
    expect(within(dialog).getByText("Testna stranka")).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole("button", { name: "Izbriši vzorčni termin" }));
    expect(within(dialog).queryByText("Testna stranka")).not.toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole("button", { name: /Ponastavi demo/ }));
    expect(within(dialog).getAllByText("Salon Studio").length).toBeGreaterThan(0);
  });

  it("supports English and Escape to close", () => {
    const close = vi.fn();
    render(<InteractiveCalendarDemo initialDevice="mobile" language="en" onClose={close} />);
    expect(screen.getByRole("dialog", { name: "Try the Calendra calendar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New booking" })).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(close).toHaveBeenCalledOnce();
  });
  it("opens the lazy preview from either homepage device screenshot", async () => {
    window.history.replaceState({}, "", "/");
    render(<SiteLanguageProvider initialLanguage="sl"><Hero /></SiteLanguageProvider>);

    fireEvent.click(screen.getByRole("button", { name: "Odpri interaktivni predogled koledarja na računalniku" }));
    const desktop = await screen.findByRole("dialog", { name: "Preizkusite Calendra koledar" });
    expect(within(desktop).getByRole("button", { name: "Računalnik" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(within(desktop).getByRole("button", { name: "Zapri predogled" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Odpri interaktivni predogled mobilnega koledarja" }));
    const mobile = await screen.findByRole("dialog");
    expect(within(mobile).getByRole("button", { name: "Telefon" })).toHaveAttribute("aria-pressed", "true");
  });

});
