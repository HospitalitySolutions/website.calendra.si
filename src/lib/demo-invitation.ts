import { getRouteKeyFromPathname, type CanonicalRouteKey } from "@/lib/localized-routes";

export const DEMO_PROMPT_DELAY = 10_000;
export const DEMO_PROMPT_SUPPRESSION = 7 * 24 * 60 * 60 * 1000;
export const DEMO_PROMPT_KEYS = {
  started: "calendra:demo-invitation:v1:started",
  seen: "calendra:demo-invitation:v1:seen",
  suppressed: "calendra:demo-invitation:v1:suppressed-until",
} as const;
const eligibleKeys = new Set<CanonicalRouteKey>([
  "home", "pricing", "calendar", "invoicing", "clientManagement", "reminders",
  "integrations", "materialManagement", "fiscalCashRegister", "groupBookings",
]);
export const isDemoInvitationPath = (pathname: string) => {
  const key = getRouteKeyFromPathname(pathname);
  return Boolean(key && eligibleKeys.has(key));
};
export const safeDemoEntry = (value: unknown) =>
  value === "popup_desktop" || value === "banner_mobile" ? value : undefined;

// Memory remains authoritative when private browsing or a browser policy blocks storage.
export const createDemoInvitationSession = () => {
  let started = 0;
  let seen = false;
  let suppressed = 0;
  const read = (kind: "localStorage" | "sessionStorage", key: string) => {
    try { return window[kind].getItem(key); } catch { return null; }
  };
  const write = (kind: "localStorage" | "sessionStorage", key: string, value: string) => {
    try { window[kind].setItem(key, value); } catch { /* In-memory frequency control still applies. */ }
  };
  return {
    allowed(now = Date.now()) {
      const until = Number(read("localStorage", DEMO_PROMPT_KEYS.suppressed));
      return !seen && read("sessionStorage", DEMO_PROMPT_KEYS.seen) !== "1"
        && Math.max(suppressed, Number.isFinite(until) ? until : 0) <= now;
    },
    deadline(now = Date.now()) {
      const stored = Number(read("sessionStorage", DEMO_PROMPT_KEYS.started));
      if (!started) {
        started = stored > 0 && stored <= now ? stored : now;
        write("sessionStorage", DEMO_PROMPT_KEYS.started, String(started));
      }
      return started + DEMO_PROMPT_DELAY;
    },
    markSeen() {
      seen = true;
      write("sessionStorage", DEMO_PROMPT_KEYS.seen, "1");
    },
    suppress(now = Date.now()) {
      seen = true;
      suppressed = now + DEMO_PROMPT_SUPPRESSION;
      write("sessionStorage", DEMO_PROMPT_KEYS.seen, "1");
      write("localStorage", DEMO_PROMPT_KEYS.suppressed, String(suppressed));
    },
  };
};

// One session controller across React remounts; never used during server rendering.
export const demoInvitationSession = createDemoInvitationSession();
