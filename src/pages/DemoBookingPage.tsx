import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { addDays, format } from "date-fns";
import { enGB, sl } from "date-fns/locale";
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Check,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
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
import { demoBookingApi, type DemoAvailability, type DemoBooking, type DemoHold, type DemoProfile, type DemoSlot } from "@/lib/demo-booking";
import { trackMarketingEvent } from "@/lib/marketing-events";
import { useSiteLanguage } from "@/lib/site-language";

const dateInput = (date: Date) => format(date, "yyyy-MM-dd");
const detectedTimeZone = () => typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Ljubljana" : "Europe/Ljubljana";

const copy = {
  sl: {
    eyebrow: "30-minutna predstavitev",
    title: "Rezervirajte osebno predstavitev Calendre",
    subtitle: "Izberite termin, ki vam ustreza. Na video klicu vam pokažemo Calendro in odgovorimo na vaša vprašanja.",
    duration: "30 minut",
    video: "Google Meet",
    timezone: "Časovni pas",
    pickDate: "1. Izberite datum",
    pickTime: "2. Izberite uro",
    noSlots: "Na ta dan ni prostih terminov.",
    next: "Nadaljuj s podatki",
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
    previousDates: "Prejšnjih 14 dni",
    nextDates: "Naslednjih 14 dni",
    bookedFor: "Rezervirano za",
    pageError: "Rezervacije ni bilo mogoče najti ali povezava ni več veljavna.",
  },
  en: {
    eyebrow: "30-minute product demo",
    title: "Book a personal Calendra demo",
    subtitle: "Choose a convenient time. We will show you Calendra on a video call and answer your questions.",
    duration: "30 minutes",
    video: "Google Meet",
    timezone: "Time zone",
    pickDate: "1. Choose a date",
    pickTime: "2. Choose a time",
    noSlots: "No available times on this day.",
    next: "Continue to your details",
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
    previousDates: "Previous 14 days",
    nextDates: "Next 14 days",
    bookedFor: "Booked for",
    pageError: "The booking could not be found or this link is no longer valid.",
  },
} as const;

const formatDateTime = (value: string, language: "sl" | "en", timeZone?: string) => new Intl.DateTimeFormat(language === "sl" ? "sl-SI" : "en-GB", {
  weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone,
}).format(new Date(value));

