import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import NotFound from "@/pages/NotFound";
import { Button } from "@/components/ui/button";
import { APP_BASE_URL } from "@/lib/site";
import {
  getDirectoryClientBookingPath,
  isDirectoryClientBookingEnabled,
  normalizeDirectoryClient,
  normalizeDirectoryClients,
  type DirectoryClient,
} from "@/lib/company-directory";
import { getRoutePath } from "@/lib/localized-routes";
import { CUSTOMER_APP_BASE_URL } from "@/lib/site";
import { getPublicCompanyProfile, publicCompanyProfiles, type PublicCompanyProfile } from "@/lib/public-company-profiles";
import { normalizePublicStorefront, type PublicStorefront, type StorefrontProduct, type StorefrontService } from "@/lib/public-storefront";
import { useSiteLanguage } from "@/lib/site-language";
import { trackMarketingEvent } from "@/lib/marketing-events";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Gift,
  MapPin,
  Package,
  ShieldCheck,
  Star,
  UserRound,
  UsersRound,
} from "lucide-react";

const initialsFor = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("") || "C";

const sameTenant = (profile: PublicCompanyProfile, client: DirectoryClient) => {
  const profileTenant = (profile.tenantCode || profile.tenantSlug || "").trim().toLowerCase();
  const clientTenant = (client.tenantCode || client.tenantSlug || "").trim().toLowerCase();
  return Boolean(profileTenant && clientTenant && profileTenant === clientTenant);
};

const findCuratedProfile = (slug: string, client: DirectoryClient | null) => {
  const direct = getPublicCompanyProfile(slug);
  if (direct) return direct;
  if (!client) return undefined;
  return publicCompanyProfiles.find((profile) => sameTenant(profile, client) || profile.name.toLowerCase() === client.name.toLowerCase());
};

const categoryLabel = (category: DirectoryClient["category"], language: "sl" | "en") => {
  if (!category) return language === "sl" ? "Spletno naročanje" : "Online booking";
  const labels = {
    salon: { sl: "Salon", en: "Salon" },
    fitness: { sl: "Fitnes", en: "Fitness" },
    wellness: { sl: "Wellness", en: "Wellness" },
    health: { sl: "Zdravje", en: "Health" },
    consulting: { sl: "Svetovanje", en: "Consulting" },
  } as const;
  return labels[category][language];
};

const addBookingService = (bookingPath: string, serviceId: number) => {
  const [pathname, rawQuery = ""] = bookingPath.split("?", 2);
  const params = new URLSearchParams(rawQuery);
  params.set("typeId", String(serviceId));
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
};

