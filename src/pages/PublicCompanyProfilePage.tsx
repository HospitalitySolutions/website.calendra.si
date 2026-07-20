import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import NotFound from "@/pages/NotFound";
import { Button } from "@/components/ui/button";
import { APP_BASE_URL } from "@/lib/site";
import { getDirectoryClientBookingPath, normalizeDirectoryClients, type DirectoryClient } from "@/lib/company-directory";
import { getPublicCompanyProfile, getPublicCompanyProfilePath } from "@/lib/public-company-profiles";
import { useSiteLanguage } from "@/lib/site-language";
import { trackMarketingEvent } from "@/lib/marketing-events";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, MapPin, ShieldCheck, Star } from "lucide-react";

const initialsFor = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("") || "C";

const PublicCompanyProfilePage = () => {
  const { slug = "" } = useParams();
  const { language } = useSiteLanguage();
  const staticProfile = getPublicCompanyProfile(slug);
  const [apiClient, setApiClient] = useState<DirectoryClient | null>(null);

  useEffect(() => {
    if (!staticProfile) return;
    const controller = new AbortController();
    fetch(`${APP_BASE_URL}/api/public/company-directory`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(`Directory request failed: ${response.status}`)))
      .then((data) => {
        const clients = normalizeDirectoryClients(data, APP_BASE_URL);
        const match = clients.find((client) => client.slug === staticProfile.slug || client.name.toLowerCase() === staticProfile.name.toLowerCase());
        if (match) setApiClient(match);
      })
      .catch((error) => {
        if (error?.name !== "AbortError") console.warn("Public company profile could not be refreshed.", error);
      });
    return () => controller.abort();
  }, [staticProfile]);

  const client = useMemo<DirectoryClient | null>(() => {
    if (!staticProfile) return null;
    return {
      ...staticProfile,
      ...apiClient,
      slug: staticProfile.slug,
      tenantCode: apiClient?.tenantCode || staticProfile.tenantCode,
      description: apiClient?.description || staticProfile.localizedDescription[language],
    };
  }, [apiClient, language, staticProfile]);

  if (!staticProfile || !client) return <NotFound />;

  const text = language === "sl" ? {
    back: "Nazaj na naročanje",
    verified: "Javno podjetje v Calendri",
    services: "Storitve in področja",
    location: "Lokacija",
    review: "Mnenje uporabnika",
    bookingTitle: "Rezervirajte termin",
    bookingBody: "Izberite storitev, zaposlenega, datum in način plačila v varnem rezervacijskem toku Calendra.",
    bookingButton: "Odpri naročanje",
    security: "Rezervacija se zapiše neposredno v koledar podjetja.",
  } : {
    back: "Back to booking",
    verified: "Public business in Calendra",
    services: "Services and categories",
    location: "Location",
    review: "Customer review",
    bookingTitle: "Book an appointment",
    bookingBody: "Choose a service, employee, date and payment method in Calendra’s secure booking flow.",
    bookingButton: "Open booking",
    security: "The booking is added directly to the business calendar.",
  };

  const bookingPath = getDirectoryClientBookingPath(client);
  const trackBookingStart = () => {
    trackMarketingEvent("public_booking_started", {
      company_slug: client.slug,
      company_name: client.name,
      tenant_code: client.tenantCode || client.tenantSlug || client.slug,
      language,
      source: "profile",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border/60 bg-gradient-to-br from-background via-card to-primary/[0.05] py-14 md:py-20">
          <div className="container mx-auto max-w-6xl px-4 lg:px-8">
            <a href={getPublicCompanyProfilePath("", language).replace(/\/$/, "")} className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" />{text.back}</a>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
              <div className="flex items-start gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-border/70 bg-card text-2xl font-black text-primary shadow-soft">
                  {client.logoUrl ? <img src={client.logoUrl} alt={language === "sl" ? `Logotip podjetja ${client.name}` : `${client.name} company logo`} width="80" height="80" decoding="async" className="h-full w-full object-contain p-2" /> : initialsFor(client.name)}
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/[0.08] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-primary"><CheckCircle2 className="h-4 w-4" />{text.verified}</div>
                  <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">{client.name}</h1>
                  <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{staticProfile.localizedDescription[language]}</p>
                </div>
              </div>
              <Button variant="hero" size="lg" className="rounded-xl" asChild><a href={bookingPath} onClick={trackBookingStart}>{text.bookingButton}<ArrowRight className="h-4 w-4" /></a></Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto grid max-w-6xl gap-6 px-4 py-14 lg:grid-cols-3 lg:px-8 md:py-20">
          <article className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
            <CalendarDays className="h-7 w-7 text-primary" />
            <h2 className="mt-5 text-xl font-bold text-foreground">{text.services}</h2>
            <ul className="mt-4 grid gap-3">{staticProfile.serviceCategories[language].map((service) => <li key={service} className="flex items-center gap-3 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-primary" />{service}</li>)}</ul>
          </article>
          <article className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
            <MapPin className="h-7 w-7 text-primary" />
            <h2 className="mt-5 text-xl font-bold text-foreground">{text.location}</h2>
            <a href={client.googleMapsUrl} target="_blank" rel="noreferrer noopener" className="mt-4 block leading-7 text-muted-foreground transition hover:text-primary">{client.address}</a>
          </article>
          {staticProfile.review ? (
            <article className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
              <div className="flex gap-0.5" aria-label={`${staticProfile.review.rating} / 5`}>{Array.from({ length: staticProfile.review.rating }).map((_, index) => <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
              <h2 className="mt-5 text-xl font-bold text-foreground">{text.review}</h2>
              <blockquote className="mt-4 leading-7 text-muted-foreground">“{staticProfile.review.text[language]}”</blockquote>
              <p className="mt-4 text-sm font-semibold text-foreground">{staticProfile.review.author} · {staticProfile.review.source}</p>
            </article>
          ) : null}
        </section>

        <section id="rezervacija" className="bg-card py-16 md:py-24">
          <div className="container mx-auto max-w-5xl px-4 text-center lg:px-8">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/[0.08] text-primary"><CalendarDays className="h-7 w-7" /></span>
            <h2 className="mt-6 font-display text-3xl font-bold text-foreground md:text-4xl">{text.bookingTitle}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{text.bookingBody}</p>
            <Button variant="hero" size="lg" className="mt-7 rounded-xl" asChild><a href={bookingPath} onClick={trackBookingStart}>{text.bookingButton}<ArrowRight className="h-4 w-4" /></a></Button>
            <p className="mx-auto mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" />{text.security}</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PublicCompanyProfilePage;
