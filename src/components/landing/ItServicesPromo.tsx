import { Button } from "@/components/ui/button";
import { getItServiceContent, IT_SERVICE_ROUTE_KEYS } from "@/lib/it-services";
import { getRoutePath } from "@/lib/localized-routes";
import { useSiteLanguage } from "@/lib/site-language";
import { ArrowRight, Globe2, Headphones, Mail, Repeat2, ShieldCheck, Wrench } from "lucide-react";

const icons = [Headphones, Globe2, Wrench, Mail, ShieldCheck, Repeat2] as const;

const copy = {
  sl: {
    eyebrow: "Dodatne IT storitve",
    title: "Več kot program za naročanje",
    intro:
      "Poleg Calendre pomagamo malim podjetjem urediti spletne strani, poslovno e-pošto, varnostne kopije, vsakodnevno IT-podporo in povezovanje poslovnih sistemov.",
    cta: "Preglejte IT storitve",
    note: "IT storitve so samostojna ponudba in niso vključene v naročnino Calendra.",
  },
  en: {
    eyebrow: "Additional IT services",
    title: "More than appointment-booking software",
    intro:
      "Alongside Calendra, we help small businesses with websites, business email, backups, everyday IT support and business-system integration.",
    cta: "Explore IT services",
    note: "IT services are a standalone offer and are not included in the Calendra subscription.",
  },
} as const;

const ItServicesPromo = () => {
  const { language } = useSiteLanguage();
  const content = copy[language];

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-card to-accent/[0.06] p-8 shadow-soft md:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{content.eyebrow}</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{content.title}</h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">{content.intro}</p>
              <Button variant="hero" size="lg" className="mt-7 rounded-xl" asChild>
                <a href={getRoutePath("itServices", language)}>{content.cta}<ArrowRight className="h-4 w-4" /></a>
              </Button>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{content.note}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {IT_SERVICE_ROUTE_KEYS.map((routeKey, index) => {
                const service = getItServiceContent(routeKey, language);
                const Icon = icons[index];
                return (
                  <a key={routeKey} href={getRoutePath(routeKey, language)} className="group rounded-2xl border border-border/60 bg-background p-5 transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-sm">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    <p className="mt-4 font-semibold leading-6 text-foreground">{service.navLabel}</p>
                    <ArrowRight className="mt-4 h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItServicesPromo;
