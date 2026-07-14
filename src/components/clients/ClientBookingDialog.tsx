import { useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AlertCircle, CalendarDays, LoaderCircle, MapPin, X } from "lucide-react";
import { APP_BASE_URL } from "@/lib/site";
import {
  createCalendraBookingWidget,
  loadCalendraBookingWidgetScript,
} from "@/lib/calendra-booking-widget";
import type { DirectoryClient } from "@/lib/company-directory";
import type { SiteLanguage } from "@/lib/site-language";

const initialsFor = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "C";

type ClientBookingDialogProps = {
  client: DirectoryClient | null;
  language: SiteLanguage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type BookingDialogStatus = "idle" | "loading" | "ready" | "error" | "unavailable";

const copy = {
  sl: {
    title: "Nova rezervacija",
    description: "Izberite storitev, zaposlenega, datum in način plačila.",
    loading: "Nalagam razpoložljive storitve in termine …",
    errorTitle: "Naročanja trenutno ni mogoče odpreti",
    errorBody: "Poskusite znova čez nekaj trenutkov.",
    unavailableTitle: "Spletno naročanje trenutno ni na voljo",
    unavailableBody: "Podjetje za zdaj nima omogočenega spletnega naročanja.",
    close: "Zapri naročanje",
  },
  en: {
    title: "New booking",
    description: "Choose a service, employee, date and payment method.",
    loading: "Loading available services and times …",
    errorTitle: "Booking cannot be opened right now",
    errorBody: "Please try again in a few moments.",
    unavailableTitle: "Online booking is currently unavailable",
    unavailableBody: "This business has not enabled online booking yet.",
    close: "Close booking",
  },
} as const;

const ClientBookingDialog = ({ client, language, open, onOpenChange }: ClientBookingDialogProps) => {
  const widgetHostRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<BookingDialogStatus>("idle");

  useEffect(() => {
    if (!open || !client) {
      setStatus("idle");
      return;
    }

    let cancelled = false;
    let widget: HTMLElement | null = null;
    const host = widgetHostRef.current;

    const handleWidgetReady = () => {
      if (!cancelled) setStatus("ready");
    };

    const handleWidgetError = (event: Event) => {
      if (cancelled) return;
      const detail = (event as CustomEvent<{ code?: string }>).detail;
      setStatus(detail?.code === "WIDGET_DISABLED" ? "unavailable" : "error");
    };

    const handleStepChange = () => {
      scrollAreaRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    const mountWidget = async () => {
      if (!client.tenantSlug) {
        setStatus("unavailable");
        return;
      }

      setStatus("loading");

      try {
        await loadCalendraBookingWidgetScript(APP_BASE_URL);
        if (cancelled || !widgetHostRef.current) return;

        widget = createCalendraBookingWidget({
          tenant: client.tenantSlug,
          baseUrl: APP_BASE_URL,
          locale: language,
          presentation: "directory",
        });
        widget.addEventListener("calendra-widget-ready", handleWidgetReady);
        widget.addEventListener("calendra-widget-error", handleWidgetError);
        widget.addEventListener("calendra-widget-step-change", handleStepChange);

        widgetHostRef.current.replaceChildren(widget);

        // Older widget builds do not emit lifecycle events. Keep the flow usable
        // while the app and marketing site are deployed independently.
        window.setTimeout(() => {
          if (!cancelled) setStatus((current) => (current === "loading" ? "ready" : current));
        }, 600);
      } catch (error) {
        console.error(error);
        if (!cancelled) setStatus("error");
      }
    };

    void mountWidget();

    return () => {
      cancelled = true;
      widget?.removeEventListener("calendra-widget-ready", handleWidgetReady);
      widget?.removeEventListener("calendra-widget-error", handleWidgetError);
      widget?.removeEventListener("calendra-widget-step-change", handleStepChange);
      host?.replaceChildren();
    };
  }, [client, language, open]);

  if (!client) return null;

  const text = copy[language];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-md data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby="client-booking-description"
          className="fixed left-1/2 top-1/2 z-50 flex max-h-[96vh] w-[min(96vw,1440px)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-background shadow-[0_32px_100px_rgba(15,23,42,0.28)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <header className="relative flex shrink-0 flex-col gap-5 border-b border-border/70 bg-gradient-to-r from-card via-card to-primary/[0.04] px-5 py-5 pr-16 sm:px-8 sm:py-6 sm:pr-20 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-background text-lg font-black text-primary shadow-soft sm:h-16 sm:w-16">
                {client.logoUrl ? (
                  <img src={client.logoUrl} alt="" className="h-full w-full object-contain p-1.5" />
                ) : (
                  initialsFor(client.name)
                )}
              </div>
              <div className="min-w-0">
                <DialogPrimitive.Title className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  {text.title}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description id="client-booking-description" className="mt-1 text-sm text-muted-foreground">
                  {text.description}
                </DialogPrimitive.Description>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                  <span className="font-bold text-foreground">{client.name}</span>
                  {client.address ? (
                    <a
                      href={client.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 text-muted-foreground transition hover:text-primary"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      {client.address}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-primary/10 bg-primary/[0.06] px-4 py-2 text-sm font-semibold text-primary lg:inline-flex">
              <CalendarDays className="h-4 w-4" />
              {language === "sl" ? "Varno naročanje s Calendro" : "Secure booking with Calendra"}
            </div>

            <DialogPrimitive.Close
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-border/70 bg-background/90 text-muted-foreground shadow-sm transition hover:border-primary/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:right-7 sm:top-7"
              aria-label={text.close}
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </header>

          <div ref={scrollAreaRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-gradient-to-b from-background to-muted/20 px-3 py-3 sm:px-5 sm:py-5 lg:px-7">
            <div className="mx-auto w-full max-w-[1320px]">
              {status === "loading" ? (
                <div className="flex min-h-[520px] items-center justify-center rounded-[1.75rem] border border-border/60 bg-card">
                  <div className="grid justify-items-center gap-4 text-center text-muted-foreground">
                    <LoaderCircle className="h-9 w-9 animate-spin text-primary" />
                    <p className="font-medium">{text.loading}</p>
                  </div>
                </div>
              ) : null}

              {status === "error" || status === "unavailable" ? (
                <div className="flex min-h-[520px] items-center justify-center rounded-[1.75rem] border border-border/60 bg-card p-8 text-center">
                  <div className="max-w-md">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/[0.08] text-primary">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <h2 className="mt-5 text-2xl font-bold text-foreground">
                      {status === "unavailable" ? text.unavailableTitle : text.errorTitle}
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      {status === "unavailable" ? text.unavailableBody : text.errorBody}
                    </p>
                  </div>
                </div>
              ) : null}

              <div
                ref={widgetHostRef}
                className={status === "ready" ? "block min-h-[650px]" : "hidden"}
                aria-live="polite"
              />
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default ClientBookingDialog;
