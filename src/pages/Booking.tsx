import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { APP_BASE_URL } from "@/lib/site";
import { CalendarDays, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage } from "@/lib/site-language";

const WIDGET_SCRIPT_ID = "calendra-booking-widget-script";
const WIDGET_SCRIPT_SRC = `${APP_BASE_URL}/widget/calendra-booking-widget.js`;

declare global {
  interface Window {
    __calendraWidgetScriptPromise?: Promise<void>;
  }
}

const loadWidgetScript = () => {
  if (window.customElements.get("calendra-booking-widget")) {
    return Promise.resolve();
  }

  if (window.__calendraWidgetScriptPromise) {
    return window.__calendraWidgetScriptPromise;
  }

  window.__calendraWidgetScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(WIDGET_SCRIPT_ID) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Calendra widget script.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = WIDGET_SCRIPT_ID;
    script.src = WIDGET_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Calendra widget script."));
    document.body.appendChild(script);
  });

  return window.__calendraWidgetScriptPromise;
};

const Booking = () => {
  const widgetHostRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const widgetUrl = useMemo(() => APP_BASE_URL, []);
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).bookingPage;

  useEffect(() => {
    let cancelled = false;
    let observer: MutationObserver | null = null;

    const hideWidgetBrandedText = () => {
      const host = widgetHostRef.current;
      if (!host) {
        return;
      }

      host.querySelectorAll<HTMLElement>("*").forEach((el) => {
        const text = el.textContent?.trim() ?? "";
        if (
          text.includes("Calendra booking") ||
          text.includes("Book your session") ||
          text.includes("Rezervirajte termin") ||
          text.includes("Vaša rezervacija je zasebna in varna") ||
          text.includes("A faster multi-step booking flow") ||
          text.includes("Tenant 2TEN")
        ) {
          el.style.display = "none";
        }
      });
    };

    const mountWidget = async () => {
      try {
        setStatus("loading");
        await loadWidgetScript();

        if (cancelled || !widgetHostRef.current) {
          return;
        }

        widgetHostRef.current.innerHTML = "";
        const widget = document.createElement("calendra-booking-widget");
        widget.setAttribute("tenant", "2TEN");
        widget.setAttribute("base-url", widgetUrl);
        widget.setAttribute("locale", language);
        widgetHostRef.current.appendChild(widget);

        observer = new MutationObserver(hideWidgetBrandedText);
        observer.observe(widgetHostRef.current, {
          childList: true,
          subtree: true,
        });

        setTimeout(hideWidgetBrandedText, 200);
        setStatus("ready");
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setStatus("error");
        }
      }
    };

    mountWidget();

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (widgetHostRef.current) {
        widgetHostRef.current.innerHTML = "";
      }
    };
  }, [language, widgetUrl]);

  const cardIcons = [CalendarDays, CheckCircle2, Clock3, ShieldCheck] as const;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pb-16 pt-12 md:pb-20 md:pt-16">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 xl:gap-12">
            <section className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
              <div className="grid gap-4 sm:grid-cols-2">
                {copy.cards.map((item, index) => {
                  const Icon = cardIcons[index];
                  return (
                    <div key={item.title} className="rounded-2xl border border-border/60 bg-background/70 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.08] text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section id="widget" className="">
              <div ref={widgetHostRef} className="min-h-[820px]" />
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;
