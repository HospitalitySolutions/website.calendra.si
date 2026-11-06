import { type FormEvent, useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight, Bell, CalendarCheck, CircleCheck, Mail, X } from "lucide-react";
import { demoInvitationSession } from "@/lib/demo-invitation";
import { getRoutePath } from "@/lib/localized-routes";
import { trackMarketingEvent } from "@/lib/marketing-events";
import { isNewsletterSignupEnabled, isValidNewsletterEmail, subscribeToNewsletter } from "@/lib/newsletter";
import { hasBlockingInterface, type Language } from "./demo-invitation-dom";
import "./demo-invitation.css";

// Loaded on demand by DemoInvitation: visitors who never see the invitation do not download it.

const copy = {
  sl: {
    eyebrow: "Brezplačna predstavitev",
    title: "Spoznajte Calendro v", time: "15 minutah",
    description: "Pokažemo vam, kako Calendra poenostavi naročanje strank, upravljanje terminov in poslovanje — prilagojeno vaši dejavnosti.",
    cta: "Rezervirajte brezplačno predstavitev", mobileCta: "Rezervirajte predstavitev",
    facts: ["Brez obveznosti", "15 minut", "Prek spleta"], mobileFacts: ["Brezplačno", "Brez obveznosti", "Prek spleta"],
    close: "Zapri povabilo",
    reminder: ["Opomnik poslan", "SMS · jutri ob 10:00"], booking: ["Nova rezervacija", "Pilates · 17:30"],
    caption: ["15-minutni klic v živo", "prek spleta, z vašimi vprašanji"],
    news: {
      title: "Še niste pripravljeni? Prejemajte e-novice.", mobileTitle: "E-novice Calendre",
      lead: "Nasveti za več rezervacij in novosti v Calendri. Največ 2× na mesec.", mobileLead: "Nasveti in novosti, največ 2× na mesec.",
      toggle: "Ali prejemajte e-novice", label: "E-poštni naslov", placeholder: "vas@email.si",
      submit: "Prijava", mobileSubmit: "Prijava na e-novice", submitting: "Prijavljam …",
      consent: "S prijavo soglašate s prejemanjem e-novic in obvestil o novostih Calendre. Prijavo potrdite v e-pošti, odjava je mogoča kadar koli.",
      privacy: "Politika zasebnosti", invalid: "Vnesite veljaven e-poštni naslov.",
      successTitle: "Skoraj končano!", successText: "Poslali smo vam e-pošto. Kliknite povezavo v njej, da potrdite prijavo.",
      errorTitle: "Prijava trenutno ni uspela.", errorText: "Poskusite znova čez nekaj trenutkov.",
    },
  },
  en: {
    eyebrow: "Free demo",
    title: "Discover Calendra in", time: "15 minutes",
    description: "We'll show you how Calendra simplifies appointment booking, scheduling and business management — tailored to your business.",
    cta: "Book a free 15-minute demo", mobileCta: "Book a free demo",
    facts: ["No obligation", "15 minutes", "Online"], mobileFacts: ["Free", "No obligation", "Online"],
    close: "Close invitation",
    reminder: ["Reminder sent", "SMS · tomorrow at 10:00"], booking: ["New booking", "Pilates · 17:30"],
    caption: ["A live 15-minute call", "online, with your questions"],
    news: {
      title: "Not ready yet? Get the newsletter.", mobileTitle: "Calendra newsletter",
      lead: "Tips for more bookings and what's new in Calendra. At most twice a month.", mobileLead: "Tips and news, at most twice a month.",
      toggle: "Or get the newsletter", label: "Email address", placeholder: "you@example.com",
      submit: "Subscribe", mobileSubmit: "Subscribe to the newsletter", submitting: "Subscribing …",
      consent: "By subscribing you agree to receive Calendra's newsletter and product updates. Confirm in the email we send you; unsubscribe at any time.",
      privacy: "Privacy policy", invalid: "Enter a valid email address.",
      successTitle: "Almost done!", successText: "We've sent you an email. Click the link in it to confirm your subscription.",
      errorTitle: "We couldn't subscribe you right now.", errorText: "Please try again in a moment.",
    },
  },
};

const SCREENSHOT = "/homepage/calendar-mobile.webp";

// Decorative product scene: the real mobile calendar plus two example notifications.
const ProductVisual = ({ language }: { language: Language }) => {
  const c = copy[language];
  return (
    <div className="demo-invitation-visual" aria-hidden="true">
      <div className="demo-invitation-chip demo-invitation-chip-reminder"><i><Bell size={17} /></i><span><b>{c.reminder[0]}</b>{c.reminder[1]}</span></div>
      <div className="demo-invitation-phone"><img src={SCREENSHOT} width={367} height={819} alt="" decoding="async" /></div>
      <div className="demo-invitation-chip demo-invitation-chip-booking"><i><CalendarCheck size={17} /></i><span><b>{c.booking[0]}</b>{c.booking[1]}</span></div>
      <p className="demo-invitation-caption"><b>{c.caption[0]}</b>{c.caption[1]}</p>
    </div>
  );
};

type NewsletterState = "idle" | "submitting" | "success" | "invalid" | "error";

