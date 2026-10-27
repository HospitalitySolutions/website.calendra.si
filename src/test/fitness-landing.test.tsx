import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SiteLanguageProvider, type SiteLanguage } from "@/lib/site-language";
import { getIndustryContent } from "@/lib/industry-pages";
import { buildTrialSignupRoute } from "@/lib/routes";
import { getRoutePath } from "@/lib/localized-routes";
import { trackMarketingEvent } from "@/lib/marketing-events";
import FitnessLandingPage from "@/pages/FitnessLandingPage";
import IndustryDetailPage from "@/pages/IndustryDetailPage";

vi.mock("@/components/landing/Navbar", () => ({ default: () => null }));
vi.mock("@/components/landing/Footer", () => ({ default: () => null }));
vi.mock("@/components/landing/StickySalesCtaBar", () => ({ default: () => null }));
vi.mock("@/pages/StandardIndustryDetailPage", () => ({ default: () => <div data-testid="standard-industry">Standard industry page</div> }));
vi.mock("@/lib/marketing-events", () => ({ trackMarketingEvent: vi.fn() }));

const renderPage = (language: SiteLanguage = "sl", route = getRoutePath("fitnessPersonalTraining", language), routed = false) => {
  window.history.replaceState({}, "", `${route}?utm_source=fitness-test`);
  return render(
    <MemoryRouter initialEntries={[`${route}?utm_source=fitness-test`]}>
      <SiteLanguageProvider initialLanguage={language}>
        {routed ? <IndustryDetailPage /> : <FitnessLandingPage />}
      </SiteLanguageProvider>
    </MemoryRouter>,
  );
};

afterEach(() => { cleanup(); vi.clearAllMocks(); window.history.replaceState({}, "", "/"); });

describe("fitness landing page", () => {
  it("uses the approved section order and exact Slovenian workflow titles", () => {
    const { container } = renderPage();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Program za fitnes centre, osebne trenerje in skupinske vadbe");
    expect(Array.from(container.querySelectorAll("main > section"), (section) => section.id)).toEqual([
      "fitness-hero", "fitness-activities", "funkcionalnosti-panoge", "fitness-challenges", "fitness-workflow", "fitness-faq", "fitness-cta",
    ]);
    const workflow = container.querySelector("#fitness-workflow") as HTMLElement;
    expect(within(workflow).getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)).toEqual([
      "Nastavite urnik", "Stranke se naročijo", "Spremljajte obiske in pakete",
    ]);
    expect(container.querySelectorAll("#fitness-activities article")).toHaveLength(4);
    expect(container.querySelectorAll("#funkcionalnosti-panoge article")).toHaveLength(6);
    expect(container.textContent).not.toMatch(/1[.,]000\+|92%|312\s*\/\s*340/);
  });

  it.each(["sl", "en"] as const)("preserves real trial links, demo links and FAQ content in %s", (language) => {
    const { container } = renderPage(language);
    const trialLabel = language === "sl" ? "Preizkusite brezplačno" : "Try it free";
    const demoLabel = language === "sl" ? "Rezervirajte predstavitev" : "Book a demo";
    const trials = screen.getAllByRole("link", { name: trialLabel });
    expect(trials).toHaveLength(2);
    for (const link of trials) expect(link).toHaveAttribute("href", buildTrialSignupRoute(language, "?utm_source=fitness-test"));
    const demos = screen.getAllByRole("link", { name: demoLabel });
    expect(demos).toHaveLength(2);
    for (const link of demos) expect(link).toHaveAttribute("href", getRoutePath("demo", language));
    for (const item of getIndustryContent("fitnessPersonalTraining", language).faq) {
      expect(screen.getByText(item.question, { exact: true })).toBeInTheDocument();
      expect(screen.getByText(item.answer, { exact: true })).toBeInTheDocument();
    }
    const images = Array.from(container.querySelectorAll("main img"));
    expect(images.length).toBeGreaterThan(4);
    for (const image of images) {
      expect(image).toHaveAttribute("width");
      expect(image).toHaveAttribute("height");
      expect(image).toHaveAttribute("alt");
      expect(image.getAttribute("src")).toMatch(/^\/(screenshots|industries)\//);
    }
  });

  it("tracks trial and demo actions without replacing their destinations", () => {
    renderPage();
    const trial = screen.getAllByRole("link", { name: "Preizkusite brezplačno" })[0];
    const demo = screen.getAllByRole("link", { name: "Rezervirajte predstavitev" })[0];
    // Prevent document navigation in jsdom; keep React click tracking active.
    trial.addEventListener("click", (event) => event.preventDefault());
    demo.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(trial);
    fireEvent.click(demo);
    expect(trackMarketingEvent).toHaveBeenCalledWith("trial_cta_click", { placement: "industry_page", language: "sl" });
    expect(trackMarketingEvent).toHaveBeenCalledWith("demo_booking_cta_clicked", { placement: "industry_page", language: "sl" });
  });

  it("renders the English workflow on the English route", () => {
    const { container } = renderPage("en");
    const workflow = container.querySelector("#fitness-workflow") as HTMLElement;
    expect(within(workflow).getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent)).toEqual([
      "Set up your schedule", "Clients book a session", "Track visits and passes",
    ]);
    expect(screen.queryByText("Nastavite urnik")).not.toBeInTheDocument();
  });

  it.each(["sl", "en"] as const)("selects the redesigned page for the %s fitness URL", (language) => {
    renderPage(language, getRoutePath("fitnessPersonalTraining", language), true);
    expect(screen.queryByTestId("standard-industry")).not.toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it.each(["psychologyCounselling", "yogaPilates", "fitnessGroups"] as const)("leaves %s on its existing template", (routeKey) => {
    renderPage("sl", getRoutePath(routeKey, "sl"), true);
    expect(screen.getByTestId("standard-industry")).toBeInTheDocument();
    expect(screen.queryByText("Primerno za različne fitnes aktivnosti")).not.toBeInTheDocument();
  });
});
