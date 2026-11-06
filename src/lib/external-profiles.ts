import { normalizeCompanyIdentifiers } from "@/lib/company-identifiers";
import { LEGAL } from "@/lib/legal";
import { LEGAL_POLICY } from "@/lib/legal-policy";

export const GOOGLE_BUSINESS_PROFILE_URL =
  "https://www.google.com/maps/search/?api=1&query=Calendra&query_place_id=ChIJm6_tDR93b0cRZhhgh_KBCd0";

const isPublicHttpUrl = (value: string | undefined): value is string => {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

/**
 * A social profile URL set at build time (Docker build argument) wins over the
 * committed default, so a corrected profile needs no code change. Empty or
 * invalid values fall back to the default; profiles without a default are
 * omitted until their variable is set.
 */
function buildTimeProfileUrl(value: string | undefined, fallback: string): string;
function buildTimeProfileUrl(value: string | undefined): string | undefined;
function buildTimeProfileUrl(value: string | undefined, fallback?: string) {
  const trimmed = value?.trim();
  return isPublicHttpUrl(trimmed) ? trimmed : fallback;
}

export const FACEBOOK_PROFILE_URL = buildTimeProfileUrl(
  import.meta.env.VITE_FACEBOOK_URL,
  "https://www.facebook.com/profile.php?id=61590713483596",
);
export const INSTAGRAM_PROFILE_URL = buildTimeProfileUrl(
  import.meta.env.VITE_INSTAGRAM_URL,
  "https://www.instagram.com/calendra_si/",
);
export const LINKEDIN_PROFILE_URL = buildTimeProfileUrl(
  import.meta.env.VITE_LINKEDIN_URL,
  "https://www.linkedin.com/company/135116409/",
);
export const TIKTOK_PROFILE_URL = buildTimeProfileUrl(import.meta.env.VITE_TIKTOK_URL);

/**
 * Additional entity profiles supplied at build time as a comma or newline
 * separated list: Wikidata, Crunchbase, Product Hunt, G2, Capterra, Slovenian
 * business directories.
 *
 * These live in one environment variable rather than one variable per
 * directory, because listing on a new directory then needs no change to this
 * repository, the Dockerfile or the compose file. Each URL becomes a `sameAs`
 * entry, which is how a search engine or an assistant confirms that the profile
 * on another site and this website describe the same organization.
 */
const parseProfileList = (value: string | undefined) =>
  (value ?? "")
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(isPublicHttpUrl);

export const ENTITY_PROFILE_URLS = parseProfileList(import.meta.env.VITE_ENTITY_PROFILE_URLS);

/**
 * Official profiles that can be safely declared as the same organization.
 * Social and app-store links are build-time settings because their final URLs
 * are not stored elsewhere in this website repository.
 */
export const OFFICIAL_PROFILE_URLS = Array.from(new Set([
  FACEBOOK_PROFILE_URL,
  INSTAGRAM_PROFILE_URL,
  LINKEDIN_PROFILE_URL,
  TIKTOK_PROFILE_URL,
  import.meta.env.VITE_YOUTUBE_URL,
  GOOGLE_BUSINESS_PROFILE_URL,
  import.meta.env.VITE_GOOGLE_PLAY_URL,
  import.meta.env.VITE_APP_STORE_URL,
  ...ENTITY_PROFILE_URLS,
].filter(isPublicHttpUrl)));

/** Author profiles, kept separate so a personal profile never becomes an Organization `sameAs`. */
export const AUTHOR_PROFILE_URLS = parseProfileList(import.meta.env.VITE_AUTHOR_PROFILE_URLS);

/**
 * Public company registration identifiers. Registry numbers are the strongest
 * signal that the Calendra entity described here and the entry in a business
 * directory are the same legal person, so they are emitted when supplied and
 * omitted entirely when not.
 */
const companyIdentifiers = normalizeCompanyIdentifiers({
  vatId: import.meta.env.VITE_COMPANY_VAT_ID || LEGAL_POLICY.vatId,
  vatRegistered: LEGAL.vatRegistered,
  taxId: import.meta.env.VITE_COMPANY_TAX_ID,
  registrationNumber: import.meta.env.VITE_COMPANY_REGISTRATION_NUMBER,
});
export const COMPANY_VAT_ID = companyIdentifiers.vatId;
export const COMPANY_TAX_ID = companyIdentifiers.taxId;
export const COMPANY_REGISTRATION_NUMBER = companyIdentifiers.registrationNumber;
export const WIKIDATA_ENTITY_ID = import.meta.env.VITE_WIKIDATA_ENTITY_ID?.trim() || undefined;
