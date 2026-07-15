import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getItServiceContent, IT_SERVICE_ROUTE_KEYS, type ItServiceRouteKey } from "@/lib/it-services";
import { LEGAL } from "@/lib/legal";
import { trackMarketingEvent } from "@/lib/marketing-events";
import { getRoutePath } from "@/lib/localized-routes";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { useSiteLanguage } from "@/lib/site-language";
import {
  ArrowRight,
  CalendarCheck2,
  Check,
  Clock3,
  Headphones,
  Laptop,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

type ContactFlow = "calendra" | "it";

const copy = {
  sl: {
    badge: "Kontakt",
    title: "Kako vam lahko pomagamo?",
    intro:
      "Vprašanja o aplikaciji Calendra in povpraševanja za IT storitve obravnavamo ločeno, da vas hitreje usmerimo do pravega odgovora.",
    chooseTitle: "Izberite namen kontakta",
    calendraCardTitle: "Zanima me Calendra",
    calendraCardBody:
      "Za vprašanja o paketih, funkcionalnostih, predstavitvi, preizkusnem računu, obračunu ali podpori za aplikacijo.",
    calendraCardItems: ["Paketi in funkcionalnosti", "Predstavitev in preizkusni račun", "Podpora za aplikacijo"],
    calendraQuestion: "Pošljite vprašanje o Calendri",
    calendraTrial: "Preizkusite brezplačno",
    itCardTitle: "Potrebujem IT storitev",
    itCardBody:
      "Za IT-podporo, spletne strani, vzdrževanje, poslovno e-pošto, varnostne kopije ter avtomatizacije.",
    itCardItems: ["Enkratni projekt ali pomoč po urah", "Mesečna IT-podpora", "Ponudba glede na obseg"],
    itQuestion: "Pripravite IT povpraševanje",
    itOverview: "Preglejte IT storitve",
    changeChoice: "Spremenite namen kontakta",
    common: {
      name: "Ime in priimek",
      company: "Podjetje",
      email: "E-pošta",
      phone: "Telefon",
      message: "Sporočilo",
      privacy: "Podatke bomo uporabili samo za obravnavo vašega vprašanja ali povpraševanja.",
      formIntro: "Po oddaji se odpre vaš e-poštni program z že pripravljenim sporočilom. Pred pošiljanjem ga lahko še dopolnite.",
    },
    calendra: {
      formTitle: "Vprašanje o Calendri",
      topic: "Tema vprašanja",
      selectTopic: "Izberite temo",
      topics: ["Paketi in cena", "Funkcionalnosti", "Predstavitev / demo", "Preizkusni račun", "Obračun in naročnina", "Tehnična podpora za aplikacijo", "Drugo"],
      messagePlaceholder: "Opišite vprašanje, težavo ali funkcionalnost, ki vas zanima.",
      submit: "Pripravi vprašanje o Calendri",
      subject: "Vprašanje o Calendri",
    },
    it: {
      formTitle: "Povpraševanje za IT storitve",
      service: "Storitev",
      selectService: "Izberite storitev",
      other: "Drugo / nisem prepričan",
      companySize: "Velikost podjetja",
      companySizeOptions: ["1 oseba", "2–5 oseb", "6–15 oseb", "16–50 oseb", "Več kot 50 oseb"],
      cooperation: "Vrsta sodelovanja",
      cooperationOptions: ["Enkratni projekt", "Pomoč po urah", "Mesečna IT-podpora", "Nisem prepričan"],
      urgency: "Kako hitro potrebujete pomoč?",
      urgencyOptions: ["Čim prej", "V naslednjih 7 dneh", "V naslednjem mesecu", "Raziskujem možnosti"],
      website: "Obstoječa spletna stran ali domena",
      websitePlaceholder: "https://... ali domena podjetja",
      messagePlaceholder: "Opišite trenutno stanje, težavo, cilj, uporabljene sisteme in morebitne roke.",
      submit: "Pripravi e-poštno povpraševanje",
      subject: "Povpraševanje za IT storitve",
    },
    directTitle: "Raje stopite v stik neposredno?",
    directBody: "Dosegljivi smo po e-pošti in telefonu. Za učinkovitejši prvi odgovor vključite kratek opis vprašanja, težave ali projekta.",
    hours: "Delovni čas podpore",
    hoursValue: "ponedeljek–petek, 8.00–16.00",
    location: "Lokacija",
    locationValue: "Slovenija; oddaljena pomoč in obiski po dogovoru",
    trustTitle: "Jasen naslednji korak",
    trustBody: "Pri IT storitvah pred začetkom potrdimo obseg, odgovornosti, način obračuna in pričakovani časovni okvir.",
  },
  en: {
    badge: "Contact",
    title: "How can we help?",
    intro:
      "Questions about the Calendra application and IT services enquiries follow separate paths so we can direct you to the right answer faster.",
    chooseTitle: "Choose the reason for contacting us",
    calendraCardTitle: "I am interested in Calendra",
    calendraCardBody:
      "For questions about plans, features, a product demonstration, trial accounts, billing or application support.",
    calendraCardItems: ["Plans and features", "Demo and trial account", "Application support"],
    calendraQuestion: "Ask a question about Calendra",
    calendraTrial: "Start a free trial",
    itCardTitle: "I need an IT service",
    itCardBody:
      "For IT support, websites, maintenance, business email, backups, essential security and automation.",
    itCardItems: ["One-off project or hourly help", "Monthly IT support", "Scope-based proposal"],
    itQuestion: "Prepare an IT enquiry",
    itOverview: "Explore IT services",
    changeChoice: "Change contact reason",
    common: {
      name: "Full name",
      company: "Company",
      email: "Email",
      phone: "Phone",
      message: "Message",
      privacy: "We will use the information only to respond to your question or enquiry.",
      formIntro: "Submitting the form opens your email application with a prepared message that you can review before sending.",
    },
    calendra: {
      formTitle: "Question about Calendra",
      topic: "Question topic",
      selectTopic: "Choose a topic",
      topics: ["Plans and pricing", "Features", "Product demonstration", "Trial account", "Billing and subscription", "Application support", "Other"],
      messagePlaceholder: "Describe your question, issue or the feature you are interested in.",
      submit: "Prepare Calendra question",
      subject: "Question about Calendra",
    },
    it: {
      formTitle: "IT services enquiry",
      service: "Service",
      selectService: "Choose a service",
      other: "Other / not sure",
      companySize: "Company size",
      companySizeOptions: ["1 person", "2–5 people", "6–15 people", "16–50 people", "More than 50 people"],
      cooperation: "Cooperation type",
      cooperationOptions: ["One-off project", "Hourly support", "Monthly IT support", "Not sure"],
      urgency: "How soon do you need help?",
      urgencyOptions: ["As soon as possible", "Within 7 days", "Within the next month", "I am exploring options"],
      website: "Existing website or domain",
      websitePlaceholder: "https://... or your company domain",
      messagePlaceholder: "Describe the current situation, problem, goal, existing systems and any deadlines.",
      submit: "Prepare email enquiry",
      subject: "IT services enquiry",
    },
    directTitle: "Prefer to contact us directly?",
    directBody: "We are available by email and phone. Include a short description of your question, issue or project for a more useful first response.",
    hours: "Support hours",
    hoursValue: "Monday–Friday, 08:00–16:00",
    location: "Location",
    locationValue: "Slovenia; remote help and on-site work by agreement",
    trustTitle: "A clear next step",
    trustBody: "For IT services, we confirm the scope, responsibilities, billing model and expected timeframe before work starts.",
  },
} as const;

const ContactPage = () => {
  const { language } = useSiteLanguage();
  const page = copy[language];
  const [searchParams] = useSearchParams();
  const requestedService = searchParams.get("service") as ItServiceRouteKey | null;
  const validRequestedService = requestedService && IT_SERVICE_ROUTE_KEYS.includes(requestedService) ? requestedService : "";
  const requestedType = searchParams.get("type");
  const resolvedInitialFlow: ContactFlow | null = validRequestedService || requestedType === "it" ? "it" : requestedType === "calendra" ? "calendra" : null;

  const [flow, setFlow] = useState<ContactFlow | null>(resolvedInitialFlow);
  const formRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [topic, setTopic] = useState("");
  const [service, setService] = useState<ItServiceRouteKey | "other" | "">(validRequestedService);
  const [companySize, setCompanySize] = useState("");
  const [cooperation, setCooperation] = useState("");
  const [urgency, setUrgency] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (validRequestedService) {
      setService(validRequestedService);
      setFlow("it");
    } else if (requestedType === "it" || requestedType === "calendra") {
      setFlow(requestedType);
    }
  }, [requestedType, validRequestedService]);

  const selectedServiceLabel = useMemo(() => {
    if (service === "other") return page.it.other;
    if (!service) return "-";
    return getItServiceContent(service, language).title;
  }, [language, page.it.other, service]);

  const selectFlow = (nextFlow: ContactFlow) => {
    setFlow(nextFlow);
    trackMarketingEvent("contact_path_selected", { contact_type: nextFlow, language });
    window.setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handleCalendraSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = [
      `${page.common.name}: ${name}`,
      `${page.common.company}: ${company || "-"}`,
      `${page.common.email}: ${email}`,
      `${page.common.phone}: ${phone || "-"}`,
      `${page.calendra.topic}: ${topic || "-"}`,
      "",
      `${page.common.message}:`,
      message,
    ].join("\n");

    trackMarketingEvent("calendra_inquiry_submitted", {
      topic: topic || "unspecified",
      language,
      delivery_method: "mailto",
    });

    window.location.href = `mailto:${LEGAL.generalEmail}?subject=${encodeURIComponent(`${page.calendra.subject}${topic ? ` – ${topic}` : ""}`)}&body=${encodeURIComponent(body)}`;
  };

  const handleItSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = [
      `${page.common.name}: ${name}`,
      `${page.common.company}: ${company || "-"}`,
      `${page.common.email}: ${email}`,
      `${page.common.phone}: ${phone || "-"}`,
      `${page.it.service}: ${selectedServiceLabel}`,
      `${page.it.companySize}: ${companySize || "-"}`,
      `${page.it.cooperation}: ${cooperation || "-"}`,
      `${page.it.urgency}: ${urgency || "-"}`,
      `${page.it.website}: ${website || "-"}`,
      "",
      `${page.common.message}:`,
      message,
    ].join("\n");

    trackMarketingEvent("it_service_inquiry_submitted", {
      service_key: service || "unspecified",
      company_size: companySize || "unspecified",
      cooperation_type: cooperation || "unspecified",
      urgency: urgency || "unspecified",
      language,
      delivery_method: "mailto",
    });

    window.location.href = `mailto:${LEGAL.generalEmail}?subject=${encodeURIComponent(`${page.it.subject} – ${selectedServiceLabel}`)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/[0.07] px-4 py-2 text-sm font-semibold text-primary">{page.badge}</span>
            <h1 className="mt-6 font-display text-4xl font-extrabold tracking-[-0.03em] text-foreground sm:text-5xl">{page.title}</h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{page.intro}</p>
          </div>

          <section className="mx-auto mt-12 max-w-6xl" aria-labelledby="contact-choice-title">
            <h2 id="contact-choice-title" className="text-center font-display text-2xl font-bold text-foreground">{page.chooseTitle}</h2>
            <div className="mt-7 grid gap-6 lg:grid-cols-2">
              <article className={`rounded-3xl border bg-card p-7 shadow-soft transition md:p-9 ${flow === "calendra" ? "border-primary/40 ring-2 ring-primary/10" : "border-border/60"}`}>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/[0.08] text-primary"><CalendarCheck2 className="h-6 w-6" aria-hidden="true" /></div>
                <h3 className="mt-6 font-display text-2xl font-bold text-foreground">{page.calendraCardTitle}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{page.calendraCardBody}</p>
                <ul className="mt-5 grid gap-3 text-sm text-muted-foreground">
                  {page.calendraCardItems.map((item) => <li key={item} className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span>{item}</span></li>)}
                </ul>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button type="button" variant="hero" className="rounded-xl" onClick={() => selectFlow("calendra")}>{page.calendraQuestion}<ArrowRight className="h-4 w-4" /></Button>
                  <Button variant="outline" className="rounded-xl" asChild><a href={TRIAL_SIGNUP_ROUTE}>{page.calendraTrial}</a></Button>
                </div>
              </article>

              <article className={`rounded-3xl border bg-card p-7 shadow-soft transition md:p-9 ${flow === "it" ? "border-primary/40 ring-2 ring-primary/10" : "border-border/60"}`}>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/[0.08] text-primary"><Laptop className="h-6 w-6" aria-hidden="true" /></div>
                <h3 className="mt-6 font-display text-2xl font-bold text-foreground">{page.itCardTitle}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{page.itCardBody}</p>
                <ul className="mt-5 grid gap-3 text-sm text-muted-foreground">
                  {page.itCardItems.map((item) => <li key={item} className="flex items-start gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span>{item}</span></li>)}
                </ul>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button type="button" variant="hero" className="rounded-xl" onClick={() => selectFlow("it")}>{page.itQuestion}<ArrowRight className="h-4 w-4" /></Button>
                  <Button variant="outline" className="rounded-xl" asChild><a href={getRoutePath("itServices", language)}>{page.itOverview}</a></Button>
                </div>
              </article>
            </div>
          </section>

          {flow && (
            <div ref={formRef} id="contact-form" className="mx-auto mt-12 grid max-w-6xl scroll-mt-28 gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
              <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft md:p-9" aria-labelledby="contact-form-title">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 id="contact-form-title" className="font-display text-2xl font-bold text-foreground">{flow === "calendra" ? page.calendra.formTitle : page.it.formTitle}</h2>
                    <p className="mt-3 leading-7 text-muted-foreground">{page.common.formIntro}</p>
                  </div>
                  <button type="button" className="shrink-0 text-left text-sm font-semibold text-primary hover:underline" onClick={() => setFlow(null)}>{page.changeChoice}</button>
                </div>

                {flow === "calendra" ? (
                  <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleCalendraSubmit}>
                    <CommonFields page={page.common} name={name} company={company} email={email} phone={phone} setName={setName} setCompany={setCompany} setEmail={setEmail} setPhone={setPhone} />
                    <div className="md:col-span-2">
                      <label htmlFor="calendra-contact-topic" className="mb-2 block text-sm font-semibold text-foreground">{page.calendra.topic}</label>
                      <select id="calendra-contact-topic" value={topic} onChange={(event) => setTopic(event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="">{page.calendra.selectTopic}</option>
                        {page.calendra.topics.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                    <MessageAndSubmit page={page.common} message={message} setMessage={setMessage} placeholder={page.calendra.messagePlaceholder} submit={page.calendra.submit} />
                  </form>
                ) : (
                  <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleItSubmit}>
                    <CommonFields page={page.common} name={name} company={company} email={email} phone={phone} setName={setName} setCompany={setCompany} setEmail={setEmail} setPhone={setPhone} />
                    <div>
                      <label htmlFor="it-contact-service" className="mb-2 block text-sm font-semibold text-foreground">{page.it.service}</label>
                      <select id="it-contact-service" value={service} onChange={(event) => setService(event.target.value as ItServiceRouteKey | "other" | "")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="">{page.it.selectService}</option>
                        {IT_SERVICE_ROUTE_KEYS.map((routeKey) => <option key={routeKey} value={routeKey}>{getItServiceContent(routeKey, language).title}</option>)}
                        <option value="other">{page.it.other}</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="it-contact-size" className="mb-2 block text-sm font-semibold text-foreground">{page.it.companySize}</label>
                      <select id="it-contact-size" value={companySize} onChange={(event) => setCompanySize(event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="">—</option>
                        {page.it.companySizeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="it-contact-cooperation" className="mb-2 block text-sm font-semibold text-foreground">{page.it.cooperation}</label>
                      <select id="it-contact-cooperation" value={cooperation} onChange={(event) => setCooperation(event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="">—</option>
                        {page.it.cooperationOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="it-contact-urgency" className="mb-2 block text-sm font-semibold text-foreground">{page.it.urgency}</label>
                      <select id="it-contact-urgency" value={urgency} onChange={(event) => setUrgency(event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="">—</option>
                        {page.it.urgencyOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="it-contact-website" className="mb-2 block text-sm font-semibold text-foreground">{page.it.website}</label>
                      <Input id="it-contact-website" type="text" inputMode="url" placeholder={page.it.websitePlaceholder} value={website} onChange={(event) => setWebsite(event.target.value)} />
                    </div>
                    <MessageAndSubmit page={page.common} message={message} setMessage={setMessage} placeholder={page.it.messagePlaceholder} submit={page.it.submit} />
                  </form>
                )}
              </section>

              <ContactAside page={page} language={language} />
            </div>
          )}

          {!flow && (
            <div className="mx-auto mt-12 max-w-6xl">
              <ContactAside page={page} language={language} horizontal />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

type CommonCopy = (typeof copy)["sl"]["common"] | (typeof copy)["en"]["common"];

const CommonFields = ({
  page,
  name,
  company,
  email,
  phone,
  setName,
  setCompany,
  setEmail,
  setPhone,
}: {
  page: CommonCopy;
  name: string;
  company: string;
  email: string;
  phone: string;
  setName: (value: string) => void;
  setCompany: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
}) => (
  <>
    <div>
      <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-foreground">{page.name} *</label>
      <Input id="contact-name" required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
    </div>
    <div>
      <label htmlFor="contact-company" className="mb-2 block text-sm font-semibold text-foreground">{page.company}</label>
      <Input id="contact-company" autoComplete="organization" value={company} onChange={(event) => setCompany(event.target.value)} />
    </div>
    <div>
      <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-foreground">{page.email} *</label>
      <Input id="contact-email" required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
    </div>
    <div>
      <label htmlFor="contact-phone" className="mb-2 block text-sm font-semibold text-foreground">{page.phone}</label>
      <Input id="contact-phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
    </div>
  </>
);

const MessageAndSubmit = ({ page, message, setMessage, placeholder, submit }: { page: CommonCopy; message: string; setMessage: (value: string) => void; placeholder: string; submit: string }) => (
  <>
    <div className="md:col-span-2">
      <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-foreground">{page.message} *</label>
      <Textarea id="contact-message" required className="min-h-40" placeholder={placeholder} value={message} onChange={(event) => setMessage(event.target.value)} />
    </div>
    <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="max-w-xl text-sm leading-6 text-muted-foreground">{page.privacy}</p>
      <Button type="submit" variant="hero" size="lg" className="shrink-0 rounded-xl"><Send className="h-4 w-4" />{submit}</Button>
    </div>
  </>
);

const ContactAside = ({ page, language, horizontal = false }: { page: (typeof copy)["sl"] | (typeof copy)["en"]; language: "sl" | "en"; horizontal?: boolean }) => (
  <aside className={horizontal ? "grid gap-5 md:grid-cols-3" : "grid gap-5"}>
    <section className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
      <Mail className="h-7 w-7 text-primary" aria-hidden="true" />
      <h2 className="mt-5 text-xl font-bold text-foreground">{page.directTitle}</h2>
      <p className="mt-3 leading-7 text-muted-foreground">{page.directBody}</p>
      <div className="mt-6 grid gap-3 text-sm">
        <a href={`mailto:${LEGAL.generalEmail}`} className="flex items-center gap-3 font-semibold text-primary"><Mail className="h-4 w-4" />{LEGAL.generalEmail}</a>
        <a href={`tel:${LEGAL.supportPhoneTel}`} className="flex items-center gap-3 font-semibold text-primary"><Phone className="h-4 w-4" />{LEGAL.supportPhone}</a>
      </div>
    </section>

    <section className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
      <Headphones className="h-7 w-7 text-primary" aria-hidden="true" />
      <div className="mt-5 flex items-start gap-3"><Clock3 className="mt-1 h-5 w-5 shrink-0 text-primary" /><div><p className="font-semibold text-foreground">{page.hours}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{page.hoursValue}</p></div></div>
      <div className="mt-5 flex items-start gap-3"><MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" /><div><p className="font-semibold text-foreground">{page.location}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{page.locationValue}</p></div></div>
    </section>

    <section className="rounded-3xl border border-primary/15 bg-primary/[0.05] p-7">
      <ShieldCheck className="h-7 w-7 text-primary" aria-hidden="true" />
      <h2 className="mt-5 text-xl font-bold text-foreground">{page.trustTitle}</h2>
      <p className="mt-3 leading-7 text-muted-foreground">{page.trustBody}</p>
      <a href={`${getRoutePath("contact", language)}?type=it`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">{page.itQuestion}<ArrowRight className="h-4 w-4" /></a>
    </section>
  </aside>
);

export default ContactPage;
