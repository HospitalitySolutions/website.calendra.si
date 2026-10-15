import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import { demoBookingApi } from "@/lib/demo-booking";
import { demoInvitationSession, isDemoInvitationPath } from "@/lib/demo-invitation";
import { getLanguageFromPathname, getRoutePath } from "@/lib/localized-routes";
import { getGoogleAnalyticsConsent, GOOGLE_ANALYTICS_CONSENT_EVENT } from "@/lib/google-analytics";
import { trackMarketingEvent } from "@/lib/marketing-events";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import "./demo-invitation.css";

const copy = {
  sl: {
    title: "Spoznajte Calendro v", time: "15 minutah",
    description: "Odkrijte, kako vam Calendra poenostavi naročanje strank, upravljanje terminov in poslovanje.",
    cta: "Rezervirajte brezplačno predstavitev", mobileCta: "Rezervirajte predstavitev",
    short: "Brezplačno in brez obveznosti.", support: "Brez obveznosti • 15 minut • Prek spleta", close: "Zapri povabilo",
  },
  en: {
    title: "Discover Calendra in", time: "15 minutes",
    description: "See how Calendra simplifies appointment booking, scheduling and business management.",
    cta: "Book a free 15-minute demo", mobileCta: "Book a free demo",
    short: "Free and without obligation.", support: "No obligation • 15 minutes • Online", close: "Close invitation",
  },
};

