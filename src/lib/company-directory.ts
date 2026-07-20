export type ClientCategory = "salon" | "fitness" | "wellness" | "health" | "consulting";

export type DirectoryClient = {
  slug: string;
  tenantCode?: string;
  tenantSlug: string;
  name: string;
  description: string;
  address: string;
  googleMapsUrl: string;
  category?: ClientCategory;
  logoUrl?: string | null;
  googleRating?: number | null;
  googleReviewCount?: number | null;
};

type UnknownRecord = Record<string, unknown>;

const asRecord = (value: unknown): UnknownRecord | null =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;

const firstString = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
};

const firstNumber = (...values: unknown[]): number | null => {
  for (const value of values) {
    const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};

const firstBoolean = (...values: unknown[]): boolean | null => {
  for (const value of values) {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();
      if (normalized === "true") return true;
      if (normalized === "false") return false;
    }
  }
  return null;
};

const slugify = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "podjetje";

const normalizeCategory = (value: unknown): ClientCategory | undefined => {
  if (typeof value !== "string") return undefined;

  switch (value.trim().toLowerCase()) {
    case "salon":
    case "beauty":
    case "lepota":
      return "salon";
    case "fitness":
    case "sport":
    case "šport":
      return "fitness";
    case "wellness":
      return "wellness";
    case "health":
    case "healthcare":
    case "zdravje":
      return "health";
    case "consulting":
    case "counselling":
    case "counseling":
    case "svetovanje":
      return "consulting";
    default:
      return undefined;
  }
};

const resolveLogoUrl = (value: string, appBaseUrl: string): string | null => {
  if (!value) return null;
  if (/^(?:https?:|data:|blob:)/i.test(value)) return value;
  return `${appBaseUrl.replace(/\/+$/, "")}/${value.replace(/^\/+/, "")}`;
};

const buildAddress = (record: UnknownRecord): string => {
  const physicalAddress = asRecord(record.physicalAddress);
  const address = asRecord(record.address);

  const formatted = firstString(
    record.formattedPhysicalAddress,
    record.physicalAddressFormatted,
    physicalAddress?.formattedAddress,
    physicalAddress?.formatted,
  );
  if (formatted) return formatted;

  const street = firstString(
    record.physicalStreetAddress,
    record.physicalAddressLine1,
    record.physicalStreet,
    physicalAddress?.address,
    physicalAddress?.streetAddress,
    physicalAddress?.street,
    physicalAddress?.addressLine1,
    // Backwards-compatible API fallbacks. The app endpoint should prefer physical-address fields.
    record.streetAddress,
    address?.streetAddress,
    address?.street,
  );
  const postalCode = firstString(
    record.physicalPostalCode,
    physicalAddress?.postalCode,
    physicalAddress?.zipCode,
    record.postalCode,
    address?.postalCode,
  );
  const city = firstString(
    record.physicalCity,
    physicalAddress?.city,
    record.city,
    address?.city,
  );
  const locality = [postalCode, city].filter(Boolean).join(" ");

  return [street, locality].filter(Boolean).join(", ");
};

const extractRows = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;

  const record = asRecord(payload);
  if (!record) return [];

  for (const key of ["companies", "items", "content", "data", "results"]) {
    if (Array.isArray(record[key])) return record[key] as unknown[];
  }

  return [];
};

export const normalizeDirectoryClients = (payload: unknown, appBaseUrl: string): DirectoryClient[] =>
  extractRows(payload).flatMap((item, index) => {
    const record = asRecord(item);
    if (!record) return [];

    const publiclyDiscoverable = firstBoolean(
      record.publiclyDiscoverable,
      record.publiclyFindable,
      record.publiclyVisible,
      record.showOnCustomersPage,
      record.publicDirectoryEnabled,
      record.publiclyListed,
      record.javnoNajdljivo,
    );
    if (publiclyDiscoverable === false) return [];

    const name = firstString(record.publicName, record.javnoIme, record.name);
    if (!name) return [];

    const description = firstString(record.publicDescription, record.javniOpis, record.description);
    const address = buildAddress(record);
    const tenant = asRecord(record.tenant);
    const tenantCode = firstString(
      record.tenantCode,
      record.tenant_code,
      record.code,
      tenant?.code,
      tenant?.tenantCode,
      tenant?.tenant_code,
      record.tenantKey,
      record.tenant_key,
      record.tenantSlug,
      record.tenant_slug,
      typeof record.tenant === "string" ? record.tenant : undefined,
    );
    const tenantSlug = firstString(
      record.tenantSlug,
      record.tenant_slug,
      record.tenantKey,
      record.tenant_key,
      typeof record.tenant === "string" ? record.tenant : undefined,
      record.slug,
      tenantCode,
    );
    const explicitSlug = firstString(record.publicSlug, record.slug);
    const logo = asRecord(record.logo);
    const carouselLogo = asRecord(record.carouselLogo);
    const googleReviews = asRecord(record.googleReviews) ?? asRecord(record.googleReviewSummary);
    const logoUrl = resolveLogoUrl(
      firstString(
        record.publicLogoUrl,
        record.logoUrl,
        record.companyLogoUrl,
        record.carouselLogoUrl,
        record.logoPath,
        logo?.url,
        logo?.path,
        carouselLogo?.url,
        carouselLogo?.path,
      ),
      appBaseUrl,
    );

    const googleRating = firstNumber(
      record.googleRating,
      record.googleReviewRating,
      record.reviewRating,
      googleReviews?.rating,
      record.rating,
    );
    const reviewCount = firstNumber(
      record.googleReviewCount,
      record.googleUserRatingCount,
      record.reviewCount,
      googleReviews?.reviewCount,
      googleReviews?.userRatingCount,
      record.userRatingCount,
    );
    const googleReviewCount = reviewCount === null ? null : Math.max(0, Math.trunc(reviewCount));
    const mapsUrl = firstString(
      record.googleMapsUrl,
      record.googleMapsUri,
      googleReviews?.googleMapsUrl,
      googleReviews?.googleMapsUri,
    );
    const googleMapsUrl = mapsUrl || (address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
      : "");

    return [{
      slug: explicitSlug || tenantSlug || tenantCode || `${slugify(name)}-${index + 1}`,
      tenantCode: tenantCode || undefined,
      tenantSlug,
      name,
      description,
      address,
      googleMapsUrl,
      category: normalizeCategory(record.category ?? record.businessCategory ?? record.companyCategory),
      logoUrl,
      googleRating,
      googleReviewCount,
    }];
  });

export const getDirectoryClientBookingPath = (
  client: Pick<DirectoryClient, "tenantCode" | "tenantSlug" | "slug">,
): string => {
  const tenantCode = client.tenantCode || client.tenantSlug || client.slug;
  return `/narocanje/${encodeURIComponent(tenantCode)}`;
};
