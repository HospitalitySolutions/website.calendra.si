import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnswerSummary from "@/components/seo/AnswerSummary";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getDirectoryClientBookingPath,
  isDirectoryClientBookingEnabled,
  mergeDirectoryClients,
  normalizeDirectoryClients,
  type ClientCategory,
  type DirectoryClient,
} from "@/lib/company-directory";
import { getRoutePath } from "@/lib/localized-routes";
import { trackMarketingEvent } from "@/lib/marketing-events";
import { getPublicCompanyProfilePath, indexablePublicCompanyProfiles } from "@/lib/public-company-profiles";
import { APP_BASE_URL } from "@/lib/site";
import { useSiteLanguage, type SiteLanguage } from "@/lib/site-language";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Search,
  ShieldCheck,
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
    badge: "Javni imenik Calendra",
    title: "Poiščite podjetje in rezervirajte termin",
    intro:
      "V imeniku so podjetja, ki uporabljajo Calendro in so omogočila javni prikaz. Poiščite ponudnika po imenu, lokaciji ali dejavnosti, odprite njegov javni profil in nadaljujte neposredno v rezervacijo termina.",
    searchPlaceholder: "Išči po imenu, storitvi ali lokaciji …",
    filters: ["Vse", "Salon", "Fitnes", "Wellness", "Zdravje", "Svetovanje"],
    primaryCta: "Rezerviraj termin",
    profileCta: "Poglej profil",
    loading: "Osvežujem seznam podjetij …",
    emptyTitle: "Ni zadetkov",
    emptyBody: "Poskusite z drugim iskalnim izrazom ali filtrom.",
    howEyebrow: "Kako deluje imenik",
    howTitle: "Od iskanja do rezervacije v nekaj korakih",
    howItems: [
      { title: "Poiščite ponudnika", body: "Uporabite iskanje in filtre, da hitro zožite javno objavljena podjetja glede na dejavnost, ime ali lokacijo." },
      { title: "Preglejte javni profil", body: "Pri podjetjih z javnim profilom lahko preverite opis, področja storitev, lokacijo in druge objavljene informacije." },
      { title: "Rezervirajte neposredno", body: "Gumb za naročanje vas odpelje v rezervacijski tok izbranega podjetja, kjer izberete storitev, izvajalca in prost termin." },
    ],
    businessEyebrow: "Za storitvena podjetja",
    businessTitle: "Želite svoje spletno naročanje?",
    businessBody: "Calendra omogoča javno rezervacijsko povezavo, vtičnik za spletno stran, koledar terminov, obvestila in plačila. Imenik je namenjen odkrivanju ponudnikov, predstavitev funkcionalnosti pa je na ločeni strani.",
    businessCta: "Spoznajte spletno naročanje",
  },
  en: {
    badge: "Calendra public directory",
    title: "Find a business and book an appointment",
    intro:
      "The directory lists businesses that use Calendra and have enabled public visibility. Search by business name, location or category, open a public profile and continue directly to that provider's appointment booking flow.",
    searchPlaceholder: "Search by name, service or location …",
    filters: ["All", "Salon", "Fitness", "Wellness", "Health", "Consulting"],
    primaryCta: "Book an appointment",
    profileCta: "View profile",
    loading: "Refreshing businesses …",
    emptyTitle: "No results",
    emptyBody: "Try a different search term or filter.",
    howEyebrow: "How the directory works",
    howTitle: "From discovery to booking in a few steps",
    howItems: [
      { title: "Find a provider", body: "Use search and category filters to narrow the public businesses by activity, business name or location." },
      { title: "Review the public profile", body: "Where a public profile is available, review the business description, service categories, location and other published information." },
      { title: "Book directly", body: "The booking button opens that business's booking flow, where you choose a service, provider and available appointment time." },
    ],
    businessEyebrow: "For service businesses",
    businessTitle: "Want to offer your own online booking?",
    businessBody: "Calendra provides a public booking link, website widget, appointment calendar, notifications and payments. The directory is for discovering providers; the product functionality is explained on a separate page.",
    businessCta: "Explore online booking",
  },
} as const;

const filterCategoryMap: Record<SiteLanguage, Record<string, ClientCategory | "all">> = {
  sl: { Vse: "all", Salon: "salon", Fitnes: "fitness", Wellness: "wellness", Zdravje: "health", Svetovanje: "consulting" },
  en: { All: "all", Salon: "salon", Fitness: "fitness", Wellness: "wellness", Health: "health", Consulting: "consulting" },
};

const initialsFor = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("") || "C";

const mergeClients = (language: SiteLanguage, apiClients: DirectoryClient[]) => {
  const staticClients: DirectoryClient[] = indexablePublicCompanyProfiles
    .map((profile) => ({
      ...profile,
      profileSlug: profile.slug,
      description: profile.localizedDescription[language],
    }));

  return mergeDirectoryClients(apiClients, staticClients);
};

const howIcons = [Search, Building2, CalendarDays] as const;

