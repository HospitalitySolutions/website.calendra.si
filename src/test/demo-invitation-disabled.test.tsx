import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import DemoInvitation from "@/components/marketing/DemoInvitation";

afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

it("the kill switch disables display, profile requests and the session timer", async () => {
  vi.stubEnv("VITE_DEMO_PROMPT_ENABLED", "false");
  const fetch = vi.fn();
  vi.stubGlobal("fetch", fetch);
  vi.useFakeTimers();
  sessionStorage.clear();
  render(<MemoryRouter initialEntries={["/"]}><DemoInvitation /></MemoryRouter>);
  await vi.advanceTimersByTimeAsync(60_000);
  expect(document.querySelector("[data-demo-invitation]")).toBeNull();
  expect(fetch).not.toHaveBeenCalled();
  expect(sessionStorage.getItem("calendra:demo-invitation:v1:started")).toBeNull();
});
