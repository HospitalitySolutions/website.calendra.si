import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useLocation, useParams } from "react-router-dom";
import { format } from "date-fns";
import { enGB, sl } from "date-fns/locale";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Check,
  CheckCircle2,
  Clock3,
  Globe2,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Video,
  XCircle,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { demoBookingApi, type DemoBooking, type DemoHold, type DemoProfile, type DemoSlot } from "@/lib/demo-booking";
import { useDemoAvailability } from "@/hooks/use-demo-availability";
import { trackMarketingEvent } from "@/lib/marketing-events";
import { useSiteLanguage } from "@/lib/site-language";
import { sanitizeAcquisition } from "@/lib/acquisition";
import { safeDemoEntry } from "@/lib/demo-invitation";
import "@/styles/demo-booking.css";

const detectedTimeZone = () => typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Ljubljana" : "Europe/Ljubljana";

const copy = {
  sl: {
    eyebrow: "Brezplačna predstavitev",
    title: "Rezervirajte osebno predstavitev Calendre",
    subtitle: "Izberite termin za brezplačen video klic.",
    duration: "Trajanje",
    video: "Google Meet",
    timezone: "Časovni pas",
    pickDate: "Izberite datum",
    pickTime: "Izberite uro",
    noSlots: "Na ta dan ni prostih terminov.",
    next: "Nadaljujte",
    nextHelp: "Nato vnesete svoje podatke.",
    steps: ["Termin", "Vaši podatki", "Potrditev"],
    reassurance: "Brezplačno in brez obveznosti. Povezavo do klica prejmete po e-pošti.",
    emptySelection: "Izberite datum in uro.",
    noAvailability: "V tem obdobju ni prostih terminov. Pišite nam in skupaj poiščemo termin.",
    loadingMore: "Nalagam naslednje termine …",
    retry: "Poskusi znova",
    back: "Nazaj na termine",
    details: "Vaši podatki",
    detailsHelp: "Podatke potrebujemo za potrditev termina in koledarsko vabilo.",
    name: "Ime in priimek",
    email: "E-pošta",
    company: "Podjetje ali organizacija",
    phone: "Telefon (neobvezno)",
    note: "Kaj bi želeli posebej videti? (neobvezno)",
    notePlaceholder: "Na primer: naročanje strank, računi, mobilna aplikacija ...",
    privacy: "Podatke bomo uporabili samo za organizacijo predstavitve in nadaljnjo komunikacijo o vašem povpraševanju.",
    confirm: "Potrdi rezervacijo",
    confirmFailedTitle: "Rezervacija ni uspela",
    confirmFailedText: "Žal rezervacije nismo mogli potrditi. Prosimo, kontaktirajte podporo po e-pošti ali telefonu.",
    contactSupport: "Kontaktirajte podporo",
    contactSupportText: "Z veseljem vam pomagamo in skupaj poiščemo nov termin.",
    retryConfirm: "Poskusi znova rezervirati",
    selected: "Izbrani termin",
    loading: "Nalagam proste termine …",
    unavailable: "Spletno naročanje predstavitve trenutno ni na voljo.",
    error: "Terminov ni bilo mogoče naložiti.",
    confirmed: "Predstavitev je rezervirana",
    confirmedText: "Potrdilo in povezavo do video klica smo poslali na vaš e-poštni naslov.",
    join: "Pridruži se klicu",
    addCalendar: "Dodaj v koledar",
    manage: "Upravljaj rezervacijo",
    managementTitle: "Vaša predstavitev Calendre",
    cancel: "Prekliči termin",
    cancelConfirm: "Ali res želite preklicati rezervacijo?",
    cancelled: "Termin je preklican",
    reschedule: "Prestavi termin",
    chooseNew: "Izberite nov termin",
    saveNew: "Potrdi novi termin",
    platform: "Platforma",
    previousDates: "Prejšnji datumi",
    nextDates: "Naslednji datumi",
    bookedFor: "Rezervirano za",
    pageError: "Rezervacije ni bilo mogoče najti ali povezava ni več veljavna.",
  },
  en: {
    eyebrow: "Free product demo",
    title: "Book a personal Calendra demo",
    subtitle: "Choose a time for a free video call.",
    duration: "Duration",
    video: "Google Meet",
    timezone: "Time zone",
    pickDate: "Choose a date",
    pickTime: "Choose a time",
    noSlots: "No available times on this day.",
    next: "Continue",
    nextHelp: "Enter your details in the next step.",
    steps: ["Time", "Your details", "Confirmation"],
    reassurance: "Free, with no obligation. We will email you the call link.",
    emptySelection: "Choose a date and time.",
    noAvailability: "No times are available in this period. Email us to find a suitable time.",
    loadingMore: "Loading later dates …",
    retry: "Try again",
    back: "Back to times",
    details: "Your details",
    detailsHelp: "We need these details to confirm the call and send a calendar invitation.",
    name: "Full name",
    email: "Email",
    company: "Company or organisation",
    phone: "Phone (optional)",
    note: "What would you particularly like to see? (optional)",
    notePlaceholder: "For example: online booking, invoices, mobile app ...",
    privacy: "We will only use your details to organise the demo and follow up on your enquiry.",
    confirm: "Confirm booking",
    confirmFailedTitle: "Booking failed",
    confirmFailedText: "Unfortunately, we could not confirm your booking. Please contact support by email or phone.",
    contactSupport: "Contact support",
    contactSupportText: "We will be happy to help and find another suitable time with you.",
    retryConfirm: "Try booking again",
    selected: "Selected time",
    loading: "Loading available times …",
    unavailable: "Online demo booking is currently unavailable.",
    error: "Available times could not be loaded.",
    confirmed: "Your demo is booked",
    confirmedText: "We sent the confirmation and video-call link to your email address.",
    join: "Join the call",
    addCalendar: "Add to calendar",
    manage: "Manage booking",
    managementTitle: "Your Calendra demo",
    cancel: "Cancel booking",
    cancelConfirm: "Are you sure you want to cancel this booking?",
    cancelled: "The booking is cancelled",
    reschedule: "Reschedule",
    chooseNew: "Choose a new time",
    saveNew: "Confirm new time",
    platform: "Platform",
    previousDates: "Previous dates",
    nextDates: "Next dates",
    bookedFor: "Booked for",
    pageError: "The booking could not be found or this link is no longer valid.",
  },
} as const;

