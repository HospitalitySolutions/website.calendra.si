import { type CSSProperties, type DragEvent, type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  addDays, addMonths, addWeeks, eachDayOfInterval, endOfMonth, endOfWeek,
  format, isSameDay, isSameMonth, isToday, parseISO, startOfMonth, startOfWeek,
} from "date-fns";
import { enUS, sl } from "date-fns/locale";
import {
  ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3,
  CreditCard, GripVertical, Monitor, Plus, RefreshCcw, Smartphone, Users, X,
} from "lucide-react";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { trackMarketingEvent } from "@/lib/marketing-events";
import {
  demoScenarios, generateDemoAppointments,
  type DemoAppointment, type DemoDevice, type DemoLanguage, type DemoScenario,
} from "./interactive-preview-data";
import "./interactive-preview.css";

type DemoView = "day" | "week" | "month";
type Draft = { date: string; hour: number };
type Props = {
  initialDevice: DemoDevice;
  language: DemoLanguage;
  onClose: () => void;
};

const words = {
  sl: {
    title: "Preizkusite Calendra koledar",
    subtitle: "Interaktivni ogled aplikacije",
    demo: "DEMO • Vzorčni podatki",
    notice: "To je prikaz z izmišljenimi podatki. Spremembe se ne shranijo.",
    close: "Zapri predogled",
    deviceDesktop: "Računalnik",
    deviceMobile: "Telefon",
    business: "Vrsta dejavnosti",
    calendar: "Koledar",
    team: "Ekipa",
    allStaff: "Celotna ekipa",
    today: "Danes",
    previous: "Prejšnje obdobje",
    next: "Naslednje obdobje",
    day: "Dan",
    week: "Teden",
    month: "Mesec",
    newBooking: "Nov termin",
    addSlot: "Dodaj termin",
    inspect: "Kliknite termin za podrobnosti ali prazen čas za novega.",
    drag: "Namig: termine lahko z miško premikate med prostimi urami.",
    detail: "Podrobnosti termina",
    service: "Storitev",
    customer: "Stranka",
    employee: "Zaposleni",
    participants: "Udeleženci",
    paid: "Plačano",
    unpaid: "Neplačano",
    markPaid: "Označi kot plačano",
    markUnpaid: "Označi kot neplačano",
    remove: "Izbriši vzorčni termin",
    create: "Dodaj vzorčni termin",
    cancel: "Prekliči",
    customerPlaceholder: "Ime vzorčne stranke",
    personFallback: "Nova stranka",
    reset: "Ponastavi demo",
    bookingCount: "terminov",
    tryFree: "Preizkusite 14 dni brezplačno",
    noBookings: "Na ta dan ni terminov.",
    back: "Nazaj na koledar",
    at: "ob",
    changeScenario: "Ob zamenjavi dejavnosti se vzorčni termini ponastavijo.",
  },
  en: {
    title: "Try the Calendra calendar",
    subtitle: "Interactive product preview",
    demo: "DEMO • Sample data",
    notice: "This preview uses fictional data. Changes are never saved.",
    close: "Close preview",
    deviceDesktop: "Desktop",
    deviceMobile: "Mobile",
    business: "Business type",
    calendar: "Calendar",
    team: "Team",
    allStaff: "All staff",
    today: "Today",
    previous: "Previous period",
    next: "Next period",
    day: "Day",
    week: "Week",
    month: "Month",
    newBooking: "New booking",
    addSlot: "Add booking",
    inspect: "Select a booking for details or an empty time to create one.",
    drag: "Tip: drag bookings to another day or time.",
    detail: "Booking details",
    service: "Service",
    customer: "Client",
    employee: "Employee",
    participants: "Participants",
    paid: "Paid",
    unpaid: "Unpaid",
    markPaid: "Mark as paid",
    markUnpaid: "Mark as unpaid",
    remove: "Delete sample booking",
    create: "Add sample booking",
    cancel: "Cancel",
    customerPlaceholder: "Sample client name",
    personFallback: "New client",
    reset: "Reset demo",
    bookingCount: "bookings",
    tryFree: "Try 14 days for free",
    noBookings: "No bookings on this day.",
    back: "Back to calendar",
    at: "at",
    changeScenario: "Changing the business type resets sample bookings.",
  },
} as const;

