const WIDGET_SCRIPT_ID = "calendra-booking-widget-script";

export type CalendraBookingWidgetOptions = {
  tenant: string;
  baseUrl: string;
  locale: string;
  presentation?: "default" | "directory";
  primaryColor?: string;
  accentColor?: string;
};

declare global {
  interface Window {
    __calendraWidgetScriptPromise?: Promise<void>;
  }
}

const widgetScriptUrl = (baseUrl: string) =>
  `${baseUrl.replace(/\/+$/, "")}/widget/calendra-booking-widget.js`;

export const loadCalendraBookingWidgetScript = (baseUrl: string): Promise<void> => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(new Error("The Calendra booking widget can only be loaded in a browser."));
  }

  if (window.customElements?.get("calendra-booking-widget")) {
    return Promise.resolve();
  }

  if (window.__calendraWidgetScriptPromise) {
    return window.__calendraWidgetScriptPromise;
  }

  window.__calendraWidgetScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(WIDGET_SCRIPT_ID) as HTMLScriptElement | null;

    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }

      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => {
          window.__calendraWidgetScriptPromise = undefined;
          reject(new Error("Failed to load the Calendra booking widget script."));
        },
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = WIDGET_SCRIPT_ID;
    script.src = widgetScriptUrl(baseUrl);
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => {
      window.__calendraWidgetScriptPromise = undefined;
      script.remove();
      reject(new Error("Failed to load the Calendra booking widget script."));
    };
    document.body.appendChild(script);
  });

  return window.__calendraWidgetScriptPromise;
};

export const createCalendraBookingWidget = ({
  tenant,
  baseUrl,
  locale,
  presentation = "default",
  primaryColor,
  accentColor,
}: CalendraBookingWidgetOptions): HTMLElement => {
  const widget = document.createElement("calendra-booking-widget");
  widget.setAttribute("tenant", tenant);
  widget.setAttribute("base-url", baseUrl.replace(/\/+$/, ""));
  widget.setAttribute("locale", locale);

  if (presentation !== "default") widget.setAttribute("presentation", presentation);
  if (primaryColor) widget.setAttribute("primary-color", primaryColor);
  if (accentColor) widget.setAttribute("accent-color", accentColor);

  return widget;
};
