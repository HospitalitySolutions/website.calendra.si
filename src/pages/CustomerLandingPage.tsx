import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
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
import { CUSTOMER_LOGIN_ROUTE, CUSTOMER_REGISTER_ROUTE } from "@/lib/routes";
import { getRoutePath } from "@/lib/localized-routes";
import { useSiteLanguage, type SiteLanguage } from "@/lib/site-language";
import { useCustomerSession } from "@/lib/customer-session";
import { trackMarketingEvent } from "@/lib/marketing-events";
import { getPublicCompanyProfilePath, indexablePublicCompanyProfiles } from "@/lib/public-company-profiles";
import { APP_BASE_URL } from "@/lib/site";
import {
  ArrowRight,
  CalendarCheck2,
  Dumbbell,
  ExternalLink,
  Flower2,
  HeartPulse,
  MapPin,
  MessagesSquare,
  Scissors,
  Search,
  UserRoundCheck,
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

const availableCategories: ClientCategory[] = ["salon", "fitness", "wellness", "health", "consulting"];

const initialsFor = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("") || "C";

const mergeClients = (language: SiteLanguage, apiClients: DirectoryClient[]) => {
  const staticClients: DirectoryClient[] = indexablePublicCompanyProfiles.map((profile) => ({
    ...profile,
    profileSlug: profile.slug,
    description: profile.localizedDescription[language],
  }));

  return mergeDirectoryClients(apiClients, staticClients);
};

const normalizeCategory = (value: string | null): ClientCategory | "all" =>
  value && availableCategories.includes(value as ClientCategory) ? value as ClientCategory : "all";

const CustomerLandingPage = () => {
  const { language } = useSiteLanguage();
  const { isAuthenticated } = useCustomerSession();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamString = searchParams.toString();
  const connectPath = getRoutePath("connect", language);

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [locationQuery, setLocationQuery] = useState(searchParams.get("location") || "");
  const [activeCategory, setActiveCategory] = useState<ClientCategory | "all">(normalizeCategory(searchParams.get("category")));
  const [apiClients, setApiClients] = useState<DirectoryClient[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [locationResolved, setLocationResolved] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [hasSearched, setHasSearched] = useState(() =>
    Boolean(searchParams.get("q") || searchParams.get("location") || searchParams.get("category")),
  );

  const text = language === "sl" ? {
    title: "Poiščite ponudnika in rezervirajte termin",
    subtitle: "Enostavno poiščite storitve v svoji bližini in rezervirajte termin, ki vam ustreza.",
    what: "Kaj iščete?",
    whatPlaceholder: "Masaža, frizer, svetovanje …",
    where: "Kje?",
    wherePlaceholder: "Vnesite naslov ali kraj …",
    search: "Poišči",
    popular: "Priljubljene kategorije",
    categories: [
      ["Salon", "salon", Scissors],
      ["Fitnes", "fitness", Dumbbell],
      ["Wellness", "wellness", Flower2],
      ["Zdravje", "health", HeartPulse],
      ["Svetovanje", "consulting", MessagesSquare],
    ] as const,
    results: "Rezultati iskanja",
    resultsCount: (count: number) => `${count} ${count === 1 ? "ponudnik" : "ponudnikov"}`,
    loading: "Iščem ponudnike …",
    emptyTitle: "Ni najdenih ponudnikov",
    emptyBody: "Poskusite z drugim iskalnim izrazom, lokacijo ali kategorijo.",
    locationError: "Lokacije ni bilo mogoče najti.",
    booking: "Rezerviraj termin",
    profile: "Poglej profil",
    benefitsEyebrow: "Calendra Connect",
    benefitsTitle: "Vaši termini in ugodnosti na enem mestu",
    benefits: [
      ["Vsi termini na enem mestu", "Preglejte prihodnje in pretekle rezervacije pri različnih ponudnikih.", CalendarCheck2],
      ["Paketi, članstva in boni", "V denarnici spremljajte kupljene pakete, članstva, bone in preostalo dobroimetje.", WalletCards],
      ["Hitrejše ponovno naročanje", "Ko se vrnete k ponudniku, je naslednja rezervacija hitrejša in preglednejša.", UserRoundCheck],
    ] as const,
    connectCta: "Spoznajte Calendra Connect",
    login: "Prijava za stranke",
    register: "Ustvari brezplačen račun",
    businessEyebrow: "Ste ponudnik storitev?",
    businessTitle: "Calendra pomaga tudi pri upravljanju vašega poslovanja.",
    businessCta: "Calendra za podjetja",
  } : {
    title: "Find a provider and book an appointment",
    subtitle: "Find services near you and book an appointment that suits you.",
    what: "What are you looking for?",
    whatPlaceholder: "Massage, hairdresser, counselling …",
    where: "Where?",
    wherePlaceholder: "Enter an address or place …",
    search: "Search",
    popular: "Popular categories",
    categories: [
      ["Salon", "salon", Scissors],
      ["Fitness", "fitness", Dumbbell],
      ["Wellness", "wellness", Flower2],
      ["Health", "health", HeartPulse],
      ["Consulting", "consulting", MessagesSquare],
    ] as const,
    results: "Search results",
    resultsCount: (count: number) => `${count} ${count === 1 ? "provider" : "providers"}`,
    loading: "Finding providers …",
    emptyTitle: "No providers found",
    emptyBody: "Try another search term, location or category.",
    locationError: "The location could not be found.",
    booking: "Book an appointment",
    profile: "View profile",
    benefitsEyebrow: "Calendra Connect",
    benefitsTitle: "Your appointments and benefits in one place",
    benefits: [
      ["All appointments in one place", "See upcoming and past bookings across different providers.", CalendarCheck2],
      ["Packages, memberships and gift cards", "Keep purchased packages, memberships, gift cards and remaining balances in your wallet.", WalletCards],
      ["Faster repeat booking", "When you return to a provider, your next booking is faster and easier to manage.", UserRoundCheck],
    ] as const,
    connectCta: "Explore Calendra Connect",
    login: "Customer login",
    register: "Create a free account",
    businessEyebrow: "Are you a service provider?",
    businessTitle: "Calendra also helps you run your business.",
    businessCta: "Calendra for business",
  };

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParamString);
    const nextQuery = currentParams.get("q") || "";
    const nextLocation = currentParams.get("location") || "";
    const nextCategory = normalizeCategory(currentParams.get("category"));
    setQuery(nextQuery);
    setLocationQuery(nextLocation);
    setActiveCategory(nextCategory);
    if (nextQuery || nextLocation || nextCategory !== "all") setHasSearched(true);
  }, [searchParamString]);

  useEffect(() => {
    if (!hasSearched) return;

    const controller = new AbortController();
    const currentParams = new URLSearchParams(searchParamString);
    const activeLocation = currentParams.get("location")?.trim() || "";
    const endpoint = activeLocation
      ? `/api/public/location-directory/nearby?${new URLSearchParams({ address: activeLocation, limit: "100" }).toString()}`
      : "/api/public/location-directory";

    setRefreshing(true);
    setLocationError("");

    fetch(endpoint, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json().catch(() => null) as { message?: string } | null;
          throw new Error(payload?.message || `${text.locationError} (${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        const payload = activeLocation && data && typeof data === "object" && Array.isArray((data as { items?: unknown[] }).items)
          ? (data as { items: Array<{ location?: unknown }> }).items.map((item) => item.location).filter(Boolean)
          : data;
        setApiClients(normalizeDirectoryClients(payload, APP_BASE_URL));
        setLocationResolved(Boolean(activeLocation));
      })
      .catch((error) => {
        if (error?.name !== "AbortError") {
          console.warn("Public location search could not be refreshed.", error);
          setApiClients([]);
          setLocationResolved(false);
          setLocationError(error instanceof Error ? error.message : text.locationError);
        }
      })
      .finally(() => setRefreshing(false));

    return () => controller.abort();
  }, [hasSearched, searchParamString, text.locationError]);

  const directoryClients = useMemo(
    () => locationResolved ? apiClients : mergeClients(language, apiClients),
    [apiClients, language, locationResolved],
  );

  const filteredClients = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(language === "sl" ? "sl" : "en");
    const normalizedLocation = locationQuery.trim().toLocaleLowerCase(language === "sl" ? "sl" : "en");

    return directoryClients.filter((client) => {
      const matchesCategory = activeCategory === "all" || client.category === activeCategory;
      const searchableText = [client.name, client.category ? categoryLabels[client.category][language] : "", client.description]
        .join(" ")
        .toLocaleLowerCase(language === "sl" ? "sl" : "en");
      const locationText = client.address.toLocaleLowerCase(language === "sl" ? "sl" : "en");

      return matchesCategory
        && (!normalizedQuery || searchableText.includes(normalizedQuery))
        && (locationResolved || !normalizedLocation || locationText.includes(normalizedLocation));
    });
  }, [activeCategory, directoryClients, language, locationQuery, locationResolved, query]);

  const scrollToResults = () => {
    window.setTimeout(() => document.getElementById("rezultati")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  };

  const runSearch = (event?: FormEvent) => {
    event?.preventDefault();
    const params = new URLSearchParams();
    const normalizedQuery = query.trim().replace(/\s+/g, " ");
    const normalizedLocation = locationQuery.trim().replace(/\s+/g, " ");
    if (normalizedQuery) params.set("q", normalizedQuery);
    if (normalizedLocation) params.set("location", normalizedLocation);
    if (activeCategory !== "all") params.set("category", activeCategory);
    setHasSearched(true);
    setSearchParams(params);
    scrollToResults();
  };

  const selectCategory = (category: ClientCategory) => {
    const nextCategory = activeCategory === category ? "all" : category;
    setActiveCategory(nextCategory);

    const params = new URLSearchParams();
    const normalizedQuery = query.trim().replace(/\s+/g, " ");
    const normalizedLocation = locationQuery.trim().replace(/\s+/g, " ");
    if (normalizedQuery) params.set("q", normalizedQuery);
    if (normalizedLocation) params.set("location", normalizedLocation);
    if (nextCategory !== "all") params.set("category", nextCategory);
    setHasSearched(true);
    setSearchParams(params);
    scrollToResults();
  };

  return (
    <div className="customer-surface min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="py-14 md:py-20 lg:py-24">
          <div className="container mx-auto max-w-7xl px-4 text-center lg:px-8">
            <h1 className="mx-auto font-display text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl lg:whitespace-nowrap lg:text-[2.65rem] lg:leading-[1.1]">
              {text.title}
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
              {text.subtitle}
            </p>

            <form
              onSubmit={runSearch}
              className="mx-auto mt-10 grid max-w-5xl gap-4 text-left md:grid-cols-[1.15fr_0.95fr_auto] md:items-end md:gap-5"
            >
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                <span>{text.what}</span>
                <span className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={text.whatPlaceholder}
                    className="h-14 rounded-2xl border-border/80 bg-transparent pl-12 text-base shadow-none transition focus-visible:border-primary/70 focus-visible:ring-2 focus-visible:ring-primary/10"
                  />
                </span>
              </label>

              <label className="grid gap-2 text-sm font-semibold text-foreground">
                <span>{text.where}</span>
                <span className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={locationQuery}
                    onChange={(event) => setLocationQuery(event.target.value)}
                    placeholder={text.wherePlaceholder}
                    aria-label={text.where}
                    autoComplete="street-address"
                    className="h-14 rounded-2xl border-border/80 bg-transparent pl-12 text-base shadow-none transition focus-visible:border-primary/70 focus-visible:ring-2 focus-visible:ring-primary/10"
                  />
                </span>
              </label>

              <Button type="submit" variant="hero" size="lg" className="h-14 rounded-2xl px-8 shadow-soft">
                {text.search}<ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mx-auto mt-10 max-w-4xl text-center">
              <p className="text-sm font-semibold text-foreground">{text.popular}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {text.categories.map(([label, category, Icon]) => {
                  const selected = activeCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => selectCategory(category)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                        selected
                          ? "border-primary/25 bg-primary/[0.08] text-primary shadow-sm"
                          : "border-border/80 bg-transparent text-foreground hover:border-primary/35 hover:text-primary hover:shadow-sm"
                      }`}
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {hasSearched ? (
          <section id="rezultati" className="scroll-mt-28 pb-14 md:pb-20">
            <div className="container mx-auto max-w-7xl px-4 lg:px-8">
              <div className="flex flex-col gap-2 border-t border-border/50 pt-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-primary">{text.results}</p>
                  {!refreshing && !locationError ? <h2 className="mt-1 font-display text-2xl font-extrabold text-foreground">{text.resultsCount(filteredClients.length)}</h2> : null}
                </div>
                {searchParams.get("location") && !locationError ? <p className="text-sm text-muted-foreground">{searchParams.get("location")}</p> : null}
              </div>

              {refreshing ? (
                <div className="py-12 text-center text-sm font-medium text-muted-foreground">{text.loading}</div>
              ) : locationError ? (
                <div className="mt-7 rounded-2xl border border-destructive/20 bg-destructive/[0.04] px-5 py-4 text-sm font-medium text-destructive">{locationError}</div>
              ) : filteredClients.length > 0 ? (
                <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {filteredClients.map((client) => {
                    const profilePath = client.slug ? getPublicCompanyProfilePath(client.slug, language) : null;
                    const bookingEnabled = isDirectoryClientBookingEnabled(client);
                    const bookingPath = getDirectoryClientBookingPath(client);

                    return (
                      <article key={client.locationId ? `location-${client.locationId}` : client.slug} className="group flex flex-col rounded-3xl border border-border/65 bg-background p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-glow">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-background text-lg font-black text-primary shadow-sm">
                            {client.logoUrl ? <img src={client.logoUrl} alt={client.name} width="64" height="64" className="h-full w-full object-contain p-1.5" loading="lazy" decoding="async" /> : initialsFor(client.name)}
                          </div>
                          {client.category ? <div className={`rounded-full px-3 py-1 text-xs font-bold ${categoryClasses[client.category]}`}>{categoryLabels[client.category][language]}</div> : null}
                        </div>
                        <h3 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-foreground">
                          {profilePath ? <a href={profilePath} className="transition hover:text-primary">{client.name}</a> : client.name}
                        </h3>
                        {client.description ? <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{client.description}</p> : <div className="flex-1" />}
                        {client.address ? <a href={client.googleMapsUrl} target="_blank" rel="noreferrer noopener" className="mt-5 flex items-start gap-2 text-sm text-muted-foreground transition hover:text-primary"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{client.address}</span><ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0" /></a> : null}
                        <div className="mt-6 flex flex-wrap gap-3">
                          {bookingEnabled ? <Button variant="hero" className="rounded-xl" asChild><a href={bookingPath} onClick={(event) => { event.preventDefault(); event.stopPropagation(); trackMarketingEvent("public_booking_started", { company_slug: client.slug, company_name: client.name, tenant_code: client.tenantCode || client.tenantSlug || client.slug, location_id: client.locationId, language, source: "customer_landing_search" }); window.location.assign(bookingPath); }}>{text.booking}<ArrowRight className="h-4 w-4" /></a></Button> : null}
                          {profilePath ? <Button variant="outline" className="rounded-xl bg-transparent" asChild><a href={profilePath}>{text.profile}</a></Button> : null}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-7 py-12 text-center">
                  <Search className="mx-auto h-7 w-7 text-primary" />
                  <h2 className="mt-4 text-xl font-bold text-foreground">{text.emptyTitle}</h2>
                  <p className="mt-2 text-muted-foreground">{text.emptyBody}</p>
                </div>
              )}
            </div>
          </section>
        ) : null}

        <section className="container mx-auto max-w-7xl px-4 py-14 lg:px-8 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">{text.benefitsEyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-4xl">{text.benefitsTitle}</h2>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            {text.benefits.map(([title, body, Icon]) => (
              <article key={title} className="flex items-start gap-4 px-2 py-2 text-left">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/[0.07] text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-foreground md:text-lg">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground md:text-base">{body}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button variant="hero" size="lg" className="rounded-xl" asChild>
              <a href={connectPath}>{text.connectCta}<ArrowRight className="h-4 w-4" /></a>
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl bg-transparent" asChild>
              <a href={isAuthenticated ? "/racun" : `${CUSTOMER_LOGIN_ROUTE}?next=${encodeURIComponent(getRoutePath("customers", language))}`}>
                {isAuthenticated ? (language === "sl" ? "Odpri moj račun" : "Open my account") : text.login}
              </a>
            </Button>
          </div>
          {!isAuthenticated ? <p className="mt-4 text-center">
            <a href={CUSTOMER_REGISTER_ROUTE} className="text-sm font-semibold text-primary hover:underline">{text.register}</a>
          </p> : null}
        </section>

        <section className="py-14 md:py-20">
          <div className="container mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-4 text-center md:flex-row md:text-left lg:px-8">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">{text.businessEyebrow}</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">{text.businessTitle}</h2>
            </div>
            <Button variant="outline" size="lg" className="rounded-xl bg-transparent" asChild>
              <a href={getRoutePath("home", language)}>{text.businessCta}<ArrowRight className="h-4 w-4" /></a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLandingPage;
