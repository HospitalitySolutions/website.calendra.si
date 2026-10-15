import { useCallback, useEffect, useState } from "react";
import { demoBookingApi, type DemoDay, type DemoProfile } from "@/lib/demo-booking";

const dayInZone = (date: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat("en", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  return ["year", "month", "day"].map((type) => parts.find((part) => part.type === type)?.value).join("-");
};

const shiftDay = (day: string, count: number) => {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + count);
  return date.toISOString().slice(0, 10);
};

export function demoAvailabilityRanges(profile: DemoProfile, timeZone: string, now = new Date()) {
  const earliest = new Date(now.getTime() + Math.max(0, profile.minimumNoticeMinutes || 0) * 60_000);
  // The API bounds availability by host-local calendar days (including a day
  // for guests across a time-zone boundary), rather than a fixed number of hours.
  const end = shiftDay(dayInZone(now, profile.timeZone), profile.bookingHorizonDays + 1);
  const ranges: { from: string; to: string }[] = [];
  for (let from = dayInZone(earliest, timeZone); from <= end; from = shiftDay(from, 7)) {
    const to = shiftDay(from, 6);
    ranges.push({ from, to: to < end ? to : end });
  }
  return ranges;
}

export function useDemoAvailability(profile: DemoProfile | null, timeZone: string, enabled: boolean) {
  const [days, setDays] = useState<DemoDay[]>([]);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    if (!profile?.enabled || !enabled) return;
    const controller = new AbortController();
    setDays([]);
    setPending(true);
    setError(false);
    void (async () => {
      try {
        // Render each week immediately. Sequential background requests avoid
        // multiplying database load and keep later weeks off the critical path.
        for (const range of demoAvailabilityRanges(profile, timeZone)) {
          const response = await demoBookingApi.availability(range.from, range.to, timeZone, controller.signal);
          if (controller.signal.aborted) return;
          setDays((previous) => {
            const merged = new Map(previous.map((day) => [day.date, day]));
            for (const day of response.days) if (day.slots.length) merged.set(day.date, day);
            return [...merged.values()].sort((a, b) => a.date.localeCompare(b.date));
          });
        }
      } catch {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setPending(false);
      }
    })();
    return () => controller.abort();
  }, [profile, timeZone, enabled, revision]);

  return { days, loading: pending && days.length === 0, loadingMore: pending && days.length > 0, error, refresh };
}
