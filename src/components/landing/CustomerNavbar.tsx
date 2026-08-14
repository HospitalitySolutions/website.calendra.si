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
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  Download,
  Globe,
  House,
  LogOut,
  Menu,
  MessageCircle,
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
  const { user, loading: sessionLoading, isAuthenticated, logout } = useCustomerSession();
  const customerPath = getRoutePath("customers", language);
  const connectPath = getRoutePath("connect", language);
  const nextPath = `${pathname}${search}`;
  const loginPath = `${CUSTOMER_LOGIN_ROUTE}?next=${encodeURIComponent(nextPath)}`;

  const labels = language === "sl" ? {
    download: "Prenesite aplikacijo",
    business: "Za ponudnike",
    auth: "Prijava / Ustvari račun",
    menu: "Meni",
    overview: "Pregled",
    profile: "Moj profil",
    appointments: "Moji termini",
    wallet: "Denarnica",
    messages: "Sporočila",
    notifications: "Obvestila",
    logout: "Odjava",
  } : {
    download: "Download the app",
    business: "For providers",
    auth: "Login / Create account",
    menu: "Menu",
    overview: "Overview",
    profile: "My profile",
    appointments: "My appointments",
    wallet: "Wallet",
    messages: "Messages",
    notifications: "Notifications",
    logout: "Log out",
  };

  const accountLinks = [
    { label: labels.overview, href: "/racun", icon: House },
    { label: labels.appointments, href: "/racun/termini", icon: CalendarDays },
    { label: labels.wallet, href: "/racun/denarnica", icon: WalletCards },
    { label: labels.messages, href: "/racun/sporocila", icon: MessageCircle },
    { label: labels.notifications, href: "/racun/obvestila", icon: Bell },
    { label: labels.profile, href: "/racun/profil", icon: UserRound },
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

  const LanguageSelect = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`relative ${mobile ? "w-full" : "min-w-[145px]"}`}>
      <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as SiteLanguage)}
        className={`w-full appearance-none rounded-xl border border-border/70 bg-background px-9 pr-9 text-sm font-medium text-foreground outline-none transition focus:border-primary ${mobile ? "py-3" : "py-2.5"}`}
        aria-label={language === "sl" ? "Jezik" : "Language"}
      >
        <option value="sl">{languageNames[language].sl}</option>
        <option value="en">{languageNames[language].en}</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-border/35 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-[72px] items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <a href={customerPath} className="flex items-center">
            <img src={WORDMARK.src} alt="Calendra" width={WORDMARK.width} height={WORDMARK.height} className="h-8 w-auto md:h-9" />
          </a>
          <div className="hidden xl:block">
            <LanguageSelect />
          </div>
        </div>

        <div className="hidden items-center gap-2.5 xl:flex">
          <Button variant="ghost" className="rounded-xl px-3 font-medium" asChild>
            <a href={connectPath}><Download className="h-4 w-4 text-primary" />{labels.download}</a>
          </Button>

          <Button variant="outline" className="rounded-xl bg-background" asChild>
            <a href={getRoutePath("home", language)}>
              <BriefcaseBusiness className="h-4 w-4 text-primary" />
              {labels.business}
            </a>
          </Button>

          {sessionLoading ? (
            <div className="h-10 w-[92px] animate-pulse rounded-xl border border-border/70 bg-secondary/45" aria-label={language === "sl" ? "Preverjam prijavo" : "Checking sign-in"} />
          ) : isAuthenticated ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-border/75 bg-background px-2.5 pr-3 text-sm font-semibold text-foreground transition hover:border-primary/30"
                aria-haspopup="menu"
                aria-expanded={accountOpen}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/[0.10] text-xs font-extrabold text-primary">{customerInitials(user)}</span>
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
                        <Icon className="h-4 w-4 text-muted-foreground" />{label}
                      </a>
                    ))}
                  </div>
                  <div className="h-px bg-border/70" />
                  <button type="button" onClick={performLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground transition hover:bg-secondary/60" role="menuitem">
                    <LogOut className="h-4 w-4 text-muted-foreground" />{labels.logout}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Button variant="hero" className="rounded-xl" asChild>
              <a href={loginPath}>{labels.auth}</a>
            </Button>
          )}
        </div>

        <button type="button" className="xl:hidden" onClick={() => setOpen((value) => !value)} aria-label={labels.menu}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border/35 bg-background px-4 pb-6 pt-4 xl:hidden">
          <div className="flex flex-col gap-3">
            <LanguageSelect mobile />

            <Button variant="ghost" size="lg" className="justify-start rounded-xl" asChild>
              <a href={connectPath} onClick={() => setOpen(false)}><Download className="h-4 w-4 text-primary" />{labels.download}</a>
            </Button>

            <Button variant="outline" size="lg" className="justify-start rounded-xl bg-background" asChild>
              <a href={getRoutePath("home", language)} onClick={() => setOpen(false)}>
                <BriefcaseBusiness className="h-4 w-4 text-primary" />{labels.business}
              </a>
            </Button>

            {sessionLoading ? (
              <div className="h-12 animate-pulse rounded-xl border border-border/70 bg-secondary/45" aria-label={language === "sl" ? "Preverjam prijavo" : "Checking sign-in"} />
            ) : isAuthenticated ? (
              <div className="rounded-2xl border border-border/70 p-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/[0.10] text-sm font-extrabold text-primary">{customerInitials(user)}</span>
                  <span className="min-w-0"><strong className="block truncate text-sm">{user?.firstName} {user?.lastName}</strong><small className="block truncate text-muted-foreground">{user?.email}</small></span>
                </div>
                {accountLinks.map(({ label, href, icon: Icon }) => (
                  <a key={href} href={href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-secondary/60"><Icon className="h-4 w-4 text-muted-foreground" />{label}</a>
                ))}
                <button type="button" onClick={performLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-secondary/60"><LogOut className="h-4 w-4 text-muted-foreground" />{labels.logout}</button>
              </div>
            ) : (
              <Button variant="hero" size="lg" className="rounded-xl" asChild><a href={loginPath}>{labels.auth}</a></Button>
            )}
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default CustomerNavbar;
