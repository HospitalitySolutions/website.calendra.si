import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LOGIN_ROUTE, TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { getRoutePath } from "@/lib/localized-routes";
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

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-card/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4 lg:px-8">
        <a href={homePath} className="flex items-center">
          <img src={calendraLogo} alt="Calendra" width="628" height="205" className="h-8 w-auto md:h-9" />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = link.activePaths?.includes(pathname);

            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors hover:text-foreground ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {link.label}
                {isActive && <span className="absolute -bottom-7 left-0 h-0.5 w-full rounded-full bg-primary" aria-hidden="true" />}
              </a>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="relative min-w-[170px]">
            <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as SiteLanguage)}
              className="w-full appearance-none rounded-xl border border-border bg-background px-10 py-2.5 pr-10 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-primary"
              aria-label={copy.nav.language}
            >
              <option value="sl">{languageNames[language].sl}</option>
              <option value="en">{languageNames[language].en}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          <Button variant="ghost" size="default" className="font-medium" asChild>
            <a href={LOGIN_ROUTE}>{copy.nav.login}</a>
          </Button>
          <Button variant="hero" size="default" className="rounded-xl px-5" asChild>
            <a href={TRIAL_SIGNUP_ROUTE}>{copy.nav.trial}</a>
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-card px-4 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-4">
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

            {navLinks.map((link) => {
              const isActive = link.activePaths?.includes(pathname);

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

            <Button variant="hero" size="lg" className="rounded-xl" asChild>
              <a href={TRIAL_SIGNUP_ROUTE}>{copy.nav.trial}</a>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <a href={LOGIN_ROUTE}>{copy.nav.login}</a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
