import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { demoAvailabilityRanges, useDemoAvailability } from "@/hooks/use-demo-availability";
import { demoBookingApi, type DemoAvailability, type DemoProfile } from "@/lib/demo-booking";

vi.mock("@/lib/demo-booking", () => ({ demoBookingApi: { availability: vi.fn() } }));
const api = vi.mocked(demoBookingApi.availability);
const profile: DemoProfile = { slug: "demo", title: "Demo", enabled: true, durationMinutes: 15, timeZone: "Europe/Ljubljana", meetingProvider: "GOOGLE_MEET", bookingHorizonDays: 30, minimumNoticeMinutes: 1440 };
const available = (date: string): DemoAvailability => ({ timeZone: "Europe/Ljubljana", days: [{ date, slots: [{ startAt: `${date}T13:00:00Z`, endAt: `${date}T13:15:00Z`, displayTime: "15:00–15:15" }] }] });
const deferred = () => {
  let resolve!: (value: DemoAvailability) => void;
  const promise = new Promise<DemoAvailability>((done) => { resolve = done; });
  return { promise, resolve };
};
beforeEach(() => api.mockReset());
afterEach(cleanup);

describe("demo availability windows", () => {
  it("skips dates before minimum notice and covers the horizon without overlapping weeks across DST", () => {
    const ranges = demoAvailabilityRanges(profile, "Europe/Ljubljana", new Date("2026-10-15T12:00:00Z"));
    expect(ranges).toEqual([
      { from: "2026-10-16", to: "2026-10-22" },
      { from: "2026-10-23", to: "2026-10-29" },
      { from: "2026-10-30", to: "2026-11-05" },
      { from: "2026-11-06", to: "2026-11-12" },
      { from: "2026-11-13", to: "2026-11-15" },
    ]);
  });
  it("uses the guest date for the beginning and the host horizon for the end", () => {
    const ranges = demoAvailabilityRanges({ ...profile, bookingHorizonDays: 1, minimumNoticeMinutes: 0 }, "America/Los_Angeles", new Date("2026-10-16T00:30:00Z"));
    expect(ranges).toEqual([{ from: "2026-10-15", to: "2026-10-18" }]);
  });
  it("does not request dates when minimum notice exceeds the booking horizon", () => {
    expect(demoAvailabilityRanges({ ...profile, bookingHorizonDays: 1, minimumNoticeMinutes: 14400 }, "Europe/Ljubljana")).toEqual([]);
  });
});

describe("progressive availability", () => {
  it("makes the first week usable while later dates are still pending, then appends without losing earlier days", async () => {
    const later = deferred();
    api.mockResolvedValueOnce(available("2026-10-16")).mockImplementationOnce(() => later.promise).mockResolvedValue({ timeZone: "Europe/Ljubljana", days: [] });
    const { result } = renderHook(() => useDemoAvailability(profile, "Europe/Ljubljana", true));
    await waitFor(() => expect(result.current.days).toHaveLength(1));
    expect(result.current.loading).toBe(false);
    expect(result.current.loadingMore).toBe(true);
    await act(async () => later.resolve(available("2026-10-23")));
    await waitFor(() => expect(result.current.loadingMore).toBe(false));
    expect(result.current.days.map((day) => day.date)).toEqual(["2026-10-16", "2026-10-23"]);
  });
  it("keeps looking after an empty first week instead of showing a false no-times result", async () => {
    const later = deferred();
    api.mockResolvedValueOnce({ timeZone: "Europe/Ljubljana", days: [] }).mockImplementationOnce(() => later.promise).mockResolvedValue({ timeZone: "Europe/Ljubljana", days: [] });
    const { result } = renderHook(() => useDemoAvailability(profile, "Europe/Ljubljana", true));
    await waitFor(() => expect(api).toHaveBeenCalledTimes(2));
    expect(result.current.loading).toBe(true);
    await act(async () => later.resolve(available("2026-10-23")));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.days).toHaveLength(1);
  });
  it("preserves usable dates on a later request failure and can retry", async () => {
    api.mockResolvedValueOnce(available("2026-10-16")).mockRejectedValueOnce(new Error("offline"));
    const { result } = renderHook(() => useDemoAvailability(profile, "Europe/Ljubljana", true));
    await waitFor(() => expect(result.current.error).toBe(true));
    expect(result.current.days).toHaveLength(1);
    expect(result.current.loading).toBe(false);
    api.mockResolvedValue(available("2026-10-19"));
    act(() => result.current.refresh());
    await waitFor(() => expect(result.current.loadingMore).toBe(false));
    expect(result.current.error).toBe(false);
    expect(result.current.days.map((day) => day.date)).toEqual(["2026-10-19"]);
  });
  it("ends the loading state on first-week failure", async () => {
    api.mockRejectedValueOnce(new Error("offline"));
    const { result } = renderHook(() => useDemoAvailability(profile, "Europe/Ljubljana", true));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(true);
    expect(result.current.days).toEqual([]);
  });
  it("aborts old requests and ignores a late response after disabling the picker", async () => {
    const pending = deferred();
    api.mockImplementationOnce(() => pending.promise);
    const { result, rerender } = renderHook(({ enabled }) => useDemoAvailability(profile, "Europe/Ljubljana", enabled), { initialProps: { enabled: true } });
    const signal = api.mock.calls[0][3];
    rerender({ enabled: false });
    expect(signal?.aborted).toBe(true);
    await act(async () => pending.resolve(available("2026-10-16")));
    expect(result.current.days).toEqual([]);
    expect(api).toHaveBeenCalledTimes(1);
  });
  it("does not load availability on management pages until rescheduling is opened", () => {
    renderHook(() => useDemoAvailability(profile, "Europe/Ljubljana", false));
    expect(api).not.toHaveBeenCalled();
  });
});
