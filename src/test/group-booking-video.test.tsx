import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GroupBookingVideo from "@/components/marketing/GroupBookingVideo";

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("group booking inline video", () => {
  it("keeps the MP4 out of the initial HTML and loads it only after Play", () => {
    const html = renderToString(createElement(GroupBookingVideo, { language: "sl" }));
    expect(html).not.toContain("<video");
    expect(html).not.toContain(".mp4");

    const { container } = render(<GroupBookingVideo language="sl" />);
    expect(container.querySelector("video, source")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /Predvajaj predstavitev skupinskih rezervacij/ }));

    const player = container.querySelector("video");
    expect(player).toHaveAttribute("src", "/videos/calendra-skupinske-rezervacije.mp4");
    expect(player).toHaveAttribute("controls");
    expect(player).toHaveAttribute("playsinline");
    expect(player).toHaveFocus();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledOnce();
  });

  it("leaves native playback available when browser policy declines the play request", async () => {
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValue(new DOMException("Not allowed", "NotAllowedError"));
    const { container } = render(<GroupBookingVideo language="en" />);
    fireEvent.click(screen.getByRole("button", { name: /Slovenian audio/ }));
    expect(await screen.findByRole("status")).toHaveTextContent("Use the video's play control");
    expect(container.querySelector("video")).toHaveAttribute("controls");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    fireEvent.play(container.querySelector("video")!);
    await waitFor(() => expect(screen.queryByRole("status")).not.toBeInTheDocument());
  });

  it("offers a direct video link after a media error", () => {
    const { container } = render(<GroupBookingVideo language="sl" />);
    fireEvent.click(screen.getByRole("button", { name: /Predvajaj predstavitev/ }));
    fireEvent.error(container.querySelector("video")!);
    expect(screen.getByRole("alert")).toHaveTextContent("Videoposnetka trenutno ni mogoče predvajati");
    expect(screen.getByRole("link", { name: /Odprite video/ })).toHaveAttribute("href", "/videos/calendra-skupinske-rezervacije.mp4");
  });

  it("pauses playback on navigation away", () => {
    const { unmount } = render(<GroupBookingVideo language="en" />);
    fireEvent.click(screen.getByRole("button", { name: /Play group bookings demo/ }));
    unmount();
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledOnce();
  });
});
