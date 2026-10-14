import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Hero from "@/components/landing/Hero";
import { SiteLanguageProvider } from "@/lib/site-language";

const renderHero = (language: "sl" | "en" = "sl") => {
  window.history.replaceState({}, "", language === "sl" ? "/" : "/en");
  return render(
    <SiteLanguageProvider initialLanguage={language}>
      <Hero />
    </SiteLanguageProvider>,
  );
};

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
});

describe("homepage screenshot zoom", () => {
  it("enlarges the original desktop screenshot and closes with X", async () => {
    renderHero();
    const screenshot = screen.getByRole("button", { name: "Povečaj posnetek koledarja na računalniku" });
    expect(screenshot).toHaveAttribute("aria-haspopup", "dialog");

    fireEvent.click(screenshot);

    const dialog = await screen.findByRole("dialog", { name: "Povečan pogled računalniškega koledarja Calendra" });
    expect(within(dialog).getByRole("img")).toHaveAttribute("src", "/homepage/calendar-desktop.webp");
    expect(within(dialog).queryByRole("button", { name: "Nov termin" })).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");

    const close = within(dialog).getByRole("button", { name: "Zapri povečan pogled" });
    expect(close).toHaveFocus();
    fireEvent.click(close);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(document.body.style.overflow).toBe("");
  });

  it("enlarges the mobile screenshot and closes with Escape", async () => {
    renderHero();
    fireEvent.click(screen.getByRole("button", { name: "Povečaj posnetek mobilnega koledarja" }));

    const dialog = await screen.findByRole("dialog", { name: "Povečan pogled mobilnega koledarja Calendra" });
    expect(within(dialog).getByRole("img")).toHaveAttribute("src", "/homepage/calendar-mobile.webp");
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("closes when the dimmed backdrop is clicked", async () => {
    renderHero();
    fireEvent.click(screen.getByRole("button", { name: "Povečaj posnetek koledarja na računalniku" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(dialog);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("supports English and retains the original homepage CTAs", async () => {
    renderHero("en");
    expect(screen.getByRole("link", { name: /Try.*free/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Enlarge desktop calendar screenshot" }));
    const dialog = await screen.findByRole("dialog", { name: "Enlarged Calendra desktop calendar" });
    expect(within(dialog).getByRole("button", { name: "Close enlarged preview" })).toBeInTheDocument();
  });

  it("keeps keyboard focus inside the preview", async () => {
    renderHero();
    fireEvent.click(screen.getByRole("button", { name: "Povečaj posnetek mobilnega koledarja" }));
    const dialog = await screen.findByRole("dialog");
    const close = within(dialog).getByRole("button", { name: "Zapri povečan pogled" });
    fireEvent.keyDown(document, { key: "Tab" });
    expect(close).toHaveFocus();
  });
  it("draws handwritten desktop callouts that explain key functionality", async () => {
    renderHero();
    fireEvent.click(screen.getByRole("button", { name: "Povečaj posnetek koledarja na računalniku" }));
    const dialog = await screen.findByRole("dialog");
    const annotations = within(dialog).getByTestId("feature-arrows-desktop");

    expect(annotations).toHaveAttribute("aria-hidden", "true");
    expect(annotations.querySelectorAll("g.product-zoom-annotation")).toHaveLength(6);
    expect(annotations.textContent).toContain("Menjava datumov");
    expect(annotations.textContent).toContain("Več zaposlenih");
    expect(annotations.textContent).toContain("Več prostorov");
    expect(annotations.textContent).toContain("Skupinski termini");
    expect(annotations.textContent).toContain("7/10");
    expect(annotations.textContent).toContain("Pregleden koledar");

    const list = dialog.querySelector(".product-zoom-feature-list");
    expect(list).toHaveAttribute("aria-hidden", "false");
    expect(list?.textContent).toContain("največjo kapaciteto");
  });

  it("draws mobile feature callouts and can hide or show them", async () => {
    renderHero();
    fireEvent.click(screen.getByRole("button", { name: "Povečaj posnetek mobilnega koledarja" }));
    const dialog = await screen.findByRole("dialog");
    const annotations = within(dialog).getByTestId("feature-arrows-mobile");

    expect(annotations.textContent).toContain("Obvestila o novih");
    expect(annotations.textContent).toContain("Vsa ekipa");
    expect(annotations.textContent).toContain("Filtri za prostore");

    fireEvent.click(within(dialog).getByRole("button", { name: "Skrij poudarke" }));
    expect(within(dialog).getByRole("button", { name: "Prikaži poudarke" })).toHaveAttribute("aria-pressed", "false");
    expect(dialog.querySelector(".product-zoom-feature-list")).toHaveAttribute("aria-hidden", "true");

    fireEvent.click(within(dialog).getByRole("button", { name: "Prikaži poudarke" }));
    expect(within(dialog).getByRole("button", { name: "Skrij poudarke" })).toHaveAttribute("aria-pressed", "true");
    expect(dialog.querySelector(".product-zoom-feature-list")).toHaveAttribute("aria-hidden", "false");
  });

  it("translates callouts and the highlight toggle in English", async () => {
    renderHero("en");
    fireEvent.click(screen.getByRole("button", { name: "Enlarge mobile calendar screenshot" }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByTestId("feature-arrows-mobile").textContent).toContain("New booking");
    expect(within(dialog).getByRole("button", { name: "Hide highlights" })).toBeInTheDocument();
    expect(dialog.querySelector(".product-zoom-feature-list")?.textContent).toContain("Booking notifications");
  });

  it("wraps keyboard focus between the close button and the highlight toggle", async () => {
    renderHero();
    fireEvent.click(screen.getByRole("button", { name: "Povečaj posnetek koledarja na računalniku" }));
    const dialog = await screen.findByRole("dialog");
    const close = within(dialog).getByRole("button", { name: "Zapri povečan pogled" });
    const toggle = within(dialog).getByRole("button", { name: "Skrij poudarke" });
    expect(close).toHaveFocus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(toggle).toHaveFocus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(close).toHaveFocus();
  });

});