// Decorative product illustration: native SVG stays crisp without downloading a large bitmap.
const CalendarIllustration = () => (
  <svg className="demo-invitation-art" viewBox="0 0 240 205" aria-hidden="true" focusable="false">
    <circle cx="142" cy="89" r="86" fill="#ffead7" />
    <circle cx="108" cy="124" r="76" fill="#e0f3ff" />
    <rect x="15" y="35" width="204" height="151" rx="12" fill="white" stroke="#b9d7ff" />
    <path d="M15 59H219" stroke="#e4ecf8" />
    <circle cx="29" cy="47" r="3.5" fill="#ff7776" /><circle cx="41" cy="47" r="3.5" fill="#ffc347" /><circle cx="53" cy="47" r="3.5" fill="#59d3aa" />
    <path d="M37 77H203M37 101H203M37 125H203M37 149H203M37 173H203M37 77V173M70 77V173M103 77V173M136 77V173M169 77V173M202 77V173" stroke="#edf1f8" />
    <rect x="73" y="80" width="27" height="19" rx="4" fill="#a9d6ff" />
    <rect x="40" y="105" width="27" height="42" rx="4" fill="#a1e7d0" />
    <rect x="106" y="128" width="27" height="19" rx="4" fill="#ffd5aa" />
    <rect x="172" y="105" width="27" height="19" rx="4" fill="#a1e7d0" />
    <rect x="166" y="142" width="57" height="54" rx="14" fill="#066aff" />
    <rect x="179" y="159" width="19" height="19" rx="4" fill="white" /><path d="m199 164 9-5v19l-9-5z" fill="white" />
    <path d="m221 126 5-15m1 22 10-7" stroke="#ffad24" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const isVisible = (element: Element) => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden";
const hasBlockingInterface = () => getGoogleAnalyticsConsent() === null || Array.from(document.querySelectorAll(
  '[role="dialog"], [aria-modal="true"], dialog[open], [data-demo-invitation-blocker="true"]',
)).some(element => !element.closest("[data-demo-invitation]") && isVisible(element));

const hasMobileCtaCollision = () => {
  if (window.innerHeight < 480) return true;
  const bannerTop = document.querySelector('[data-demo-invitation="mobile"]')?.getBoundingClientRect().top ?? window.innerHeight - 230;
  return Array.from(document.querySelectorAll<HTMLAnchorElement | HTMLButtonElement>("main a[href], main button[type=submit]")).some(element => {
    const isPrimary = element.tagName === "BUTTON" || [TRIAL_SIGNUP_ROUTE, "/predstavitev", "/en/demo"].includes(element.getAttribute("href") || "");
    const box = element.getBoundingClientRect();
    return isPrimary && isVisible(element) && box.bottom > bannerTop && box.top < window.innerHeight;
  });
};

function InvitationCard({ mobile, language, onFinish }: {
  mobile: boolean; language: "sl" | "en"; onFinish: () => void;
}) {
  const c = copy[language];
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const interacted = useRef(false);
  const placement = mobile ? "demo_banner_mobile" : "demo_popup_desktop";
  const finish = useCallback((clicked: boolean) => {
    if (interacted.current) return;
    interacted.current = true;
    demoInvitationSession.suppress();
    trackMarketingEvent(clicked ? "demo_booking_cta_clicked" : "demo_prompt_dismissed", { placement, language });
    onFinish();
  }, [language, onFinish, placement]);

  useEffect(() => {
    document.documentElement.dataset.demoInvitationVisible = "true";
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }
    return () => {
      delete document.documentElement.dataset.demoInvitationVisible;
      dialog?.close();
      if (dialog) {
        document.body.style.overflow = previousOverflow;
        if (previousFocus?.isConnected && !hasBlockingInterface()) previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

  const content = <>
    <button type="button" className="demo-invitation-close" aria-label={c.close} onClick={() => finish(false)}><X size={21} aria-hidden="true" /></button>
    <div className="demo-invitation-heading">
      <h2 id={titleId}>{c.title} <span>{c.time}</span></h2>
      {!mobile && <CalendarIllustration />}
    </div>
    <p id={descriptionId} className="demo-invitation-description">{mobile ? c.short : c.description}</p>
    <Link className="demo-invitation-cta" to={getRoutePath("demo", language)} state={{ demoEntry: mobile ? "banner_mobile" : "popup_desktop" }} onClick={() => finish(true)}>
      {mobile ? c.mobileCta : c.cta}<ArrowRight size={19} aria-hidden="true" />
    </Link>
    {!mobile && <p className="demo-invitation-support">{c.support}</p>}
  </>;
  return createPortal(mobile ? <section data-demo-invitation="mobile" className="demo-invitation demo-invitation-mobile" role="region" aria-labelledby={titleId} onKeyDown={event => {
    if (event.key === "Escape") finish(false);
  }}>{content}</section> : <dialog ref={dialogRef} data-demo-invitation="desktop" className="demo-invitation demo-invitation-desktop" aria-labelledby={titleId} aria-describedby={descriptionId} onKeyDown={event => {
    if (event.key !== "Tab") return;
    const controls = event.currentTarget.querySelectorAll<HTMLElement>("button, a[href]");
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }} onCancel={event => {
    event.preventDefault(); finish(false);
  }}>{content}</dialog>, document.body);
}

export default function DemoInvitation() {
  const { pathname } = useLocation();
  const currentPath = useRef(pathname);
  currentPath.current = pathname;
  const evaluateRef = useRef<() => void>(() => undefined);
  const [presentation, setPresentation] = useState<{ mobile: boolean; language: "sl" | "en" } | null>(null);
  const finish = useCallback(() => setPresentation(null), []);
  const enabled = import.meta.env.VITE_DEMO_PROMPT_ENABLED !== "false";

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    let shown = false;
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
      const blocked = document.visibilityState !== "visible" || hasBlockingInterface()
        || Boolean(document.activeElement?.closest("form"))
        || [...dirtyForms].some(form => form.isConnected && isVisible(form));
      if (shown) {
        // A new higher-priority interaction ends this invitation for the session.
        if (!eligible || blocked || (mobileQuery.matches && hasMobileCtaCollision())) setPresentation(null);
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
      const form = event.target instanceof Element ? event.target.closest("form") : null;
      if (form) dirtyForms.add(form);
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
    ? <InvitationCard key={String(presentation.mobile)} {...presentation} onFinish={finish} /> : null;
}
