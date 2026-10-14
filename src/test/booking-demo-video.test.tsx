import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import BookingDemoVideo from "@/components/marketing/BookingDemoVideo";
import Features from "@/components/landing/Features";
import { SiteLanguageProvider } from "@/lib/site-language";

const poster = {
  posterSrc: "/homepage/booking.webp",
  posterAlt: "Spletno naročanje v Calendri",
  width: 1149,
  height: 856,
} as const;

const renderPoster = (language: "sl" | "en" = "sl") =>
  render(<BookingDemoVideo {...poster} language={language} placement="homepage_feature" />);

beforeEach(() => {
  vi.stubEnv("VITE_BOOKING_DEMO_VIDEO_URL", "/videos/calendra-spletno-narocanje.mp4");
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  document.body.style.overflow = "";
});

describe("online booking product video", () => {
  it("leaves the video unmounted and unloaded before clicking its screenshot poster", async () => {
    renderPoster();
    const trigger = screen.getByRole("button", { name: /Spletno naročanje – predstavitev/i });
    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    expect(within(trigger).getByRole("img", { hidden: true })).toHaveAttribute("src", poster.posterSrc);
    expect(document.querySelectorAll("video, source")).toHaveLength(0);

    fireEvent.click(trigger);
    const dialog = await screen.findByRole("dialog");
    const player = within(dialog).getByTestId("booking-demo-player");
    expect(player).toHaveAttribute("controls");
    expect(player).toHaveAttribute("autoplay");
    expect(player).toHaveAttribute("playsinline");
    expect(player).toHaveAttribute("preload", "metadata");
    expect(player.querySelector("source")).toHaveAttribute("src", "/videos/calendra-spletno-narocanje.mp4");
  });

  it("pauses video and restores scrolling when closed", async () => {
    renderPoster();
    fireEvent.click(screen.getByRole("button", { name: /Spletno naročanje – predstavitev/i }));
    const dialog = await screen.findByRole("dialog");
    expect(document.body.style.overflow).toBe("hidden");
    const close = within(dialog).getByRole("button", { name: "Zapri video" });
    expect(close).toHaveFocus();
    fireEvent.click(close);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(document.body.style.overflow).toBe("");
  });

  it("can close with Escape or by clicking the dimmed backdrop", async () => {
    renderPoster();
    fireEvent.click(screen.getByRole("button", { name: /Spletno naročanje – predstavitev/i }));
    const firstDialog = await screen.findByRole("dialog");
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /Spletno naročanje – predstavitev/i }));
    const secondDialog = await screen.findByRole("dialog");
    expect(secondDialog).not.toBe(firstDialog);
    fireEvent.mouseDown(secondDialog);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("labels Slovenian narration clearly on the English marketing page", async () => {
    renderPoster("en");
    const trigger = screen.getByRole("button", { name: /Online booking – video tour/i });
    expect(within(trigger).getByText(/44 sec/)).toBeInTheDocument();
    fireEvent.click(trigger);
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("button", { name: "Close video" })).toBeInTheDocument();
  });

  it("falls back to the original screenshot if no hosted video URL is configured", () => {
    vi.stubEnv("VITE_BOOKING_DEMO_VIDEO_URL", "");
    renderPoster();
    expect(screen.getByRole("img", { name: poster.posterAlt })).toHaveAttribute("src", poster.posterSrc);
    expect(screen.queryByRole("button", { name: /predstavitev/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("adds the same click-to-play interaction to the homepage booking feature card", () => {
    window.history.replaceState({}, "", "/");
    render(<SiteLanguageProvider initialLanguage="sl"><Features /></SiteLanguageProvider>);
    expect(screen.getByRole("button", { name: /Spletno naročanje – predstavitev/i })).toBeInTheDocument();
    // Other feature links still work; only the booking poster becomes clickable.
    expect(screen.getByRole("link", { name: /Oglejte si spletno naročanje/ })).toHaveAttribute("href", "/narocanje");
  });

  it("keeps the server-rendered marketing HTML video-free", () => {
    const html = renderToString(createElement(BookingDemoVideo, {
      ...poster,
      language: "sl",
      placement: "booking_page_hero",
    }));
    expect(html).toContain("/homepage/booking.webp");
    expect(html).not.toContain("<video");
    expect(html).not.toContain("calendra-spletno-narocanje.mp4");
  });
});
