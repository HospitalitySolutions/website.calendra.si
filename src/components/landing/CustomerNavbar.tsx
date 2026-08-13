import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WORDMARK } from "@/lib/brand-assets";
import { getRoutePath } from "@/lib/localized-routes";
import { languageNames } from "@/lib/site-copy";
import { useSiteLanguage, type SiteLanguage } from "@/lib/site-language";
import { ChevronDown, Globe, Menu, X } from "lucide-react";
import AudienceSwitch from "./AudienceSwitch";

const CustomerNavbar = () => {
  const [open, setOpen] = useState(false);
  const { language, setLanguage } = useSiteLanguage();
  const customerPath = getRoutePath("customers", language);
  const providersPath = getRoutePath("businesses", language);
  const connectPath = getRoutePath("connect", language);
  const loginPath = language === "sl" ? "/prijava" : "/en/login";

  const links = [
    { label: language === "sl" ? "Poišči ponudnika" : "Find a provider", href: providersPath },
    { label: language === "sl" ? "Storitve" : "Services", href: `${providersPath}#kategorije` },
    { label: "Calendra Connect", href: connectPath },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <a href={customerPath} className="flex items-center">
            <img src={WORDMARK.src} alt="Calendra" width={WORDMARK.width} height={WORDMARK.height} className="h-8 w-auto md:h-9" />
          </a>
          <AudienceSwitch language={language} audience="customers" className="hidden xl:inline-flex" />
        </div>

        <div className="hidden items-center gap-7 xl:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <div className="relative min-w-[145px]">
            <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as SiteLanguage)}
              className="w-full appearance-none rounded-xl border border-border bg-background px-9 py-2.5 pr-9 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-primary"
              aria-label={language === "sl" ? "Jezik" : "Language"}
            >
              <option value="sl">{languageNames[language].sl}</option>
              <option value="en">{languageNames[language].en}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
          <Button variant="ghost" asChild><a href={loginPath}>{language === "sl" ? "Prijava" : "Login"}</a></Button>
          <Button variant="hero" className="rounded-xl" asChild><a href={providersPath}>{language === "sl" ? "Poišči termin" : "Find an appointment"}</a></Button>
        </div>

        <button className="xl:hidden" onClick={() => setOpen((value) => !value)} aria-label={language === "sl" ? "Meni" : "Menu"}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-card px-4 pb-6 pt-4 xl:hidden">
          <div className="flex flex-col gap-3">
            <AudienceSwitch language={language} audience="customers" className="w-full justify-center" />
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as SiteLanguage)}
                className="w-full appearance-none rounded-xl border border-border bg-background px-10 py-3 pr-10 text-sm font-medium text-foreground outline-none transition focus:border-primary"
                aria-label={language === "sl" ? "Jezik" : "Language"}
              >
                <option value="sl">{languageNames[language].sl}</option>
                <option value="en">{languageNames[language].en}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 font-medium text-foreground hover:bg-secondary">
                {link.label}
              </a>
            ))}
            <Button variant="hero" size="lg" className="rounded-xl" asChild><a href={providersPath}>{language === "sl" ? "Poišči termin" : "Find an appointment"}</a></Button>
            <Button variant="ghost" size="lg" asChild><a href={loginPath}>{language === "sl" ? "Prijava" : "Login"}</a></Button>
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default CustomerNavbar;
