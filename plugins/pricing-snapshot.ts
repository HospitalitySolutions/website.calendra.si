import fs from "node:fs/promises";
import path from "node:path";
import { loadEnv, type Plugin, type ResolvedConfig } from "vite";
import { normalizePublicPricingCatalog } from "../src/lib/pricing-catalog";

const FETCH_ATTEMPTS = 3;
const FETCH_TIMEOUT_MS = 15_000;

/** Fetch the app catalog with retries; a failure names the endpoint and the cause. */
export const fetchAppPricing = async (endpoint: string): Promise<unknown> => {
  const failures: string[] = [];
  for (let attempt = 1; attempt <= FETCH_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    // A referenced timer keeps the build alive until the request settles. AbortSignal.timeout() alone
    // does not, so a stalled connection made Rollup quit with "Unexpected early exit" and no cause.
    const timer = setTimeout(() => controller.abort(new Error(`timed out after ${FETCH_TIMEOUT_MS / 1000} s`)), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(endpoint, { headers: { Accept: "application/json" }, signal: controller.signal, cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      const cause = error instanceof Error ? (error.cause instanceof Error ? `${error.message}: ${error.cause.message}` : error.message) : String(error);
      failures.push(`attempt ${attempt}: ${cause}`);
    } finally {
      clearTimeout(timer);
    }
    if (attempt < FETCH_ATTEMPTS) await new Promise((resolve) => setTimeout(resolve, attempt * 2_000));
  }
  throw new Error(`App pricing unavailable from ${endpoint} (${failures.join("; ")}); refusing to publish invented prices.`);
};

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
        catalog = normalizePublicPricingCatalog(await fetchAppPricing(endpoint));
        await fs.mkdir(path.dirname(cachePath), { recursive: true });
        await fs.writeFile(cachePath, JSON.stringify({ endpoint, fetchedAt: Date.now(), catalog }));
      }
      return `export const appPricingSnapshot = ${JSON.stringify(catalog)};`;
    },
  };
};
