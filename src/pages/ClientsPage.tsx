import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { APP_BASE_URL } from "@/lib/site";
import { getDirectoryClientBookingPath, normalizeDirectoryClients, type ClientCategory, type DirectoryClient } from "@/lib/company-directory";
import { useSiteLanguage, type SiteLanguage } from "@/lib/site-language";
import {
  getPublicCompanyProfilePath,
  publicCompanyProfiles,
} from "@/lib/public-company-profiles";
import { trackMarketingEvent } from "@/lib/marketing-events";
import {
  ArrowRight,
  BellRing,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Link2,
  MapPin,
  MessageSquareText,
  MonitorSmartphone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserRoundCheck,
  Users,
  WalletCards,
} from "lucide-react";

const categoryLabels: Record<ClientCategory, Record<SiteLanguage, string>> = {
  salon: { sl: "Salon", en: "Salon" },
  fitness: { sl: "Fitnes", en: "Fitness" },
  wellness: { sl: "Wellness", en: "Wellness" },
  health: { sl: "Zdravje", en: "Health" },
  consulting: { sl: "Svetovanje", en: "Consulting" },
};

const categoryClasses: Record<ClientCategory, string> = {
  salon: "bg-primary/[0.08] text-primary",
  fitness: "bg-blue-500/[0.10] text-blue-700",
  wellness: "bg-violet-500/[0.10] text-violet-700",
  health: "bg-emerald-500/[0.10] text-emerald-700",
  consulting: "bg-accent/[0.12] text-orange-700",
};

