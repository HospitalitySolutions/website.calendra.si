import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import NotFound from "@/pages/NotFound";
import { Button } from "@/components/ui/button";
import { CUSTOMER_TOKEN_KEY, useCustomerSession } from "@/lib/customer-session";
import { APP_BASE_URL } from "@/lib/site";
import {
  getDirectoryClientBookingPath,
  getDirectoryClientProfileIdentifier,
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
  CalendarDays,
  ChevronRight,
  Clock3,
  ExternalLink,
  Heart,
  Loader2,
  MapPin,
  Share2,
  Sparkles,
  Star,
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

const BENEFIT_TYPE_ORDER: StorefrontProduct["productType"][] = ["MEMBERSHIP", "PACK", "GIFT_CARD", "COURSE"];

const benefitTypeLabel = (productType: StorefrontProduct["productType"], language: "sl" | "en") => {
  const labels = language === "sl"
    ? {
        MEMBERSHIP: "Članarina",
        PACK: "Paket obiskov",
        GIFT_CARD: "Bon",
        COURSE: "Dostop do tečaja",
      }
    : {
        MEMBERSHIP: "Membership",
        PACK: "Visit package",
        GIFT_CARD: "Voucher",
        COURSE: "Course access",
      };
  return labels[productType];
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
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useSiteLanguage();
  const { isAuthenticated } = useCustomerSession();
  const initialProfile = getPublicCompanyProfile(slug);
  const [apiClient, setApiClient] = useState<DirectoryClient | null>(null);
  const [storefront, setStorefront] = useState<PublicStorefront | null>(null);
  const [loading, setLoading] = useState(!initialProfile);
  const [activeProfileTab, setActiveProfileTab] = useState<"services" | "benefits">("services");
  const [activeServiceGroup, setActiveServiceGroup] = useState<string>("");
  const [activeBenefitType, setActiveBenefitType] = useState<StorefrontProduct["productType"] | "">("");
  const [bookingLaunching, setBookingLaunching] = useState<string | null>(null);
  const [favourite, setFavourite] = useState(false);

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
          try {
            const resolvedStorefront = await fetchStorefront(directLocation.slug);
            if (!cancelled && resolvedStorefront) setStorefront(resolvedStorefront);
          } catch (error: any) {
            if (error?.name !== "AbortError") console.warn("Public storefront catalog could not be loaded.", error);
          }
          return;
        }

        // The public customer URL uses the location code. The backend may still expose
        // the storefront by its generated directory slug, so resolve the location first
        // and then load the storefront using that canonical API identifier.
        const listResponse = await fetch(`${APP_BASE_URL}/api/public/location-directory`, { signal: controller.signal });
        if (!listResponse.ok) return;
        const clients = normalizeDirectoryClients(await listResponse.json(), APP_BASE_URL);
        const normalizedSlug = slug.trim().toLowerCase();
        const match = clients.find((candidate) =>
          candidate.locationCode?.trim().toLowerCase() === normalizedSlug ||
          candidate.slug.trim().toLowerCase() === normalizedSlug ||
          candidate.profileSlug?.trim().toLowerCase() === normalizedSlug ||
          (initialProfile && (sameTenant(initialProfile, candidate) || candidate.name.toLowerCase() === initialProfile.name.toLowerCase()))
        );
        if (!match) return;
        if (!cancelled) setApiClient(match);
        try {
          const matchedStorefront = await fetchStorefront(match.slug);
          if (!cancelled && matchedStorefront) setStorefront(matchedStorefront);
        } catch (error: any) {
          if (error?.name !== "AbortError") console.warn("Public storefront catalog could not be loaded.", error);
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

  useEffect(() => {
    if (!apiClient) return;
    const identifier = getDirectoryClientProfileIdentifier(apiClient);
    if (!identifier || identifier.toLowerCase() === slug.toLowerCase()) return;

    const base = language === "sl" ? "/za-stranke" : "/en/for-customers";
    if (!location.pathname.startsWith(`${base}/`)) return;
    navigate(`${base}/${encodeURIComponent(identifier)}${location.search}${location.hash}`, { replace: true });
  }, [apiClient, language, location.hash, location.pathname, location.search, navigate, slug]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = JSON.parse(window.localStorage.getItem("calendra.customer.favourites") || "[]") as string[];
      setFavourite(saved.includes(slug));
    } catch {
      setFavourite(false);
    }
  }, [slug]);

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
      <div className="marketing-page marketing-redesign min-h-screen bg-background">
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
    benefits: "Ugodnosti",
    benefitsEmpty: "Ta lokacija trenutno nima objavljenih ugodnosti.",
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
    benefits: "Benefits",
    benefitsEmpty: "This location currently has no published benefits.",
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
  const benefits = storefront?.products ?? [];
  const benefitTypes = BENEFIT_TYPE_ORDER.filter((type) => benefits.some((product) => product.productType === type));
  const visibleBenefits = activeBenefitType
    ? benefits.filter((product) => product.productType === activeBenefitType)
    : benefits;
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

  const categoryNames = serviceGroups.map(([name]) => name).filter(Boolean);
  const visibleServices = activeServiceGroup
    ? services.filter((service) => service.serviceGroupName === activeServiceGroup)
    : services;
  const primaryCategory = categoryNames[0] || fallbackServiceItems[0] || categoryLabel(client.category, language);

  const launchBooking = async (
    event: MouseEvent<HTMLAnchorElement>,
    source: string,
    fallbackPath: string,
    serviceId?: number,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    trackBooking(source, serviceId);

    const launchKey = serviceId ? `service-${serviceId}` : "profile";
    if (!isAuthenticated || !client.locationId) {
      window.location.assign(fallbackPath);
      return;
    }

    const customerToken = window.localStorage.getItem(CUSTOMER_TOKEN_KEY);
    if (!customerToken) {
      window.location.assign(fallbackPath);
      return;
    }

    setBookingLaunching(launchKey);
    try {
      const response = await fetch("/api/customer/v1/booking-handoffs", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${customerToken}`,
        },
        body: JSON.stringify({
          locationId: String(client.locationId),
          sessionTypeId: serviceId == null ? null : String(serviceId),
        }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          window.localStorage.removeItem(CUSTOMER_TOKEN_KEY);
          window.dispatchEvent(new Event("calendra:customer-session-changed"));
        }
        throw new Error(`Booking handoff failed (${response.status})`);
      }

      const payload = await response.json() as { bookingUrl?: string; handoffToken?: string };
      if (!payload.bookingUrl || !payload.handoffToken) throw new Error("Booking handoff is incomplete.");
      const destination = new URL(payload.bookingUrl, window.location.origin);
      destination.hash = new URLSearchParams({ customerHandoff: payload.handoffToken }).toString();
      window.location.assign(destination.toString());
    } catch (error) {
      console.warn("Customer booking handoff failed; continuing with the public booking flow.", error);
      window.location.assign(fallbackPath);
    } finally {
      setBookingLaunching(null);
    }
  };

  const toggleFavourite = () => {
    if (typeof window === "undefined") return;
    let saved: string[] = [];
    try {
      saved = JSON.parse(window.localStorage.getItem("calendra.customer.favourites") || "[]") as string[];
    } catch {
      saved = [];
    }
    const next = saved.includes(slug) ? saved.filter((item) => item !== slug) : [...saved, slug];
    window.localStorage.setItem("calendra.customer.favourites", JSON.stringify(next));
    setFavourite(next.includes(slug));
  };

  const shareProfile = async () => {
    if (typeof window === "undefined") return;
    const shareData = { title: client.name, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard?.writeText(window.location.href);
    } catch {
      // The user can dismiss the native share sheet; no error state is required.
    }
  };

  const allServicesLabel = language === "sl" ? "Vse storitve" : "All services";
  const allBenefitsLabel = language === "sl" ? "Vse ugodnosti" : "All benefits";
  const chooseTimeLabel = language === "sl" ? "Izberi termin" : "Choose time";
  const buyBenefitLabel = language === "sl" ? "Kupi" : "Buy";
  const seeAllServicesLabel = language === "sl" ? "Poglej vse storitve" : "See all services";
  const seeAllBenefitsLabel = language === "sl" ? "Poglej vse ugodnosti" : "See all benefits";
  const aboutLocationLabel = language === "sl" ? "O lokaciji" : "About the location";
  const reviewsLabel = language === "sl" ? "Mnenja" : "Reviews";
  const onePersonLabel = language === "sl" ? "1 oseba" : "1 person";
  const onlineBookingLabel = language === "sl" ? "Spletno naročanje" : "Online booking";

  return (
    <div className="marketing-page marketing-redesign min-h-screen bg-[#fbfcfe]">
      <Navbar />
      <main className="pb-20">
        <section id="o-ponudniku" className="bg-background pt-5 md:pt-7">
          <div className="mx-auto max-w-[1160px] px-4 lg:px-6">
            <nav aria-label={language === "sl" ? "Drobtinice" : "Breadcrumb"} className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <a href={getRoutePath("home", language)} className="font-medium transition hover:text-primary">{text.home}</a>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <a href={getRoutePath("customers", language)} className="font-medium transition hover:text-primary">{text.customers}</a>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="font-semibold text-foreground" aria-current="page">{client.name}</span>
            </nav>

            <div className="mt-5 flex items-start justify-between gap-5">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-background text-xl font-black text-primary shadow-[0_4px_14px_rgba(15,23,42,0.07)] md:h-20 md:w-20">
                  {client.logoUrl ? <img src={client.logoUrl} alt={client.name} width="80" height="80" decoding="async" className="h-full w-full object-contain p-2" /> : initialsFor(client.name)}
                </div>
                <div className="min-w-0 pt-0.5">
                  <span className="inline-flex items-center rounded-full bg-primary/[0.08] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.11em] text-primary">{primaryCategory}</span>
                  <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.035em] text-foreground md:text-[42px] md:leading-none">{client.name}</h1>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground">
                    {client.googleRating ? <span className="inline-flex items-center gap-1 font-semibold text-foreground"><Star className="h-4 w-4 fill-amber-400 text-amber-400" />{client.googleRating.toFixed(1)}{client.googleReviewCount ? <span className="font-normal text-muted-foreground">({client.googleReviewCount})</span> : null}</span> : null}
                    {client.address ? <><span className="hidden h-1 w-1 rounded-full bg-muted-foreground/50 sm:block" /><span>{client.address}</span></> : null}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 pt-1">
                <button type="button" onClick={shareProfile} className="grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-background text-foreground shadow-sm transition hover:border-primary/30 hover:text-primary" aria-label={language === "sl" ? "Deli" : "Share"}><Share2 className="h-[18px] w-[18px]" /></button>
                <button type="button" onClick={toggleFavourite} className="grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-background text-foreground shadow-sm transition hover:border-primary/30 hover:text-primary" aria-label={language === "sl" ? "Shrani med priljubljene" : "Save as favourite"}><Heart className={`h-[19px] w-[19px] ${favourite ? "fill-primary text-primary" : ""}`} /></button>
              </div>
            </div>

            <div className="mt-6 grid h-[280px] gap-2.5 overflow-hidden rounded-[18px] md:h-[360px] md:grid-cols-[1.62fr_1fr]">
              <div className="group relative overflow-hidden rounded-[18px] border border-border/50 bg-gradient-to-br from-primary/[0.08] via-background to-primary/[0.16]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(15,107,255,0.14),transparent_38%),radial-gradient(circle_at_80%_85%,rgba(251,146,60,0.11),transparent_40%)]" />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  {client.logoUrl ? <img src={client.logoUrl} alt="" className="max-h-[52%] max-w-[52%] object-contain opacity-95 transition duration-500 group-hover:scale-[1.03]" /> : <div className="grid h-28 w-28 place-items-center rounded-full border border-primary/15 bg-background/80 text-4xl font-black text-primary shadow-xl">{initialsFor(client.name)}</div>}
                </div>
                <div className="absolute bottom-5 left-5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-bold text-foreground shadow-sm backdrop-blur"><Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-primary" />{primaryCategory}</div>
              </div>
              <div className="hidden gap-2.5 md:grid md:grid-rows-2">
                <div className="relative overflow-hidden rounded-[18px] border border-border/50 bg-gradient-to-br from-[#eef5ff] to-[#f8fbff]">
                  <div className="absolute inset-0 flex items-center justify-center"><CalendarDays className="h-14 w-14 text-primary/25" /></div>
                  <div className="absolute bottom-4 left-4 right-4"><p className="text-xs font-bold uppercase tracking-[0.08em] text-primary">{onlineBookingLabel}</p><p className="mt-1 text-sm font-semibold text-foreground">{language === "sl" ? "Izberite storitev in prost termin." : "Choose a service and an available time."}</p></div>
                </div>
                <div className="relative overflow-hidden rounded-[18px] border border-border/50 bg-gradient-to-br from-[#fff8f2] to-background">
                  <div className="absolute inset-0 flex items-center justify-center"><MapPin className="h-14 w-14 text-orange-400/25" /></div>
                  <div className="absolute bottom-4 left-4 right-4"><p className="line-clamp-2 text-sm font-semibold text-foreground">{client.address || (language === "sl" ? "Lokacija ponudnika" : "Provider location")}</p></div>
                </div>
              </div>
            </div>

            <div className="mt-1 flex items-center gap-8 overflow-x-auto border-b border-border/70 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button type="button" onClick={() => setActiveProfileTab("services")} className={`border-b-2 px-1 py-4 text-sm transition ${activeProfileTab === "services" ? "border-primary font-bold text-primary" : "border-transparent font-semibold text-muted-foreground hover:text-foreground"}`}>{text.services}</button>
              <button type="button" onClick={() => setActiveProfileTab("benefits")} className={`border-b-2 px-1 py-4 text-sm transition ${activeProfileTab === "benefits" ? "border-primary font-bold text-primary" : "border-transparent font-semibold text-muted-foreground hover:text-foreground"}`}>{text.benefits}</button>
              <a href="#o-lokaciji" className="border-b-2 border-transparent px-1 py-4 text-sm font-semibold text-muted-foreground transition hover:text-foreground">{aboutLocationLabel}</a>
              {team.length > 0 ? <a href="#ekipa" className="border-b-2 border-transparent px-1 py-4 text-sm font-semibold text-muted-foreground transition hover:text-foreground">{text.team}</a> : null}
              {(review || client.googleRating) ? <a href="#mnenja" className="border-b-2 border-transparent px-1 py-4 text-sm font-semibold text-muted-foreground transition hover:text-foreground">{reviewsLabel}</a> : null}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1160px] gap-8 px-4 pt-7 lg:grid-cols-[minmax(0,1fr)_330px] lg:px-6">
          <div className="min-w-0">
            <div id="storitve" className="scroll-mt-28">
              {activeProfileTab === "services" ? (
                <>
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">{text.services}</h2>
                  {categoryNames.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" onClick={() => setActiveServiceGroup("")} className={`rounded-full border px-4 py-2 text-xs font-bold transition ${!activeServiceGroup ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border/70 bg-background text-foreground hover:border-primary/30"}`}>{allServicesLabel}</button>
                      {categoryNames.map((name) => <button key={name} type="button" onClick={() => setActiveServiceGroup(name)} className={`rounded-full border px-4 py-2 text-xs font-bold transition ${activeServiceGroup === name ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border/70 bg-background text-foreground hover:border-primary/30"}`}>{name}</button>)}
                    </div>
                  ) : null}

                  {services.length > 0 ? (
                    <div className="mt-4 overflow-hidden rounded-[18px] border border-border/70 bg-background shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
                      {visibleServices.map((service, index) => {
                        const serviceBookingPath = addBookingService(bookingPath, service.id);
                        const launchKey = `service-${service.id}`;
                        return (
                          <article key={service.id} className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${index > 0 ? "border-t border-border/60" : ""}`}>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-extrabold text-foreground sm:text-[15px]">{service.name}</h3>
                              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                                {service.durationMinutes ? <span>{service.durationMinutes} {text.duration}</span> : null}
                                {(service.durationMinutes && (service.groupBooking || !service.groupBooking)) ? <span>•</span> : null}
                                <span>{service.groupBooking && service.maxParticipantsPerSession ? `${text.upTo} ${service.maxParticipantsPerSession} ${text.participants}` : onePersonLabel}</span>
                              </div>
                              {service.description ? <p className="mt-1.5 line-clamp-2 max-w-2xl text-xs leading-5 text-muted-foreground">{service.description}</p> : null}
                            </div>
                            <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                              {service.priceLabel ? <span className="min-w-[64px] text-right text-sm font-extrabold text-foreground">{service.priceLabel}</span> : null}
                              {bookingEnabled ? <Button variant="outline" size="sm" className="h-9 rounded-lg border-primary/40 px-4 text-xs font-bold text-primary hover:bg-primary/[0.05]" asChild><a href={serviceBookingPath} onClick={(event) => launchBooking(event, "profile_service", serviceBookingPath, service.id)}>{bookingLaunching === launchKey ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}{chooseTimeLabel}</a></Button> : null}
                            </div>
                          </article>
                        );
                      })}
                      {activeServiceGroup ? <div className="border-t border-border/60 p-3 text-center"><button type="button" onClick={() => setActiveServiceGroup("")} className="rounded-lg border border-primary/35 px-4 py-2 text-xs font-bold text-primary transition hover:bg-primary/[0.05]">{seeAllServicesLabel}</button></div> : null}
                    </div>
                  ) : (
                    <article className="mt-4 rounded-[18px] border border-border/70 bg-background p-6 shadow-sm">
                      <CalendarDays className="h-6 w-6 text-primary" />
                      <h3 className="mt-4 font-bold text-foreground">{text.fallbackServices}</h3>
                      <ul className="mt-3 flex flex-wrap gap-2">{fallbackServiceItems.map((service) => <li key={service} className="rounded-full bg-secondary/70 px-3 py-1.5 text-xs font-semibold text-muted-foreground">{service}</li>)}</ul>
                    </article>
                  )}
                </>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">{text.benefits}</h2>
                  {benefitTypes.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" onClick={() => setActiveBenefitType("")} className={`rounded-full border px-4 py-2 text-xs font-bold transition ${!activeBenefitType ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border/70 bg-background text-foreground hover:border-primary/30"}`}>{allBenefitsLabel}</button>
                      {benefitTypes.map((type) => <button key={type} type="button" onClick={() => setActiveBenefitType(type)} className={`rounded-full border px-4 py-2 text-xs font-bold transition ${activeBenefitType === type ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border/70 bg-background text-foreground hover:border-primary/30"}`}>{benefitTypeLabel(type, language)}</button>)}
                    </div>
                  ) : null}

                  {benefits.length > 0 ? (
                    <div className="mt-4 overflow-hidden rounded-[18px] border border-border/70 bg-background shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
                      {visibleBenefits.map((product, index) => {
                        const meta = productMeta(product, language);
                        return (
                          <article key={product.productId} className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${index > 0 ? "border-t border-border/60" : ""}`}>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-extrabold text-foreground sm:text-[15px]">{product.name}</h3>
                              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                                <span>{benefitTypeLabel(product.productType, language)}</span>
                                {meta ? <><span>•</span><span>{meta}</span></> : null}
                              </div>
                              {product.description ? <p className="mt-1.5 line-clamp-2 max-w-2xl text-xs leading-5 text-muted-foreground">{product.description}</p> : null}
                              {product.promoText ? <p className="mt-1.5 text-xs font-bold text-primary">{product.promoText}</p> : null}
                            </div>
                            <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                              <span className="min-w-[64px] text-right text-sm font-extrabold text-foreground">{formatMoney(product.priceGross, product.currency, language)}</span>
                              <Button variant="outline" size="sm" className="h-9 rounded-lg border-primary/40 px-4 text-xs font-bold text-primary hover:bg-primary/[0.05]" asChild><a href={connectPurchaseUrl(product.productId)}>{buyBenefitLabel}</a></Button>
                            </div>
                          </article>
                        );
                      })}
                      {activeBenefitType ? <div className="border-t border-border/60 p-3 text-center"><button type="button" onClick={() => setActiveBenefitType("")} className="rounded-lg border border-primary/35 px-4 py-2 text-xs font-bold text-primary transition hover:bg-primary/[0.05]">{seeAllBenefitsLabel}</button></div> : null}
                    </div>
                  ) : (
                    <article className="mt-4 rounded-[18px] border border-border/70 bg-background p-6 shadow-sm">
                      <Sparkles className="h-6 w-6 text-primary" />
                      <h3 className="mt-4 font-bold text-foreground">{text.benefits}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{text.benefitsEmpty}</p>
                    </article>
                  )}
                </>
              )}
            </div>

            {team.length > 0 ? (
              <section id="ekipa" className="scroll-mt-28 pt-9">
                <div className="flex items-center justify-between"><h2 className="font-display text-xl font-extrabold tracking-tight text-foreground">{text.team}</h2><span className="text-xs font-bold text-primary">{language === "sl" ? "Poglej vse" : "See all"}</span></div>
                <div className="mt-5 flex flex-wrap gap-x-7 gap-y-5">
                  {team.map((member) => (
                    <div key={member.id} className="w-[66px] text-center">
                      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-primary/10 bg-gradient-to-br from-primary/[0.12] to-primary/[0.03] text-sm font-extrabold text-primary shadow-sm">{initialsFor(member.name)}</span>
                      <span className="mt-2 block truncate text-xs font-semibold text-foreground">{member.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            <section id="o-lokaciji" className="scroll-mt-28 pt-9">
              <h2 className="font-display text-xl font-extrabold tracking-tight text-foreground">{aboutLocationLabel}</h2>
              <div className="mt-4 rounded-[18px] border border-border/70 bg-background p-5 shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
                {description ? <p className="text-sm leading-6 text-muted-foreground">{description}</p> : <p className="text-sm text-muted-foreground">{language === "sl" ? "Več informacij o lokaciji trenutno ni na voljo." : "More information about this location is not available yet."}</p>}
                {client.address ? <a href={client.googleMapsUrl} target="_blank" rel="noreferrer noopener" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary"><MapPin className="h-4 w-4" />{client.address}<ExternalLink className="h-3.5 w-3.5" /></a> : null}
              </div>
            </section>

            {(review || client.googleRating) ? (
              <section id="mnenja" className="scroll-mt-28 pt-9">
                <h2 className="font-display text-xl font-extrabold tracking-tight text-foreground">{reviewsLabel}</h2>
                <div className="mt-4 rounded-[18px] border border-border/70 bg-background p-5 shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
                  <div className="flex items-center gap-2"><Star className="h-5 w-5 fill-amber-400 text-amber-400" /><strong className="text-xl text-foreground">{(review?.rating ?? client.googleRating ?? 0).toFixed(1)} / 5</strong></div>
                  {review ? <><blockquote className="mt-4 text-sm leading-6 text-muted-foreground">“{review.text[language]}”</blockquote><p className="mt-3 text-xs font-bold text-foreground">{review.author} · {review.source}</p></> : client.googleReviewCount ? <p className="mt-2 text-xs text-muted-foreground">{client.googleReviewCount} Google</p> : null}
                </div>
              </section>
            ) : null}

          </div>

          <aside className="lg:sticky lg:top-[92px] lg:self-start">
            <div className="overflow-hidden rounded-[18px] border border-border/70 bg-background shadow-[0_8px_28px_rgba(15,23,42,0.07)]">
              <div className="p-4">
                {bookingEnabled ? <Button variant="hero" className="h-11 w-full rounded-xl font-bold shadow-[0_7px_18px_rgba(15,107,255,0.20)]" asChild><a href={bookingPath} onClick={(event) => launchBooking(event, "profile", bookingPath)}>{bookingLaunching === "profile" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{text.bookingButton}</a></Button> : null}
              </div>
              <div className="border-t border-border/60 px-4 py-2">
                <div className="flex items-center gap-3 py-3 text-sm text-foreground"><CalendarDays className="h-4 w-4 text-muted-foreground" /><span className="font-medium">{onlineBookingLabel}</span><ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" /></div>
                {client.address ? <a href={client.googleMapsUrl} target="_blank" rel="noreferrer noopener" className="flex items-center gap-3 border-t border-border/50 py-3 text-sm text-foreground transition hover:text-primary"><MapPin className="h-4 w-4 text-muted-foreground" /><span className="line-clamp-2 font-medium">{client.address}</span><ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" /></a> : null}
              </div>
            </div>

            <div className="mt-4 rounded-[18px] border border-border/70 bg-background p-5 shadow-[0_5px_20px_rgba(15,23,42,0.05)]">
              <h3 className="font-display text-base font-extrabold text-foreground">{aboutLocationLabel}</h3>
              {description ? <p className="mt-3 line-clamp-5 text-xs leading-5 text-muted-foreground">{description}</p> : null}
              <a href="#o-lokaciji" className="mt-3 inline-block text-xs font-bold text-primary">{language === "sl" ? "Preberi več" : "Read more"}</a>
            </div>

            {client.googleRating ? (
              <div className="mt-4 rounded-[18px] border border-border/70 bg-background p-5 shadow-[0_5px_20px_rgba(15,23,42,0.05)]">
                <h3 className="font-display text-base font-extrabold text-foreground">{language === "sl" ? "Mnenja strank" : "Customer reviews"}</h3>
                <div className="mt-4 flex items-center gap-2"><Star className="h-5 w-5 fill-amber-400 text-amber-400" /><strong className="text-xl text-foreground">{client.googleRating.toFixed(1)} / 5</strong></div>
                {client.googleReviewCount ? <p className="mt-1 text-xs text-muted-foreground">{language === "sl" ? `Na podlagi ${client.googleReviewCount} mnenj` : `Based on ${client.googleReviewCount} reviews`}</p> : null}
                <a href="#mnenja" className="mt-3 inline-block text-xs font-bold text-primary">{language === "sl" ? "Poglej vsa mnenja" : "See all reviews"}</a>
              </div>
            ) : null}
          </aside>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PublicCompanyProfilePage;
