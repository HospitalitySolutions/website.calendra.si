import { useEffect, useSyncExternalStore } from "react";
import { fetchPublicPricingCatalog, getInitialPricingCatalog, PRICING_CATALOG_UPDATED_EVENT } from "@/lib/public-pricing";
const subscribe = (notify: () => void) => {
  window.addEventListener(PRICING_CATALOG_UPDATED_EVENT, notify);
  return () => window.removeEventListener(PRICING_CATALOG_UPDATED_EVENT, notify);
};
export const usePublicPricingCatalog = () => {
  const catalog = useSyncExternalStore(subscribe, getInitialPricingCatalog, getInitialPricingCatalog);
  useEffect(() => {
    const controller = new AbortController();
    void fetchPublicPricingCatalog(controller.signal).catch(() => { /* Keep the last verified app snapshot. */ });
    return () => controller.abort();
  }, []);
  return catalog;
};
