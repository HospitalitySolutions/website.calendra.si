import ResponsiveScreenshot from "@/components/marketing/ResponsiveScreenshot";
import { getRoutePath, type CanonicalRouteKey } from "@/lib/localized-routes";
import { MARKETING_IMAGES, type MarketingImage } from "@/lib/marketing-images";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage, type SiteLanguage } from "@/lib/site-language";
import {
  ArrowRight,
  Bell,
  CalendarCheck2,
  CalendarDays,
  Check,
  Plug,
  Receipt,
  Users,
} from "lucide-react";

const featureOrder = [0, 2, 4, 1, 3, 5] as const;
const detailRouteKeys: CanonicalRouteKey[] = [
  "booking",
  "calendar",
  "invoicing",
  "clientManagement",
  "reminders",
  "integrations",
];
const featureIcons = [CalendarCheck2, CalendarDays, Receipt, Users, Bell, Plug] as const;
const featureImages: Record<number, MarketingImage> = {
  0: MARKETING_IMAGES.bookingService,
  1: MARKETING_IMAGES.calendar,
  2: MARKETING_IMAGES.invoicing,
  3: MARKETING_IMAGES.clientProfile,
  4: MARKETING_IMAGES.reminders,
  5: MARKETING_IMAGES.bookingReview,
};
const featureTones = ["white", "warm", "blue", "warm", "blue", "warm"] as const;

const featureMeta: Record<SiteLanguage, { categories: string[]; highlights: string[][]; imageAlt: string[] }> = {
  sl: {
    categories: ["Naročanje", "Pregled", "Poslovanje", "Stranke", "Komunikacija", "Povezave"],
    highlights: [
      ["Rezervacije 24/7", "Vtičnik za vašo spletno stran"],
      ["Dnevni, tedenski in mesečni pogled", "Jasen pregled ekipe in prostorov"],
      ["Več načinov plačila", "Podatki za računovodstvo"],
      ["Zgodovina obiskov in zapiski", "Vsi podatki na enem mestu"],
      ["Samodejna obvestila", "Prilagodljive predloge"],
      ["Google Calendar, Stripe in Zoom", "Brez podvajanja podatkov"],
    ],
    imageAlt: [
      "Izbira storitve pri spletnem naročanju v Calendri",
      "Tedenski koledar terminov v Calendri",
      "Priprava računa in plačila v Calendri",
      "Profil stranke z zgodovino terminov v Calendri",
      "Predloge za SMS in e-poštna obvestila v Calendri",
      "Pregled rezervacije in plačila v Calendri",
    ],
  },
  en: {
    categories: ["Booking", "Overview", "Business", "Clients", "Communication", "Connections"],
    highlights: [
      ["Bookings available 24/7", "A widget for your website"],
      ["Daily, weekly and monthly views", "Clear team and room overview"],
      ["Multiple payment methods", "Accounting-ready data"],
      ["Visit history and notes", "All client data in one place"],
      ["Automatic notifications", "Customisable templates"],
      ["Google Calendar, Stripe and Zoom", "No duplicated data"],
    ],
    imageAlt: [
      "Service selection in Calendra online booking",
      "Weekly appointment calendar in Calendra",
      "Invoice and payment workflow in Calendra",
      "Client profile with appointment history in Calendra",
      "SMS and email notification templates in Calendra",
      "Booking and payment review in Calendra",
    ],
  },
};

const Features = () => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).features;
  const meta = featureMeta[language];

  return (
    <section id="funkcionalnosti" className="feature-editorial scroll-mt-20 pt-16 md:pt-20 lg:pt-24">
      <div className="container mx-auto max-w-[1380px] px-4 text-center sm:px-6 lg:px-8">
        <span className="marketing-eyebrow">{copy.eyebrow}</span>
        <h2 className="marketing-section-title mt-3 text-3xl sm:text-4xl lg:text-[3rem]">{copy.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{copy.description}</p>
      </div>

      <div className="mt-12 md:mt-16">
        {featureOrder.map((featureIndex, rowIndex) => {
          const item = copy.items[featureIndex];
          const Icon = featureIcons[featureIndex];
          const mediaFirst = rowIndex % 2 === 1;

          return (
            <article key={item.title} className={`feature-editorial-row feature-tone-${featureTones[rowIndex]}`}>
              <div className="container mx-auto grid max-w-[1380px] items-center gap-10 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-24">
                <div className={mediaFirst ? "lg:order-2" : ""}>
                  <span className={`feature-icon feature-icon-${featureTones[rowIndex]}`}>
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
                    {String(rowIndex + 1).padStart(2, "0")} · {meta.categories[featureIndex]}
                  </p>
                  <h3 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.04em] text-foreground sm:text-[2.5rem] sm:leading-[1.08]">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                    {item.description}
                  </p>

                  <ul className="mt-7 grid max-w-xl gap-4">
                    {meta.highlights[featureIndex].map((highlight) => (
                      <li key={highlight} className="flex items-center gap-3 text-sm font-semibold text-foreground sm:text-base">
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-[10px] ${featureTones[rowIndex] === "warm" ? "bg-orange-500/10 text-orange-600" : "bg-primary/10 text-primary"}`}>
                          <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                        </span>
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={getRoutePath(detailRouteKeys[featureIndex], language)}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:gap-3"
                  >
                    {item.linkLabel}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>

                <div className={mediaFirst ? "lg:order-1" : ""}>
                  <ResponsiveScreenshot
                    image={featureImages[featureIndex]}
                    alt={meta.imageAlt[featureIndex]}
                    className={`feature-product-shot feature-product-shot-${featureIndex}`}
                    imageClassName="feature-product-image"
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
