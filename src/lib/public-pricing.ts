import { APP_BASE_URL } from "@/lib/site";
import { appPricingSnapshot } from "virtual:app-pricing-snapshot";
import { normalizePublicPricingCatalog, type PublicPricingCatalog } from "@/lib/pricing-catalog";
export * from "@/lib/pricing-catalog";

export const PUBLIC_PRICING_ENDPOINT = `${APP_BASE_URL}/api/register/public-pricing`;
export const PRICING_CATALOG_SCRIPT_ID = "calendra-pricing-catalog";
export const PRICING_CATALOG_UPDATED_EVENT = "calendra:pricing-catalog-updated";
export const APP_PRICING_SNAPSHOT = normalizePublicPricingCatalog(appPricingSnapshot);
/** Compatibility alias: this is fetched from the app at build time, NOT a local price table. */
export const FALLBACK_PUBLIC_PRICING = APP_PRICING_SNAPSHOT;
let initialCatalog: PublicPricingCatalog | undefined;
// The catalog the page was prerendered with. Unlike initialCatalog it never follows a refresh,
// so anything decided from it renders the same on the server and during hydration.
let prerenderedCatalog: PublicPricingCatalog | undefined;
export const setPrerenderedPricingCatalog = (catalog: PublicPricingCatalog) => {
  initialCatalog = normalizePublicPricingCatalog(catalog);
  prerenderedCatalog = initialCatalog;
};
export const getInitialPricingCatalog = (): PublicPricingCatalog => {
  if (initialCatalog) return initialCatalog;
  if (typeof document !== "undefined") {
    const island = document.getElementById(PRICING_CATALOG_SCRIPT_ID);
    if (island?.textContent) {
      try { initialCatalog = normalizePublicPricingCatalog(JSON.parse(island.textContent)); }
      catch { /* Retain the verified build snapshot, never make up missing prices. */ }
    }
  }
  initialCatalog ??= APP_PRICING_SNAPSHOT;
  prerenderedCatalog ??= initialCatalog;
  return initialCatalog;
};
/**
 * True when the page was prerendered with an offer. The build drops an offer that has
 * already ended, so this means "the offer was running at build time". Offer slots are
 * reserved from it on the server and in the first client render.
 */
export const hasPrerenderedPromotion = (): boolean => {
  getInitialPricingCatalog();
  return Boolean(prerenderedCatalog?.promotion);
};
export const fetchPublicPricingCatalog = async (signal?: AbortSignal): Promise<PublicPricingCatalog> => {
  const response = await fetch(PUBLIC_PRICING_ENDPOINT, {
    method: "GET", headers: { Accept: "application/json" }, signal, credentials: "omit", cache: "no-cache",
  });
  if (!response.ok) throw new Error(`Pricing endpoint returned ${response.status}`);
  const catalog = normalizePublicPricingCatalog(await response.json());
  const changed = JSON.stringify(catalog) !== JSON.stringify(getInitialPricingCatalog());
  initialCatalog = catalog;
  if (changed && typeof window !== "undefined") window.dispatchEvent(new Event(PRICING_CATALOG_UPDATED_EVENT));
  return catalog;
};