const hours = Array.from({ length: 11 }, (_, index) => index + 8);
const dateKey = (date: Date) => format(date, "yyyy-MM-dd");
const hourLabel = (hour: number) => String(hour).padStart(2, "0") + ":00";

// The fixture IDs remain language-independent while visible demo names are localized.
const demoCustomerName = (name: string, language: DemoLanguage) => {
  if (language === "sl") return name;
  if (name === "Skupinska vadba") return "Group class";
  if (name === "Podporna skupina") return "Support group";
  if (name.startsWith("Stranka ")) return "Client " + name.slice("Stranka ".length);
  return name;
};

export default function InteractiveCalendarDemo({ initialDevice, language, onClose }: Props) {
  const t = words[language];
  const locale = language === "sl" ? sl : enUS;
  const [anchor] = useState(() => new Date());
  const [day, setDay] = useState(() => new Date());
  const [device, setDevice] = useState<DemoDevice>(initialDevice);
  const [view, setView] = useState<DemoView>("week");
  const [scenario, setScenario] = useState<DemoScenario>("studio");
  const [staff, setStaff] = useState("all");
  const [appointments, setAppointments] = useState<DemoAppointment[]>(() => generateDemoAppointments("studio", new Date()));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [draftService, setDraftService] = useState("pilates");
  const [draftEmployee, setDraftEmployee] = useState("Maja");
  const [customer, setCustomer] = useState("");
  const nextCreatedId = useRef(0);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])",
      )).filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const business = demoScenarios[scenario];
  const selected = appointments.find((appointment) => appointment.id === selectedId) ?? null;
  const filtered = useMemo(() => appointments.filter(
    (appointment) => staff === "all" || appointment.employee === staff,
  ), [appointments, staff]);

  const periodDays = useMemo(() => {
    if (view === "day") return [day];
    return Array.from({ length: 7 }, (_, index) =>
      addDays(startOfWeek(day, { weekStartsOn: 1 }), index));
  }, [day, view]);

  const monthDays = useMemo(() => eachDayOfInterval({
    start: startOfWeek(startOfMonth(day), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(day), { weekStartsOn: 1 }),
  }), [day]);

  const appointmentsFor = (date: Date) =>
    filtered.filter((appointment) => appointment.date === dateKey(date))
      .sort((a, b) => a.hour - b.hour);

  const serviceFor = (appointment: DemoAppointment) =>
    business.services.find((service) => service.id === appointment.serviceId) ?? business.services[0];

  const resetDemo = (targetScenario = scenario) => {
    setAppointments(generateDemoAppointments(targetScenario, anchor));
    setSelectedId(null);
    setDraft(null);
    setDay(new Date());
  };

  const changeScenario = (next: DemoScenario) => {
    setScenario(next);
    setStaff("all");
    setDraftService(demoScenarios[next].services[0].id);
    setDraftEmployee(demoScenarios[next].employees[0]);
    resetDemo(next);
  };

  const movePeriod = (direction: number, activeView: DemoView = view) => {
    setSelectedId(null);
    setDraft(null);
    setDay((current) => activeView === "month"
      ? addMonths(current, direction)
      : activeView === "week" ? addWeeks(current, direction) : addDays(current, direction));
  };

  const openBooking = (appointment: DemoAppointment) => {
    setSelectedId(appointment.id);
    setDraft(null);
  };

  const openDraft = (date: Date, hour: number) => {
    setDraft({ date: dateKey(date), hour });
    setSelectedId(null);
    setDraftService(business.services[0].id);
    setDraftEmployee(staff === "all" ? business.employees[0] : staff);
    setCustomer("");
  };

  const createBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) return;
    const created: DemoAppointment = {
      id: "visitor-" + (++nextCreatedId.current),
      date: draft.date,
      hour: draft.hour,
      serviceId: draftService,
      employee: draftEmployee,
      customer: customer.trim() || t.personFallback,
      paid: false,
    };
    setAppointments((previous) => [...previous, created]);
    setSelectedId(created.id);
    setDraft(null);
  };

  const moveBooking = (event: DragEvent<HTMLDivElement>, targetDate: Date, hour: number) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (!id || !appointments.some((appointment) => appointment.id === id)) return;
    setAppointments((previous) => previous.map((appointment) =>
      appointment.id === id ? { ...appointment, date: dateKey(targetDate), hour } : appointment));
  };

  const updateSelected = (update: (appointment: DemoAppointment) => DemoAppointment) => {
    if (!selectedId) return;
    setAppointments((previous) => previous.map((appointment) =>
      appointment.id === selectedId ? update(appointment) : appointment));
  };

  const controls = (
    <div className="cal-demo-navigation">
      <button type="button" className="cal-demo-icon-button" aria-label={t.previous} onClick={() => movePeriod(-1, device === "mobile" ? "day" : view)}>
        <ChevronLeft aria-hidden="true" />
      </button>
      <button type="button" className="cal-demo-today" onClick={() => setDay(new Date())}>{t.today}</button>
      <button type="button" className="cal-demo-icon-button" aria-label={t.next} onClick={() => movePeriod(1, device === "mobile" ? "day" : view)}>
        <ChevronRight aria-hidden="true" />
      </button>
    </div>
  );

  const BookingButton = ({ appointment, compact = false }: { appointment: DemoAppointment; compact?: boolean }) => {
    const service = serviceFor(appointment);
    const isGroup = Boolean(appointment.participants);
    return (
      <button
        type="button"
        className={"cal-demo-booking cal-demo-" + service.color + (compact ? " cal-demo-booking-compact" : "")}
        draggable={device === "desktop"}
        onDragStart={(event) => {
          event.dataTransfer.setData("text/plain", appointment.id);
          event.dataTransfer.effectAllowed = "move";
        }}
        onClick={() => openBooking(appointment)}
        aria-label={hourLabel(appointment.hour) + " " + service.title[language] + " – " + demoCustomerName(appointment.customer, language)}
      >
        <strong>{service.title[language]}</strong>
        <span>{hourLabel(appointment.hour)} · {isGroup ? appointment.participants?.length + " " + t.participants.toLowerCase() : demoCustomerName(appointment.customer, language)}</span>
      </button>
    );
  };

  const details = (isMobile = false): ReactNode => {
    if (draft) return (
      <div className="cal-demo-details-inner">
        <div className="cal-demo-inspector-heading">
          <h3>{t.newBooking}</h3>
          <button type="button" className="cal-demo-icon-button" aria-label={t.cancel} onClick={() => setDraft(null)}><X aria-hidden="true" /></button>
        </div>
        <p className="cal-demo-inspector-date"><CalendarDays aria-hidden="true" />{format(parseISO(draft.date), "EEE, d MMM", { locale })} · {hourLabel(draft.hour)}</p>
        <form onSubmit={createBooking} className="cal-demo-form">
          <label>{t.service}
            <select value={draftService} onChange={(event) => setDraftService(event.target.value)}>
              {business.services.map((service) => <option key={service.id} value={service.id}>{service.title[language]}</option>)}
            </select>
          </label>
          <label>{t.customer}
            <input value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder={t.customerPlaceholder} maxLength={60} />
          </label>
          <label>{t.employee}
            <select value={draftEmployee} onChange={(event) => setDraftEmployee(event.target.value)}>
              {business.employees.map((employee) => <option key={employee}>{employee}</option>)}
            </select>
          </label>
          <button className="cal-demo-action-primary" type="submit"><Plus aria-hidden="true" />{t.create}</button>
          <button className="cal-demo-action-quiet" type="button" onClick={() => setDraft(null)}>{t.cancel}</button>
        </form>
      </div>
    );

    if (!selected) return (
      <div className="cal-demo-inspector-empty">
        <div className="cal-demo-inspector-illustration"><CalendarDays aria-hidden="true" /></div>
        <strong>{t.calendar}</strong>
        <p>{t.inspect}</p>
        {!isMobile && <small><GripVertical aria-hidden="true" />{t.drag}</small>}
      </div>
    );

    const service = serviceFor(selected);
    const participants = selected.participants;
    const paidCount = participants ? participants.filter((person) => person.paid).length : Number(selected.paid);
    return (
      <div className="cal-demo-details-inner">
        <div className="cal-demo-inspector-heading">
          <h3>{t.detail}</h3>
          <button type="button" className="cal-demo-icon-button" aria-label={t.back} onClick={() => setSelectedId(null)}><X aria-hidden="true" /></button>
        </div>
        <span className={"cal-demo-service-tag cal-demo-" + service.color}>{service.title[language]}</span>
        <p className="cal-demo-inspector-date"><CalendarDays aria-hidden="true" />{format(parseISO(selected.date), "EEEE, d MMMM", { locale })}</p>
        <p className="cal-demo-inspector-date"><Clock3 aria-hidden="true" />{hourLabel(selected.hour)}–{hourLabel(selected.hour + 1)}</p>
        <div className="cal-demo-property"><span>{t.employee}</span><strong>{selected.employee}</strong></div>
        <div className="cal-demo-property"><span>{t.customer}</span><strong>{demoCustomerName(selected.customer, language)}</strong></div>
        <div className="cal-demo-property"><span>{participants ? t.participants : t.paid}</span>
          <strong>{participants ? paidCount + "/" + participants.length + " " + t.paid.toLowerCase() : (selected.paid ? t.paid : t.unpaid)}</strong>
        </div>
        {participants ? (
          <div className="cal-demo-participants">
            <strong><Users aria-hidden="true" />{t.participants} ({participants.length})</strong>
            {participants.map((person, index) => (
              <button
                key={index}
                className="cal-demo-participant"
                type="button"
                onClick={() => updateSelected((appointment) => ({
                  ...appointment,
                  participants: appointment.participants?.map((part, i) => i === index ? { ...part, paid: !part.paid } : part),
                }))}
                aria-label={person.name + ": " + (person.paid ? t.paid : t.unpaid)}
                title={person.paid ? t.markUnpaid : t.markPaid}
              >
                <span>{person.name}</span><span className={person.paid ? "cal-demo-paid" : "cal-demo-unpaid"}>{person.paid ? t.paid : t.unpaid}</span>
              </button>
            ))}
          </div>
        ) : (
          <button className="cal-demo-action-primary" type="button" onClick={() => updateSelected((appointment) => ({ ...appointment, paid: !appointment.paid }))}>
            <CreditCard aria-hidden="true" />{selected.paid ? t.markUnpaid : t.markPaid}
          </button>
        )}
        <button className="cal-demo-action-quiet cal-demo-danger" type="button" onClick={() => {
          setAppointments((previous) => previous.filter((appointment) => appointment.id !== selected.id));
          setSelectedId(null);
        }}>{t.remove}</button>
      </div>
    );
  };

  const desktopCalendar = () => (
    <div className="cal-demo-desktop">
      <aside className="cal-demo-sidebar" aria-hidden="true">
        <div className="cal-demo-wordmark"><span>◕</span>calendra</div>
        <div className="cal-demo-sidebar-business">{business.business[language]}</div>
        <div className="cal-demo-side-link cal-demo-side-link-active"><CalendarDays />{t.calendar}</div>
        <div className="cal-demo-side-link"><Users />{t.team}</div>
        <div className="cal-demo-sidebar-end">{t.demo}</div>
      </aside>
      <div className="cal-demo-workspace">
        <div className="cal-demo-workspace-bar">
          <div>
            <span className="cal-demo-kicker">{business.business[language]}</span>
            <h2>{t.calendar}</h2>
          </div>
          <button type="button" className="cal-demo-action-primary" onClick={() => openDraft(day, 10)}>
            <Plus aria-hidden="true" />{t.newBooking}
          </button>
        </div>
        <div className="cal-demo-toolbar">
          <div className="cal-demo-date-toolbar">{controls}
            <strong>{view === "month"
              ? format(day, "LLLL yyyy", { locale })
              : view === "week"
                ? format(periodDays[0], "d MMM", { locale }) + " – " + format(periodDays[6], "d MMM yyyy", { locale })
                : format(day, "d MMMM yyyy", { locale })}</strong>
          </div>
          <div className="cal-demo-toolbar-right">
            <label className="cal-demo-staff-filter">{t.employee}<select value={staff} onChange={(event) => setStaff(event.target.value)}>
              <option value="all">{t.allStaff}</option>
              {business.employees.map((employee) => <option key={employee}>{employee}</option>)}
            </select></label>
            <div className="cal-demo-view-switch" aria-label={t.calendar}>
              {(["day", "week", "month"] as DemoView[]).map((nextView) =>
                <button key={nextView} type="button" className={view === nextView ? "active" : ""} aria-pressed={view === nextView} onClick={() => setView(nextView)}>{t[nextView]}</button>)}
            </div>
          </div>
        </div>
        <div className="cal-demo-workspace-content">
          <div className="cal-demo-grid-scroll">
            {view === "month" ? (
              <div className="cal-demo-month-grid">
                {Array.from({ length: 7 }, (_, index) => addDays(startOfWeek(day, { weekStartsOn: 1 }), index)).map((date) =>
                  <span key={dateKey(date)} className="cal-demo-month-weekday">{format(date, "EEE", { locale })}</span>)}
                {monthDays.map((date) => {
                  const bookings = appointmentsFor(date);
                  return (
                    <div key={dateKey(date)} className={"cal-demo-month-cell" + (!isSameMonth(date, day) ? " outside" : "")}>
                      <button type="button" className={isToday(date) ? "cal-demo-current-date" : ""} onClick={() => { setDay(date); setView("day"); }}>{format(date, "d")}</button>
                      {bookings.slice(0, 2).map((appointment) => <BookingButton key={appointment.id} compact appointment={appointment} />)}
                      {bookings.length > 2 && <small>+{bookings.length - 2}</small>}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="cal-demo-time-grid" style={{ gridTemplateColumns: "52px repeat(" + periodDays.length + ", minmax(0, 1fr))" } as CSSProperties}>
                <span className="cal-demo-grid-corner" />
                {periodDays.map((date) => (
                  <button type="button" key={dateKey(date)} className={"cal-demo-column-heading" + (isToday(date) ? " is-today" : "")} onClick={() => { setDay(date); setView("day"); }}>
                    <small>{format(date, "EEE", { locale })}</small><strong>{format(date, "d")}</strong>
                  </button>
                ))}
                {hours.map((hour) => (
                  <div key={hour} className="cal-demo-hour-row" style={{ display: "contents" }}>
                    <span className="cal-demo-hour-label">{hourLabel(hour)}</span>
                    {periodDays.map((date) => (
                      <div key={dateKey(date)} className="cal-demo-time-cell"
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => moveBooking(event, date, hour)}>
                        {appointmentsFor(date).filter((appointment) => appointment.hour === hour).map((appointment) =>
                          <BookingButton key={appointment.id} appointment={appointment} />)}
                        <button type="button" className="cal-demo-empty-slot"
                          aria-label={t.addSlot + " " + format(date, "d MMM", { locale }) + " " + hourLabel(hour)}
                          onClick={() => openDraft(date, hour)}><Plus aria-hidden="true" /></button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          <aside className="cal-demo-inspector">{details()}</aside>
        </div>
      </div>
    </div>
  );

  const mobileCalendar = () => {
    const days = Array.from({ length: 7 }, (_, index) => addDays(startOfWeek(day, { weekStartsOn: 1 }), index));
    const todaysAppointments = appointmentsFor(day);
    return (
      <div className="cal-demo-mobile-wrap">
        <div className="cal-demo-phone">
          <div className="cal-demo-phone-island" aria-hidden="true" />
          <div className="cal-demo-phone-header"><span className="cal-demo-wordmark"><span>◕</span>calendra</span><span className="cal-demo-phone-avatar">M</span></div>
          {selected || draft ? (
            <div className="cal-demo-phone-content cal-demo-phone-details">
              <button type="button" className="cal-demo-action-quiet cal-demo-mobile-back" onClick={() => { setSelectedId(null); setDraft(null); }}><ChevronLeft aria-hidden="true" />{t.back}</button>
              {details(true)}
            </div>
          ) : (
            <div className="cal-demo-phone-content">
              <div className="cal-demo-phone-title">
                <h2>{t.calendar}</h2>
                <button type="button" className="cal-demo-icon-button" aria-label={t.reset} onClick={() => resetDemo()}><RefreshCcw aria-hidden="true" /></button>
              </div>
              <div className="cal-demo-mobile-period">
                <strong>{format(day, "LLLL yyyy", { locale })}</strong>{controls}
              </div>
              <div className="cal-demo-mobile-weekstrip">
                {days.map((date) =>
                  <button type="button" key={dateKey(date)} className={isSameDay(date, day) ? "active" : ""} onClick={() => setDay(date)}>
                    <small>{format(date, "EEE", { locale })}</small><strong>{format(date, "d")}</strong>
                  </button>)}
              </div>
              <div className="cal-demo-phone-agenda">
                <div className="cal-demo-phone-agenda-heading"><strong>{format(day, "EEEE, d MMM", { locale })}</strong><small>{todaysAppointments.length} {t.bookingCount}</small></div>
                {todaysAppointments.length ? todaysAppointments.map((appointment) => (
                  <div className="cal-demo-agenda-row" key={appointment.id}>
                    <span>{hourLabel(appointment.hour)}</span><BookingButton appointment={appointment} />
                  </div>
                )) : <p className="cal-demo-no-bookings">{t.noBookings}</p>}
              </div>
              <button type="button" className="cal-demo-mobile-add" onClick={() => openDraft(day, 10)}><Plus aria-hidden="true" />{t.newBooking}</button>
            </div>
          )}
          <div className="cal-demo-phone-home-indicator" aria-hidden="true" />
        </div>
      </div>
    );
  };

  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="cal-demo-overlay" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div className="cal-demo-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="cal-demo-dialog-title" tabIndex={-1}>
        <header className="cal-demo-header">
          <div className="cal-demo-header-titles">
            <span className="cal-demo-eyebrow">{t.subtitle}</span>
            <h2 id="cal-demo-dialog-title">{t.title}</h2>
          </div>
          <div className="cal-demo-header-actions">
            <span className="cal-demo-badge"><Check aria-hidden="true" />{t.demo}</span>
            <button type="button" className="cal-demo-icon-button cal-demo-close" onClick={onClose} aria-label={t.close}><X aria-hidden="true" /></button>
          </div>
        </header>
        <div className="cal-demo-controls">
          <div className="cal-demo-device-switch">
            <button type="button" className={device === "desktop" ? "active" : ""} aria-pressed={device === "desktop"} onClick={() => { setDevice("desktop"); setSelectedId(null); setDraft(null); }}><Monitor aria-hidden="true" />{t.deviceDesktop}</button>
            <button type="button" className={device === "mobile" ? "active" : ""} aria-pressed={device === "mobile"} onClick={() => { setDevice("mobile"); setSelectedId(null); setDraft(null); }}><Smartphone aria-hidden="true" />{t.deviceMobile}</button>
          </div>
          <label className="cal-demo-scenario-control">{t.business}
            <select value={scenario} onChange={(event) => changeScenario(event.target.value as DemoScenario)} title={t.changeScenario}>
              {(Object.keys(demoScenarios) as DemoScenario[]).map((key) =>
                <option key={key} value={key}>{demoScenarios[key].label[language]}</option>)}
            </select>
          </label>
          <button type="button" className="cal-demo-reset" onClick={() => resetDemo()}><RefreshCcw aria-hidden="true" />{t.reset}</button>
        </div>
        <div className={"cal-demo-stage cal-demo-stage-" + device}>
          {device === "desktop" ? desktopCalendar() : mobileCalendar()}
        </div>
        <footer className="cal-demo-footer">
          <p>{t.notice}</p>
          <a href={TRIAL_SIGNUP_ROUTE} onClick={() => trackMarketingEvent("trial_cta_click", { placement: "interactive_calendar_preview", language })}>
            {t.tryFree}<ArrowRight aria-hidden="true" />
          </a>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