const formatMoney = (value: number, currency: string, language: "sl" | "en") => {
  try {
    return new Intl.NumberFormat(language === "sl" ? "sl-SI" : "en-GB", {
      style: "currency",
      currency: currency || "EUR",
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency || "EUR"}`;
  }
};

const groupServices = (services: StorefrontService[]) => {
  const groups = new Map<string, StorefrontService[]>();
  services.forEach((service) => {
    const key = service.serviceGroupName || "";
    groups.set(key, [...(groups.get(key) || []), service]);
  });
  return Array.from(groups.entries());
};

const productMeta = (product: StorefrontProduct, language: "sl" | "en") => {
  const parts: string[] = [];
  if (product.usageLimit) parts.push(language === "sl" ? `${product.usageLimit} obiskov` : `${product.usageLimit} visits`);
  if (product.validityDays) parts.push(language === "sl" ? `velja ${product.validityDays} dni` : `valid ${product.validityDays} days`);
  if (product.productType === "GIFT_CARD" && product.voucherFaceValueGross) {
    parts.push(language === "sl" ? `vrednost ${formatMoney(product.voucherFaceValueGross, product.currency, language)}` : `value ${formatMoney(product.voucherFaceValueGross, product.currency, language)}`);
  }
  return parts.join(" · ");
};

const PublicCompanyProfilePage = () => {
  const { slug = "" } = useParams();
  const { language } = useSiteLanguage();
  const initialProfile = getPublicCompanyProfile(slug);
  const [apiClient, setApiClient] = useState<DirectoryClient | null>(null);
  const [storefront, setStorefront] = useState<PublicStorefront | null>(null);
  const [loading, setLoading] = useState(!initialProfile);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const fetchStorefront = async (candidateSlug: string) => {
      const response = await fetch(`${APP_BASE_URL}/api/public/storefront/${encodeURIComponent(candidateSlug)}`, { signal: controller.signal });
      if (!response.ok) return null;
      return normalizePublicStorefront(await response.json(), APP_BASE_URL);
    };

    const fetchLocation = async (candidateSlug: string) => {
      const response = await fetch(`${APP_BASE_URL}/api/public/location-directory/${encodeURIComponent(candidateSlug)}`, { signal: controller.signal });
      if (!response.ok) return null;
      return normalizeDirectoryClient(await response.json(), APP_BASE_URL);
    };

    const load = async () => {
      setLoading(!initialProfile);
      setStorefront(null);
      setApiClient(null);
      try {
        const directStorefront = await fetchStorefront(slug);
        if (directStorefront) {
          if (!cancelled) {
            setStorefront(directStorefront);
            setApiClient(directStorefront.location);
          }
          return;
        }

        const directLocation = await fetchLocation(slug);
        if (directLocation) {
          if (!cancelled) setApiClient(directLocation);
          return;
        }

        // Curated profiles created before location-first directory slugs are kept as
        // backwards-compatible URLs. Resolve the live branch first, then load the same
        // storefront endpoint used by canonical location profiles.
        if (initialProfile) {
          const listResponse = await fetch(`${APP_BASE_URL}/api/public/location-directory`, { signal: controller.signal });
          if (!listResponse.ok) return;
          const clients = normalizeDirectoryClients(await listResponse.json(), APP_BASE_URL);
          const match = clients.find((candidate) => sameTenant(initialProfile, candidate) || candidate.name.toLowerCase() === initialProfile.name.toLowerCase());
          if (!match) return;
          if (!cancelled) setApiClient(match);
          try {
            const matchedStorefront = await fetchStorefront(match.slug);
            if (!cancelled && matchedStorefront) setStorefront(matchedStorefront);
          } catch (error: any) {
            if (error?.name !== "AbortError") console.warn("Public storefront catalog could not be loaded.", error);
          }
        }
      } catch (error: any) {
        if (error?.name !== "AbortError") console.warn("Public provider profile could not be refreshed.", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [initialProfile, slug]);

  const curatedProfile = useMemo(() => findCuratedProfile(slug, apiClient), [apiClient, slug]);
  const client = useMemo<DirectoryClient | null>(() => {
    const liveClient = storefront?.location || apiClient;
    const fallback = curatedProfile || initialProfile;
    if (!liveClient && !fallback) return null;
    if (!liveClient && fallback) {
      return {
        ...fallback,
        description: fallback.localizedDescription[language],
      };
    }
    if (!liveClient) return null;
    return {
      ...fallback,
      ...liveClient,
      description: liveClient.description || fallback?.localizedDescription[language] || "",
      logoUrl: liveClient.logoUrl || fallback?.logoUrl || null,
      category: liveClient.category || fallback?.category,
    };
  }, [apiClient, curatedProfile, initialProfile, language, storefront]);

  if (loading && !client) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto max-w-6xl px-4 py-24 lg:px-8">
          <div className="h-48 animate-pulse rounded-3xl border border-border/60 bg-card" aria-hidden="true" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!client) return <NotFound />;

  const text = language === "sl" ? {
    home: "Domov",
    customers: "Za stranke",
    directory: "Ponudniki",
    verified: "Lokacija v Calendri",
    services: "Storitve",
    about: "O ponudniku",
    servicesIntro: "Izberite storitev in nadaljujte neposredno v rezervacijo termina.",
    fallbackServices: "Storitve in področja",
    packages: "Paketi in članstva",
    packagesIntro: "Ponudba, ki jo lahko uporabljate in spremljate v svoji Calendra denarnici.",
    giftCards: "Darilni boni",
    connectOnly: "Na voljo v Calendra Connect",
    buyInConnect: "Kupi v Calendra Connect",
    team: "Ekipa",
    teamIntro: "Izvajalci, ki jih lahko izberete pri spletnem naročanju na tej lokaciji.",
    location: "Lokacija",
    review: "Mnenje uporabnika",
    rating: "Google ocena",
    bookingTitle: "Rezervirajte termin",
    bookingBody: "Izberite storitev, zaposlenega in prost termin v varnem rezervacijskem toku Calendra.",
    bookingButton: "Rezerviraj termin",
    security: "Rezervacija se zapiše neposredno v koledar izbrane lokacije.",
    duration: "min",
    group: "Skupinska storitev",
    upTo: "do",
    participants: "udeležencev",
  } : {
    home: "Home",
    customers: "For customers",
    directory: "Providers",
    verified: "Location on Calendra",
    services: "Services",
    about: "About",
    servicesIntro: "Choose a service and continue directly to appointment booking.",
    fallbackServices: "Services and categories",
    packages: "Packages and memberships",
    packagesIntro: "Offers you can use and track in your Calendra wallet.",
    giftCards: "Gift cards",
    connectOnly: "Available in Calendra Connect",
    buyInConnect: "Buy in Calendra Connect",
    team: "Team",
    teamIntro: "Professionals you can select when booking online at this location.",
    location: "Location",
    review: "Customer review",
    rating: "Google rating",
    bookingTitle: "Book an appointment",
    bookingBody: "Choose a service, employee and available time in Calendra's secure booking flow.",
    bookingButton: "Book an appointment",
    security: "The booking is added directly to the selected location's calendar.",
    duration: "min",
    group: "Group service",
    upTo: "up to",
    participants: "participants",
  };

  const bookingEnabled = isDirectoryClientBookingEnabled(client);
  const bookingPath = getDirectoryClientBookingPath(client);
  const fallbackServiceItems = curatedProfile?.serviceCategories[language] ?? [categoryLabel(client.category, language)];
  const review = curatedProfile?.review;
  const description = client.description || curatedProfile?.localizedDescription[language] || "";
  const services = storefront?.services ?? [];
  const serviceGroups = groupServices(services);
  const packages = (storefront?.products ?? []).filter((product) => product.productType === "PACK" || product.productType === "MEMBERSHIP");
  const giftCards = (storefront?.products ?? []).filter((product) => product.productType === "GIFT_CARD");
  const team = storefront?.team ?? [];
  const connectProviderSlug = storefront?.location?.slug || client.slug;
  const connectPurchaseUrl = (productId: string) => `${CUSTOMER_APP_BASE_URL}/ponudniki/${encodeURIComponent(connectProviderSlug)}/kupi/${encodeURIComponent(productId)}`;

  const trackBooking = (source: string, serviceId?: number) => {
    trackMarketingEvent("public_booking_started", {
      company_slug: client.slug,
      company_name: client.name,
      tenant_code: client.tenantCode || client.tenantSlug || client.slug,
      location_id: client.locationId,
      service_id: serviceId,
      language,
      source,
    });
  };

  const openStandaloneBooking = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    trackBooking("profile");
    window.location.assign(bookingPath);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section id="o-ponudniku" className="border-b border-border/60 bg-gradient-to-br from-background via-card to-primary/[0.05] py-14 md:py-20">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <nav aria-label={language === "sl" ? "Drobtinice" : "Breadcrumb"} className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <a href={getRoutePath("home", language)} className="font-medium transition hover:text-primary">{text.home}</a>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              <a href={getRoutePath("customers", language)} className="font-medium transition hover:text-primary">{text.customers}</a>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              <span className="font-semibold text-foreground" aria-current="page">{client.name}</span>
            </nav>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
              <div className="flex items-start gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-border/70 bg-card text-2xl font-black text-primary shadow-soft">
                  {client.logoUrl ? <img src={client.logoUrl} alt={client.name} width="80" height="80" decoding="async" className="h-full w-full object-contain p-2" /> : initialsFor(client.name)}
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/[0.08] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-primary"><CheckCircle2 className="h-4 w-4" />{text.verified}</div>
                  <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">{client.name}</h1>
                  {description ? <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{description}</p> : null}
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    {client.address ? <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{client.address}</span> : null}
                    {client.googleRating ? <span className="inline-flex items-center gap-2"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{client.googleRating.toFixed(1)}{client.googleReviewCount ? ` (${client.googleReviewCount})` : ""}</span> : null}
                  </div>
                </div>
              </div>
              {bookingEnabled ? <Button variant="hero" size="lg" className="rounded-xl" asChild><a href={bookingPath} onClick={openStandaloneBooking}>{text.bookingButton}<ArrowRight className="h-4 w-4" /></a></Button> : null}
            </div>
          </div>
        </section>

        <div className="sticky top-20 z-20 border-b border-border/60 bg-background/95 backdrop-blur">
          <div className="container mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 lg:px-8">
            <a href="#o-ponudniku" className="whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground">{text.about}</a>
            <a href="#storitve" className="whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground">{text.services}</a>
            {packages.length > 0 ? <a href="#paketi" className="whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground">{text.packages}</a> : null}
            {giftCards.length > 0 ? <a href="#darilni-boni" className="whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground">{text.giftCards}</a> : null}
            {team.length > 0 ? <a href="#ekipa" className="whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground">{text.team}</a> : null}
            <a href="#lokacija" className="whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground">{text.location}</a>
          </div>
        </div>

        <section className="container mx-auto max-w-6xl px-4 py-14 lg:px-8 md:py-20">
          {services.length > 0 ? (
            <div id="storitve" className="scroll-mt-16">
              <div className="max-w-3xl">
                <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">{text.services}</h2>
                <p className="mt-3 text-lg leading-8 text-muted-foreground">{text.servicesIntro}</p>
              </div>
              <div className="mt-8 grid gap-8">
                {serviceGroups.map(([groupName, items]) => (
                  <div key={groupName || "services"}>
                    {groupName ? <h3 className="mb-4 text-lg font-bold text-foreground">{groupName}</h3> : null}
                    <div className="grid gap-4 md:grid-cols-2">
                      {items.map((service) => {
                        const serviceBookingPath = addBookingService(bookingPath, service.id);
                        return (
                          <article key={service.id} className="flex min-h-44 flex-col rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h4 className="text-lg font-bold text-foreground">{service.name}</h4>
                                {service.description ? <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{service.description}</p> : null}
                              </div>
                              {service.priceLabel ? <span className="shrink-0 text-base font-extrabold text-foreground">{service.priceLabel}</span> : null}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-muted-foreground">
                              {service.durationMinutes ? <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-primary" />{service.durationMinutes} {text.duration}</span> : null}
                              {service.groupBooking ? <span className="inline-flex items-center gap-1.5"><UsersRound className="h-3.5 w-3.5 text-primary" />{text.group}{service.maxParticipantsPerSession ? ` · ${text.upTo} ${service.maxParticipantsPerSession} ${text.participants}` : ""}</span> : null}
                            </div>
                            {bookingEnabled ? (
                              <div className="mt-auto pt-5">
                                <Button variant="outline" className="w-full rounded-xl" asChild>
                                  <a href={serviceBookingPath} onClick={() => trackBooking("profile_service", service.id)}>{text.bookingButton}<ArrowRight className="h-4 w-4" /></a>
                                </Button>
                              </div>
                            ) : null}
                          </article>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <article className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
              <CalendarDays className="h-7 w-7 text-primary" />
              <h2 className="mt-5 text-xl font-bold text-foreground">{text.fallbackServices}</h2>
              <ul className="mt-4 grid gap-3">{fallbackServiceItems.map((service) => <li key={service} className="flex items-center gap-3 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-primary" />{service}</li>)}</ul>
            </article>
          )}
        </section>

        {packages.length > 0 ? (
          <section id="paketi" className="scroll-mt-16 border-y border-border/60 bg-card py-14 md:py-20">
            <div className="container mx-auto max-w-6xl px-4 lg:px-8">
              <div className="max-w-3xl">
                <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">{text.packages}</h2>
                <p className="mt-3 text-lg leading-8 text-muted-foreground">{text.packagesIntro}</p>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {packages.map((product) => (
                  <article key={product.productId} className="rounded-3xl border border-border/60 bg-background p-6 shadow-soft">
                    <div className="flex items-start justify-between gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/[0.08] text-primary"><Package className="h-5 w-5" /></span>
                      {product.promoText ? <span className="rounded-full bg-primary/[0.08] px-3 py-1 text-xs font-bold text-primary">{product.promoText}</span> : null}
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-foreground">{product.name}</h3>
                    {product.description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{product.description}</p> : null}
                    {productMeta(product, language) ? <p className="mt-4 text-xs font-semibold text-muted-foreground">{productMeta(product, language)}</p> : null}
                    <p className="mt-5 text-2xl font-extrabold text-foreground">{formatMoney(product.priceGross, product.currency, language)}</p>
                    <div className="mt-5 flex flex-col gap-3"><div className="inline-flex w-fit items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" />{text.connectOnly}</div><Button variant="outline" className="w-full rounded-xl" asChild><a href={connectPurchaseUrl(product.productId)}>{text.buyInConnect}<ArrowRight className="h-4 w-4" /></a></Button></div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {giftCards.length > 0 ? (
          <section id="darilni-boni" className="container mx-auto max-w-6xl scroll-mt-16 px-4 py-14 lg:px-8 md:py-20">
            <div className="max-w-3xl">
              <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">{text.giftCards}</h2>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {giftCards.map((product) => (
                <article key={product.productId} className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/[0.08] text-primary"><Gift className="h-5 w-5" /></span>
                  <h3 className="mt-5 text-lg font-bold text-foreground">{product.name}</h3>
                  {product.description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{product.description}</p> : null}
                  {product.voucherSessionTypeNames.length > 0 ? <p className="mt-4 text-xs leading-5 text-muted-foreground">{product.voucherSessionTypeNames.join(" · ")}</p> : null}
                  <p className="mt-5 text-2xl font-extrabold text-foreground">{formatMoney(product.priceGross, product.currency, language)}</p>
                  <div className="mt-5 flex flex-col gap-3"><div className="inline-flex w-fit items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" />{text.connectOnly}</div><Button variant="outline" className="w-full rounded-xl" asChild><a href={connectPurchaseUrl(product.productId)}>{text.buyInConnect}<ArrowRight className="h-4 w-4" /></a></Button></div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {team.length > 0 ? (
          <section id="ekipa" className="scroll-mt-16 border-y border-border/60 bg-card py-14 md:py-20">
            <div className="container mx-auto max-w-6xl px-4 lg:px-8">
              <div className="max-w-3xl">
                <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">{text.team}</h2>
                <p className="mt-3 text-lg leading-8 text-muted-foreground">{text.teamIntro}</p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {team.map((member) => (
                  <article key={member.id} className="flex items-center gap-4 rounded-3xl border border-border/60 bg-background p-5 shadow-soft">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/[0.08] font-extrabold text-primary">{initialsFor(member.name)}</span>
                    <div><UserRound className="mb-1 h-4 w-4 text-primary" /><h3 className="font-bold text-foreground">{member.name}</h3></div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section id="lokacija" className="container mx-auto grid max-w-6xl scroll-mt-16 gap-6 px-4 py-14 lg:grid-cols-2 lg:px-8 md:py-20">
          <article className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
            <MapPin className="h-7 w-7 text-primary" />
            <h2 className="mt-5 text-xl font-bold text-foreground">{text.location}</h2>
            {client.address ? <a href={client.googleMapsUrl} target="_blank" rel="noreferrer noopener" className="mt-4 block leading-7 text-muted-foreground transition hover:text-primary">{client.address}</a> : <p className="mt-4 text-muted-foreground">—</p>}
          </article>
          {review ? (
            <article className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
              <div className="flex gap-0.5" role="img" aria-label={`${review.rating} / 5`}>{Array.from({ length: review.rating }).map((_, index) => <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />)}</div>
              <h2 className="mt-5 text-xl font-bold text-foreground">{text.review}</h2>
              <blockquote className="mt-4 leading-7 text-muted-foreground">“{review.text[language]}”</blockquote>
              <p className="mt-4 text-sm font-semibold text-foreground">{review.author} · {review.source}</p>
            </article>
          ) : client.googleRating ? (
            <article className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
              <Star className="h-7 w-7 fill-amber-400 text-amber-400" />
              <h2 className="mt-5 text-xl font-bold text-foreground">{text.rating}</h2>
              <p className="mt-4 text-3xl font-extrabold text-foreground">{client.googleRating.toFixed(1)} / 5</p>
              {client.googleReviewCount !== null && client.googleReviewCount !== undefined ? <p className="mt-2 text-sm text-muted-foreground">{client.googleReviewCount} Google</p> : null}
            </article>
          ) : null}
        </section>

        {bookingEnabled ? (
          <section id="rezervacija" className="bg-card py-16 md:py-24">
            <div className="container mx-auto max-w-5xl px-4 text-center lg:px-8">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/[0.08] text-primary"><CalendarDays className="h-7 w-7" /></span>
              <h2 className="mt-6 font-display text-3xl font-bold text-foreground md:text-4xl">{text.bookingTitle}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{text.bookingBody}</p>
              <Button variant="hero" size="lg" className="mt-7 rounded-xl" asChild><a href={bookingPath} onClick={openStandaloneBooking}>{text.bookingButton}<ArrowRight className="h-4 w-4" /></a></Button>
              <p className="mx-auto mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" />{text.security}</p>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
};

export default PublicCompanyProfilePage;
