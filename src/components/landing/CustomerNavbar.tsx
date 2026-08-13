import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WORDMARK } from "@/lib/brand-assets";
import { customerInitials, useCustomerSession } from "@/lib/customer-session";
import { getRoutePath } from "@/lib/localized-routes";
import { CUSTOMER_LOGIN_ROUTE } from "@/lib/routes";
import { languageNames } from "@/lib/site-copy";
import { useSiteLanguage, type SiteLanguage } from "@/lib/site-language";
import {
  Bell,
  Briefcase,
  CalendarDays,
  ChevronDown,
  Globe,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

const CustomerNavbar = () => {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const { pathname, search } = useLocation();
  const { language, setLanguage } = useSiteLanguage();
  const { user, isAuthenticated, logout } = useCustomerSession();
  const customerPath = getRoutePath("customers", language);
  const connectPath = getRoutePath("connect", language);
  const nextPath = `${pathname}${search}`;
  const loginPath = `${CUSTOMER_LOGIN_ROUTE}?next=${encodeURIComponent(nextPath)}`;

  const links = [
    { label: "Calendra Connect", href: connectPath },
  ];

  const accountLinks = [
    { label: language === "sl" ? "Moj profil" : "My profile", href: "/racun/profil", icon: UserRound },
    { label: language === "sl" ? "Moji termini" : "My appointments", href: "/racun/termini", icon: CalendarDays },
    { label: language === "sl" ? "Denarnica" : "Wallet", href: "/racun/denarnica", icon: WalletCards },
    { label: language === "sl" ? "Sporočila" : "Messages", href: "/racun/sporocila", icon: MessageCircle },
    { label: language === "sl" ? "Obvestila" : "Notifications", href: "/racun/obvestila", icon: Bell },
    { label: language === "sl" ? "Nastavitve" : "Settings", href: "/racun/profil#nastavitve", icon: Settings },
  ];

  useEffect(() => {
    if (!accountOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAccountOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [accountOpen]);

  const performLogout = () => {
    logout();
    setAccountOpen(false);
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/35 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <a href={customerPath} className="flex items-center">
            <img src={WORDMARK.src} alt="Calendra" width={WORDMARK.width} height={WORDMARK.height} className="h-8 w-auto md:h-9" />
          </a>

          <div className="relative hidden min-w-[145px] xl:block">
            <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as SiteLanguage)}
              className="w-full appearance-none rounded-xl border border-border/80 bg-transparent px-9 py-2.5 pr-9 text-sm font-medium text-foreground outline-none transition focus:border-primary"
              aria-label={language === "sl" ? "Jezik" : "Language"}
            >
              <option value="sl">{languageNames[language].sl}</option>
              <option value="en">{languageNames[language].en}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="hidden items-center gap-7 xl:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <Button variant="outline" className="rounded-xl bg-transparent" asChild>
            <a href={getRoutePath("home", language)}>
              <Briefcase className="h-4 w-4 text-primary" />
              {language === "sl" ? "Za podjetje" : "For business"}
            </a>
          </Button>

          <Button variant="hero" className="rounded-xl" asChild>
            <a href={customerPath}><CalendarDays className="h-4 w-4" />{language === "sl" ? "Poišči termin" : "Find an appointment"}</a>
          </Button>

          {isAuthenticated ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-border/80 bg-transparent px-2.5 pr-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:bg-secondary/45"
                aria-haspopup="menu"
                aria-expanded={accountOpen}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/[0.10] text-xs font-extrabold text-primary">
                  {customerInitials(user)}
                </span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${accountOpen ? "rotate-180" : ""}`} />
              </button>

              {accountOpen ? (
                <div className="absolute right-0 top-[calc(100%+10px)] z-[70] w-72 overflow-hidden rounded-2xl border border-border/70 bg-background p-2 shadow-[0_24px_70px_rgba(15,23,42,0.16)]" role="menu">
                  <div className="px-3 pb-3 pt-2">
                    <strong className="block truncate text-sm text-foreground">{user?.firstName} {user?.lastName}</strong>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                  <div className="h-px bg-border/70" />
                  <div className="py-1.5">
                    {accountLinks.map(({ label, href, icon: Icon }) => (
                      <a key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary/60" role="menuitem">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        {label}
                      </a>
                    ))}
                  </div>
                  <div className="h-px bg-border/70" />
                  <button type="button" onClick={performLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground transition hover:bg-secondary/60" role="menuitem">
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                    {language === "sl" ? "Odjava" : "Log out"}
                  </button>
                  <div className="mt-1 h-px bg-border/70" />
                  <a href={getRoutePath("home", language)} className="mt-1 flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary/60" role="menuitem">
                    <span className="inline-flex items-center gap-3"><Briefcase className="h-4 w-4 text-muted-foreground" />{language === "sl" ? "Za podjetje" : "For business"}</span>
                    <span aria-hidden>→</span>
                  </a>
                </div>
              ) : null}
            </div>
          ) : (
            <Button variant="ghost" asChild><a href={loginPath}>{language === "sl" ? "Prijava" : "Login"}</a></Button>
          )}

        </div>

        <button className="xl:hidden" onClick={() => setOpen((value) => !value)} aria-label={language === "sl" ? "Meni" : "Menu"}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border/35 bg-background px-4 pb-6 pt-4 xl:hidden">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as SiteLanguage)}
                className="w-full appearance-none rounded-xl border border-border/80 bg-transparent px-10 py-3 pr-10 text-sm font-medium text-foreground outline-none transition focus:border-primary"
                aria-label={language === "sl" ? "Jezik" : "Language"}
              >
                <option value="sl">{languageNames[language].sl}</option>
                <option value="en">{languageNames[language].en}</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            <Button variant="outline" size="lg" className="rounded-xl bg-transparent" asChild>
              <a href={getRoutePath("home", language)} onClick={() => setOpen(false)}>
                <Briefcase className="h-4 w-4 text-primary" />
                {language === "sl" ? "Za podjetje" : "For business"}
              </a>
            </Button>

            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2.5 font-medium text-foreground hover:bg-secondary/70">
                {link.label}
              </a>
            ))}

            <Button variant="hero" size="lg" className="rounded-xl" asChild>
              <a href={customerPath}><CalendarDays className="h-4 w-4" />{language === "sl" ? "Poišči termin" : "Find an appointment"}</a>
            </Button>

            {isAuthenticated ? (
              <div className="rounded-2xl border border-border/70 p-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/[0.10] text-sm font-extrabold text-primary">{customerInitials(user)}</span>
                  <span className="min-w-0"><strong className="block truncate text-sm">{user?.firstName} {user?.lastName}</strong><small className="block truncate text-muted-foreground">{user?.email}</small></span>
                </div>
                {accountLinks.map(({ label, href, icon: Icon }) => (
                  <a key={href} href={href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-secondary/60"><Icon className="h-4 w-4 text-muted-foreground" />{label}</a>
                ))}
                <button type="button" onClick={performLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-secondary/60"><LogOut className="h-4 w-4 text-muted-foreground" />{language === "sl" ? "Odjava" : "Log out"}</button>
              </div>
            ) : (
              <Button variant="ghost" size="lg" asChild><a href={loginPath}>{language === "sl" ? "Prijava" : "Login"}</a></Button>
            )}
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default CustomerNavbar;
