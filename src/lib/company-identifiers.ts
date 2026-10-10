/** Accept a value or a mistakenly pasted KEY=value, never the assignment itself. */
const readIdentifier = (raw: string | undefined, key: string): string | undefined => {
  let value = raw?.trim();
  if (value?.startsWith(`${key}=`)) value = value.slice(key.length + 1).trim();
  if (!value || value.includes("=")) return undefined;
  return value;
};

export const normalizeCompanyIdentifiers = ({
  vatId,
  taxId,
  registrationNumber,
}: {
  vatId?: string;
  taxId?: string;
  registrationNumber?: string;
}) => {
  const configuredVatId = readIdentifier(vatId, "VITE_COMPANY_VAT_ID")?.toUpperCase();
  const configuredTaxId = readIdentifier(taxId, "VITE_COMPANY_TAX_ID");
  const configuredRegistration = readIdentifier(registrationNumber, "VITE_COMPANY_REGISTRATION_NUMBER");

  // A domestic tax number does not establish VAT registration. Only preserve
  // a VAT ID when its SI prefix was explicitly supplied in the configuration.
  const normalizedVatId = configuredVatId && /^SI\d{8}$/.test(configuredVatId)
    ? configuredVatId
    : undefined;
  const taxNumber = configuredTaxId ?? normalizedVatId?.slice(2) ?? configuredVatId;

  return {
    vatId: normalizedVatId,
    taxId: taxNumber && /^\d{8}$/.test(taxNumber) ? taxNumber : undefined,
    registrationNumber: configuredRegistration && /^\d+$/.test(configuredRegistration)
      ? configuredRegistration
      : undefined,
  };
};
