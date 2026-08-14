import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CUSTOMER_LOGIN_ROUTE } from "@/lib/routes";
import { getRoutePath } from "@/lib/localized-routes";
import { getIndustryContent, INDUSTRY_ROUTE_KEYS } from "@/lib/industry-pages";
import {
  BarChart3,
  Bell,
  Briefcase,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Globe,
  Menu,
  Package,
  Receipt,
  Scissors,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { WORDMARK } from "@/lib/brand-assets";
import { languageNames, getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage, type SiteLanguage } from "@/lib/site-language";
import CustomerNavbar from "./CustomerNavbar";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const { language, setLanguage } = useSiteLanguage();
  const { pathname, search } = useLocation();
  const copy = getSiteCopy(language);
  const customerMode = pathname === getRoutePath("customers", "sl")
    || pathname === getRoutePath("customers", "en")
    || pathname === getRoutePath("connect", "sl")
    || pathname === getRoutePath("connect", "en")
    || pathname === getRoutePath("businesses", "sl")
    || pathname === getRoutePath("businesses", "en")
    || pathname.startsWith(`${getRoutePath("businesses", "sl")}/`)
    || pathname.startsWith(`${getRoutePath("businesses", "en")}/`);

  const homePath = getRoutePath("home", language);
  const bookingPath = getRoutePath("booking", language);
  const customerPath = getRoutePath("customers", language);
  const customerLoginPath = `${CUSTOMER_LOGIN_ROUTE}?next=${encodeURIComponent(`${pathname}${search}`)}`;
  const pricingPath = getRoutePath("pricing", language);
  const calendarPath = getRoutePath("calendar", language);
  const clientManagementPath = getRoutePath("clientManagement", language);
  const remindersPath = getRoutePath("reminders", language);
  const invoicingPath = getRoutePath("invoicing", language);
  const materialManagementPath = getRoutePath("materialManagement", language);
  const contactPath = getRoutePath("contact", language);

  const featurePaths = [
    getRoutePath("calendar", "sl"),
    getRoutePath("calendar", "en"),
    getRoutePath("invoicing", "sl"),
    getRoutePath("invoicing", "en"),
    getRoutePath("clientManagement", "sl"),
    getRoutePath("clientManagement", "en"),
    getRoutePath("reminders", "sl"),
    getRoutePath("reminders", "en"),
    getRoutePath("integrations", "sl"),
    getRoutePath("integrations", "en"),
    getRoutePath("materialManagement", "sl"),
    getRoutePath("materialManagement", "en"),
  ];
  const industryPaths = INDUSTRY_ROUTE_KEYS.flatMap((key) => [getRoutePath(key, "sl"), getRoutePath(key, "en")]);
  const bookingPaths = [getRoutePath("booking", "sl"), getRoutePath("booking", "en")];
  const aboutAppActive = [getRoutePath("home", "sl"), getRoutePath("home", "en"), ...featurePaths, ...industryPaths, ...bookingPaths].includes(pathname);
  const customerStoriesPaths = [getRoutePath("customerStories", "sl"), getRoutePath("customerStories", "en")];
  const blogPaths = [getRoutePath("blog", "sl"), getRoutePath("blog", "en")];
  const resourcesActive = [...customerStoriesPaths, ...blogPaths].some(
    (activePath) => pathname === activePath || pathname.startsWith(`${activePath}/`),
  );
  const solutionsLabel = language === "sl" ? "Rešitve" : "Solutions";
  const aboutAppLabel = copy.nav.aboutApp ?? (language === "sl" ? "O aplikaciji" : "About the app");
  const resourcesLabel = language === "sl" ? "Vsebine" : "Resources";

  const featureMenuItems = useMemo(
    () => [
      {
        title: language === "sl" ? "Koledar terminov" : "Appointment calendar",
        description:
          language === "sl"
            ? "Pametno upravljanje terminov in razpoložljivosti v enem pogledu."
            : "Smart appointment and availability management in one view.",
        href: calendarPath,
        icon: CalendarDays,
      },
      {
        title: language === "sl" ? "Upravljanje strank" : "Client management",
        description:
          language === "sl"
            ? "Vsi podatki o strankah, obiskih in zgodovini na enem mestu."
            : "Client records, visits and history stored in one place.",
        href: clientManagementPath,
        icon: Users,
      },
      {
        title: language === "sl" ? "Obveščanje" : "Notifications",
        description:
          language === "sl"
            ? "Samodejna SMS in e-poštna obvestila za manj izostalih terminov."
            : "Automated SMS and email reminders to reduce missed appointments.",
        href: remindersPath,
        icon: Bell,
      },
      {
        title: language === "sl" ? "Spletna plačila" : "Online payments",
        description:
          language === "sl"
            ? "Hitra in varna spletna plačila za vaše storitve."
            : "Fast and secure online payments for your services.",
        href: invoicingPath,
        icon: CreditCard,
      },
      {
        title: language === "sl" ? "Davčna blagajna" : "Fiscal cash register",
        description:
          language === "sl"
            ? "Popolna skladnost z zakonodajo in enostavno izdajanje računov."
            : "Compliant invoicing and fiscal workflows made simple.",
        href: invoicingPath,
        icon: Receipt,
      },
      {
        title: language === "sl" ? "Analitika" : "Analytics",
        description:
          language === "sl"
            ? "Ključni podatki o poslovanju za boljše odločitve."
            : "Business insights and performance metrics for better decisions.",
        href: `${homePath}#funkcionalnosti`,
        icon: BarChart3,
      },
      {
        title: language === "sl" ? "Organizacija dela" : "Work organisation",
        description:
          language === "sl"
            ? "Naloge, urniki in sodelovanje ekipe na enem mestu."
            : "Tasks, schedules and team collaboration in one place.",
        href: bookingPath,
        icon: ClipboardList,
      },
      {
        title: language === "sl" ? "Spletno naročanje" : "Online booking",
        description:
          language === "sl"
            ? "Stranke si lahko termin hitro in preprosto rezervirajo prek spleta."
            : "Let clients quickly and easily book appointments online.",
        href: bookingPath,
        icon: Globe,
      },
      {
        title: language === "sl" ? "Materialno poslovanje" : "Inventory management",
        description:
          language === "sl"
            ? "Artikli, zaloga, nabava, inventura in poraba materiala na enem mestu."
            : "Items, stock, purchasing, inventory counts and material usage in one place.",
        href: materialManagementPath,
        icon: Package,
      },
    ],
    [bookingPath, calendarPath, clientManagementPath, homePath, invoicingPath, language, materialManagementPath, remindersPath],
  );

  const solutionMenuItems = useMemo(
    () => [
      {
        title: language === "sl" ? "Kozmetični saloni" : "Beauty salons",
        href: getRoutePath("beautyHair", language),
        icon: Sparkles,
      },
      {
        title: language === "sl" ? "Frizerski saloni" : "Hair salons",
        href: getRoutePath("beautyHair", language),
        icon: Scissors,
      },
      {
        title: language === "sl" ? "Brivnice" : "Barbershops",
        href: getRoutePath("beautyHair", language),
        icon: Scissors,
      },
      {
        title: "Wellness",
        href: getRoutePath("healthWellbeing", language),
        icon: Sparkles,
      },
      {
        title: language === "sl" ? "Vadbe & trenerji" : "Classes & trainers",
        href: getRoutePath("fitnessGroups", language),
        icon: BarChart3,
      },
      {
        title: language === "sl" ? "Po meri" : "Custom",
        href: `${contactPath}?type=calendra`,
        icon: Briefcase,
      },
    ],
    [contactPath, language],
  );

  const topLevelLinks = [
    {
      label: copy.nav.pricing,
      href: pricingPath,
      activePaths: [getRoutePath("pricing", "sl"), getRoutePath("pricing", "en")],
    },
  ];

  const resourceMenuItems = [
    {
      title: language === "sl" ? "Zgodbe strank" : "Customer stories",
      description:
        language === "sl"
          ? "Kako Calendra pomaga različnim podjetjem pri vsakodnevnem delu."
          : "See how different businesses use Calendra in their day-to-day work.",
      href: getRoutePath("customerStories", language),
    },
    {
      title: copy.nav.blog,
      description:
        language === "sl"
          ? "Praktični nasveti za naročanje, organizacijo dela in poslovanje."
          : "Practical guides for booking, organisation and running your business.",
      href: getRoutePath("blog", language),
    },
  ];

  /**
   * Article URLs sit below their index path, so the blog tab has to stay
   * highlighted while an article is open, not only on the index itself.
   */
  const isLinkActive = (activePaths: string[]) =>
    activePaths.some((activePath) => pathname === activePath || pathname.startsWith(`${activePath}/`));

  if (customerMode) return <CustomerNavbar />;

  return (
    <nav
      className="sticky top-0 isolate border-b border-border/55 bg-background/82 backdrop-blur-xl supports-[backdrop-filter]:bg-background/74"
      style={{ zIndex: 1000 }}
    >
      <div className="container mx-auto flex h-[72px] items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <a href={homePath} className="flex items-center">
            <img
              src={WORDMARK.src}
              alt="Calendra"
              width={WORDMARK.width}
              height={WORDMARK.height}
              className="h-8 w-auto md:h-9"
            />
          </a>

          <div className="relative hidden min-w-[145px] xl:block">
            <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as SiteLanguage)}
              className="w-full appearance-none rounded-full border border-border/85 bg-white/85 px-9 py-2.5 pr-9 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-primary"
              aria-label={copy.nav.language}
            >
              <option value="sl">{languageNames[language].sl}</option>
              <option value="en">{languageNames[language].en}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="hidden items-center gap-7 xl:flex">
          <div className="group relative">
            <a
              href={homePath}
              className={`relative inline-flex items-center gap-1 whitespace-nowrap py-7 text-sm font-medium transition-colors hover:text-foreground ${
                aboutAppActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {aboutAppLabel}
              <ChevronDown className="h-4 w-4 transition group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden="true" />
              {aboutAppActive && <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary" aria-hidden="true" />}
            </a>

            <div className="invisible absolute left-1/2 top-[calc(100%-4px)] z-[1010] w-[980px] -translate-x-1/2 translate-y-2 rounded-[28px] border border-border/70 bg-white p-8 opacity-0 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="grid gap-8 lg:grid-cols-[1.45fr_0.95fr]">
                <div>
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-primary">{copy.nav.features}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {language === "sl"
                        ? "Vse ključne funkcionalnosti za pametno upravljanje terminov, strank in poslovanja."
                        : "Core capabilities for smart appointment, client and business management."}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {featureMenuItems.map((item, index) => {
                      const Icon = item.icon;
                      const isMaterialManagement = index === featureMenuItems.length - 1;
                      return (
                        <a
                          key={item.title}
                          href={item.href}
                          className={`group/item rounded-3xl border border-border/70 bg-background px-5 py-4 transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md ${
                            isMaterialManagement ? "sm:col-span-2" : ""
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
                              <Icon className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                              <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>

                  <div className="mt-4 rounded-2xl border border-primary/10 bg-primary/[0.04] px-4 py-3 text-sm text-muted-foreground">
                    <span className="font-semibold text-primary">Calendra</span>{" "}
                    {language === "sl"
                      ? "združuje koledar, stranke, plačila, opomnike, analitiko in materialno poslovanje na enem mestu."
                      : "brings together scheduling, clients, payments, reminders, analytics and inventory management in one place."}
                  </div>
                </div>

                <div className="border-t border-border/70 pt-1 lg:border-l lg:border-t-0 lg:pl-8">
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-primary">{solutionsLabel}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {language === "sl"
                        ? "Izberite rešitev glede na vaš tip poslovanja."
                        : "Choose a solution based on your business type."}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {solutionMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.title}
                          href={item.href}
                          className="flex items-center justify-between rounded-2xl border border-border/70 bg-background px-4 py-4 transition hover:border-primary/25 hover:bg-secondary/40"
                        >
                          <span className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
                              <Icon className="h-5 w-5" />
                            </span>
                            <span className="text-sm font-medium text-foreground">{item.title}</span>
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        </a>
                      );
                    })}
                  </div>

                  <a href={`${contactPath}?type=calendra`} className="mt-4 block rounded-2xl bg-primary/[0.05] px-5 py-4 transition hover:bg-primary/[0.08]">
                    <p className="text-sm font-semibold text-primary">
                      {language === "sl" ? "Ne najdete svoje dejavnosti?" : "Don’t see your industry?"}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {language === "sl"
                        ? "Pripravimo rešitev po meri za vaš način dela."
                        : "We can tailor Calendra to the way your business works."}
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {topLevelLinks.map((link) => {
            const isActive = isLinkActive(link.activePaths);
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative whitespace-nowrap text-sm font-medium transition-colors hover:text-foreground ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {link.label}
                {isActive && <span className="absolute -bottom-7 left-0 h-0.5 w-full rounded-full bg-primary" aria-hidden="true" />}
              </a>
            );
          })}

          <div className="group relative">
            <button
              type="button"
              className={`relative inline-flex items-center gap-1 whitespace-nowrap py-7 text-sm font-medium transition-colors hover:text-foreground ${
                resourcesActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {resourcesLabel}
              <ChevronDown className="h-4 w-4 transition group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden="true" />
              {resourcesActive && <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary" aria-hidden="true" />}
            </button>

            <div className="invisible absolute left-1/2 top-[calc(100%-4px)] z-[1010] w-[390px] -translate-x-1/2 translate-y-2 rounded-[24px] border border-border/70 bg-white p-3 opacity-0 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="grid gap-2">
                {resourceMenuItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between rounded-2xl px-4 py-4 transition hover:bg-secondary/60"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-foreground">{item.title}</span>
                      <span className="mt-1 block text-sm leading-5 text-muted-foreground">{item.description}</span>
                    </span>
                    <ChevronRight className="ml-4 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-2.5 xl:flex">
          <Button variant="outline" className="rounded-full border-border/85 bg-white/85 px-5 shadow-sm" asChild>
            <a href={customerPath}>
              <Users className="h-4 w-4 text-primary" />
              {language === "sl" ? "Za stranke" : "For customers"}
            </a>
          </Button>
          <Button variant="hero" className="rounded-xl" asChild>
            <a href={customerLoginPath}>{language === "sl" ? "Prijava / Ustvari račun" : "Login / Create account"}</a>
          </Button>
        </div>

        <button className="xl:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/70 bg-background/95 px-4 pb-6 pt-4 backdrop-blur-xl xl:hidden">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as SiteLanguage)}
                className="w-full appearance-none rounded-2xl border border-border bg-white px-10 py-3 pr-10 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-primary"
                aria-label={copy.nav.language}
              >
                <option value="sl">{languageNames[language].sl}</option>
                <option value="en">{languageNames[language].en}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            <Button variant="outline" size="lg" className="rounded-2xl border-border/80 bg-white shadow-sm" asChild>
              <a href={customerPath} onClick={() => setOpen(false)}>
                <Users className="h-4 w-4 text-primary" />
                {language === "sl" ? "Za stranke" : "For customers"}
              </a>
            </Button>

            <div className="rounded-3xl border border-border/70 bg-white/90 p-2 shadow-sm">
              <button
                type="button"
                onClick={() => setMobileAboutOpen((current) => !current)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left font-semibold text-foreground"
              >
                <span>{aboutAppLabel}</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${mobileAboutOpen ? "rotate-180" : ""}`} />
              </button>

              {mobileAboutOpen && (
                <div className="mt-2 space-y-4 px-1 pb-1">
                  <div>
                    <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">{copy.nav.features}</p>
                    <div className="mt-2 grid gap-2">
                      {featureMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={item.title}
                            href={item.href}
                            className="flex items-start gap-3 rounded-2xl border border-border/60 px-3 py-3 hover:bg-secondary"
                            onClick={() => setOpen(false)}
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
                              <Icon className="h-5 w-5" />
                            </span>
                            <span>
                              <span className="block text-sm font-semibold text-foreground">{item.title}</span>
                              <span className="mt-1 block text-sm leading-5 text-muted-foreground">{item.description}</span>
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="px-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">{solutionsLabel}</p>
                    <div className="mt-2 grid gap-2">
                      {solutionMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={item.title}
                            href={item.href}
                            className="flex items-center justify-between rounded-2xl border border-border/60 px-3 py-3 hover:bg-secondary"
                            onClick={() => setOpen(false)}
                          >
                            <span className="flex items-center gap-3">
                              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
                                <Icon className="h-5 w-5" />
                              </span>
                              <span className="text-sm font-medium text-foreground">{item.title}</span>
                            </span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {topLevelLinks.map((link) => {
              const isActive = isLinkActive(link.activePaths);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`rounded-xl px-3 py-2 text-base font-medium transition-colors ${
                    isActive ? "bg-primary/[0.08] text-primary" : "text-muted-foreground hover:bg-secondary"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              );
            })}

            <div className="rounded-3xl border border-border/70 bg-white/90 p-2 shadow-sm">
              <button
                type="button"
                onClick={() => setMobileResourcesOpen((current) => !current)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left font-semibold ${
                  resourcesActive ? "text-primary" : "text-foreground"
                }`}
              >
                <span>{resourcesLabel}</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${mobileResourcesOpen ? "rotate-180" : ""}`} />
              </button>

              {mobileResourcesOpen && (
                <div className="mt-2 grid gap-2 px-1 pb-1">
                  {resourceMenuItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between rounded-2xl border border-border/60 px-3 py-3 hover:bg-secondary"
                      onClick={() => setOpen(false)}
                    >
                      <span>
                        <span className="block text-sm font-semibold text-foreground">{item.title}</span>
                        <span className="mt-1 block text-sm leading-5 text-muted-foreground">{item.description}</span>
                      </span>
                      <ChevronRight className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <Button variant="hero" size="lg" className="rounded-xl" asChild>
              <a href={customerLoginPath} onClick={() => setOpen(false)}>{language === "sl" ? "Prijava / Ustvari račun" : "Login / Create account"}</a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
