import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { APP_BASE_URL } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";

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

  useEffect(() => {
    let cancelled = false;

    const mountWidget = async () => {
      try {
        setStatus("loading");
        await loadWidgetScript();

        if (cancelled || !widgetHostRef.current) {
          return;
        }

        widgetHostRef.current.innerHTML = "";
        const widget = document.createElement("calendra-booking-widget");
        widget.setAttribute("tenant", "2");
        widget.setAttribute("base-url", widgetUrl);
        widgetHostRef.current.appendChild(widget);
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
      if (widgetHostRef.current) {
        widgetHostRef.current.innerHTML = "";
      }
    };
  }, [widgetUrl]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pb-16 pt-12 md:pb-20 md:pt-16">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:gap-12">
            <section className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10 lg:sticky lg:top-28">
              <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Nazaj na predstavitveno stran
              </a>

              <div className="mt-6 inline-flex rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-sm font-semibold text-primary">
                Booking / Naročanje
              </div>

              <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ color: "hsl(var(--text-heading))" }}>
                Rezervirajte termin neposredno na spletni strani.
              </h1>

              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Gost izbere storitev, datum in uro, nato pa vnese ime, priimek, e-pošto in telefonsko številko. Če je za tenant aktivirana razpoložljivost, so prikazani samo prosti termini.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: CalendarDays,
                    title: "Izbira storitve",
                    description: "Obiskovalec najprej izbere storitev, ki jo želi rezervirati.",
                  },
                  {
                    icon: Clock3,
                    title: "Prosti termini",
                    description: "Ko je availability vklopljen, se prikažejo le razpoložljivi sloti.",
                  },
                  {
                    icon: CheckCircle2,
                    title: "Hiter zaključek",
                    description: "Na koncu gost vnese kontaktne podatke in odda rezervacijo.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Povezano z app.calendra.si",
                    description: "Rezervacija se odda neposredno v vaš Calendra sistem.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.08] text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
                Ta stran uporablja tenant <span className="font-semibold text-foreground">2</span> in nalaga widget iz <span className="font-semibold text-foreground">{widgetUrl}</span>.
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button variant="hero" size="lg" className="rounded-xl px-6" asChild>
                  <a href="#widget">Odpri naročanje</a>
                </Button>
                <Button variant="hero-outline" size="lg" className="rounded-xl px-6" asChild>
                  <a href="/">Več o Calendri</a>
                </Button>
              </div>
            </section>

            <section id="widget" className="rounded-3xl border border-border/60 bg-card p-4 shadow-soft md:p-6 xl:p-8">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Naročanje termina</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Vgrajeni Calendra booking widget.</p>
                </div>
                <div className="inline-flex rounded-full bg-primary/[0.08] px-3 py-1 text-sm font-medium text-primary">
                  Tenant 2
                </div>
              </div>

              {status === "loading" && (
                <div className="mb-4 rounded-2xl border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                  Nalagam booking widget ...
                </div>
              )}

              {status === "error" && (
                <div className="mb-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  Widgeta ni bilo mogoče naložiti. Preverite, ali je script dosegljiv na {WIDGET_SCRIPT_SRC}.
                </div>
              )}

              <div className="min-h-[820px] rounded-[28px] border border-border/60 bg-background/50 p-3 md:p-5">
                <div ref={widgetHostRef} className="min-h-[780px]" />
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;
