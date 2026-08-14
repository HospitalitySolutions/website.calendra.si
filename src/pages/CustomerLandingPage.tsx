import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getDirectoryClientBookingPath,
  getDirectoryClientProfileIdentifier,
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
  CalendarDays,
  ChevronRight,
  Dumbbell,
  Flower2,
  Heart,
  HeartPulse,
  MapPin,
  MessagesSquare,
  Scissors,
  Search,
  Star,
  UserRoundCheck,
  WalletCards,
} from "lucide-react";

const categoryLabels: Record<ClientCategory, Record<SiteLanguage, string>> = {
  salon: { sl: "Salon", en: "Salon" },
  fitness: { sl: "Fitness", en: "Fitness" },
  wellness: { sl: "Wellness", en: "Wellness" },
  health: { sl: "Zdravje", en: "Health" },
  consulting: { sl: "Svetovanje", en: "Consulting" },
};

const categoryClasses: Record<ClientCategory, string> = {
  salon: "bg-blue-50 text-blue-700",
  fitness: "bg-indigo-50 text-indigo-700",
  wellness: "bg-violet-50 text-violet-700",
  health: "bg-emerald-50 text-emerald-700",
  consulting: "bg-orange-50 text-orange-700",
};

const categoryCovers: Record<ClientCategory, string> = {
  salon: "/industries/beauty-salon-bg.png",
  fitness: "/industries/fitness-groups-bg.png",
  wellness: "/industries/wellbeing-bg.png",
  health: "/screenshots/client-profile-appointments.webp",
  consulting: "/industries/consulting-education-bg.png",
};

const availableCategories: ClientCategory[] = ["salon", "fitness", "wellness", "health", "consulting"];

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

const cityLabel = (address: string, language: SiteLanguage) => {
  if (!address) return language === "sl" ? "Slovenija" : "Slovenia";
  const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]}, ${parts[parts.length - 1]}`;
  return parts[0] || address;
};

const ProviderCard = ({ client, language }: { client: DirectoryClient; language: SiteLanguage }) => {
  const profileIdentifier = getDirectoryClientProfileIdentifier(client);
  const profilePath = profileIdentifier ? getPublicCompanyProfilePath(profileIdentifier, language) : null;
  const bookingEnabled = isDirectoryClientBookingEnabled(client);
  const bookingPath = bookingEnabled ? getDirectoryClientBookingPath(client) : null;
  const destination = profilePath || bookingPath;
  const category = client.category || "wellness";
  const rating = client.googleRating;
  const reviewCount = client.googleReviewCount;

  const handleClick = () => {
    if (!profilePath && bookingPath) {
      trackMarketingEvent("public_booking_started", {
        company_slug: client.slug,
        company_name: client.name,
        tenant_code: client.tenantCode || client.tenantSlug || client.slug,
        location_id: client.locationId,
        language,
        source: "customer_marketplace_card",
      });
    }
  };

  const content = (
    <>
      <div className="relative aspect-[1.78/1] overflow-hidden bg-secondary/40">
        <img
          src={categoryCovers[category]}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5" />
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm ${categoryClasses[category]}`}>
          {categoryLabels[category][language]}
        </span>
        {client.logoUrl ? (
          <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-white/85 bg-white/95 p-1 shadow-sm">
            <img src={client.logoUrl} alt="" className="h-full w-full object-contain" loading="lazy" decoding="async" />
          </span>
        ) : null}
      </div>
      <div className="px-3.5 pb-3.5 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-[14px] font-extrabold tracking-tight text-foreground md:text-[15px]">{client.name}</h3>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground md:text-xs">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" />
              <span className="truncate">{cityLabel(client.address, language)}</span>
            </div>
          </div>
          {typeof rating === "number" ? (
            <div className="flex shrink-0 items-center gap-1 pt-0.5 text-[11px] font-semibold text-foreground md:text-xs">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{rating.toFixed(1)}</span>
              {typeof reviewCount === "number" ? <span className="font-normal text-muted-foreground">({reviewCount})</span> : null}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );

  const className = "group block min-w-0 overflow-hidden rounded-[17px] border border-border/65 bg-background shadow-[0_5px_18px_rgba(15,23,42,0.055)] transition duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_12px_30px_rgba(15,23,42,0.10)]";

  return destination ? (
    <a href={destination} onClick={handleClick} className={className}>{content}</a>
  ) : (
    <article className={className}>{content}</article>
  );
};

