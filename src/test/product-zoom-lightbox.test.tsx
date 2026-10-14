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
    expect(screen.getByRole("link", { name: /Try free/i })).toBeInTheDocument();
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
});
