import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getGoogleAnalyticsConsent,
  OPEN_COOKIE_SETTINGS_EVENT,
  setGoogleAnalyticsConsent,
} from "@/lib/google-analytics";
import { getRoutePath } from "@/lib/localized-routes";
import { useSiteLanguage } from "@/lib/site-language";

const copy = {
  sl: {
    title: "Nastavitve analitike",
    text: "Za osnovno merjenje obiska uporabljamo analitiko brez piškotkov. Google tag se naloži z analitičnim shranjevanjem privzeto onemogočenim; brez soglasja ne nastavlja analitičnih piškotkov. Z dovoljenjem omogočite podrobnejše merjenje z Google Analytics.",
    necessary: "Samo nujni",
    analytics: "Dovoli analitiko",
    more: "Več o piškotkih",
  },
  en: {
    title: "Analytics settings",
    text: "We use cookieless analytics for basic traffic measurement. The Google tag loads with analytics storage denied by default and does not set analytics cookies without consent. Allowing analytics enables more detailed measurement with Google Analytics.",
    necessary: "Necessary only",
    analytics: "Allow analytics",
    more: "Cookie details",
  },
} as const;

const CookieConsentBanner = () => {
  const { language } = useSiteLanguage();
  const [open, setOpen] = useState(false);
  const c = copy[language];

  useEffect(() => {
    setOpen(getGoogleAnalyticsConsent() === null);

    const openSettings = () => setOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
  }, []);

  if (!open) return null;

  const choose = (consent: "granted" | "denied") => {
    setGoogleAnalyticsConsent(consent);
    setOpen(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-5" role="dialog" aria-live="polite" aria-label={c.title}>
      {/*
        On mobile this bar sits over the hero, so every line of height here is
        a line the primary CTA loses. The full explanation stays one tap away
        via the "more" link instead of wrapping to 3-4 lines inline, and the
        two choices sit side by side instead of stacked, which is what let a
        375px-wide banner run to ~45% of viewport height and hide both CTAs.
      */}
      <div className="mx-auto flex max-w-5xl flex-col gap-3 rounded-2xl border border-border/70 bg-background/95 p-3 shadow-2xl backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-foreground">{c.title}</p>
          <p className="mt-0.5 line-clamp-1 text-sm leading-6 text-muted-foreground sm:mt-1 sm:line-clamp-none">{c.text}</p>
          <a
            href={getRoutePath("cookies", language)}
            className="mt-1 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline sm:mt-2"
          >
            {c.more}
          </a>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button type="button" variant="outline" className="flex-1 rounded-xl sm:flex-initial" onClick={() => choose("denied")}>
            {c.necessary}
          </Button>
          <Button type="button" className="flex-1 rounded-xl sm:flex-initial" onClick={() => choose("granted")}>
            {c.analytics}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
