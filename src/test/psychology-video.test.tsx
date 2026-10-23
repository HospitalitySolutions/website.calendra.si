import fs from "node:fs";
import path from "node:path";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PsychologyVideo from "@/components/marketing/PsychologyVideo";
import { getIndustryContent } from "@/lib/industry-pages";

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("psychology landing page video", () => {
  it("loads the MP4 only after Play and retains browser controls", () => {
    const markup = renderToString(createElement(PsychologyVideo, { language: "sl" }));
    expect(markup).not.toContain("<video");
    expect(markup).not.toContain(".mp4");
    const { container } = render(<PsychologyVideo language="sl" />);
    fireEvent.click(screen.getByRole("button", { name: /Predvajaj predstavitev Calendra za psihološko prakso/ }));
    expect(container.querySelector("video")).toHaveAttribute("src", "/videos/calendra-svetovanje.mp4");
    expect(container.querySelector("video")).toHaveAttribute("controls");
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledOnce();
  });

  it("has the web video and preview on disk", () => {
    for (const name of ["calendra-svetovanje.mp4", "calendra-svetovanje-poster.webp"]) {
      expect(fs.statSync(path.resolve(process.cwd(), "public/videos", name)).size).toBeGreaterThan(1000);
    }
  });

  it("uses the approved 2–5 team size wording", () => {
    expect(getIndustryContent("psychologyCounselling", "sl").heroPoints[0]).toContain("2–5 izvajalcev");
    expect(getIndustryContent("psychologyCounselling", "sl").heroPoints[0]).not.toContain("1–5");
  });
});
