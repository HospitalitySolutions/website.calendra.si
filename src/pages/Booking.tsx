import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { APP_BASE_URL } from "@/lib/site";
import { ArrowLeft } from "lucide-react";
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
  }, [language, widgetUrl]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pb-16 pt-12 md:pb-20 md:pt-16">
        <div className="container mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 xl:gap-12">
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
