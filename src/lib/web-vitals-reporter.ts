import { ANALYTICS_ENABLED, trackAnalyticsEvent } from "@/lib/analytics";
import { isMarketingPath } from "@/lib/analytics-policy";

let started = false;

/**
 * Reports Core Web Vitals field data into Umami. Lab scores from Lighthouse do
 * not reflect real Slovenian mobile connections, and Google ranks on field data,
 * so this is the number that actually matters.
 *
 * The library is imported dynamically to keep it out of the main bundle.
 */
export const reportWebVitals = () => {
  if (typeof window === "undefined" || !ANALYTICS_ENABLED || started) return;
  if (!isMarketingPath(window.location.pathname)) return;
  started = true;
  const path = window.location.pathname;
  const reported = new Set<string>();

  void import("web-vitals").then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
    const report = ({ id, name, value, rating }: { id: string; name: string; value: number; rating: string }) => {
      // One final value per metric per document lifecycle; bfcache gets new IDs.
      const key = `${name}:${id}`;
      if (reported.has(key)) return;
      reported.add(key);
      trackAnalyticsEvent("web-vitals", {
        metric: name,
        // CLS is unitless and needs the extra precision; the rest are milliseconds.
        value: name === "CLS" ? Number(value.toFixed(4)) : Math.round(value),
        rating,
        path,
      });
    };

    onCLS(report);
    onINP(report);
    onLCP(report);
    onFCP(report);
    onTTFB(report);
  });
};