const SUPPORT_EMAIL = "info@calendra.si";
const SUPPORT_PHONE = "040 641 644";
const SUPPORT_PHONE_LINK = "+38640641644";

const formatDateTime = (value: string, language: "sl" | "en", timeZone?: string) => new Intl.DateTimeFormat(language === "sl" ? "sl-SI" : "en-GB", {
  weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone,
}).format(new Date(value));

const DATE_PAGE_SIZE = 5;

const formatSlotStart = (value: string, language: "sl" | "en", timeZone: string) => new Intl.DateTimeFormat(language === "sl" ? "sl-SI" : "en-GB", {
  hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone,
}).format(new Date(value));

const meetingProviderLabel = (provider?: string | null) => provider === "ZOOM" ? "Zoom" : "Google Meet";

const downloadIcs = (booking: DemoBooking) => {
  const icsDate = (value: string) => new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Calendra//Demo booking//SL", "BEGIN:VEVENT",
    `UID:calendra-demo-${booking.id}@calendra.si`, `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(booking.startAt)}`, `DTEND:${icsDate(booking.endAt)}`,
    `SUMMARY:${booking.title || "Calendra demo"}`,
    booking.meetingJoinUrl ? `URL:${booking.meetingJoinUrl}` : "",
    booking.meetingJoinUrl ? `DESCRIPTION:Video call: ${booking.meetingJoinUrl}` : "",
    "END:VEVENT", "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
  const url = URL.createObjectURL(new Blob([lines], { type: "text/calendar;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "calendra-predstavitev.ics";
  anchor.click();
  URL.revokeObjectURL(url);
};

const DemoBookingPage = () => {
  const { token } = useParams();
  const { state } = useLocation();
  const entryPoint = safeDemoEntry(state?.demoEntry);
  const { language } = useSiteLanguage();
  const t = copy[language];
  const locale = language === "sl" ? sl : enGB;
  const timeZone = useMemo(detectedTimeZone, []);
  const [profile, setProfile] = useState<DemoProfile | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [datePage, setDatePage] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<DemoSlot | null>(null);
  const [hold, setHold] = useState<DemoHold | null>(null);
  const [booking, setBooking] = useState<DemoBooking | null>(null);
  const [step, setStep] = useState<"slots" | "details" | "confirmed">("slots");
  const [rescheduling, setRescheduling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageRevision, setPageRevision] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmationFailed, setConfirmationFailed] = useState(false);
  const [form, setForm] = useState({ guestName: "", guestEmail: "", guestPhone: "", companyName: "", guestNote: "" });
  const selectedSummaryRef = useRef<HTMLElement | null>(null);
  const confirmationLocked = useRef(false);
  const { days, loading: slotsLoading, loadingMore, error: availabilityError, refresh: refreshAvailability } = useDemoAvailability(profile, timeZone, !token || rescheduling);
  const loadingSlots = loading || slotsLoading;

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    (async () => {
      try {
        if (token) {
          const [managed, currentProfile] = await Promise.all([
            demoBookingApi.manage(token),
            demoBookingApi.profile(controller.signal).catch(() => null),
          ]);
          if (!active) return;
          setBooking(managed);
          setProfile(currentProfile);
          setStep("confirmed");
        } else {
          const currentProfile = await demoBookingApi.profile(controller.signal);
          if (!active) return;
          setProfile(currentProfile);
          trackMarketingEvent("demo_booking_page_viewed", { language });
        }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : (token ? t.pageError : t.error));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; controller.abort(); };
  }, [token, language, pageRevision, t.error, t.pageError]);

  useEffect(() => {
    if (!days.length) return;
    const index = days.findIndex((day) => day.date === selectedDate);
    if (index < 0) {
      setSelectedDate(days[0].date);
      setDatePage(0);
    } else {
      setDatePage(Math.floor(index / DATE_PAGE_SIZE));
    }
  }, [days, selectedDate]);

  const selectedDay = days.find((day) => day.date === selectedDate) || days[0];
  const datePageCount = Math.max(1, Math.ceil(days.length / DATE_PAGE_SIZE));
  const visibleDays = days.slice(datePage * DATE_PAGE_SIZE, (datePage + 1) * DATE_PAGE_SIZE);
  const visibleDateRange = visibleDays.length > 0
    ? `${format(new Date(`${visibleDays[0].date}T12:00:00`), "d. MMM", { locale })} – ${format(new Date(`${visibleDays[visibleDays.length - 1].date}T12:00:00`), "d. MMM", { locale })}`
    : "";

  const moveDatePage = (direction: -1 | 1) => {
    const nextPage = Math.min(datePageCount - 1, Math.max(0, datePage + direction));
    if (nextPage === datePage) return;
    const nextDays = days.slice(nextPage * DATE_PAGE_SIZE, (nextPage + 1) * DATE_PAGE_SIZE);
    const firstAvailable = nextDays.find((day) => day.slots.length > 0) || nextDays[0];
    setDatePage(nextPage);
    setSelectedDate(firstAvailable?.date || "");
    setSelectedSlot(null);
  };

  const chooseSlot = async (slot: DemoSlot) => {
    setSaving(true);
    setError("");
    setSelectedSlot(null);
    setConfirmationFailed(false);
    try {
      const nextHold = await demoBookingApi.hold(slot.startAt, timeZone, hold?.holdToken);
      setSelectedSlot(slot);
      setHold(nextHold);
      trackMarketingEvent("demo_booking_slot_selected", { language });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t.error);
      refreshAvailability();
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (step !== "slots" || rescheduling || !selectedSlot || !hold) return;
    if (typeof window === "undefined" || !window.matchMedia("(max-width: 1023px)").matches) return;

    const frame = window.requestAnimationFrame(() => {
      selectedSummaryRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hold, rescheduling, selectedSlot, step]);

  const openDetails = () => {
    if (!selectedSlot || !hold) return;
    setConfirmationFailed(false);
    setStep("details");
    trackMarketingEvent("demo_booking_form_started", { language });
  };

  useEffect(() => {
    if ((step !== "details" && step !== "confirmed") || typeof window === "undefined") return;
    if (step === "confirmed" && !window.matchMedia("(max-width: 1023px)").matches) return;

    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [step]);

  const confirm = async (event: FormEvent) => {
    event.preventDefault();
    if (!hold || saving || step === "confirmed" || confirmationLocked.current) return;
    confirmationLocked.current = true;
    setSaving(true);
    setError("");
    setConfirmationFailed(false);
    try {
      const params = sanitizeAcquisition(window.location.search);
      const result = await demoBookingApi.confirm({
        holdToken: hold.holdToken,
        ...form,
        guestTimeZone: timeZone,
        locale: language,
        utmSource: params.get("utm_source"),
        utmMedium: params.get("utm_medium"),
        utmCampaign: params.get("utm_campaign"),
      });
      if (result.status !== "CONFIRMED" || !result.id) throw new Error("Demo was not confirmed");
      setBooking(result);
      setConfirmationFailed(false);
      setStep("confirmed");
      trackMarketingEvent("demo_booking_confirmed", { language, meeting_provider: result.meetingProvider, entry_point: entryPoint });
    } catch (cause) {
      confirmationLocked.current = false;
      setConfirmationFailed(true);
      if (import.meta.env.DEV) console.error("Demo booking confirmation failed", cause);
    } finally {
      setSaving(false);
    }
  };

  const cancelBooking = async () => {
    if (!booking || !window.confirm(t.cancelConfirm)) return;
    setSaving(true);
    setError("");
    try {
      const result = await demoBookingApi.cancel(booking.manageToken, language);
      setBooking(result);
      setRescheduling(false);
      trackMarketingEvent("demo_booking_cancelled", { language });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t.pageError);
    } finally { setSaving(false); }
  };

  const startReschedule = async () => {
    setError("");
    setSaving(true);
    try {
      const currentProfile = profile || await demoBookingApi.profile();
      if (!currentProfile.enabled) throw new Error(t.unavailable);
      setProfile(currentProfile);
      setSelectedSlot(null);
      setHold(null);
      setRescheduling(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t.error);
    } finally { setSaving(false); }
  };

  const saveReschedule = async () => {
    if (!booking || !hold) return;
    setSaving(true);
    setError("");
    try {
      const result = await demoBookingApi.reschedule(booking.manageToken, hold.holdToken, timeZone, language);
      setBooking(result);
      setRescheduling(false);
      setSelectedSlot(null);
      setHold(null);
      trackMarketingEvent("demo_booking_rescheduled", { language });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t.error);
    } finally { setSaving(false); }
  };

  const slotPicker = (
    <div className="demo-slot-picker" aria-busy={loadingSlots}>
      <section>
        <div className="demo-date-heading">
          <h2><span className="demo-heading-icon"><CalendarDays aria-hidden="true" /></span>{t.pickDate}</h2>
          <div className="demo-date-navigation">
            <Button type="button" variant="outline" size="icon" className="h-10 w-10 rounded-xl" disabled={loadingSlots || saving || datePage <= 0} onClick={() => moveDatePage(-1)} aria-label={t.previousDates}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="demo-date-range">{loadingSlots ? <span className="demo-skeleton demo-range-skeleton" /> : visibleDateRange || "—"}</span>
            <Button type="button" variant="outline" size="icon" className="h-10 w-10 rounded-xl" disabled={loadingSlots || saving || datePage >= datePageCount - 1} onClick={() => moveDatePage(1)} aria-label={t.nextDates}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="demo-date-grid">
          {loadingSlots ? Array.from({ length: 5 }, (_, index) => <div key={index} className="demo-skeleton demo-date-skeleton" aria-hidden="true" />) : visibleDays.map((day) => {
            const parsed = new Date(`${day.date}T12:00:00`);
            const active = selectedDay?.date === day.date;
            return <button key={day.date} type="button" disabled={saving} aria-pressed={active} aria-label={format(parsed, "EEEE, d. MMMM yyyy", { locale })} onClick={() => { setSelectedDate(day.date); setSelectedSlot(null); }} className={`demo-date ${active ? "is-selected" : ""}`}>
              <span className="demo-weekday">{format(parsed, "EEE", { locale })}</span>
              <span className="demo-day-number">{format(parsed, "d")}</span>
              <span className="demo-month">{format(parsed, "MMM", { locale })}</span>
            </button>;
          })}
        </div>
      </section>
      <section>
        <h2><span className="demo-heading-icon"><Clock3 aria-hidden="true" /></span>{t.pickTime}</h2>
        {loadingSlots ? <><div className="demo-time-grid" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <div key={index} className="demo-skeleton demo-time-skeleton" />)}</div><p className="demo-loading-label" role="status">{t.loading}</p></> : selectedDay?.slots.length ? <div className="demo-time-grid">
          {selectedDay.slots.map((slot) => <button key={slot.startAt} type="button" disabled={saving} aria-pressed={selectedSlot?.startAt === slot.startAt} onClick={() => void chooseSlot(slot)} className={`demo-time ${selectedSlot?.startAt === slot.startAt ? "is-selected" : ""}`}>{formatSlotStart(slot.startAt, language, timeZone)}{selectedSlot?.startAt === slot.startAt && <Check className="h-4 w-4" aria-hidden="true" />}</button>)}
        </div> : !availabilityError && <div className="demo-empty">{t.noAvailability} <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></div>}
      </section>
      {error && <p role="alert" className="demo-availability-error">{error}</p>}
      {availabilityError && <div role="alert" className="demo-availability-error"><p>{t.error}</p><Button variant="outline" onClick={refreshAvailability}><RefreshCw className="mr-2 h-4 w-4" />{t.retry}</Button></div>}
      <div className="demo-picker-meta"><span><Globe2 aria-hidden="true" />{t.timezone}: {timeZone}</span>{loadingMore && <span role="status" className="demo-loading-more">{t.loadingMore}</span>}</div>
    </div>
  );

  return <div className="marketing-page demo-booking-page min-h-screen bg-white">
    <Navbar />
    <main>
      {!token && step !== "confirmed" && <header className="demo-intro demo-container">
        <div><h1>{t.title}</h1><p>{t.subtitle}</p></div>
        <div className="demo-intro-facts">
          {profile?.durationMinutes ? <span><Clock3 aria-hidden="true" />{profile.durationMinutes} {language === "sl" ? "minut" : "minutes"}</span> : null}
          {profile && <span><Video aria-hidden="true" />{meetingProviderLabel(profile.meetingProvider)}</span>}
        </div>
      </header>}
      <section className="demo-booking-band"><div className="demo-container">
      {!token && <ol className="demo-steps" aria-label={language === "sl" ? "Koraki rezervacije" : "Booking steps"}>{t.steps.map((label, index) => {
        const active = index === (step === "slots" ? 0 : step === "details" ? 1 : 2);
        return <li key={label} aria-current={active ? "step" : undefined}><span>{index + 1}</span>{label}</li>;
      })}</ol>}
      {loading && token ? <div className="demo-management-loading" role="status"><Loader2 className="h-6 w-6 animate-spin text-primary motion-reduce:animate-none" />{t.loading}</div> : error && !profile && !booking ? <div className="mx-auto max-w-xl rounded-3xl border border-destructive/20 bg-card p-8 text-center shadow-soft"><XCircle className="mx-auto h-12 w-12 text-destructive" />{token ? <h1 className="mt-4 font-display text-2xl font-medium">{t.pageError}</h1> : <h2 className="mt-4 font-display text-xl font-medium">{t.unavailable}</h2>}<p className="mt-2 text-muted-foreground">{error}</p><Button variant="outline" className="mt-4" onClick={() => setPageRevision((value) => value + 1)}>{t.retry}</Button></div> : !token && profile && !profile.enabled ? <div className="mx-auto max-w-xl rounded-3xl border bg-card p-10 text-center shadow-soft"><CalendarDays className="mx-auto h-12 w-12 text-muted-foreground" /><h2 className="mt-4 font-display text-xl font-medium">{t.unavailable}</h2></div> : step === "confirmed" && booking ? (
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-border/70 bg-card p-4 shadow-[0_28px_80px_-40px_hsl(var(--primary)/0.5)] sm:p-6 md:p-10">
          <div className="text-center">
            <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full sm:h-16 sm:w-16 ${booking.status === "CANCELLED" ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-600"}`}>{booking.status === "CANCELLED" ? <XCircle className="h-7 w-7 sm:h-9 sm:w-9" /> : <CheckCircle2 className="h-7 w-7 sm:h-9 sm:w-9" />}</span>
            <h1 className="mt-3 font-display text-2xl font-extrabold text-foreground sm:mt-5 sm:text-3xl">{token ? t.managementTitle : booking.status === "CANCELLED" ? t.cancelled : t.confirmed}</h1>
            {!token && booking.status !== "CANCELLED" && <p className="mx-auto mt-2 max-w-xl text-sm leading-5 text-muted-foreground sm:mt-3 sm:text-base">{t.confirmedText}</p>}
          </div>
          <div className="mt-4 rounded-2xl border border-border/70 bg-background p-4 sm:mt-8 sm:p-5 md:p-6">
            <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-5">
              <div className="flex min-w-0 gap-2 sm:gap-3"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" /><div className="min-w-0"><span className="text-xs text-muted-foreground sm:text-sm">{t.bookedFor}</span><strong className="mt-0.5 block text-sm leading-5 text-foreground sm:mt-1 sm:text-base">{formatDateTime(booking.startAt, language, booking.guestTimeZone || timeZone)}</strong></div></div>
              <div className="flex min-w-0 gap-2 sm:gap-3"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" /><div><span className="text-xs text-muted-foreground sm:text-sm">{t.duration}</span><strong className="mt-0.5 block text-sm text-foreground sm:mt-1 sm:text-base">{booking.durationMinutes} min</strong></div></div>
              <div className="flex min-w-0 gap-2 sm:gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" /><div className="min-w-0"><span className="text-xs text-muted-foreground sm:text-sm">{t.email}</span><strong className="mt-0.5 block break-all text-sm leading-5 text-foreground sm:mt-1 sm:text-base">{booking.guestEmail}</strong></div></div>
              <div className="flex min-w-0 gap-2 sm:gap-3"><Video className="mt-0.5 h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" /><div><span className="text-xs text-muted-foreground sm:text-sm">{t.platform}</span><strong className="mt-0.5 block text-sm text-foreground sm:mt-1 sm:text-base">{meetingProviderLabel(booking.meetingProvider)}</strong></div></div>
            </div>
          </div>
          {error && <p className="mt-4 rounded-xl bg-destructive/10 p-4 text-sm text-destructive sm:mt-5">{error}</p>}
          {rescheduling ? <div className="mt-8 border-t border-border pt-8"><h2 className="mb-6 font-display text-2xl font-bold">{t.chooseNew}</h2>{slotPicker}<div className="mt-7 flex flex-col gap-3 sm:flex-row"><Button variant="outline" className="h-12 rounded-xl" onClick={() => setRescheduling(false)}>{t.back}</Button><Button className="h-12 rounded-xl" disabled={!hold || saving} onClick={() => void saveReschedule()}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t.saveNew}</Button></div></div> : <div className="mt-4 grid gap-3 sm:mt-7 sm:grid-cols-2">
            {booking.status !== "CANCELLED" && <Button variant="hero" className="h-11 w-full rounded-xl sm:col-span-2 sm:h-12" onClick={() => downloadIcs(booking)}><CalendarDays className="mr-2 h-4 w-4" />{t.addCalendar}</Button>}
            {token && booking.canModify && booking.status !== "CANCELLED" && <Button variant="outline" className="h-12 rounded-xl" disabled={saving} onClick={() => void startReschedule()}><RefreshCw className="mr-2 h-4 w-4" />{t.reschedule}</Button>}
            {token && booking.canModify && booking.status !== "CANCELLED" && <Button variant="outline" className="h-12 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive" disabled={saving} onClick={() => void cancelBooking()}><XCircle className="mr-2 h-4 w-4" />{t.cancel}</Button>}
          </div>}
        </div>
      ) : (
        <div className="demo-booking-card">
          <section className="demo-booking-content">
            {step === "slots" ? slotPicker : (
              <form onSubmit={confirm} className="grid gap-5">
                <div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="-ml-3 mb-3"
                    onClick={() => {
                      setConfirmationFailed(false);
                      setStep("slots");
                    }}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t.back}
                  </Button>
                  <h2 className="text-xl font-medium text-foreground">{t.details}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{t.detailsHelp}</p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="demo-name">{t.name}</Label>
                    <Input id="demo-name" required value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} className="h-12 rounded-xl" autoComplete="name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="demo-email">{t.email}</Label>
                    <Input id="demo-email" type="email" required value={form.guestEmail} onChange={(e) => setForm({ ...form, guestEmail: e.target.value })} className="h-12 rounded-xl" autoComplete="email" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="demo-company">{t.company}</Label>
                    <Input id="demo-company" required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="h-12 rounded-xl" autoComplete="organization" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="demo-phone">{t.phone}</Label>
                    <Input id="demo-phone" type="tel" value={form.guestPhone} onChange={(e) => setForm({ ...form, guestPhone: e.target.value })} className="h-12 rounded-xl" autoComplete="tel" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="demo-note">{t.note}</Label>
                  <Textarea id="demo-note" value={form.guestNote} onChange={(e) => setForm({ ...form, guestNote: e.target.value })} placeholder={t.notePlaceholder} className="min-h-28 rounded-xl" />
                </div>

                {confirmationFailed && (
                  <div className="grid gap-3" aria-live="polite">
                    <div role="alert" className="flex gap-3 rounded-2xl border border-destructive/35 bg-destructive/[0.055] p-4 sm:p-5">
                      <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive text-base font-extrabold text-destructive-foreground shadow-sm">
                        !
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-base font-bold text-destructive">{t.confirmFailedTitle}</h3>
                        <p className="mt-1 text-sm leading-6 text-foreground/75">{t.confirmFailedText}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-primary/10 bg-primary/[0.055] p-4 sm:p-5">
                      <h3 className="font-display text-sm font-bold text-foreground">{t.contactSupport}</h3>
                      <p className="mt-1 text-sm leading-5 text-muted-foreground">{t.contactSupportText}</p>
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        <a
                          href={`mailto:${SUPPORT_EMAIL}`}
                          aria-label={`${t.contactSupport}: ${SUPPORT_EMAIL}`}
                          className="group flex min-h-12 min-w-0 items-center gap-3 rounded-xl border border-border/80 bg-card px-3.5 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/35 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Mail className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1 truncate text-left">{SUPPORT_EMAIL}</span>
                          <ChevronRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                        </a>
                        <a
                          href={`tel:${SUPPORT_PHONE_LINK}`}
                          aria-label={`${t.contactSupport}: ${SUPPORT_PHONE}`}
                          className="group flex min-h-12 min-w-0 items-center gap-3 rounded-xl border border-border/80 bg-card px-3.5 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/35 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Phone className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1 text-left">{SUPPORT_PHONE}</span>
                          <ChevronRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                <Button type="submit" variant="hero" className="h-12 rounded-xl text-base" disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : confirmationFailed ? <RefreshCw className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                  {confirmationFailed ? t.retryConfirm : t.confirm}
                </Button>
                <p className="text-xs leading-5 text-muted-foreground">{t.privacy}</p>
              </form>
            )}
          </section>
          <aside ref={selectedSummaryRef} className="demo-selection" aria-live="polite">
            <h2>{t.selected}</h2>
            {selectedSlot ? <><p className="demo-selection-date">{new Intl.DateTimeFormat(language === "sl" ? "sl-SI" : "en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone }).format(new Date(selectedSlot.startAt))}</p><p className="demo-selection-time">{formatSlotStart(selectedSlot.startAt, language, timeZone)}–{formatSlotStart(selectedSlot.endAt, language, timeZone)}</p></> : <p className="demo-selection-empty">{saving ? t.loading : t.emptySelection}</p>}
            {profile && <div className="demo-selection-facts"><span><Clock3 aria-hidden="true" />{profile.durationMinutes} min</span><span><Video aria-hidden="true" />{meetingProviderLabel(profile.meetingProvider)}</span></div>}
            {step === "slots" && <><Button className="demo-continue" disabled={!selectedSlot || !hold || saving} onClick={openDetails}>{saving ? <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" /> : null}{t.next}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Button><p className="demo-next-help">{t.nextHelp}</p></>}
          </aside>
        </div>
      )}
      {!token && step !== "confirmed" && <p className="demo-reassurance">{t.reassurance}</p>}
      </div></section>
    </main>
    <Footer appearance="light" />
  </div>;
};

export default DemoBookingPage;
