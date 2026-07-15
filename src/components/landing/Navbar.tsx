import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LOGIN_ROUTE, TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { getRoutePath } from "@/lib/localized-routes";
import { getItServiceContent, IT_SERVICE_ROUTE_KEYS } from "@/lib/it-services";
import { ChevronDown, Globe, Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import calendraLogo from "@/assets/calendra-logo.png";
import { languageNames, getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage, type SiteLanguage } from "@/lib/site-language";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { language, setLanguage } = useSiteLanguage();
  const { pathname } = useLocation();
  const copy = getSiteCopy(language);

  const homePath = getRoutePath("home", language);
  const navLinks = [
    { label: copy.nav.features, href: `${homePath}#funkcionalnosti`, activePaths: [] },
    { label: copy.nav.booking, href: getRoutePath("booking", language), activePaths: [getRoutePath("booking", "sl"), getRoutePath("booking", "en")] },
    { label: copy.nav.connect, href: getRoutePath("connect", language), activePaths: [getRoutePath("connect", "sl"), getRoutePath("connect", "en")] },
    { label: copy.nav.pricing, href: getRoutePath("pricing", language), activePaths: [getRoutePath("pricing", "sl"), getRoutePath("pricing", "en")] },
  ];
  const servicePaths = [
    getRoutePath("itServices", "sl"),
    getRoutePath("itServices", "en"),
    ...IT_SERVICE_ROUTE_KEYS.flatMap((key) => [getRoutePath(key, "sl"), getRoutePath(key, "en")]),
  ];
  const itServicesActive = servicePaths.includes(pathname);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-card/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between gap-3 px-4 lg:px-8">
        <a href={homePath} className="flex items-center">
          <img src={calendraLogo} alt="Calendra" width="628" height="205" className="h-8 w-auto md:h-9" />
        </a>

        <div className="hidden items-center gap-5 lg:flex xl:gap-7">
          {navLinks.slice(0, 3).map((link) => {
            const isActive = link.activePaths?.includes(pathname);
            return (
              <a key={link.href} href={link.href} className={`relative whitespace-nowrap text-sm font-medium transition-colors hover:text-foreground ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {link.label}
                {isActive && <span className="absolute -bottom-7 left-0 h-0.5 w-full rounded-full bg-primary" aria-hidden="true" />}
              </a>
            );
          })}

          <div className="group relative">
            <a href={getRoutePath("itServices", language)} className={`relative inline-flex items-center gap-1 whitespace-nowrap py-7 text-sm font-medium transition-colors hover:text-foreground ${itServicesActive ? "text-foreground" : "text-muted-foreground"}`}>
              {copy.nav.itServices}<ChevronDown className="h-4 w-4 transition group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden="true" />
              {itServicesActive && <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary" aria-hidden="true" />}
            </a>
            <div className="invisible absolute left-1/2 top-[calc(100%-4px)] z-50 w-[360px] -translate-x-1/2 translate-y-2 rounded-2xl border border-border/70 bg-background p-3 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <a href={getRoutePath("itServices", language)} className="block rounded-xl bg-primary/[0.06] px-4 py-3 font-semibold text-foreground transition hover:bg-primary/[0.1]">
                {language === "sl" ? "Pregled vseh IT storitev" : "Overview of all IT services"}
              </a>
              <div className="mt-2 grid gap-1">
                {IT_SERVICE_ROUTE_KEYS.map((routeKey) => {
                  const service = getItServiceContent(routeKey, language);
                  return (
                    <a key={routeKey} href={getRoutePath(routeKey, language)} className="rounded-xl px-4 py-2.5 text-sm leading-5 text-muted-foreground transition hover:bg-secondary hover:text-foreground">
                      {service.navLabel}
                    </a>
                  );
                })}
              </div>
              <a
                href={`${getRoutePath("contact", language)}?type=it`}
                className="mt-2 block rounded-xl border border-primary/15 bg-primary/[0.05] px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/[0.1]"
              >
                {language === "sl" ? "Pošljite povpraševanje za IT storitve" : "Send an IT services enquiry"}
              </a>
            </div>
          </div>

          {navLinks.slice(3).map((link) => {
            const isActive = link.activePaths?.includes(pathname);
            return (
              <a key={link.href} href={link.href} className={`relative whitespace-nowrap text-sm font-medium transition-colors hover:text-foreground ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {link.label}
                {isActive && <span className="absolute -bottom-7 left-0 h-0.5 w-full rounded-full bg-primary" aria-hidden="true" />}
              </a>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 lg:flex xl:gap-3">
          <div className="relative min-w-[145px] xl:min-w-[165px]">
            <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as SiteLanguage)}
              className="w-full appearance-none rounded-xl border border-border bg-background px-9 py-2.5 pr-9 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-primary"
              aria-label={copy.nav.language}
            >
              <option value="sl">{languageNames[language].sl}</option>
              <option value="en">{languageNames[language].en}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          <Button variant="ghost" size="default" className="font-medium" asChild><a href={LOGIN_ROUTE}>{copy.nav.login}</a></Button>
          <Button variant="hero" size="default" className="rounded-xl px-4 xl:px-5" asChild><a href={TRIAL_SIGNUP_ROUTE}>{copy.nav.trial}</a></Button>
        </div>

        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-card px-4 pb-6 pt-4 lg:hidden">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as SiteLanguage)}
                className="w-full appearance-none rounded-xl border border-border bg-background px-10 py-3 pr-10 text-sm font-medium text-foreground outline-none transition focus:border-primary"
                aria-label={copy.nav.language}
              >
                <option value="sl">{languageNames[language].sl}</option>
                <option value="en">{languageNames[language].en}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            {navLinks.slice(0, 3).map((link) => {
              const isActive = link.activePaths?.includes(pathname);
              return <a key={link.href} href={link.href} className={`rounded-xl px-3 py-2 text-base font-medium transition-colors ${isActive ? "bg-primary/[0.08] text-primary" : "text-muted-foreground hover:bg-secondary"}`} onClick={() => setOpen(false)}>{link.label}</a>;
            })}

            <div className="rounded-2xl border border-border/60 bg-background p-2">
              <a href={getRoutePath("itServices", language)} className={`block rounded-xl px-3 py-2.5 font-semibold ${itServicesActive ? "bg-primary/[0.08] text-primary" : "text-foreground"}`} onClick={() => setOpen(false)}>{copy.nav.itServices}</a>
              <div className="mt-1 grid gap-1 border-l border-border pl-3">
                {IT_SERVICE_ROUTE_KEYS.map((routeKey) => <a key={routeKey} href={getRoutePath(routeKey, language)} className="rounded-lg px-3 py-2 text-sm leading-5 text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={() => setOpen(false)}>{getItServiceContent(routeKey, language).navLabel}</a>)}
                <a href={`${getRoutePath("contact", language)}?type=it`} className="rounded-lg bg-primary/[0.06] px-3 py-2 text-sm font-semibold leading-5 text-primary hover:bg-primary/[0.1]" onClick={() => setOpen(false)}>
                  {language === "sl" ? "Povpraševanje za IT storitve" : "IT services enquiry"}
                </a>
              </div>
            </div>

            {navLinks.slice(3).map((link) => {
              const isActive = link.activePaths?.includes(pathname);
              return <a key={link.href} href={link.href} className={`rounded-xl px-3 py-2 text-base font-medium transition-colors ${isActive ? "bg-primary/[0.08] text-primary" : "text-muted-foreground hover:bg-secondary"}`} onClick={() => setOpen(false)}>{link.label}</a>;
            })}

            <Button variant="hero" size="lg" className="rounded-xl" asChild><a href={TRIAL_SIGNUP_ROUTE}>{copy.nav.trial}</a></Button>
            <Button variant="ghost" size="lg" asChild><a href={LOGIN_ROUTE}>{copy.nav.login}</a></Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
