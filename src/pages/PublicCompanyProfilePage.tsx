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
import { getPublicCompanyProfile, publicCompanyProfiles, type PublicCompanyProfile } from "@/lib/public-company-profiles";
import { useSiteLanguage } from "@/lib/site-language";
import { trackMarketingEvent } from "@/lib/marketing-events";
import { ArrowRight, CalendarDays, CheckCircle2, ChevronRight, MapPin, ShieldCheck, Star } from "lucide-react";

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

const PublicCompanyProfilePage = () => {
  const { slug = "" } = useParams();
  const { language } = useSiteLanguage();
  const initialProfile = getPublicCompanyProfile(slug);
  const [apiClient, setApiClient] = useState<DirectoryClient | null>(null);
  const [loading, setLoading] = useState(!initialProfile);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const load = async () => {
      setLoading(!initialProfile);
      try {
        const detailResponse = await fetch(`${APP_BASE_URL}/api/public/location-directory/${encodeURIComponent(slug)}`, { signal: controller.signal });
        if (detailResponse.ok) {
          const detail = normalizeDirectoryClient(await detailResponse.json(), APP_BASE_URL);
          if (!cancelled && detail) setApiClient(detail);
          return;
        }

        // Curated profiles created before the location-first directory do not carry
        // the location id in their slug. Resolve those through the current location
        // directory without reviving the removed company-directory endpoint.
        if (initialProfile) {
          const listResponse = await fetch(`${APP_BASE_URL}/api/public/location-directory`, { signal: controller.signal });
          if (!listResponse.ok) return;
          const clients = normalizeDirectoryClients(await listResponse.json(), APP_BASE_URL);
          const match = clients.find((client) => sameTenant(initialProfile, client) || client.name.toLowerCase() === initialProfile.name.toLowerCase());
          if (!cancelled && match) setApiClient(match);
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
    const fallback = curatedProfile || initialProfile;
    if (!apiClient && !fallback) return null;
    if (!apiClient && fallback) {
      return {
        ...fallback,
        description: fallback.localizedDescription[language],
      };
    }
    if (!apiClient) return null;
    return {
      ...fallback,
      ...apiClient,
      description: apiClient.description || fallback?.localizedDescription[language] || "",
      logoUrl: apiClient.logoUrl || fallback?.logoUrl || null,
      category: apiClient.category || fallback?.category,
    };
  }, [apiClient, curatedProfile, initialProfile, language]);

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
    services: "Storitve in področja",
    location: "Lokacija",
    review: "Mnenje uporabnika",
    rating: "Google ocena",
    bookingTitle: "Rezervirajte termin",
    bookingBody: "Izberite storitev, zaposlenega in prost termin v varnem rezervacijskem toku Calendra.",
    bookingButton: "Rezerviraj termin",
    security: "Rezervacija se zapiše neposredno v koledar izbrane lokacije.",
  } : {
    home: "Home",
    customers: "For customers",
    directory: "Providers",
    verified: "Location on Calendra",
    services: "Services and categories",
    location: "Location",
    review: "Customer review",
    rating: "Google rating",
    bookingTitle: "Book an appointment",
    bookingBody: "Choose a service, employee and available time in Calendra's secure booking flow.",
    bookingButton: "Book an appointment",
    security: "The booking is added directly to the selected location's calendar.",
  };

  const bookingEnabled = isDirectoryClientBookingEnabled(client);
  const bookingPath = getDirectoryClientBookingPath(client);
  const serviceItems = curatedProfile?.serviceCategories[language] ?? [categoryLabel(client.category, language)];
  const review = curatedProfile?.review;
  const description = client.description || curatedProfile?.localizedDescription[language] || "";

  const openStandaloneBooking = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    trackMarketingEvent("public_booking_started", {
      company_slug: client.slug,
      company_name: client.name,
      tenant_code: client.tenantCode || client.tenantSlug || client.slug,
      location_id: client.locationId,
      language,
      source: "profile",
    });
    window.location.assign(bookingPath);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border/60 bg-gradient-to-br from-background via-card to-primary/[0.05] py-14 md:py-20">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <nav aria-label={language === "sl" ? "Drobtinice" : "Breadcrumb"} className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <a href={getRoutePath("home", language)} className="font-medium transition hover:text-primary">{text.home}</a>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              <a href={getRoutePath("customers", language)} className="font-medium transition hover:text-primary">{text.customers}</a>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              <a href={getRoutePath("businesses", language)} className="font-medium transition hover:text-primary">{text.directory}</a>
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
                </div>
              </div>
              {bookingEnabled ? <Button variant="hero" size="lg" className="rounded-xl" asChild><a href={bookingPath} onClick={openStandaloneBooking}>{text.bookingButton}<ArrowRight className="h-4 w-4" /></a></Button> : null}
            </div>
          </div>
        </section>

        <section className="container mx-auto grid max-w-6xl gap-6 px-4 py-14 lg:grid-cols-3 lg:px-8 md:py-20">
          <article className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
            <CalendarDays className="h-7 w-7 text-primary" />
            <h2 className="mt-5 text-xl font-bold text-foreground">{text.services}</h2>
            <ul className="mt-4 grid gap-3">{serviceItems.map((service) => <li key={service} className="flex items-center gap-3 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-primary" />{service}</li>)}</ul>
          </article>
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
