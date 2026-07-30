import type { SiteLanguage } from "@/lib/site-language";

/**
 * Routing primitives for the comparison pages, deliberately kept apart from the
 * prose in `comparison-pages.ts`.
 *
 * The router has to resolve `/primerjava/:slug` on every page load, so anything
 * it imports lands in the entry chunk. When the slug list and these helpers
 * lived alongside the content record, that pulled every comparison's tables and
 * FAQs into the initial download for visitors who never open one, and the cost
 * grew with each competitor added. Keeping the two apart means the router pays
 * for a string array and the prose stays in the route chunk.
 */
export type ComparisonSlug =
  | "calendly"
  | "lime-booking"
  | "myplanly"
  | "booksy"
  | "fresha"
  | "treatwell"
  | "setmore"
  | "simplybook";

/**
 * Order drives the comparison hub. The two Slovenian products sit near the top
 * because a Slovenian salon owner shopping for booking software is far more
 * likely to be weighing them than Setmore.
 */
export const COMPARISON_SLUGS: ComparisonSlug[] = [
  "calendly",
  "lime-booking",
  "myplanly",
  "booksy",
  "fresha",
  "treatwell",
  "setmore",
  "simplybook",
];

export const COMPARISON_INDEX_PATH: Record<SiteLanguage, string> = {
  sl: "/primerjava",
  en: "/en/comparison",
};

export const getComparisonPath = (slug: ComparisonSlug, language: SiteLanguage) =>
  `${COMPARISON_INDEX_PATH[language]}/${slug}`;

const COMPARISON_PATH_PATTERN = /^\/(?:primerjava|en\/comparison)\/([^/]+)$/;

export const isComparisonSlug = (value: string): value is ComparisonSlug =>
  (COMPARISON_SLUGS as string[]).includes(value);

export const getComparisonSlugFromPathname = (pathname: string): ComparisonSlug | undefined => {
  const normalized = pathname.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  const match = COMPARISON_PATH_PATTERN.exec(normalized);
  if (!match) return undefined;

  const slug = decodeURIComponent(match[1]);
  return isComparisonSlug(slug) ? slug : undefined;
};

export const isComparisonIndexPathname = (pathname: string) => {
  const normalized = pathname.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  return normalized === COMPARISON_INDEX_PATH.sl || normalized === COMPARISON_INDEX_PATH.en;
};

export const comparisonPathnames = COMPARISON_SLUGS.flatMap((slug) => [
  getComparisonPath(slug, "sl"),
  getComparisonPath(slug, "en"),
]);
