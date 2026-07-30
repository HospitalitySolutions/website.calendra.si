import { ANALYTICS_ENABLED, trackAnalyticsEvent } from "@/lib/analytics";

/**
 * Reports Core Web Vitals field data into Umami. Lab scores from Lighthouse do
 * not reflect real Slovenian mobile connections, and Google ranks on field data,
 * so this is the number that actually matters.
 *
 * The library is imported dynamically to keep it out of the main bundle.
 */
export const reportWebVitals = () => {
  if (typeof window === "undefined" || !ANALYTICS_ENABLED) return;

  void import("web-vitals").then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
    const report = ({ name, value, rating }: { name: string; value: number; rating: string }) => {
      trackAnalyticsEvent("web-vitals", {
        metric: name,
        // CLS is unitless and needs the extra precision; the rest are milliseconds.
        value: name === "CLS" ? Number(value.toFixed(4)) : Math.round(value),
        rating,
        path: window.location.pathname,
      });
    };

    onCLS(report);
    onINP(report);
    onLCP(report);
    onFCP(report);
    onTTFB(report);
  });
};
