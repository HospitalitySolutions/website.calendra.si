import { lazy, Suspense, useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { demoBookingApi } from "@/lib/demo-booking";
import { demoInvitationSession, isDemoInvitationPath } from "@/lib/demo-invitation";
import { getLanguageFromPathname } from "@/lib/localized-routes";
import { GOOGLE_ANALYTICS_CONSENT_EVENT } from "@/lib/google-analytics";
import { trackMarketingEvent } from "@/lib/marketing-events";
import { hasBlockingInterface, hasMobileCtaCollision, isInsideInvitation, isVisible, type Language } from "./demo-invitation-dom";

// The card (design, copy, e-novice form and styles) is only fetched when an invitation is due.
const loadInvitationCard = () => import("./DemoInvitationCard");
const InvitationCard = lazy(loadInvitationCard);

export default function DemoInvitation() {
  const { pathname } = useLocation();
  const currentPath = useRef(pathname);
  currentPath.current = pathname;
  const evaluateRef = useRef<() => void>(() => undefined);
  const [presentation, setPresentation] = useState<{ mobile: boolean; language: Language } | null>(null);
  const finish = useCallback(() => setPresentation(null), []);
  const enabled = import.meta.env.VITE_DEMO_PROMPT_ENABLED !== "false";

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    let shown = false;
    // Once the visitor works inside the invitation (e.g. types an email), only navigation or
    // the visitor themself may close it: a phone keyboard must not count as a CTA collision.
    let engaged = false;
    let profileRequested = false;
    let profileReady = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    const dirtyForms = new Set<HTMLFormElement>();
    const mobileQuery = window.matchMedia("(max-width: 639px)");
    const evaluate = () => {
      if (!active) return;
      const eligible = isDemoInvitationPath(currentPath.current);
      const activeForm = document.activeElement?.closest("form");
      const blocked = document.visibilityState !== "visible" || hasBlockingInterface()
        || Boolean(activeForm && !isInsideInvitation(activeForm))
        || [...dirtyForms].some(form => form.isConnected && isVisible(form));
      if (shown) {
        engaged ||= isInsideInvitation(document.activeElement) && document.activeElement?.tagName === "INPUT";
        // A new higher-priority interaction ends this invitation for the session.
        if (!eligible || (!engaged && (blocked || (mobileQuery.matches && hasMobileCtaCollision())))) setPresentation(null);
        return;
      }
      if (!eligible || !demoInvitationSession.allowed()) return;
      const remaining = demoInvitationSession.deadline() - Date.now();
      if (remaining > 0) {
        if (!timer) timer = setTimeout(() => { timer = undefined; evaluate(); }, remaining);
        return;
      }
      if (blocked) return;
      if (!profileRequested) {
        profileRequested = true;
        void loadInvitationCard().catch(() => undefined);
        controller = new AbortController();
        timeout = setTimeout(() => controller?.abort(), 8000);
        demoBookingApi.profile(controller.signal).then(profile => {
          if (!active) return;
          profileReady = profile.enabled && profile.durationMinutes === 15;
          evaluate();
        }).catch(() => { /* Fail closed: never advertise an unavailable or different-duration demo. */ })
          .finally(() => clearTimeout(timeout));
        return;
      }
      if (!profileReady || (mobileQuery.matches && hasMobileCtaCollision())) return;
      shown = true;
      demoInvitationSession.markSeen();
      const mobile = mobileQuery.matches;
      const language = getLanguageFromPathname(currentPath.current);
      setPresentation({ mobile, language });
      trackMarketingEvent("demo_prompt_impression", { placement: mobile ? "demo_banner_mobile" : "demo_popup_desktop", language });
    };
    const onInput = (event: Event) => {
      if (isInsideInvitation(event.target)) engaged = true;
      else {
        const form = event.target instanceof Element ? event.target.closest("form") : null;
        if (form) dirtyForms.add(form);
      }
      evaluate();
    };
    const onFocus = () => queueMicrotask(evaluate);
    const onResize = () => {
      setPresentation(current => current ? { ...current, mobile: mobileQuery.matches } : null);
      evaluate();
    };
    evaluateRef.current = evaluate;
    const observer = new MutationObserver(evaluate);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["open", "hidden", "aria-modal", "data-demo-invitation-blocker"] });
    document.addEventListener("visibilitychange", evaluate);
    document.addEventListener("input", onInput);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", onFocus);
    window.addEventListener(GOOGLE_ANALYTICS_CONSENT_EVENT, evaluate);
    window.addEventListener("storage", evaluate);
    // Scroll only rechecks collisions AFTER the deadline; it never starts or advances the timer.
    window.addEventListener("scroll", evaluate, { passive: true });
    window.addEventListener("resize", onResize);
    evaluate();
    return () => {
      active = false;
      clearTimeout(timer); clearTimeout(timeout); controller?.abort(); observer.disconnect();
      document.removeEventListener("visibilitychange", evaluate);
      document.removeEventListener("input", onInput);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", onFocus);
      window.removeEventListener(GOOGLE_ANALYTICS_CONSENT_EVENT, evaluate);
      window.removeEventListener("storage", evaluate);
      window.removeEventListener("scroll", evaluate);
      window.removeEventListener("resize", onResize);
    };
  }, [enabled]);
  useEffect(() => evaluateRef.current(), [pathname]);

  return presentation && isDemoInvitationPath(pathname)
    ? <Suspense fallback={null}><InvitationCard key={String(presentation.mobile)} {...presentation} onFinish={finish} /></Suspense> : null;
}
