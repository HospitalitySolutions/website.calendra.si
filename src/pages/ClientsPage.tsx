import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { APP_BASE_URL } from "@/lib/site";
import { normalizeDirectoryClients, type ClientCategory, type DirectoryClient } from "@/lib/company-directory";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage, type SiteLanguage } from "@/lib/site-language";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Search,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

const categoryLabels: Record<ClientCategory, Record<SiteLanguage, string>> = {
  salon: { sl: "Salon", en: "Salon" },
  fitness: { sl: "Fitness", en: "Fitness" },
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

const initialsFor = (name: string) => name
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase() || "")
  .join("") || "C";

const filterCategoryMap: Record<SiteLanguage, Record<string, ClientCategory | "all">> = {
  sl: {
    Vse: "all",
    Salon: "salon",
    Fitness: "fitness",
    Wellness: "wellness",
    Zdravje: "health",
    Svetovanje: "consulting",
  },
  en: {
    All: "all",
    Salon: "salon",
    Fitness: "fitness",
    Wellness: "wellness",
    Health: "health",
    Consulting: "consulting",
  },
};

const ClientsPage = () => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).clientsPage;
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ClientCategory | "all">("all");
  const [directoryClients, setDirectoryClients] = useState<DirectoryClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${APP_BASE_URL}/api/public/company-directory`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Directory request failed: ${response.status}`);
        return response.json();
      })
      .then((data) => setDirectoryClients(normalizeDirectoryClients(data, APP_BASE_URL)))
      .catch((error) => {
        if (error?.name !== "AbortError") setDirectoryClients([]);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const filteredClients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return directoryClients.filter((client) => {
      const matchesFilter = activeCategory === "all" || client.category === activeCategory;
      const searchableText = [
        client.name,
        client.address,
        client.category ? categoryLabels[client.category][language] : "",
        client.description,
      ]
        .join(" ")
        .toLowerCase();

      return matchesFilter && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [activeCategory, directoryClients, language, query]);

  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <Navbar />

      <main>
        <section className="relative border-b border-border/50 bg-gradient-to-br from-background via-card to-primary/[0.04] py-16 md:py-24">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/[0.08] blur-3xl" aria-hidden="true" />
          <div className="absolute -right-24 top-28 h-80 w-80 rounded-full bg-primary/[0.10] blur-3xl" aria-hidden="true" />

          <div className="container relative mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/[0.08] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                {copy.badge}
              </div>

              <h1 className="mt-7 font-display text-5xl font-extrabold leading-tight tracking-tight text-foreground md:text-7xl">
                {copy.titlePrefix} <span className="text-gradient">{copy.titleHighlight}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">{copy.intro}</p>
            </div>

            <div className="mt-12 rounded-3xl border border-border/70 bg-card/90 p-4 shadow-soft backdrop-blur md:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-lg">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={copy.searchPlaceholder}
                    className="h-14 rounded-2xl border-border bg-background pl-12 text-base shadow-sm"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {copy.filters.map((filter) => {
                    const filterCategory = filterCategoryMap[language][filter] ?? "all";
                    const isActive = activeCategory === filterCategory;

                    return (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setActiveCategory(filterCategory)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          isActive
                            ? "border-primary/20 bg-primary/[0.10] text-primary shadow-sm"
                            : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}
                      >
                        {filter}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-18">
          {loading ? (
            <div className="rounded-3xl border border-border/70 bg-card p-10 text-center text-muted-foreground shadow-soft">
              {language === "sl" ? "Nalaganje podjetij…" : "Loading businesses…"}
            </div>
          ) : filteredClients.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredClients.map((client) => {
                const formattedReviewCount = client.googleReviewCount === null || client.googleReviewCount === undefined
                  ? null
                  : new Intl.NumberFormat(language === "sl" ? "sl-SI" : "en-US").format(client.googleReviewCount);

                return (
                  <article
                    key={client.slug}
                    id={client.slug}
                    className="group rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-glow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-background text-lg font-black text-primary shadow-soft">
                        {client.logoUrl ? (
                          <img src={client.logoUrl} alt={`${client.name} logo`} className="h-full w-full object-contain p-1.5" loading="lazy" />
                        ) : initialsFor(client.name)}
                      </div>
                      {client.category ? (
                        <div className={`rounded-full px-3 py-1 text-xs font-bold ${categoryClasses[client.category]}`}>
                          {categoryLabels[client.category][language]}
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-6 flex items-center gap-2">
                      <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">{client.name}</h2>
                    </div>
                    <p className="mt-3 min-h-[3.5rem] text-sm leading-6 text-muted-foreground">{client.description}</p>

                    {client.address || (client.googleRating !== null && client.googleRating !== undefined) ? (
                      <div className="mt-5 grid gap-3 rounded-2xl bg-background/70 p-4 text-sm text-muted-foreground">
                        {client.address ? (
                          <a
                            href={client.googleMapsUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="flex items-start gap-2 rounded-lg transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                            aria-label={`${client.address} — Google Maps`}
                          >
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span className="leading-5 underline decoration-transparent underline-offset-4 transition group-hover:decoration-current">
                              {client.address}
                            </span>
                          </a>
                        ) : null}

                        {client.googleRating !== null && client.googleRating !== undefined ? (
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                              {client.googleRating.toLocaleString(language === "sl" ? "sl-SI" : "en-US", {
                                minimumFractionDigits: 1,
                                maximumFractionDigits: 1,
                              })}
                              {formattedReviewCount !== null ? (
                                <span className="font-normal text-muted-foreground">({formattedReviewCount})</span>
                              ) : null}
                            </span>
                            <span className="text-xs font-medium text-muted-foreground">Google Maps</span>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="mt-6 grid gap-3">
                      <Button
                        type="button"
                        variant="hero"
                        size="lg"
                        className="rounded-2xl shadow-lg shadow-primary/20"
                        aria-label={`${copy.primaryCta}: ${client.name}`}
                      >
                        {copy.primaryCta}
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </Button>
                      <button
                        type="button"
                        className="text-center text-sm font-bold text-primary transition hover:text-primary/80"
                        aria-label={`${copy.secondaryCta}: ${client.name}`}
                      >
                        {copy.secondaryCta}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center shadow-soft">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
                <Search className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-2xl font-bold text-foreground">{copy.emptyTitle}</h2>
              <p className="mt-2 text-muted-foreground">{copy.emptyBody}</p>
            </div>
          )}
        </section>

        <section className="container mx-auto max-w-7xl px-4 pb-16 lg:px-8 lg:pb-24">
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-gradient-to-br from-primary/[0.08] via-card to-accent/[0.08] p-8 shadow-soft md:p-10 lg:p-12">
            <div className="absolute right-8 top-8 hidden h-40 w-40 rounded-full border border-primary/10 bg-card/60 md:block" aria-hidden="true" />
            <div className="absolute -right-10 bottom-8 hidden h-32 w-32 rounded-full bg-accent/[0.16] blur-2xl md:block" aria-hidden="true" />

            <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-accent">{copy.ctaEyebrow}</p>
                <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-4xl">{copy.ctaTitle}</h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{copy.ctaDescription}</p>
                <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Button variant="hero" size="lg" className="rounded-2xl" asChild>
                    <a href={TRIAL_SIGNUP_ROUTE}>
                      {copy.ctaButton}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {copy.ctaNote}
                  </span>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-sm rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/[0.10] text-primary">
                    <CalendarDays className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-28 rounded-full bg-muted" />
                    <div className="h-3 w-40 rounded-full bg-muted" />
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="h-3 rounded-full bg-muted" />
                  <div className="h-3 w-5/6 rounded-full bg-muted" />
                  <div className="h-12 rounded-2xl bg-primary shadow-lg shadow-primary/20" />
                </div>
                <div className="absolute -left-5 -top-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-card text-primary shadow-soft">
                  <Users className="h-6 w-6" />
                </div>
                <div className="absolute -bottom-5 -right-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-soft">
                  <Star className="h-6 w-6 fill-current" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ClientsPage;