export function NewsletterForm({ language, compact, focusOnMount = false }: { language: Language; compact: boolean; focusOnMount?: boolean }) {
  const c = copy[language].news;
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<NewsletterState>("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const consentId = useId();
  const errorId = useId();

  useEffect(() => { if (focusOnMount) inputRef.current?.focus(); }, [focusOnMount]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "submitting") return;
    if (!isValidNewsletterEmail(email)) {
      setState("invalid");
      inputRef.current?.focus();
      return;
    }
    setState("submitting");
    try {
      await subscribeToNewsletter({ email, locale: language, website });
      setState("success");
      trackMarketingEvent("newsletter_signup_completed", { placement: compact ? "demo_banner_mobile" : "demo_popup_desktop", language });
    } catch (error) {
      setState(error instanceof Error && error.message === "newsletter_invalid" ? "invalid" : "error");
    }
  };

  if (state === "success") {
    return (
      <div className="demo-invitation-news">
        <div className="demo-invitation-note demo-invitation-note-ok" role="status">
          <CircleCheck size={18} aria-hidden="true" /><p><strong>{c.successTitle}</strong> {c.successText}</p>
        </div>
      </div>
    );
  }

  const submitting = state === "submitting";
  return (
    <form className="demo-invitation-news" noValidate aria-labelledby={titleId} onSubmit={submit}>
      <div className="demo-invitation-news-head">
        <span className="demo-invitation-news-icon" aria-hidden="true"><Mail size={18} /></span>
        <div>
          <p id={titleId} className="demo-invitation-news-title">{compact ? c.mobileTitle : c.title}</p>
          <p className="demo-invitation-news-lead">{compact ? c.mobileLead : c.lead}</p>
        </div>
      </div>
      <div className="demo-invitation-news-row">
        <input
          ref={inputRef} type="email" name="email" inputMode="email" autoComplete="email" spellCheck={false}
          className="demo-invitation-field" placeholder={c.placeholder} aria-label={c.label} value={email} disabled={submitting}
          aria-invalid={state === "invalid" || undefined} aria-describedby={state === "invalid" ? `${errorId} ${consentId}` : consentId}
          onChange={event => { setEmail(event.target.value); if (state === "invalid" || state === "error") setState("idle"); }}
        />
        <button type="submit" className="demo-invitation-subscribe" disabled={submitting} aria-busy={submitting || undefined}>
          {submitting && <span className="demo-invitation-spinner" aria-hidden="true" />}
          {submitting ? c.submitting : compact ? c.mobileSubmit : c.submit}
        </button>
      </div>
      <div className="demo-invitation-hp" aria-hidden="true">
        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></label>
      </div>
      {state === "invalid" && <p id={errorId} className="demo-invitation-field-error" role="alert">{c.invalid}</p>}
      {state === "error" && (
        <div className="demo-invitation-note demo-invitation-note-error" role="alert">
          <AlertCircle size={18} aria-hidden="true" /><p><strong>{c.errorTitle}</strong> {c.errorText}</p>
        </div>
      )}
      <p id={consentId} className="demo-invitation-consent">
        {c.consent} <Link to={getRoutePath("privacy", language)} target="_blank" rel="noopener">{c.privacy}</Link>
      </p>
    </form>
  );
}

export default function InvitationCard({ mobile, language, onFinish }: {
  mobile: boolean; language: Language; onFinish: () => void;
}) {
  const c = copy[language];
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const interacted = useRef(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const newsletter = isNewsletterSignupEnabled();
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

  const heading = <h2 id={titleId}>{c.title} <span className="demo-invitation-time">{c.time}</span><span className="demo-invitation-dot" aria-hidden="true">.</span></h2>;
  const cta = (
    <Link className="demo-invitation-cta" to={getRoutePath("demo", language)} state={{ demoEntry: mobile ? "banner_mobile" : "popup_desktop" }} onClick={() => finish(true)}>
      {mobile ? c.mobileCta : c.cta}<ArrowRight size={19} aria-hidden="true" />
    </Link>
  );
  const facts = (items: string[]) => (
    <ul className="demo-invitation-facts">{items.map(item => <li key={item}><CircleCheck size={16} aria-hidden="true" />{item}</li>)}</ul>
  );
  const close = <button type="button" className="demo-invitation-close" aria-label={c.close} onClick={() => finish(false)}><X size={20} aria-hidden="true" /></button>;

  if (mobile) {
    return createPortal(
      <section data-demo-invitation="mobile" className="demo-invitation demo-invitation-mobile" role="region" aria-labelledby={titleId} onKeyDown={event => {
        if (event.key === "Escape") finish(false);
      }}>
        <div className="demo-invitation-grab" aria-hidden="true" />
        {close}
        <div className="demo-invitation-mobile-top">
          <span className="demo-invitation-thumb" aria-hidden="true"><img src={SCREENSHOT} width={367} height={819} alt="" decoding="async" /></span>
          {heading}
        </div>
        {cta}
        {newsletter && newsletterOpen
          ? <NewsletterForm language={language} compact focusOnMount />
          : <>
            {facts(c.mobileFacts)}
            {newsletter && <button type="button" className="demo-invitation-toggle" aria-expanded="false" onClick={() => setNewsletterOpen(true)}>
              <Mail size={17} aria-hidden="true" />{c.news.toggle}
            </button>}
          </>}
      </section>,
      document.body,
    );
  }

  return createPortal(
    <dialog ref={dialogRef} data-demo-invitation="desktop" className="demo-invitation demo-invitation-desktop" aria-labelledby={titleId} aria-describedby={descriptionId} onKeyDown={event => {
      if (event.key !== "Tab") return;
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled])"))
        .filter(control => control.tabIndex >= 0 && !control.closest("[aria-hidden='true']"));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }} onCancel={event => {
      event.preventDefault(); finish(false);
    }}>
      {close}
      <ProductVisual language={language} />
      <div className="demo-invitation-body">
        <p className="demo-invitation-eyebrow">{c.eyebrow}</p>
        {heading}
        <p id={descriptionId} className="demo-invitation-description">{c.description}</p>
        {cta}
        {facts(c.facts)}
        {newsletter && <NewsletterForm language={language} compact={false} />}
      </div>
    </dialog>,
    document.body,
  );
}
