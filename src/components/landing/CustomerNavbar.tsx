import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WORDMARK } from "@/lib/brand-assets";
import { customerInitials, useCustomerSession } from "@/lib/customer-session";
import { getRoutePath } from "@/lib/localized-routes";
import { CUSTOMER_MARKETPLACE_PUBLIC } from "@/lib/customer-marketplace";
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
  MapPin,
  Menu,
  MessageCircle,
  Search,
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
  // Defensive fallback: if this component is ever mounted while the public
  // marketplace is disabled, do not emit links to routes that intentionally
  // return 404. Navbar normally avoids rendering CustomerNavbar in that mode.
  const customerPath = CUSTOMER_MARKETPLACE_PUBLIC
    ? getRoutePath("customers", language)
    : getRoutePath("booking", language);
  const connectPath = getRoutePath("connect", language);
  const nextPath = `${pathname}${search}`;
  const loginPath = `${CUSTOMER_LOGIN_ROUTE}?next=${encodeURIComponent(nextPath)}`;

  const initialSearch = useMemo(() => new URLSearchParams(search), [search]);
  const [query, setQuery] = useState(initialSearch.get("q") || "");
  const [locationQuery, setLocationQuery] = useState(initialSearch.get("location") || "");
  const [date, setDate] = useState(initialSearch.get("date") || "");

  useEffect(() => {
    const params = new URLSearchParams(search);
    setQuery(params.get("q") || "");
    setLocationQuery(params.get("location") || "");
    setDate(params.get("date") || "");
  }, [search]);

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
    service: "Katero storitev iščete?",
    servicePlaceholder: "Frizerstvo, masaža, joga …",
    location: "Lokacija",
    locationPlaceholder: "Vnesite kraj ali območje",
    date: "Kdaj?",
    search: "Poišči",
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
    service: "What service are you looking for?",
    servicePlaceholder: "Hair, massage, yoga …",
    location: "Location",
    locationPlaceholder: "Enter a city or area",
    date: "When?",
    search: "Search",
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

  const runSearch = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    const normalizedQuery = query.trim().replace(/\s+/g, " ");
    const normalizedLocation = locationQuery.trim().replace(/\s+/g, " ");
    if (normalizedQuery) params.set("q", normalizedQuery);
    if (normalizedLocation) params.set("location", normalizedLocation);
    if (date) params.set("date", date);
    const suffix = params.toString();
    window.location.assign(`${customerPath}${suffix ? `?${suffix}` : ""}`);
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

  const accountButton = isAuthenticated ? (
    <div className="relative" ref={accountMenuRef}>
      <button
        type="button"
        onClick={() => setAccountOpen((value) => !value)}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-border/70 bg-background px-1.5 pr-3 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/30 hover:shadow-md"
        aria-haspopup="menu"
        aria-expanded={accountOpen}
      >
        <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-primary text-xs font-extrabold text-primary-foreground">
          {user?.profilePictureUrl ? <img src={user.profilePictureUrl} alt="" className="h-full w-full object-cover" /> : customerInitials(user)}
        </span>
        <span className="hidden max-w-[115px] truncate 2xl:block">{user?.firstName || labels.profile}</span>
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
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1380px] items-center gap-4 px-4 lg:px-6">
        <a href={customerPath} className="flex shrink-0 items-center">
          <img src={WORDMARK.src} alt="Calendra" width={WORDMARK.width} height={WORDMARK.height} className="h-8 w-auto md:h-9" />
        </a>

        <form onSubmit={runSearch} className="mx-auto hidden min-w-0 max-w-[760px] flex-1 xl:flex">
          <div className="flex h-11 w-full items-stretch overflow-hidden rounded-2xl border border-border/70 bg-background shadow-[0_3px_14px_rgba(15,23,42,0.06)] transition focus-within:border-primary/35 focus-within:shadow-[0_5px_20px_rgba(15,23,42,0.09)]">
            <label className="relative flex min-w-0 flex-[1.15] items-center border-r border-border/60 pl-11 pr-3">
              <Search className="pointer-events-none absolute left-4 h-4 w-4 text-muted-foreground" />
              <span className="sr-only">{labels.service}</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/80" placeholder={labels.servicePlaceholder} />
            </label>
            <label className="relative flex min-w-0 flex-1 items-center border-r border-border/60 pl-10 pr-3">
              <MapPin className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground" />
              <span className="sr-only">{labels.location}</span>
              <input value={locationQuery} onChange={(event) => setLocationQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/80" placeholder={labels.locationPlaceholder} />
            </label>
            <label className="relative flex min-w-[155px] items-center pl-10 pr-3">
              <CalendarDays className="pointer-events-none absolute left-3.5 h-4 w-4 text-muted-foreground" />
              <span className="sr-only">{labels.date}</span>
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="w-full bg-transparent text-sm font-medium text-foreground outline-none" />
            </label>
          </div>
          <Button type="submit" variant="hero" className="ml-2 h-11 rounded-xl px-5 shadow-[0_6px_16px_rgba(15,107,255,0.20)]">
            {labels.search}<Search className="h-4 w-4" />
          </Button>
        </form>

        <div className="ml-auto hidden shrink-0 items-center gap-2 xl:flex">
          <a href="/racun/obvestila" className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary/70 hover:text-foreground" aria-label={labels.notifications}>
            <Bell className="h-5 w-5" />
          </a>
          {sessionLoading ? (
            <div className="h-10 w-[92px] animate-pulse rounded-full border border-border/70 bg-secondary/45" aria-label={language === "sl" ? "Preverjam prijavo" : "Checking sign-in"} />
          ) : accountButton}
        </div>

        <button type="button" className="ml-auto xl:hidden" onClick={() => setOpen((value) => !value)} aria-label={labels.menu}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border/35 bg-background px-4 pb-6 pt-4 xl:hidden">
          <form onSubmit={runSearch} className="mb-4 grid gap-2 rounded-2xl border border-border/60 bg-secondary/20 p-3">
            <label className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-background pl-10 pr-3 text-sm outline-none" placeholder={labels.servicePlaceholder} /></label>
            <label className="relative"><MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={locationQuery} onChange={(event) => setLocationQuery(event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-background pl-10 pr-3 text-sm outline-none" placeholder={labels.locationPlaceholder} /></label>
            <label className="relative"><CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="h-11 w-full rounded-xl border border-border/70 bg-background pl-10 pr-3 text-sm outline-none" /></label>
            <Button type="submit" variant="hero" className="h-11 rounded-xl">{labels.search}<Search className="h-4 w-4" /></Button>
          </form>

          <div className="flex flex-col gap-3">
            <LanguageSelect mobile />
            <Button variant="ghost" size="lg" className="justify-start rounded-xl" asChild>
              <a href={connectPath} onClick={() => setOpen(false)}><Download className="h-4 w-4 text-primary" />{labels.download}</a>
            </Button>
            <Button variant="outline" size="lg" className="justify-start rounded-xl bg-background" asChild>
              <a href={getRoutePath("home", language)} onClick={() => setOpen(false)}><BriefcaseBusiness className="h-4 w-4 text-primary" />{labels.business}</a>
            </Button>

            {sessionLoading ? (
              <div className="h-12 animate-pulse rounded-xl border border-border/70 bg-secondary/45" aria-label={language === "sl" ? "Preverjam prijavo" : "Checking sign-in"} />
            ) : isAuthenticated ? (
              <div className="rounded-2xl border border-border/70 p-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-primary text-sm font-extrabold text-primary-foreground">{user?.profilePictureUrl ? <img src={user.profilePictureUrl} alt="" className="h-full w-full object-cover" /> : customerInitials(user)}</span>
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
