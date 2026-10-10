import { describe, expect, it } from "vitest";
import { normalizeCompanyIdentifiers } from "@/lib/company-identifiers";

describe("public company identifiers", () => {
  it("omits a VAT ID for the confirmed non-registered entity", () => {
    expect(normalizeCompanyIdentifiers({ vatId: "SI10550631" })).toMatchObject({ vatId: undefined, taxId: "10550631" });
  });
  it("removes the accidentally pasted environment assignment from the configured VAT ID", () => {
    expect(normalizeCompanyIdentifiers({ vatRegistered: true, vatId: " VITE_COMPANY_VAT_ID=SI10550631 " })).toEqual({
      vatId: "SI10550631",
      taxId: "10550631",
      registrationNumber: undefined,
    });
  });

  it("keeps a configured VAT identifier separate from the domestic tax number", () => {
    expect(normalizeCompanyIdentifiers({ vatRegistered: true, vatId: " si10550631 " })).toEqual({
      vatId: "SI10550631",
      taxId: "10550631",
      registrationNumber: undefined,
    });
  });

  it.each([
    { taxId: "10550631" },
    { taxId: "VITE_COMPANY_TAX_ID=10550631" },
    { vatId: "10550631" },
  ])("does not infer VAT registration from a domestic tax number: %j", (config) => {
    expect(normalizeCompanyIdentifiers(config)).toMatchObject({ vatId: undefined, taxId: "10550631" });
  });

  it.each([undefined, "", "unknown", "VITE_COMPANY_VAT_ID=", "VITE_OTHER=SI10550631", "SI10550631=extra"])(
    "omits an absent or malformed identifier: %s", (vatId) => {
      expect(normalizeCompanyIdentifiers({ vatId })).toMatchObject({ vatId: undefined, taxId: undefined });
    },
  );

  it("strips registration assignments and rejects non-numeric registration text", () => {
    expect(normalizeCompanyIdentifiers({ registrationNumber: "VITE_COMPANY_REGISTRATION_NUMBER=1234567000" }).registrationNumber)
      .toBe("1234567000");
    expect(normalizeCompanyIdentifiers({ registrationNumber: "not supplied" }).registrationNumber).toBeUndefined();
  });
});