const copy = {
  sl: {
    badge: "Spletno naročanje s Calendro",
    title: "Rezervirajte termin ali ponudite spletno naročanje svojim strankam",
    intro:
      "Stranka izbere storitev, zaposlenega, datum in način plačila. Calendra preveri dejansko razpoložljivost, zapiše termin v koledar in pošlje ustrezna obvestila.",
    heroPrimary: "Poiščite podjetje",
    heroSecondary: "Omogočite naročanje",
    screenshotAlt: "Koledar in rezervacije v aplikaciji Calendra",
    workflowEyebrow: "Preprost rezervacijski tok",
    workflowTitle: "Kako stranka rezervira termin",
    workflowItems: [
      { title: "Izbere storitev", description: "Prikažejo se storitve, ki jih podjetje omogoča prek spleta." },
      { title: "Izbere zaposlenega", description: "Kadar je izbira vključena, stranka izbere želenega izvajalca ali prvega prostega." },
      { title: "Izbere prost termin", description: "Calendra upošteva delovni čas, odsotnosti, druge rezervacije, prostore in pravila storitve." },
      { title: "Potrdi rezervacijo", description: "Stranka pregleda podatke, izbere plačilo in prejme potrditev." },
    ],
    capabilities: [
      { title: "Prilagodljiva izbira zaposlenega", description: "Korak izbire zaposlenega lahko vključite ali izpustite glede na storitev in način dela." },
      { title: "Predplačilo, celotno plačilo ali plačilo na lokaciji", description: "Za vsako ponudbo določite podprte načine plačila in višino zahtevanega predplačila." },
      { title: "Potrditev, sprememba in odpoved", description: "Stranka prejme jasne informacije ter lahko prek varne povezave spremeni ali odpove termin." },
      { title: "SMS in e-poštni opomniki", description: "Avtomatska obvestila zmanjšajo pozabljene termine in količino ročnega usklajevanja." },
      { title: "Vtičnik ali javna povezava", description: "Naročanje vgradite na svojo spletno stran ali delite samostojno javno povezavo." },
      { title: "Takojšen zapis v koledar", description: "Potrjena rezervacija se brez prepisovanja pojavi v Calendri in pri izbranem zaposlenem." },
    ],
    directoryEyebrow: "Naročanje pri podjetjih",
    directoryTitle: "Poiščite podjetje in rezervirajte termin",
    directoryIntro: "Spodaj so javno objavljena podjetja, ki uporabljajo Calendro in so omogočila prikaz v imeniku.",
    searchPlaceholder: "Išči po imenu, storitvi ali lokaciji …",
    filters: ["Vse", "Salon", "Fitnes", "Wellness", "Zdravje", "Svetovanje"],
    primaryCta: "Rezerviraj termin",
    profileCta: "Poglej profil",
    loading: "Osvežujem seznam podjetij …",
    emptyTitle: "Ni zadetkov",
    emptyBody: "Poskusite z drugim iskalnim izrazom ali filtrom.",
    faqEyebrow: "Pogosta vprašanja",
    faqTitle: "Spletno naročanje brez tehničnih zapletov",
    faq: [
      { q: "Ali potrebujem novo spletno stran?", a: "Ne. Uporabite lahko javno povezavo ali pa Calendra vtičnik dodate na obstoječo spletno stran." },
      { q: "Kaj se zgodi, če storitev izvaja več zaposlenih?", a: "Podjetje določi, ali stranka izbere zaposlenega, ali Calendra ponudi prvega razpoložljivega izvajalca." },
      { q: "Ali lahko zahtevam plačilo pred rezervacijo?", a: "Da. Glede na nastavitve je mogoče zahtevati delno ali celotno plačilo ali dovoliti plačilo na lokaciji." },
      { q: "Ali lahko stranka spremeni ali odpove termin?", a: "Da, kadar podjetje to omogoči. Varne povezave v potrditvenem sporočilu vodijo do spremembe ali odpovedi." },
      { q: "Ali se rezervacija takoj prikaže v koledarju?", a: "Da. Po uspešni potrditvi se termin zapiše neposredno v koledar Calendra." },
    ],
    ctaEyebrow: "Za storitvena podjetja",
    ctaTitle: "Omogočite naročanje 24 ur na dan",
    ctaDescription: "Začnite s 14-dnevnim brezplačnim preizkusom in nastavite svoj rezervacijski tok brez kreditne kartice.",
    ctaButton: "Preizkusite brezplačno",
  },
  en: {
    badge: "Online booking with Calendra",
    title: "Book an appointment or offer online booking to your customers",
    intro:
      "The customer chooses a service, employee, date and payment method. Calendra checks real availability, adds the appointment to the calendar and sends the right notifications.",
    heroPrimary: "Find a business",
    heroSecondary: "Enable online booking",
    screenshotAlt: "Calendar and appointments in the Calendra application",
    workflowEyebrow: "A simple booking flow",
    workflowTitle: "How a customer books",
    workflowItems: [
      { title: "Choose a service", description: "The customer sees services that the business has made available online." },
      { title: "Choose an employee", description: "When enabled, the customer selects a preferred provider or the first available person." },
      { title: "Choose an available time", description: "Calendra considers working hours, absences, other bookings, resources and service rules." },
      { title: "Confirm the booking", description: "The customer reviews the details, selects payment and receives confirmation." },
    ],
    capabilities: [
      { title: "Flexible employee selection", description: "The employee step can be enabled or skipped based on the service and workflow." },
      { title: "Deposit, full payment or pay on site", description: "Choose supported payment methods and the required deposit for each offer." },
      { title: "Confirmation, rescheduling and cancellation", description: "Customers receive clear information and can use secure links to change or cancel." },
      { title: "SMS and email reminders", description: "Automatic notifications reduce missed appointments and manual coordination." },
      { title: "Website widget or public link", description: "Embed booking on your website or share a standalone public booking link." },
      { title: "Immediate calendar entry", description: "A confirmed booking appears in Calendra and for the selected employee without re-entering data." },
    ],
    directoryEyebrow: "Book with a business",
    directoryTitle: "Find a business and book an appointment",
    directoryIntro: "These businesses use Calendra and have enabled public visibility in the directory.",
    searchPlaceholder: "Search by name, service or location …",
    filters: ["All", "Salon", "Fitness", "Wellness", "Health", "Consulting"],
    primaryCta: "Book an appointment",
    profileCta: "View profile",
    loading: "Refreshing businesses …",
    emptyTitle: "No results",
    emptyBody: "Try a different search term or filter.",
    faqEyebrow: "Frequently asked questions",
    faqTitle: "Online booking without technical friction",
    faq: [
      { q: "Do I need a new website?", a: "No. You can use a public link or add the Calendra widget to your existing website." },
      { q: "What happens when several employees provide a service?", a: "The business decides whether customers select an employee or Calendra offers the first available provider." },
      { q: "Can payment be required before booking?", a: "Yes. Depending on configuration, the business can require a deposit, full payment or payment on site." },
      { q: "Can a customer reschedule or cancel?", a: "Yes, when enabled by the business. Secure links in the confirmation message open the change or cancellation flow." },
      { q: "Does the booking appear immediately in the calendar?", a: "Yes. After successful confirmation, the appointment is added directly to the Calendra calendar." },
    ],
    ctaEyebrow: "For service businesses",
    ctaTitle: "Accept bookings 24 hours a day",
    ctaDescription: "Start a 14-day free trial and configure your booking flow without a credit card.",
    ctaButton: "Try it free",
  },
} as const;

const filterCategoryMap: Record<SiteLanguage, Record<string, ClientCategory | "all">> = {
  sl: { Vse: "all", Salon: "salon", Fitnes: "fitness", Wellness: "wellness", Zdravje: "health", Svetovanje: "consulting" },
  en: { All: "all", Salon: "salon", Fitness: "fitness", Wellness: "wellness", Health: "health", Consulting: "consulting" },
};

const initialsFor = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("") || "C";

