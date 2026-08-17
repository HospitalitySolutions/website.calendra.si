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
    <section className="bg-transparent py-16 md:py-20 lg:py-24">
      <div className="container mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="marketing-panel overflow-hidden rounded-[30px] p-7 sm:p-9 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <span className="marketing-eyebrow">{content.eyebrow}</span>
              <h2 className="marketing-section-title mt-3 text-3xl sm:text-4xl lg:text-[2.75rem]">{content.title}</h2>
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
                  <a key={routeKey} href={getRoutePath(routeKey, language)} className="marketing-card marketing-card-hover group rounded-[20px] bg-white/90 p-5">
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