const DATE_PAGE_SIZE = 14;

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
  const { language } = useSiteLanguage();
  const t = copy[language];
  const locale = language === "sl" ? sl : enGB;
  const timeZone = useMemo(detectedTimeZone, []);
  const [profile, setProfile] = useState<DemoProfile | null>(null);
  const [availability, setAvailability] = useState<DemoAvailability | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [datePage, setDatePage] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<DemoSlot | null>(null);
  const [hold, setHold] = useState<DemoHold | null>(null);
  const [booking, setBooking] = useState<DemoBooking | null>(null);
  const [step, setStep] = useState<"slots" | "details" | "confirmed">("slots");
  const [rescheduling, setRescheduling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ guestName: "", guestEmail: "", guestPhone: "", companyName: "", guestNote: "" });

  const loadAvailability = async (bookingHorizonDays = profile?.bookingHorizonDays || 30) => {
    const from = new Date();
    const to = addDays(from, Math.max(DATE_PAGE_SIZE, bookingHorizonDays));
    const response = await demoBookingApi.availability(dateInput(from), dateInput(to), timeZone);
    setAvailability(response);
    const first = response.days.find((day) => day.slots.length > 0);
    const retainedDate = selectedDate && response.days.some((day) => day.date === selectedDate) ? selectedDate : "";
    const nextDate = retainedDate || first?.date || response.days[0]?.date || "";
    setSelectedDate(nextDate);
    const selectedIndex = Math.max(0, response.days.findIndex((day) => day.date === nextDate));
    setDatePage(Math.floor(selectedIndex / DATE_PAGE_SIZE));
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    (async () => {
      try {
        if (token) {
          const [managed, currentProfile] = await Promise.all([
            demoBookingApi.manage(token),
            demoBookingApi.profile().catch(() => null),
          ]);
          if (!active) return;
          setBooking(managed);
          setProfile(currentProfile);
          setStep("confirmed");
        } else {
          const currentProfile = await demoBookingApi.profile();
          if (!active) return;
          setProfile(currentProfile);
          if (currentProfile.enabled) await loadAvailability(currentProfile.bookingHorizonDays);
          trackMarketingEvent("demo_booking_page_viewed", { language });
        }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : (token ? t.pageError : t.error));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, language]);

  const selectedDay = availability?.days.find((day) => day.date === selectedDate);
  const datePageCount = Math.max(1, Math.ceil((availability?.days.length || 0) / DATE_PAGE_SIZE));
  const visibleDays = availability?.days.slice(datePage * DATE_PAGE_SIZE, (datePage + 1) * DATE_PAGE_SIZE) || [];
  const visibleDateRange = visibleDays.length > 0
    ? `${format(new Date(`${visibleDays[0].date}T12:00:00`), "d. MMM", { locale })} – ${format(new Date(`${visibleDays[visibleDays.length - 1].date}T12:00:00`), "d. MMM", { locale })}`
    : "";

  const moveDatePage = (direction: -1 | 1) => {
    const nextPage = Math.min(datePageCount - 1, Math.max(0, datePage + direction));
    if (nextPage === datePage) return;
    const nextDays = availability?.days.slice(nextPage * DATE_PAGE_SIZE, (nextPage + 1) * DATE_PAGE_SIZE) || [];
    const firstAvailable = nextDays.find((day) => day.slots.length > 0) || nextDays[0];
    setDatePage(nextPage);
    setSelectedDate(firstAvailable?.date || "");
    setSelectedSlot(null);
  };

  const chooseSlot = async (slot: DemoSlot) => {
    setSaving(true);
    setError("");
    try {
      const nextHold = await demoBookingApi.hold(slot.startAt, timeZone, hold?.holdToken);
      setSelectedSlot(slot);
      setHold(nextHold);
      trackMarketingEvent("demo_booking_slot_selected", { language, start_at: slot.startAt });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t.error);
      await loadAvailability().catch(() => undefined);
    } finally {
      setSaving(false);
    }
  };

  const openDetails = () => {
    if (!selectedSlot || !hold) return;
    setStep("details");
    trackMarketingEvent("demo_booking_form_started", { language });
  };

  const confirm = async (event: FormEvent) => {
    event.preventDefault();
    if (!hold) return;
    setSaving(true);
    setError("");
    try {
      const params = new URLSearchParams(window.location.search);
      const result = await demoBookingApi.confirm({
        holdToken: hold.holdToken,
        ...form,
        guestTimeZone: timeZone,
        locale: language,
        utmSource: params.get("utm_source"),
        utmMedium: params.get("utm_medium"),
        utmCampaign: params.get("utm_campaign"),
      });
      setBooking(result);
      setStep("confirmed");
      trackMarketingEvent("demo_booking_confirmed", { language, booking_id: result.id, meeting_provider: result.meetingProvider });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t.error);
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
      trackMarketingEvent("demo_booking_cancelled", { language, booking_id: result.id });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t.pageError);
    } finally { setSaving(false); }
  };

  const startReschedule = async () => {
    setSaving(true);
    setError("");
    try {
      await loadAvailability(profile?.bookingHorizonDays);
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
      trackMarketingEvent("demo_booking_rescheduled", { language, booking_id: result.id, start_at: result.startAt });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t.error);
    } finally { setSaving(false); }
  };

  const slotPicker = (
    <div className="grid gap-7">
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">{t.pickDate}</h2>
            <span className="mt-1 block text-xs font-medium text-muted-foreground">{t.timezone}: {timeZone}</span>
          </div>
          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <Button type="button" variant="outline" size="icon" className="h-9 w-9 rounded-xl" disabled={datePage <= 0} onClick={() => moveDatePage(-1)} aria-label={t.previousDates}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-28 text-center text-sm font-semibold text-foreground">{visibleDateRange}</span>
            <Button type="button" variant="outline" size="icon" className="h-9 w-9 rounded-xl" disabled={datePage >= datePageCount - 1} onClick={() => moveDatePage(1)} aria-label={t.nextDates}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5">
          {visibleDays.map((day) => {
            const parsed = new Date(`${day.date}T12:00:00`);
            const active = selectedDate === day.date;
            return <button key={day.date} type="button" disabled={day.slots.length === 0} onClick={() => { setSelectedDate(day.date); setSelectedSlot(null); }} className={`rounded-2xl border px-2 py-3 text-center transition ${active ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border-border/70 bg-background hover:border-primary/40"} disabled:cursor-not-allowed disabled:opacity-35`}>
              <span className="block text-[11px] font-semibold uppercase tracking-wide">{format(parsed, "EEE", { locale })}</span>
              <strong className="mt-1 block text-xl">{format(parsed, "d")}</strong>
              <span className="block text-xs">{format(parsed, "MMM", { locale })}</span>
            </button>;
          })}
        </div>
      </section>
      <section>
        <h2 className="mb-4 font-display text-lg font-bold text-foreground">{t.pickTime}</h2>
        {selectedDay?.slots.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          {selectedDay.slots.map((slot) => <button key={slot.startAt} type="button" disabled={saving} onClick={() => void chooseSlot(slot)} className={`min-h-12 rounded-xl border px-4 font-bold transition ${selectedSlot?.startAt === slot.startAt ? "border-primary bg-primary/[0.09] text-primary ring-2 ring-primary/15" : "border-border bg-background text-foreground hover:border-primary/50 hover:text-primary"}`}>{formatSlotStart(slot.startAt, language, timeZone)}</button>)}
        </div> : <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">{t.noSlots}</div>}
      </section>
    </div>
  );

  return <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.08),transparent_36%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--muted)/0.35))]">
    <Navbar />
    <main className="container mx-auto max-w-6xl px-4 py-12 md:py-16 lg:px-8">
      {!token && <header className="mx-auto mb-10 max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-2 text-sm font-bold text-primary"><Video className="h-4 w-4" />{t.eyebrow}</span>
        <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">{t.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{t.subtitle}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm font-semibold text-foreground">
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-sm"><Clock3 className="h-4 w-4 text-primary" />{profile?.durationMinutes || 30} {language === "sl" ? "minut" : "minutes"}</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-sm"><Video className="h-4 w-4 text-primary" />{meetingProviderLabel(profile?.meetingProvider)}</span>
        </div>
      </header>}

      {loading ? <div className="flex min-h-[420px] items-center justify-center"><Loader2 className="h-9 w-9 animate-spin text-primary" /><span className="ml-3 text-muted-foreground">{t.loading}</span></div> : error && !profile && !booking ? <div className="mx-auto max-w-xl rounded-3xl border border-destructive/20 bg-card p-8 text-center shadow-soft"><XCircle className="mx-auto h-12 w-12 text-destructive" /><h1 className="mt-4 font-display text-2xl font-bold">{token ? t.pageError : t.unavailable}</h1><p className="mt-2 text-muted-foreground">{error}</p></div> : !token && profile && !profile.enabled ? <div className="mx-auto max-w-xl rounded-3xl border bg-card p-10 text-center shadow-soft"><CalendarDays className="mx-auto h-12 w-12 text-muted-foreground" /><h2 className="mt-4 font-display text-2xl font-bold">{t.unavailable}</h2></div> : step === "confirmed" && booking ? (
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-border/70 bg-card p-6 shadow-[0_28px_80px_-40px_hsl(var(--primary)/0.5)] md:p-10">
          <div className="text-center">
            <span className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${booking.status === "CANCELLED" ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-600"}`}>{booking.status === "CANCELLED" ? <XCircle className="h-9 w-9" /> : <CheckCircle2 className="h-9 w-9" />}</span>
            <h1 className="mt-5 font-display text-3xl font-extrabold text-foreground">{token ? t.managementTitle : booking.status === "CANCELLED" ? t.cancelled : t.confirmed}</h1>
            {!token && booking.status !== "CANCELLED" && <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t.confirmedText}</p>}
          </div>
          <div className="mt-8 rounded-2xl border border-border/70 bg-background p-5 md:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex gap-3"><CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><span className="text-sm text-muted-foreground">{t.bookedFor}</span><strong className="mt-1 block text-foreground">{formatDateTime(booking.startAt, language, booking.guestTimeZone || timeZone)}</strong></div></div>
              <div className="flex gap-3"><Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><span className="text-sm text-muted-foreground">{t.duration}</span><strong className="mt-1 block text-foreground">{booking.durationMinutes} min</strong></div></div>
              <div className="flex gap-3"><Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><span className="text-sm text-muted-foreground">{t.email}</span><strong className="mt-1 block break-all text-foreground">{booking.guestEmail}</strong></div></div>
              <div className="flex gap-3"><Video className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><span className="text-sm text-muted-foreground">{t.platform}</span><strong className="mt-1 block text-foreground">{meetingProviderLabel(booking.meetingProvider)}</strong></div></div>
            </div>
          </div>
          {error && <p className="mt-5 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</p>}
          {rescheduling ? <div className="mt-8 border-t border-border pt-8"><h2 className="mb-6 font-display text-2xl font-bold">{t.chooseNew}</h2>{slotPicker}<div className="mt-7 flex flex-col gap-3 sm:flex-row"><Button variant="outline" className="h-12 rounded-xl" onClick={() => setRescheduling(false)}>{t.back}</Button><Button className="h-12 rounded-xl" disabled={!hold || saving} onClick={() => void saveReschedule()}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t.saveNew}</Button></div></div> : <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {booking.status !== "CANCELLED" && <Button variant="hero" className="h-12 w-full rounded-xl sm:col-span-2" onClick={() => downloadIcs(booking)}><CalendarDays className="mr-2 h-4 w-4" />{t.addCalendar}</Button>}
            {token && booking.canModify && booking.status !== "CANCELLED" && <Button variant="outline" className="h-12 rounded-xl" disabled={saving} onClick={() => void startReschedule()}><RefreshCw className="mr-2 h-4 w-4" />{t.reschedule}</Button>}
            {token && booking.canModify && booking.status !== "CANCELLED" && <Button variant="outline" className="h-12 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive" disabled={saving} onClick={() => void cancelBooking()}><XCircle className="mr-2 h-4 w-4" />{t.cancel}</Button>}
          </div>}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <section className="rounded-[2rem] border border-border/70 bg-card p-5 shadow-[0_28px_80px_-45px_hsl(var(--primary)/0.45)] md:p-8">
            {step === "slots" ? slotPicker : <form onSubmit={confirm} className="grid gap-5">
              <div><Button type="button" variant="ghost" className="-ml-3 mb-3" onClick={() => setStep("slots")}><ArrowLeft className="mr-2 h-4 w-4" />{t.back}</Button><h2 className="font-display text-2xl font-bold text-foreground">{t.details}</h2><p className="mt-2 text-muted-foreground">{t.detailsHelp}</p></div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2"><Label htmlFor="demo-name">{t.name}</Label><Input id="demo-name" required value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} className="h-12 rounded-xl" autoComplete="name" /></div>
                <div className="grid gap-2"><Label htmlFor="demo-email">{t.email}</Label><Input id="demo-email" type="email" required value={form.guestEmail} onChange={(e) => setForm({ ...form, guestEmail: e.target.value })} className="h-12 rounded-xl" autoComplete="email" /></div>
                <div className="grid gap-2"><Label htmlFor="demo-company">{t.company}</Label><Input id="demo-company" required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="h-12 rounded-xl" autoComplete="organization" /></div>
                <div className="grid gap-2"><Label htmlFor="demo-phone">{t.phone}</Label><Input id="demo-phone" type="tel" value={form.guestPhone} onChange={(e) => setForm({ ...form, guestPhone: e.target.value })} className="h-12 rounded-xl" autoComplete="tel" /></div>
              </div>
              <div className="grid gap-2"><Label htmlFor="demo-note">{t.note}</Label><Textarea id="demo-note" value={form.guestNote} onChange={(e) => setForm({ ...form, guestNote: e.target.value })} placeholder={t.notePlaceholder} className="min-h-28 rounded-xl" /></div>
              <p className="text-xs leading-5 text-muted-foreground">{t.privacy}</p>
              {error && <p className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</p>}
              <Button type="submit" variant="hero" className="h-12 rounded-xl text-base" disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}{t.confirm}</Button>
            </form>}
          </section>
          <aside className="rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-card to-card p-6 shadow-soft lg:sticky lg:top-28 md:p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><CalendarDays className="h-6 w-6" /></span>
            <h2 className="mt-5 font-display text-xl font-bold text-foreground">{t.selected}</h2>
            {selectedSlot ? <><p className="mt-3 text-lg font-bold text-foreground">{formatDateTime(selectedSlot.startAt, language, timeZone)}</p><div className="mt-5 grid gap-3 text-sm text-muted-foreground"><span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-primary" />{profile?.durationMinutes || 30} min</span><span className="flex items-center gap-2"><Video className="h-4 w-4 text-primary" />{meetingProviderLabel(profile?.meetingProvider)}</span></div>{step === "slots" && <Button variant="hero" className="mt-7 h-12 w-full rounded-xl" disabled={!hold || saving} onClick={openDetails}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t.next}</Button>}</> : <p className="mt-3 leading-7 text-muted-foreground">{language === "sl" ? "Najprej izberite datum in prost termin." : "Choose a date and available time first."}</p>}
          </aside>
        </div>
      )}
    </main>
    <Footer />
  </div>;
};

export default DemoBookingPage;