const mergeClients = (language: SiteLanguage, apiClients: DirectoryClient[]) => {
  const staticClients: DirectoryClient[] = publicCompanyProfiles
    .filter((profile) => profile.publicEnabled)
    .map((profile) => ({ ...profile, description: profile.localizedDescription[language] }));

  const merged = new Map<string, DirectoryClient>();
  staticClients.forEach((client) => merged.set(client.slug, client));
  apiClients.forEach((client) => {
    const matchingStatic = staticClients.find((item) => item.slug === client.slug || item.name.toLowerCase() === client.name.toLowerCase());
    merged.set(matchingStatic?.slug ?? client.slug, {
      ...matchingStatic,
      ...client,
      slug: matchingStatic?.slug ?? client.slug,
      tenantCode: client.tenantCode || matchingStatic?.tenantCode,
      description: client.description || matchingStatic?.description || "",
    });
  });
  return Array.from(merged.values());
};

const capabilityIcons = [UserRoundCheck, WalletCards, MessageSquareText, BellRing, MonitorSmartphone, CalendarDays] as const;
const workflowIcons = [Sparkles, Users, CalendarDays, ShieldCheck] as const;

const ClientsPage = () => {
  const { language } = useSiteLanguage();
  const text = copy[language];
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ClientCategory | "all">("all");
  const [apiClients, setApiClients] = useState<DirectoryClient[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setRefreshing(true);
    fetch(`${APP_BASE_URL}/api/public/company-directory`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Directory request failed: ${response.status}`);
        return response.json();
      })
      .then((data) => setApiClients(normalizeDirectoryClients(data, APP_BASE_URL)))
      .catch((error) => {
        if (error?.name !== "AbortError") console.warn("Public directory could not be refreshed.", error);
      })
      .finally(() => setRefreshing(false));
    return () => controller.abort();
  }, []);

  const directoryClients = useMemo(() => mergeClients(language, apiClients), [apiClients, language]);

  const filteredClients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return directoryClients.filter((client) => {
      const matchesFilter = activeCategory === "all" || client.category === activeCategory;
      const searchableText = [client.name, client.address, client.category ? categoryLabels[client.category][language] : "", client.description].join(" ").toLowerCase();
      return matchesFilter && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [activeCategory, directoryClients, language, query]);

  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <Navbar />
      <main>
        <section className="relative border-b border-border/50 bg-gradient-to-br from-background via-card to-primary/[0.05] py-16 md:py-24">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/[0.08] blur-3xl" aria-hidden="true" />
          <div className="absolute -right-24 top-28 h-80 w-80 rounded-full bg-primary/[0.10] blur-3xl" aria-hidden="true" />
          <div className="container relative mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/[0.08] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary"><Sparkles className="h-4 w-4" />{text.badge}</div>
              <h1 className="mt-7 font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">{text.title}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">{text.intro}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="hero" size="lg" className="rounded-xl" asChild><a href="#podjetja">{text.heroPrimary}<ArrowRight className="h-4 w-4" /></a></Button>
                <Button variant="outline" size="lg" className="rounded-xl" asChild><a href={TRIAL_SIGNUP_ROUTE}>{text.heroSecondary}</a></Button>
              </div>
            </div>
            <div className="relative rounded-[1.75rem] border border-white/80 bg-white/75 p-3 shadow-[0_30px_80px_-35px_hsl(var(--primary)/0.45)]">
              <img src="/hero/calendra-calendar.webp" alt={text.screenshotAlt} width="2048" height="782" loading="eager" decoding="async" className="w-full rounded-[1.3rem] border border-border/60" />
              <div className="absolute -bottom-6 left-6 hidden rounded-2xl border border-border/60 bg-card p-4 shadow-soft sm:flex sm:items-center sm:gap-3"><CheckCircle2 className="h-6 w-6 text-primary" /><span className="text-sm font-semibold text-foreground">{language === "sl" ? "Rezervacija se takoj zapiše v koledar" : "The booking is added to the calendar immediately"}</span></div>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 py-20 lg:px-8 md:py-28">
          <div className="mx-auto max-w-3xl text-center"><span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{text.workflowEyebrow}</span><h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{text.workflowTitle}</h2></div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{text.workflowItems.map((item, index) => { const Icon = workflowIcons[index]; return <article key={item.title} className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/[0.08] text-primary"><Icon className="h-5 w-5" /></span><p className="mt-5 text-xs font-black uppercase tracking-[0.15em] text-primary">{language === "sl" ? "Korak" : "Step"} {index + 1}</p><h3 className="mt-2 text-lg font-bold text-foreground">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p></article>; })}</div>
        </section>

        <section className="bg-card py-20 md:py-28">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{text.capabilities.map((item, index) => { const Icon = capabilityIcons[index]; return <article key={item.title} className="rounded-3xl border border-border/60 bg-background p-7"><Icon className="h-7 w-7 text-primary" /><h2 className="mt-5 text-xl font-bold text-foreground">{item.title}</h2><p className="mt-3 leading-7 text-muted-foreground">{item.description}</p></article>; })}</div>
          </div>
        </section>

        <section id="podjetja" className="scroll-mt-24 bg-background py-20 md:py-28">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-3xl"><span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{text.directoryEyebrow}</span><h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{text.directoryTitle}</h2><p className="mt-4 text-lg leading-8 text-muted-foreground">{text.directoryIntro}</p></div>
            <div className="mt-9 rounded-3xl border border-border/70 bg-card p-4 shadow-soft md:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-lg"><Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.searchPlaceholder} className="h-14 rounded-2xl border-border bg-background pl-12 text-base shadow-sm" /></div>
                <div className="flex flex-wrap gap-2">{text.filters.map((filter) => { const filterCategory = filterCategoryMap[language][filter] ?? "all"; const isActive = activeCategory === filterCategory; return <button key={filter} type="button" onClick={() => setActiveCategory(filterCategory)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${isActive ? "border-primary/20 bg-primary/[0.10] text-primary shadow-sm" : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"}`}>{filter}</button>; })}</div>
              </div>
              {refreshing ? <p className="mt-3 text-xs text-muted-foreground">{text.loading}</p> : null}
            </div>

            {filteredClients.length > 0 ? (
              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredClients.map((client) => (
                  <article key={client.slug} className="group flex flex-col rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-glow">
                    <div className="flex items-start justify-between gap-4"><div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-background text-lg font-black text-primary shadow-soft">{client.logoUrl ? <img src={client.logoUrl} alt={language === "sl" ? `Logotip podjetja ${client.name}` : `${client.name} company logo`} width="64" height="64" className="h-full w-full object-contain p-1.5" loading="lazy" decoding="async" /> : initialsFor(client.name)}</div>{client.category ? <div className={`rounded-full px-3 py-1 text-xs font-bold ${categoryClasses[client.category]}`}>{categoryLabels[client.category][language]}</div> : null}</div>
                    <h3 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-foreground"><a href={getPublicCompanyProfilePath(client.slug, language)} className="transition hover:text-primary">{client.name}</a></h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{client.description}</p>
                    {client.address ? <a href={client.googleMapsUrl} target="_blank" rel="noreferrer noopener" className="mt-5 flex items-start gap-2 rounded-2xl bg-background p-4 text-sm text-muted-foreground transition hover:text-primary"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{client.address}</span><ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0" /></a> : null}
                    <div className="mt-6 grid gap-3"><Button variant="hero" size="lg" className="rounded-2xl" asChild><a href={getDirectoryClientBookingPath(client)} onClick={() => trackMarketingEvent("public_booking_started", { company_slug: client.slug, company_name: client.name, tenant_code: client.tenantCode || client.tenantSlug || client.slug, language, source: "directory" })}>{text.primaryCta}<ArrowRight className="h-4 w-4" /></a></Button><Button variant="ghost" asChild><a href={getPublicCompanyProfilePath(client.slug, language)}>{text.profileCta}</a></Button></div>
                  </article>
                ))}
              </div>
            ) : <div className="mt-8 rounded-3xl border border-dashed border-border bg-card p-10 text-center shadow-soft"><Search className="mx-auto h-7 w-7 text-primary" /><h3 className="mt-5 text-2xl font-bold text-foreground">{text.emptyTitle}</h3><p className="mt-2 text-muted-foreground">{text.emptyBody}</p></div>}
          </div>
        </section>

        <section className="bg-card py-20 md:py-28">
          <div className="container mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.75fr_1.25fr] lg:px-8"><div><span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{text.faqEyebrow}</span><h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{text.faqTitle}</h2><Link2 className="mt-7 h-9 w-9 text-primary" /></div><div className="grid gap-3">{text.faq.map((item) => <details key={item.q} className="rounded-2xl border border-border/60 bg-background p-5"><summary className="cursor-pointer list-none font-semibold text-foreground">{item.q}</summary><p className="mt-3 leading-7 text-muted-foreground">{item.a}</p></details>)}</div></div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 py-16 lg:px-8 md:py-24">
          <div className="overflow-hidden rounded-[2rem] border border-primary/10 bg-gradient-to-br from-primary/[0.10] via-card to-accent/[0.08] p-8 shadow-soft md:p-12"><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">{text.ctaEyebrow}</p><h2 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-4xl">{text.ctaTitle}</h2><p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{text.ctaDescription}</p></div><Button variant="hero" size="lg" className="rounded-xl" asChild><a href={TRIAL_SIGNUP_ROUTE}>{text.ctaButton}<ArrowRight className="h-4 w-4" /></a></Button></div></div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ClientsPage;
