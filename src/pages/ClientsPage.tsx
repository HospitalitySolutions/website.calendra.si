import { useMemo, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BOOKING_PAGE, TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage, type SiteLanguage } from "@/lib/site-language";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Search,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

type ClientCategory = "salon" | "fitness" | "wellness" | "health" | "consulting";

type DirectoryClient = {
  slug: string;
  tenantSlug: string;
  name: string;
  initials: string;
  category: ClientCategory;
  categoryLabel: Record<SiteLanguage, string>;
  description: Record<SiteLanguage, string>;
  city: string;
  rating: string;
  reviews: number;
  services: number;
  accentClassName: string;
  logoClassName: string;
};

// Temporary static preview data. Later this can be replaced with backend API data
// while keeping the same page layout and card contract.
const directoryClients: DirectoryClient[] = [
  {
    slug: "studio-lux",
    tenantSlug: "studio-lux",
    name: "Studio LUX",
    initials: "LX",
    category: "salon",
    categoryLabel: { sl: "Salon", en: "Salon" },
    description: {
      sl: "Frizerski studio z vrhunskimi storitvami za popolno pričesko.",
      en: "A hair studio with premium services for a polished look.",
    },
    city: "Ljubljana",
    rating: "4,9",
    reviews: 128,
    services: 8,
    accentClassName: "bg-primary/[0.08] text-primary",
    logoClassName: "from-slate-950 to-slate-700 text-amber-300",
  },
  {
    slug: "fiziofit-center",
    tenantSlug: "fiziofit-center",
    name: "FizioFit center",
    initials: "FF",
    category: "health",
    categoryLabel: { sl: "Zdravje", en: "Health" },
    description: {
      sl: "Fizioterapija, manualne terapije in rehabilitacija za boljše počutje.",
      en: "Physiotherapy, manual therapy, and rehabilitation services.",
    },
    city: "Maribor",
    rating: "4,8",
    reviews: 96,
    services: 6,
    accentClassName: "bg-emerald-500/[0.10] text-emerald-700",
    logoClassName: "from-teal-500 to-cyan-700 text-white",
  },
  {
    slug: "yoga-vita",
    tenantSlug: "yoga-vita",
    name: "Yoga Vita",
    initials: "YV",
    category: "wellness",
    categoryLabel: { sl: "Wellness", en: "Wellness" },
    description: {
      sl: "Joga studio za ravnovesje telesa, uma in duha.",
      en: "A yoga studio for balance of body, mind, and wellbeing.",
    },
    city: "Koper",
    rating: "4,9",
    reviews: 74,
    services: 12,
    accentClassName: "bg-violet-500/[0.10] text-violet-700",
    logoClassName: "from-violet-500 to-fuchsia-700 text-white",
  },
  {
    slug: "dentalia",
    tenantSlug: "dentalia",
    name: "Dentalia",
    initials: "DE",
    category: "health",
    categoryLabel: { sl: "Zdravje", en: "Health" },
    description: {
      sl: "Zobozdravstvena ordinacija z osebnim pristopom in moderno opremo.",
      en: "A dental clinic with a personal approach and modern equipment.",
    },
    city: "Ljubljana",
    rating: "4,7",
    reviews: 62,
    services: 9,
    accentClassName: "bg-emerald-500/[0.10] text-emerald-700",
    logoClassName: "from-sky-300 to-sky-600 text-white",
  },
  {
    slug: "mindcoach",
    tenantSlug: "mindcoach",
    name: "MindCoach",
    initials: "MC",
    category: "consulting",
    categoryLabel: { sl: "Svetovanje", en: "Consulting" },
    description: {
      sl: "Osebno in poslovno svetovanje za vašo rast in uspeh.",
      en: "Personal and business consulting for growth and progress.",
    },
    city: "Celje",
    rating: "5,0",
    reviews: 38,
    services: 4,
    accentClassName: "bg-accent/[0.12] text-orange-700",
    logoClassName: "from-stone-100 to-amber-200 text-slate-900",
  },
  {
    slug: "bella-beauty",
    tenantSlug: "bella-beauty",
    name: "Bella Beauty",
    initials: "BB",
    category: "salon",
    categoryLabel: { sl: "Salon", en: "Salon" },
    description: {
      sl: "Kozmetične storitve za nego obraza in telesa.",
      en: "Beauty services for face and body care.",
    },
    city: "Novo mesto",
    rating: "4,8",
    reviews: 55,
    services: 10,
    accentClassName: "bg-primary/[0.08] text-primary",
    logoClassName: "from-rose-200 to-pink-400 text-rose-950",
  },
  {
    slug: "forma-fit",
    tenantSlug: "forma-fit",
    name: "Forma Fit",
    initials: "FT",
    category: "fitness",
    categoryLabel: { sl: "Fitness", en: "Fitness" },
    description: {
      sl: "Osebni treningi, vadbeni programi in meritve napredka.",
      en: "Personal training, workout plans, and progress tracking.",
    },
    city: "Kranj",
    rating: "4,9",
    reviews: 83,
    services: 7,
    accentClassName: "bg-blue-500/[0.10] text-blue-700",
    logoClassName: "from-blue-500 to-indigo-700 text-white",
  },
  {
    slug: "wellness-aura",
    tenantSlug: "wellness-aura",
    name: "Wellness Aura",
    initials: "WA",
    category: "wellness",
    categoryLabel: { sl: "Wellness", en: "Wellness" },
    description: {
      sl: "Masaže, sprostitveni rituali in individualne wellness storitve.",
      en: "Massage, relaxation rituals, and individual wellness services.",
    },
    city: "Bled",
    rating: "4,8",
    reviews: 49,
    services: 11,
    accentClassName: "bg-violet-500/[0.10] text-violet-700",
    logoClassName: "from-violet-300 to-indigo-500 text-white",
  },
];

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

  const filteredClients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return directoryClients.filter((client) => {
      const matchesFilter = activeCategory === "all" || client.category === activeCategory;
      const searchableText = [
        client.name,
        client.city,
        client.categoryLabel[language],
        client.description[language],
      ]
        .join(" ")
        .toLowerCase();

      return matchesFilter && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [activeCategory, language, query]);

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
          {filteredClients.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredClients.map((client) => {
                const serviceLabel = client.services === 1 ? copy.servicesLabelSingular : copy.servicesLabel;
                const bookingHref = `${BOOKING_PAGE}?tenant=${encodeURIComponent(client.tenantSlug)}`;

                return (
                  <article
                    key={client.slug}
                    id={client.slug}
                    className="group rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-glow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-black shadow-soft ${client.logoClassName}`}>
                        {client.initials}
                      </div>
                      <div className={`rounded-full px-3 py-1 text-xs font-bold ${client.accentClassName}`}>
                        {client.categoryLabel[language]}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2">
                      <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">{client.name}</h2>
                      <BadgeCheck className="h-5 w-5 text-primary" aria-label={copy.featuredLabel} />
                    </div>
                    <p className="mt-3 min-h-[3.5rem] text-sm leading-6 text-muted-foreground">{client.description[language]}</p>

                    <div className="mt-5 grid gap-3 rounded-2xl bg-background/70 p-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{client.city}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span className="inline-flex items-center gap-2">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          {client.rating} ({client.reviews})
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          {client.services} {serviceLabel}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3">
                      <Button variant="hero" size="lg" className="rounded-2xl shadow-lg shadow-primary/20" asChild>
                        <a href={bookingHref} aria-label={`${copy.primaryCta}: ${client.name}`}>
                          {copy.primaryCta}
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </a>
                      </Button>
                      <a
                        href={`/stranke#${client.slug}`}
                        className="text-center text-sm font-bold text-primary transition hover:text-primary/80"
                      >
                        {copy.secondaryCta}
                      </a>
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
