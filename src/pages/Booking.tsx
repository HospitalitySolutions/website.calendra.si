import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { APP_BASE_URL } from "@/lib/site";
import { CalendarDays, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage } from "@/lib/site-language";
import { createCalendraBookingWidget, loadCalendraBookingWidgetScript } from "@/lib/calendra-booking-widget";

const Booking = () => {
  const widgetHostRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const widgetUrl = useMemo(() => APP_BASE_URL, []);
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).bookingPage;

  useEffect(() => {
    let cancelled = false;
    let observer: MutationObserver | null = null;
    const host = widgetHostRef.current;

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
          text.includes("Tenant 3DAV")
        ) {
          el.style.display = "none";
        }
      });
    };

    const mountWidget = async () => {
      try {
        setStatus("loading");
        await loadCalendraBookingWidgetScript(APP_BASE_URL);

        if (cancelled || !widgetHostRef.current) {
          return;
        }

        widgetHostRef.current.innerHTML = "";
        const widget = createCalendraBookingWidget({
          tenant: "3DAV",
          baseUrl: widgetUrl,
          locale: language,
        });
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
      if (host) {
        host.innerHTML = "";
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
