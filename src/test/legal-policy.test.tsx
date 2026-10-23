import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import LegalPolicyPage from "@/components/legal/LegalPolicyPage";
import { LEGAL_DOCUMENTS, type PolicyKey } from "@/lib/legal-documents";
import { LEGAL_POLICY, localizeLegal, SAVED_QUESTION_RETENTION, SUPPORT_HOURS, SUPPORT_RESPONSE } from "@/lib/legal-policy";
import { SiteLanguageProvider } from "@/lib/site-language";

const keys = Object.keys(LEGAL_DOCUMENTS) as PolicyKey[];
describe("owner-confirmed legal policy v0.4", () => {
  it("records the dated VAT change without inventing an annual Basic price", () => {
    expect(LEGAL_POLICY.vatEffectiveFrom).toBe("2026-11-01");
    expect(LEGAL_POLICY.vatId).toBe("SI10550631");
    expect(LEGAL_POLICY.basicMonthlyNetFromNovember).toBe(15.9);
    expect(Math.round(LEGAL_POLICY.basicMonthlyNetFromNovember * 1.22 * 100) / 100).toBe(19.4);
    expect(LEGAL_POLICY).not.toHaveProperty("basicAnnualNet");
  });
  it("distinguishes due date, overdue reminder and restriction after receipt", () => {
    expect(LEGAL_POLICY.invoiceDueDays).toBe(14);
    expect(LEGAL_POLICY.reminderDaysOverdue).toBe(7);
    expect(LEGAL_POLICY.restrictAfterReceiptDays).toBe(30);
    expect(LEGAL_POLICY.renewalNoticeDays).toBe(30);
  });
  it("keeps support daytime, every day and first-response only", () => {
    expect(LEGAL_POLICY.support).toMatchObject({ start: "08:00", end: "20:00", timeZone: "Europe/Ljubljana", urgentHours: 12, ordinaryHours: [24, 48], everyDay: true });
    expect(SUPPORT_HOURS[1]).toContain("public holidays");
    expect(SUPPORT_RESPONSE[1]).toContain("not guaranteed resolution");
    expect(SUPPORT_RESPONSE[1]).toContain("clock pauses overnight");
  });
  it("separates live text capture, non-live voice and unverified retention enforcement", () => {
    expect(LEGAL_POLICY.textSupportLive).toBe(true);
    expect(LEGAL_POLICY.questionCaptureLive).toBe(true);
    expect(LEGAL_POLICY.voiceLive).toBe(false);
    expect(LEGAL_POLICY.savedQuestionRetention).toEqual({ minimumDays: 7, maximumDays: 14, productionVerified: false });
    expect(SAVED_QUESTION_RETENTION[1]).toContain("still being verified");
    expect(LEGAL_POLICY.legalReviewComplete).toBe(false);
  });
  it.each(["sl", "en"] as const)("provides complete %s copy for every updated document", (language) => {
    for (const key of keys) {
      const document = LEGAL_DOCUMENTS[key];
      expect(localizeLegal(document.title, language).length).toBeGreaterThan(5);
      expect(document.sections.length).toBeGreaterThan(1);
      for (const section of document.sections) {
        expect(localizeLegal(section.title, language).length).toBeGreaterThan(3);
        for (const paragraph of section.paragraphs) expect(localizeLegal(paragraph, language).length).toBeGreaterThan(20);
      }
    }
  });
  it.each(["sl", "en"] as const)("renders accessible %s contract, breach and AI content", (language) => {
    for (const policy of ["terms", "dpa", "security", "privacy", "aiTransparency", "support"] as const) {
      const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(SiteLanguageProvider, { initialLanguage: language }, createElement(LegalPolicyPage, { policy }))));
      const page = new DOMParser().parseFromString(html, "text/html");
      expect(page.querySelectorAll("h1")).toHaveLength(1);
      expect(page.querySelector("h1")?.textContent).toBe(localizeLegal(LEGAL_DOCUMENTS[policy].title, language));
      expect(page.querySelector('a[href="mailto:info@calendra.si"]')).not.toBeNull();
      if (policy === "terms") expect(page.querySelector("#connect")).not.toBeNull();
      if (policy === "security") expect(page.querySelector("#incidenti")).not.toBeNull();
      if (policy === "aiTransparency" || policy === "privacy") expect(page.body.textContent).toContain(localizeLegal(SAVED_QUESTION_RETENTION, language));
    }
  });
});
