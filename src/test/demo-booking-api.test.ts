import { afterEach, expect, it, vi } from "vitest";
import { demoBookingApi } from "@/lib/demo-booking";

afterEach(() => vi.unstubAllGlobals());

it("keeps read requests simple for CORS and forwards cancellation, while retaining JSON for booking writes", async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
  vi.stubGlobal("fetch", fetchMock);
  const controller = new AbortController();
  await demoBookingApi.profile(controller.signal);
  await demoBookingApi.availability("2026-10-16", "2026-10-22", "Europe/Ljubljana", controller.signal);
  for (const [, options] of fetchMock.mock.calls) {
    expect(options.headers).not.toHaveProperty("Content-Type");
    expect(options.signal).toBe(controller.signal);
  }
  await demoBookingApi.hold("2026-10-16T13:00:00Z", "Europe/Ljubljana");
  expect(fetchMock.mock.lastCall?.[1]).toMatchObject({ method: "POST", headers: { "Content-Type": "application/json" } });
});
