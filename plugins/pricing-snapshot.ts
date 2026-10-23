import fs from "node:fs/promises";
import path from "node:path";
import { loadEnv, type Plugin, type ResolvedConfig } from "vite";
import { normalizePublicPricingCatalog } from "../src/lib/pricing-catalog";

/** Only an app-provided catalog may supply production prices. */
export const pricingSnapshotPlugin = (): Plugin => {
  const id = "virtual:app-pricing-snapshot";
  let config: ResolvedConfig;
  return {
    name: "calendra:app-pricing-snapshot",
    configResolved(resolved) { config = resolved; },
    resolveId(source) { return source === id ? `\0${id}` : undefined; },
    async load(source) {
      if (source !== `\0${id}`) return undefined;
      const env = loadEnv(config.mode, config.root, "VITE_");
      const base = (env.VITE_APP_BASE_URL || process.env.VITE_APP_BASE_URL || "https://app.calendra.si").replace(/\/+$/, "");
      const endpoint = `${base}/api/register/public-pricing`;
      const cachePath = path.join(config.root, ".calendra-cache", "app-pricing-snapshot.json");
      let catalog;
      if (config.build.ssr) {
        try {
          const saved = JSON.parse(await fs.readFile(cachePath, "utf8"));
          if (saved.endpoint === endpoint && Date.now() - saved.fetchedAt < 300_000) catalog = normalizePublicPricingCatalog(saved.catalog);
        } catch { /* A standalone SSR build fetches its own verified snapshot. */ }
      }
      if (!catalog) {
        const response = await fetch(endpoint, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(15_000), cache: "no-store" });
        if (!response.ok) throw new Error(`App pricing unavailable (${response.status}); refusing to publish invented prices.`);
        catalog = normalizePublicPricingCatalog(await response.json());
        await fs.mkdir(path.dirname(cachePath), { recursive: true });
        await fs.writeFile(cachePath, JSON.stringify({ endpoint, fetchedAt: Date.now(), catalog }));
      }
      return `export const appPricingSnapshot = ${JSON.stringify(catalog)};`;
    },
  };
};
