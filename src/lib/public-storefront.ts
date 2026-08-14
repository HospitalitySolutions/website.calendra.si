import { normalizeDirectoryClient, type DirectoryClient } from "@/lib/company-directory";

export type StorefrontService = {
  id: number;
  name: string;
  description: string;
  durationMinutes: number | null;
  priceLabel: string;
  priceGross: number | null;
  maxParticipantsPerSession: number | null;
  groupBooking: boolean;
  serviceGroupId: number | null;
  serviceGroupName: string;
  serviceGroupSortOrder: number | null;
  serviceSortOrder: number;
};

export type StorefrontProductType = "PACK" | "MEMBERSHIP" | "GIFT_CARD" | "COURSE";

export type StorefrontProduct = {
  productId: string;
  name: string;
  productType: StorefrontProductType;
  priceGross: number;
  currency: string;
  description: string;
  promoText: string;
  validityDays: number | null;
  usageLimit: number | null;
  bookable: boolean;
  voucherFaceValueGross: number | null;
  voucherSessionTypeNames: string[];
};

export type StorefrontTeamMember = {
  id: number;
  name: string;
};

export type PublicStorefront = {
  location: DirectoryClient;
  services: StorefrontService[];
  products: StorefrontProduct[];
  team: StorefrontTeamMember[];
};

type UnknownRecord = Record<string, unknown>;

const asRecord = (value: unknown): UnknownRecord | null =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;

const stringValue = (value: unknown): string => typeof value === "string" ? value.trim() : "";
const numberValue = (value: unknown): number | null => {
  const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : null;
};
const integerValue = (value: unknown): number | null => {
  const parsed = numberValue(value);
  return parsed === null ? null : Math.trunc(parsed);
};
const booleanValue = (value: unknown): boolean => value === true || (typeof value === "string" && value.toLowerCase() === "true");
const stringArray = (value: unknown): string[] => Array.isArray(value)
  ? value.map(stringValue).filter(Boolean)
  : [];

const normalizeService = (value: unknown): StorefrontService | null => {
  const row = asRecord(value);
  if (!row) return null;
  const id = integerValue(row.id);
  const name = stringValue(row.name);
  if (id === null || id <= 0 || !name) return null;
  return {
    id,
    name,
    description: stringValue(row.description),
    durationMinutes: integerValue(row.durationMinutes),
    priceLabel: stringValue(row.priceLabel),
    priceGross: numberValue(row.priceGross),
    maxParticipantsPerSession: integerValue(row.maxParticipantsPerSession),
    groupBooking: booleanValue(row.groupBooking),
    serviceGroupId: integerValue(row.serviceGroupId),
    serviceGroupName: stringValue(row.serviceGroupName),
    serviceGroupSortOrder: integerValue(row.serviceGroupSortOrder),
    serviceSortOrder: integerValue(row.serviceSortOrder) ?? 0,
  };
};

const normalizeProduct = (value: unknown): StorefrontProduct | null => {
  const row = asRecord(value);
  if (!row) return null;
  const productId = stringValue(row.productId);
  const name = stringValue(row.name);
  const rawType = stringValue(row.productType).toUpperCase();
  if (!productId || !name || !["PACK", "MEMBERSHIP", "GIFT_CARD", "COURSE"].includes(rawType)) return null;
  return {
    productId,
    name,
    productType: rawType as StorefrontProductType,
    priceGross: numberValue(row.priceGross) ?? 0,
    currency: stringValue(row.currency) || "EUR",
    description: stringValue(row.description),
    promoText: stringValue(row.promoText),
    validityDays: integerValue(row.validityDays),
    usageLimit: integerValue(row.usageLimit),
    bookable: booleanValue(row.bookable),
    voucherFaceValueGross: numberValue(row.voucherFaceValueGross),
    voucherSessionTypeNames: stringArray(row.voucherSessionTypeNames),
  };
};

const normalizeTeamMember = (value: unknown): StorefrontTeamMember | null => {
  const row = asRecord(value);
  if (!row) return null;
  const id = integerValue(row.id);
  const name = stringValue(row.name);
  if (id === null || id <= 0 || !name) return null;
  return { id, name };
};

export const normalizePublicStorefront = (payload: unknown, appBaseUrl: string): PublicStorefront | null => {
  const record = asRecord(payload);
  if (!record) return null;
  const location = normalizeDirectoryClient(record.location, appBaseUrl);
  if (!location) return null;
  return {
    location,
    services: (Array.isArray(record.services) ? record.services : []).map(normalizeService).filter((value): value is StorefrontService => Boolean(value)),
    products: (Array.isArray(record.products) ? record.products : []).map(normalizeProduct).filter((value): value is StorefrontProduct => Boolean(value)),
    team: (Array.isArray(record.team) ? record.team : []).map(normalizeTeamMember).filter((value): value is StorefrontTeamMember => Boolean(value)),
  };
};
