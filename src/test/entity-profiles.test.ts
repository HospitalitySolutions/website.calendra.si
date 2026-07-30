import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LEGAL } from "@/lib/legal";
import { getSeoForPathname } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

/**
 * The value of an off-site directory listing depends entirely on it repeating
 * the same name, address and phone number as the Organization schema. The
 * checklist in docs/entity-profiles.md is what somebody copies from when
 * creating those listings, so it is verified against the schema rather than
 * trusted to have been kept up to date by hand.
 */
const readNapBlock = () => {
  const doc = fs.readFileSync(path.resolve(process.cwd(), "docs/entity-profiles.md"), "utf8");
  const match = /<!-- NAP_START -->([\s\S]*?)<!-- NAP_END -->/.exec(doc);
  if (!match) throw new Error("docs/entity-profiles.md is missing the NAP_START/NAP_END block.");
  return match[1];
};

const organizationSchema = () => {
  const { structuredData } = getSeoForPathname("/");
  const organization = structuredData?.["@graph"].find(
    (node: { "@type": string }) => node["@type"] === "Organization",
  );
  if (!organization) throw new Error("Homepage structured data has no Organization node.");
  return organization as {
    name: string;
    legalName: string;
    telephone: string;
    email: string;
    url: string;
    address: { streetAddress: string; postalCode: string; addressLocality: string };
  };
};

describe("off-site entity profile checklist", () => {
  it("repeats the same NAP the Organization schema publishes", () => {
    const nap = readNapBlock();
    const organization = organizationSchema();

    for (const value of [
      organization.name,
      organization.legalName,
      organization.address.streetAddress,
      `${organization.address.postalCode} ${organization.address.addressLocality}`,
      LEGAL.supportPhone,
      LEGAL.generalEmail,
      SITE_URL,
    ]) {
      expect(nap, `docs/entity-profiles.md does not list "${value}"`).toContain(value);
    }
  });

  it("publishes the legal entity and address from the single legal source", () => {
    const organization = organizationSchema();

    expect(organization.legalName).toBe(LEGAL.entityName);
    expect(organization.address.streetAddress).toBe(LEGAL.businessAddress);
    expect(organization.address.postalCode).toBe(LEGAL.postalCode);
    expect(organization.address.addressLocality).toBe(LEGAL.city);
    expect(organization.telephone).toBe(LEGAL.supportPhoneTel);
  });

  it("declares the founder and the service area used for entity resolution", () => {
    const organization = organizationSchema() as unknown as {
      founder: { "@id": string };
      areaServed: { name: string };
    };

    expect(organization.founder["@id"]).toBe(`${SITE_URL}/#author-david-mirc`);
    expect(organization.areaServed.name).toBe("Slovenia");
  });
});