const BusinessDirectoryPage = () => {
  const { language } = useSiteLanguage();
  const text = copy[language];
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ClientCategory | "all">("all");
  const [apiClients, setApiClients] = useState<DirectoryClient[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setRefreshing(true);
    fetch(`${APP_BASE_URL}/api/public/location-directory`, { signal: controller.signal })
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border/50 bg-gradient-to-br from-background via-card to-primary/[0.05] py-14 md:py-20">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8">
            <PageBreadcrumbs routeKey="businesses" />
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/[0.08] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary"><Building2 className="h-4 w-4" />{text.badge}</div>
              <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">{text.title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">{text.intro}</p>
              <AnswerSummary routeKey="businesses" className="mt-6" />
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 py-14 lg:px-8 md:py-20">
          <div className="rounded-3xl border border-border/70 bg-card p-4 shadow-soft md:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-lg"><Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.searchPlaceholder} className="h-14 rounded-2xl border-border bg-background pl-12 text-base shadow-sm" /></div>
              <div className="flex flex-wrap gap-2">{text.filters.map((filter) => { const filterCategory = filterCategoryMap[language][filter] ?? "all"; const isActive = activeCategory === filterCategory; return <button key={filter} type="button" onClick={() => setActiveCategory(filterCategory)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${isActive ? "border-primary/20 bg-primary/[0.10] text-primary shadow-sm" : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"}`}>{filter}</button>; })}</div>
            </div>
            {refreshing ? <p className="mt-3 text-xs text-muted-foreground">{text.loading}</p> : null}
          </div>

          {filteredClients.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredClients.map((client) => {
                const profilePath = client.profileSlug ? getPublicCompanyProfilePath(client.profileSlug, language) : null;
                const bookingEnabled = isDirectoryClientBookingEnabled(client);
                const bookingPath = getDirectoryClientBookingPath(client);

                return (
                  <article key={client.locationId ? `location-${client.locationId}` : client.slug} className="group flex flex-col rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-glow">
                    <div className="flex items-start justify-between gap-4"><div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-background text-lg font-black text-primary shadow-soft">{client.logoUrl ? <img src={client.logoUrl} alt={language === "sl" ? `Logotip podjetja ${client.name}` : `${client.name} company logo`} width="64" height="64" className="h-full w-full object-contain p-1.5" loading="lazy" decoding="async" /> : initialsFor(client.name)}</div>{client.category ? <div className={`rounded-full px-3 py-1 text-xs font-bold ${categoryClasses[client.category]}`}>{categoryLabels[client.category][language]}</div> : null}</div>
                    <h2 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-foreground">{profilePath ? <a href={profilePath} className="transition hover:text-primary">{client.name}</a> : client.name}</h2>
                    <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{client.description}</p>
                    {client.address ? <a href={client.googleMapsUrl} target="_blank" rel="noreferrer noopener" className="mt-5 flex items-start gap-2 rounded-2xl bg-background p-4 text-sm text-muted-foreground transition hover:text-primary"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{client.address}</span><ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0" /></a> : null}
                    <div className="mt-6 grid gap-3">
                      {bookingEnabled ? <Button variant="hero" size="lg" className="rounded-2xl" asChild><a href={bookingPath} onClick={(event) => { event.preventDefault(); event.stopPropagation(); trackMarketingEvent("public_booking_started", { company_slug: client.slug, company_name: client.name, tenant_code: client.tenantCode || client.tenantSlug || client.slug, location_id: client.locationId, language, source: "directory" }); window.location.assign(bookingPath); }}>{text.primaryCta}<ArrowRight className="h-4 w-4" /></a></Button> : null}
                      {profilePath ? <Button variant="ghost" asChild><a href={profilePath}>{text.profileCta}</a></Button> : null}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : <div className="mt-8 rounded-3xl border border-dashed border-border bg-card p-10 text-center shadow-soft"><Search className="mx-auto h-7 w-7 text-primary" /><h2 className="mt-5 text-2xl font-bold text-foreground">{text.emptyTitle}</h2><p className="mt-2 text-muted-foreground">{text.emptyBody}</p></div>}
        </section>

        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{text.howEyebrow}</p><h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">{text.howTitle}</h2></div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">{text.howItems.map((item, index) => { const Icon = howIcons[index]; return <article key={item.title} className="rounded-3xl border border-border/60 bg-background p-7"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/[0.08] text-primary"><Icon className="h-6 w-6" /></span><h3 className="mt-5 text-xl font-bold text-foreground">{item.title}</h3><p className="mt-3 leading-7 text-muted-foreground">{item.body}</p></article>; })}</div>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 py-16 lg:px-8 md:py-24">
          <div className="grid gap-7 overflow-hidden rounded-[2rem] border border-primary/10 bg-gradient-to-br from-primary/[0.10] via-card to-accent/[0.08] p-8 shadow-soft md:grid-cols-[1fr_auto] md:items-center md:p-12">
            <div><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">{text.businessEyebrow}</p><h2 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-4xl">{text.businessTitle}</h2><p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{text.businessBody}</p></div>
            <Button variant="hero" size="lg" className="rounded-xl" asChild><a href={getRoutePath("booking", language)}>{text.businessCta}<ArrowRight className="h-4 w-4" /></a></Button>
          </div>
          <p className="mx-auto mt-5 flex max-w-xl items-center justify-center gap-2 text-center text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" /><span>{language === "sl" ? "Rezervacija se odpre neposredno v varnem toku izbranega podjetja." : "Booking opens directly in the selected business's secure booking flow."}</span></p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessDirectoryPage;