const CustomerLandingPage = () => {
  const { language } = useSiteLanguage();
  const { loading: sessionLoading, isAuthenticated } = useCustomerSession();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamString = searchParams.toString();
  const connectPath = getRoutePath("connect", language);

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [locationQuery, setLocationQuery] = useState(searchParams.get("location") || "");
  const [appointmentDate, setAppointmentDate] = useState(searchParams.get("date") || "");
  const [activeCategory, setActiveCategory] = useState<ClientCategory | "all">(normalizeCategory(searchParams.get("category")));
  const [apiClients, setApiClients] = useState<DirectoryClient[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [locationResolved, setLocationResolved] = useState(false);
  const [locationError, setLocationError] = useState("");

  const text = language === "sl" ? {
    title: "Poiščite ponudnika in rezervirajte termin",
    subtitle: "Enostavno poiščite storitev v svoji bližini in rezervirajte termin, ki vam ustreza.",
    what: "Katero storitev iščete?",
    whatPlaceholder: "Frizerstvo, masaža, joga …",
    where: "Lokacija",
    wherePlaceholder: "Vnesite kraj ali območje",
    when: "Kdaj?",
    whenPlaceholder: "Izberite datum",
    search: "Poišči",
    results: "Rezultati iskanja",
    resultsCount: (count: number) => `${count} ${count === 1 ? "ponudnik" : "ponudnikov"}`,
    loading: "Iščem ponudnike …",
    emptyTitle: "Ni najdenih ponudnikov",
    emptyBody: "Poskusite z drugim iskalnim izrazom, lokacijo ali kategorijo.",
    locationError: "Lokacije ni bilo mogoče najti.",
    recent: "Nedavno ogledano",
    recommended: "Priporočeno za vas",
    newOnCalendra: "Novo na Calendra",
    showAll: "Prikaži vse",
    trust: "Preverjeni ponudniki in enostavno spletno naročanje na enem mestu.",
    benefitsEyebrow: "Calendra Connect",
    benefitsTitle: "Vaši termini in ugodnosti na enem mestu",
    benefitsBody: "Upravljajte rezervacije, shranite priljubljene ponudnike in imejte vse na enem mestu.",
    benefits: [
      ["Vsi termini na enem mestu", "Preglejte prihodnje in pretekle rezervacije kjerkoli.", CalendarCheck2],
      ["Priljubljeni ponudniki", "Shranite ponudnike in jih hitreje rezervirajte znova.", Heart],
      ["Paketi, članstva in boni", "Imejte ugodnosti in dobroimetje pregledno v denarnici.", WalletCards],
    ] as const,
    login: "Prijava",
    register: "Ustvari brezplačen račun",
  } : {
    title: "Find a provider and book an appointment",
    subtitle: "Find a service near you and book an appointment that suits you.",
    what: "What service are you looking for?",
    whatPlaceholder: "Hair, massage, yoga …",
    where: "Location",
    wherePlaceholder: "Enter a city or area",
    when: "When?",
    whenPlaceholder: "Choose a date",
    search: "Search",
    results: "Search results",
    resultsCount: (count: number) => `${count} ${count === 1 ? "provider" : "providers"}`,
    loading: "Finding providers …",
    emptyTitle: "No providers found",
    emptyBody: "Try another search term, location or category.",
    locationError: "The location could not be found.",
    recent: "Recently viewed",
    recommended: "Recommended for you",
    newOnCalendra: "New on Calendra",
    showAll: "Show all",
    trust: "Verified providers and simple online booking in one place.",
    benefitsEyebrow: "Calendra Connect",
    benefitsTitle: "Your appointments and benefits in one place",
    benefitsBody: "Manage bookings, save favourite providers and keep everything in one place.",
    benefits: [
      ["All appointments in one place", "See upcoming and past bookings wherever you are.", CalendarCheck2],
      ["Favourite providers", "Save providers and rebook them faster.", Heart],
      ["Packages, memberships and gift cards", "Keep benefits and balances organised in your wallet.", WalletCards],
    ] as const,
    login: "Login",
    register: "Create a free account",
  };

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParamString);
    setQuery(currentParams.get("q") || "");
    setLocationQuery(currentParams.get("location") || "");
    setAppointmentDate(currentParams.get("date") || "");
    setActiveCategory(normalizeCategory(currentParams.get("category")));
  }, [searchParamString]);

  useEffect(() => {
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
  }, [searchParamString, text.locationError]);

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

  const isFilteredView = Boolean(searchParams.get("q") || searchParams.get("location") || searchParams.get("date") || searchParams.get("category"));

  const recentClients = useMemo(() => directoryClients.slice(0, 10), [directoryClients]);
  const recommendedClients = useMemo(
    () => [...directoryClients].sort((a, b) => (b.googleRating ?? -1) - (a.googleRating ?? -1)).slice(0, 10),
    [directoryClients],
  );
  const newClients = useMemo(() => [...directoryClients].reverse().slice(0, 10), [directoryClients]);

  const scrollToResults = () => {
    window.setTimeout(() => document.getElementById("rezultati")?.scrollIntoView({ behavior: "smooth", block: "start" }), 20);
  };

  const runSearch = (event?: FormEvent) => {
    event?.preventDefault();
    const params = new URLSearchParams();
    const normalizedQuery = query.trim().replace(/\s+/g, " ");
    const normalizedLocation = locationQuery.trim().replace(/\s+/g, " ");
    if (normalizedQuery) params.set("q", normalizedQuery);
    if (normalizedLocation) params.set("location", normalizedLocation);
    if (appointmentDate) params.set("date", appointmentDate);
    if (activeCategory !== "all") params.set("category", activeCategory);
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
    if (appointmentDate) params.set("date", appointmentDate);
    if (nextCategory !== "all") params.set("category", nextCategory);
    setSearchParams(params);
    scrollToResults();
  };

  const scrollRail = (id: string) => {
    document.getElementById(id)?.scrollBy({ left: 720, behavior: "smooth" });
  };

  const DiscoveryRail = ({ id, title, clients }: { id: string; title: string; clients: DirectoryClient[] }) => (
    <section className="relative">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="font-display text-lg font-extrabold tracking-tight text-foreground md:text-xl">{title}</h2>
        <button
          type="button"
          onClick={() => scrollRail(id)}
          className="inline-flex items-center gap-1 text-sm font-bold text-primary transition hover:opacity-75"
        >
          {text.showAll}<ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div
        id={id}
        className="grid auto-cols-[minmax(235px,1fr)] grid-flow-col gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:auto-cols-[minmax(250px,1fr)] xl:auto-cols-[minmax(0,1fr)] xl:grid-flow-row xl:grid-cols-5 xl:overflow-visible"
      >
        {clients.slice(0, 10).map((client) => <ProviderCard key={`${id}-${client.locationId || client.slug}`} client={client} language={language} />)}
      </div>
      {clients.length > 5 ? (
        <button
          type="button"
          onClick={() => scrollRail(id)}
          className="absolute -right-4 top-[54%] hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border/70 bg-background text-foreground shadow-lg transition hover:border-primary/30 hover:text-primary md:grid xl:hidden"
          aria-label={text.showAll}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      ) : null}
    </section>
  );

  return (
    <div className="customer-surface min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="relative overflow-hidden pb-11 pt-11 md:pb-13 md:pt-14 lg:pt-16">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[360px] overflow-hidden">
            <div className="absolute left-[14%] top-5 h-72 w-72 rounded-full bg-blue-200/35 blur-[88px]" />
            <div className="absolute right-[17%] top-4 h-72 w-72 rounded-full bg-fuchsia-200/30 blur-[92px]" />
            <div className="absolute left-1/2 top-20 h-48 w-48 -translate-x-1/2 rounded-full bg-violet-100/50 blur-[78px]" />
          </div>

          <div className="container relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-5xl text-center">
              <h1 className="font-display text-4xl font-extrabold leading-[1.06] tracking-[-0.045em] text-foreground md:text-5xl lg:text-[3.35rem]">
                {text.title}
              </h1>
              <p className="mx-auto mt-3 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">{text.subtitle}</p>
            </div>

            <form
              onSubmit={runSearch}
              className="mx-auto mt-8 max-w-5xl rounded-[28px] border border-white/90 bg-background/95 p-2 shadow-[0_16px_45px_rgba(37,99,235,0.12)] ring-1 ring-primary/[0.05] backdrop-blur md:p-2.5"
            >
              <div className="grid md:grid-cols-[1.2fr_1fr_0.92fr_auto] md:items-center">
                <label className="group relative flex min-h-16 items-center gap-3 rounded-2xl px-4 text-left transition focus-within:bg-secondary/35">
                  <Search className="h-5 w-5 shrink-0 text-slate-500 group-focus-within:text-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-bold text-foreground">{text.what}</span>
                    <Input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={text.whatPlaceholder}
                      className="h-auto border-0 bg-transparent p-0 pt-1 text-sm shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
                    />
                  </span>
                </label>

                <label className="group relative flex min-h-16 items-center gap-3 rounded-2xl px-4 text-left transition before:absolute before:left-0 before:top-3 before:hidden before:h-10 before:w-px before:bg-border/70 focus-within:bg-secondary/35 md:before:block">
                  <MapPin className="h-5 w-5 shrink-0 text-slate-500 group-focus-within:text-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-bold text-foreground">{text.where}</span>
                    <Input
                      value={locationQuery}
                      onChange={(event) => setLocationQuery(event.target.value)}
                      placeholder={text.wherePlaceholder}
                      aria-label={text.where}
                      autoComplete="street-address"
                      className="h-auto border-0 bg-transparent p-0 pt-1 text-sm shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
                    />
                  </span>
                </label>

                <label className="group relative flex min-h-16 items-center gap-3 rounded-2xl px-4 text-left transition before:absolute before:left-0 before:top-3 before:hidden before:h-10 before:w-px before:bg-border/70 focus-within:bg-secondary/35 md:before:block">
                  <CalendarDays className="h-5 w-5 shrink-0 text-slate-500 group-focus-within:text-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-bold text-foreground">{text.when}</span>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(event) => setAppointmentDate(event.target.value)}
                      aria-label={text.whenPlaceholder}
                      className="mt-1 w-full bg-transparent text-sm text-muted-foreground outline-none [color-scheme:light]"
                    />
                  </span>
                </label>

                <Button type="submit" variant="hero" className="m-1 h-12 rounded-2xl px-7 shadow-[0_9px_22px_rgba(37,99,235,0.22)] md:m-0 md:ml-2">
                  {text.search}<ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>

            <div className="mx-auto mt-5 flex max-w-4xl flex-wrap justify-center gap-2.5">
              {([
                ["Salon", "salon", Scissors],
                [language === "sl" ? "Fitnes" : "Fitness", "fitness", Dumbbell],
                ["Wellness", "wellness", Flower2],
                [language === "sl" ? "Zdravje" : "Health", "health", HeartPulse],
                [language === "sl" ? "Svetovanje" : "Consulting", "consulting", MessagesSquare],
              ] as const).map(([label, category, Icon]) => {
                const selected = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => selectCategory(category)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold shadow-sm transition ${selected ? "border-primary/20 bg-primary/[0.08] text-primary" : "border-border/70 bg-background/90 text-foreground hover:border-primary/25 hover:text-primary"}`}
                  >
                    <Icon className="h-4 w-4 text-primary" />{label}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
              <UserRoundCheck className="h-5 w-5 shrink-0 text-primary" />
              <span>{text.trust}</span>
            </div>
          </div>
        </section>

        <section id="rezultati" className="scroll-mt-28 pb-12 md:pb-16">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8">
            {refreshing && directoryClients.length === 0 ? (
              <div className="py-12 text-center text-sm font-medium text-muted-foreground">{text.loading}</div>
            ) : locationError && isFilteredView ? (
              <div className="mx-auto max-w-3xl rounded-2xl border border-destructive/20 bg-destructive/[0.04] px-5 py-4 text-sm font-medium text-destructive">{locationError}</div>
            ) : isFilteredView ? (
              <div>
                <div className="mb-5 flex flex-col gap-1 border-t border-border/55 pt-7 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">{text.results}</p>
                    <h2 className="mt-1 font-display text-2xl font-extrabold text-foreground">{text.resultsCount(filteredClients.length)}</h2>
                  </div>
                  {searchParams.get("location") ? <p className="text-sm text-muted-foreground">{searchParams.get("location")}</p> : null}
                </div>
                {filteredClients.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredClients.map((client) => <ProviderCard key={`result-${client.locationId || client.slug}`} client={client} language={language} />)}
                  </div>
                ) : (
                  <div className="py-14 text-center">
                    <Search className="mx-auto h-7 w-7 text-primary" />
                    <h2 className="mt-4 text-xl font-bold text-foreground">{text.emptyTitle}</h2>
                    <p className="mt-2 text-muted-foreground">{text.emptyBody}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8 md:space-y-9">
                <DiscoveryRail id="recent-providers" title={text.recent} clients={recentClients} />
                <DiscoveryRail id="recommended-providers" title={text.recommended} clients={recommendedClients} />
                <DiscoveryRail id="new-providers" title={text.newOnCalendra} clients={newClients} />
              </div>
            )}
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 pb-14 lg:px-8 md:pb-20">
          <div className="rounded-[26px] border border-primary/15 bg-gradient-to-br from-primary/[0.035] via-background to-blue-50/40 px-5 py-6 shadow-[0_10px_35px_rgba(15,23,42,0.04)] md:px-7 md:py-7 lg:px-8">
            <div className="grid gap-7 lg:grid-cols-[1.15fr_2.1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.19em] text-primary">{text.benefitsEyebrow}</p>
                <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">{text.benefitsTitle}</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{text.benefitsBody}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {text.benefits.map(([title, body, Icon]) => (
                  <article key={title} className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-background text-primary shadow-sm ring-1 ring-primary/10">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-extrabold text-foreground">{title}</h3>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="flex min-w-[190px] flex-col gap-2.5">
                {sessionLoading ? (
                  <>
                    <div className="h-10 animate-pulse rounded-xl bg-primary/10" />
                    <div className="h-10 animate-pulse rounded-xl border border-border/70 bg-background" />
                  </>
                ) : (
                  <>
                    {!isAuthenticated ? (
                      <Button variant="hero" className="rounded-xl" asChild><a href={CUSTOMER_REGISTER_ROUTE}>{text.register}</a></Button>
                    ) : (
                      <Button variant="hero" className="rounded-xl" asChild><a href="/racun">{language === "sl" ? "Odpri moj račun" : "Open my account"}</a></Button>
                    )}
                    <Button variant="outline" className="rounded-xl bg-background" asChild>
                      <a href={isAuthenticated ? connectPath : `${CUSTOMER_LOGIN_ROUTE}?next=${encodeURIComponent(getRoutePath("customers", language))}`}>
                        {isAuthenticated ? "Calendra Connect" : text.login}
                      </a>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLandingPage;
