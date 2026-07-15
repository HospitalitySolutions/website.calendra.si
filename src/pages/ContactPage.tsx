import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getItServiceContent, IT_SERVICE_ROUTE_KEYS, type ItServiceRouteKey } from "@/lib/it-services";
import { LEGAL } from "@/lib/legal";
import { trackMarketingEvent } from "@/lib/marketing-events";
import { getRoutePath } from "@/lib/localized-routes";
import { useSiteLanguage } from "@/lib/site-language";
import { ArrowRight, Clock3, Mail, MapPin, Phone, Send, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const copy = {
  sl: {
    badge: "Kontakt in povpraševanje",
    title: "Kako vam lahko pomagamo pri IT-ju?",
    intro:
      "Opišite trenutno težavo, projekt ali cilj. Na podlagi informacij bomo predlagali naslednji korak in primeren način sodelovanja. IT storitve se dogovorijo ločeno od naročnine Calendra.",
    formTitle: "Pripravite povpraševanje",
    formIntro: "Po oddaji se odpre vaš e-poštni program z že pripravljenim sporočilom. Pred pošiljanjem ga lahko še dopolnite.",
    name: "Ime in priimek",
    company: "Podjetje",
    email: "E-pošta",
    phone: "Telefon",
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
    message: "Kaj potrebujete?",
    messagePlaceholder: "Opišite trenutno stanje, težavo, cilj, uporabljene sisteme in morebitne roke.",
    privacy: "Podatke bomo uporabili samo za obravnavo vašega povpraševanja.",
    submit: "Pripravi e-poštno povpraševanje",
    directTitle: "Raje stopite v stik neposredno?",
    directBody: "Dosegljivi smo po e-pošti in telefonu. Za učinkovitejši prvi odgovor vključite kratek opis težave ali projekta.",
    hours: "Delovni čas podpore",
    hoursValue: "ponedeljek–petek, 8.00–16.00",
    location: "Lokacija",
    locationValue: "Slovenija; oddaljena pomoč in obiski po dogovoru",
    trustTitle: "Jasen začetek sodelovanja",
    trustBody: "Pred začetkom potrdimo obseg, odgovornosti, način obračuna in pričakovani časovni okvir.",
    back: "Preglejte vse IT storitve",
    subject: "Povpraševanje za IT storitve",
  },
  en: {
    badge: "Contact and enquiry",
    title: "How can we help with your IT?",
    intro:
      "Describe the current issue, project or goal. We will suggest a sensible next step and cooperation model. IT services are agreed separately from a Calendra subscription.",
    formTitle: "Prepare an enquiry",
    formIntro: "Submitting the form opens your email application with a prepared message that you can review before sending.",
    name: "Full name",
    company: "Company",
    email: "Email",
    phone: "Phone",
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
    message: "What do you need?",
    messagePlaceholder: "Describe the current situation, problem, goal, existing systems and any deadlines.",
    privacy: "We will use the information only to respond to your enquiry.",
    submit: "Prepare email enquiry",
    directTitle: "Prefer to contact us directly?",
    directBody: "We are available by email and phone. Include a short description of the issue or project for a more useful first response.",
    hours: "Support hours",
    hoursValue: "Monday–Friday, 08:00–16:00",
    location: "Location",
    locationValue: "Slovenia; remote help and on-site work by agreement",
    trustTitle: "A clear start to the engagement",
    trustBody: "Before work starts, we confirm the scope, responsibilities, billing model and expected timeframe.",
    back: "Explore all IT services",
    subject: "IT services enquiry",
  },
} as const;

const ContactPage = () => {
  const { language } = useSiteLanguage();
  const page = copy[language];
  const [searchParams] = useSearchParams();
  const requestedService = searchParams.get("service") as ItServiceRouteKey | null;
  const validRequestedService = requestedService && IT_SERVICE_ROUTE_KEYS.includes(requestedService) ? requestedService : "";

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState<ItServiceRouteKey | "other" | "">(validRequestedService);
  const [companySize, setCompanySize] = useState("");
  const [cooperation, setCooperation] = useState("");
  const [urgency, setUrgency] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (validRequestedService) setService(validRequestedService);
  }, [validRequestedService]);

  const selectedServiceLabel = useMemo(() => {
    if (service === "other") return page.other;
    if (!service) return "-";
    return getItServiceContent(service, language).title;
  }, [language, page.other, service]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const body = [
      `${page.name}: ${name}`,
      `${page.company}: ${company || "-"}`,
      `${page.email}: ${email}`,
      `${page.phone}: ${phone || "-"}`,
      `${page.service}: ${selectedServiceLabel}`,
      `${page.companySize}: ${companySize || "-"}`,
      `${page.cooperation}: ${cooperation || "-"}`,
      `${page.urgency}: ${urgency || "-"}`,
      `${page.website}: ${website || "-"}`,
      "",
      `${page.message}:`,
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

    window.location.href = `mailto:${LEGAL.generalEmail}?subject=${encodeURIComponent(`${page.subject} – ${selectedServiceLabel}`)}&body=${encodeURIComponent(body)}`;
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

          <div className="mx-auto mt-12 grid max-w-6xl gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
            <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft md:p-9" aria-labelledby="it-contact-form-title">
              <h2 id="it-contact-form-title" className="font-display text-2xl font-bold text-foreground">{page.formTitle}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{page.formIntro}</p>

              <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="it-contact-name" className="mb-2 block text-sm font-semibold text-foreground">{page.name} *</label>
                  <Input id="it-contact-name" required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
                </div>
                <div>
                  <label htmlFor="it-contact-company" className="mb-2 block text-sm font-semibold text-foreground">{page.company}</label>
                  <Input id="it-contact-company" autoComplete="organization" value={company} onChange={(event) => setCompany(event.target.value)} />
                </div>
                <div>
                  <label htmlFor="it-contact-email" className="mb-2 block text-sm font-semibold text-foreground">{page.email} *</label>
                  <Input id="it-contact-email" required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>
                <div>
                  <label htmlFor="it-contact-phone" className="mb-2 block text-sm font-semibold text-foreground">{page.phone}</label>
                  <Input id="it-contact-phone" type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
                </div>
                <div>
                  <label htmlFor="it-contact-service" className="mb-2 block text-sm font-semibold text-foreground">{page.service}</label>
                  <select
                    id="it-contact-service"
                    value={service}
                    onChange={(event) => setService(event.target.value as ItServiceRouteKey | "other" | "")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">{page.selectService}</option>
                    {IT_SERVICE_ROUTE_KEYS.map((routeKey) => (
                      <option key={routeKey} value={routeKey}>{getItServiceContent(routeKey, language).title}</option>
                    ))}
                    <option value="other">{page.other}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="it-contact-size" className="mb-2 block text-sm font-semibold text-foreground">{page.companySize}</label>
                  <select id="it-contact-size" value={companySize} onChange={(event) => setCompanySize(event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="">—</option>
                    {page.companySizeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="it-contact-cooperation" className="mb-2 block text-sm font-semibold text-foreground">{page.cooperation}</label>
                  <select id="it-contact-cooperation" value={cooperation} onChange={(event) => setCooperation(event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="">—</option>
                    {page.cooperationOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="it-contact-urgency" className="mb-2 block text-sm font-semibold text-foreground">{page.urgency}</label>
                  <select id="it-contact-urgency" value={urgency} onChange={(event) => setUrgency(event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="">—</option>
                    {page.urgencyOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="it-contact-website" className="mb-2 block text-sm font-semibold text-foreground">{page.website}</label>
                  <Input id="it-contact-website" type="text" inputMode="url" placeholder={page.websitePlaceholder} value={website} onChange={(event) => setWebsite(event.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="it-contact-message" className="mb-2 block text-sm font-semibold text-foreground">{page.message} *</label>
                  <Textarea id="it-contact-message" required className="min-h-40" placeholder={page.messagePlaceholder} value={message} onChange={(event) => setMessage(event.target.value)} />
                </div>
                <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xl text-sm leading-6 text-muted-foreground">{page.privacy}</p>
                  <Button type="submit" variant="hero" size="lg" className="shrink-0 rounded-xl">
                    <Send className="h-4 w-4" />{page.submit}
                  </Button>
                </div>
              </form>
            </section>

            <aside className="grid gap-5">
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
                <div className="flex items-start gap-3"><Clock3 className="mt-1 h-5 w-5 shrink-0 text-primary" /><div><p className="font-semibold text-foreground">{page.hours}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{page.hoursValue}</p></div></div>
                <div className="mt-5 flex items-start gap-3"><MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" /><div><p className="font-semibold text-foreground">{page.location}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{page.locationValue}</p></div></div>
              </section>

              <section className="rounded-3xl border border-primary/15 bg-primary/[0.05] p-7">
                <ShieldCheck className="h-7 w-7 text-primary" aria-hidden="true" />
                <h2 className="mt-5 text-xl font-bold text-foreground">{page.trustTitle}</h2>
                <p className="mt-3 leading-7 text-muted-foreground">{page.trustBody}</p>
              </section>

              <Button variant="outline" size="lg" className="rounded-xl" asChild>
                <a href={getRoutePath("itServices", language)}>{page.back}<ArrowRight className="h-4 w-4" /></a>
              </Button>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
