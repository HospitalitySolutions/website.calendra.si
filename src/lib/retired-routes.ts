/**
 * Public URLs of the IT services section, which Calendra no longer offers.
 * The pages, navigation, sitemap and llms.txt entries were removed; the
 * Caddyfile answers these paths with 410 Gone so search engines drop them
 * instead of treating them as soft 404s. Keep this list and the
 * `@retiredItServices` matcher in the Caddyfile in sync.
 */
export const RETIRED_IT_SERVICE_PATHS = [
  "/it-storitve",
  "/en/it-services",
  "/it-podpora-malim-podjetjem",
  "/en/small-business-it-support",
  "/izdelava-spletnih-strani",
  "/en/website-design-and-redesign",
  "/vzdrzevanje-spletnih-strani",
  "/en/website-maintenance",
  "/poslovna-e-posta",
  "/en/business-email",
  "/varnostne-kopije-in-it-varnost",
  "/en/backups-and-it-security",
  "/avtomatizacije-in-integracije",
  "/en/business-automation-and-integrations",
] as const;
