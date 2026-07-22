import { APP_BASE_URL } from "@/lib/site";

const BASE = `${APP_BASE_URL}/api/public/demo-bookings`;

export type DemoProfile = {
  slug: string;
  title: string;
  enabled: boolean;
  durationMinutes: number;
  timeZone: string;
  meetingProvider: "GOOGLE_MEET" | "ZOOM" | string;
  bookingHorizonDays: number;
  minimumNoticeMinutes: number;
};

export type DemoSlot = { startAt: string; endAt: string; displayTime: string };
export type DemoDay = { date: string; slots: DemoSlot[] };
export type DemoAvailability = { timeZone: string; days: DemoDay[] };
export type DemoHold = { holdToken: string; expiresAt: string; startAt: string; endAt: string };

export type DemoBooking = {
  id: number;
  status: string;
  title: string;
  startAt: string;
  endAt: string;
  durationMinutes: number;
  timeZone: string;
  guestTimeZone: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string | null;
  companyName: string;
  guestNote?: string | null;
  meetingProvider: string;
  meetingJoinUrl?: string | null;
  manageToken: string;
  canModify: boolean;
};

const parseError = async (response: Response) => {
  const text = await response.text();
  if (!text) return `Request failed (${response.status}).`;
  try {
    const json = JSON.parse(text);
    return json.message || json.detail || json.error || text;
  } catch {
    return text;
  }
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json() as Promise<T>;
}

export const demoBookingApi = {
  profile: () => request<DemoProfile>("/profile"),
  availability: (from: string, to: string, timeZone: string) => {
    const query = new URLSearchParams({ from, to, timeZone });
    return request<DemoAvailability>(`/availability?${query.toString()}`);
  },
  hold: (startAt: string, guestTimeZone: string, previousHoldToken?: string) =>
    request<DemoHold>("/holds", {
      method: "POST",
      body: JSON.stringify({ startAt, guestTimeZone, previousHoldToken: previousHoldToken || null }),
    }),
  confirm: (payload: Record<string, unknown>) => request<DemoBooking>("/confirm", { method: "POST", body: JSON.stringify(payload) }),
  manage: (token: string) => request<DemoBooking>(`/manage/${encodeURIComponent(token)}`),
  cancel: (token: string, locale: string) => request<DemoBooking>(`/manage/${encodeURIComponent(token)}/cancel?locale=${encodeURIComponent(locale)}`, { method: "POST", body: "{}" }),
  reschedule: (token: string, holdToken: string, guestTimeZone: string, locale: string) =>
    request<DemoBooking>(`/manage/${encodeURIComponent(token)}/reschedule`, {
      method: "POST",
      body: JSON.stringify({ holdToken, guestTimeZone, locale }),
    }),
};
