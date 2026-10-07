import { lazy, Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import TestimonialsSsr from "@/components/landing/Testimonials";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";
import CalendraConnectPromoSsr from "@/components/landing/CalendraConnectPromo";
import "@/styles/homepage.css";
import {
  AudienceSection,
  HomeFaq,
  IntegrationsSection,
  PricingOverview,
} from "@/components/landing/HomepageSections";

/**
 * Below-fold sections are code-split on the client while staying statically
 * imported for SSR, so the prerendered HTML still contains their full copy for
 * crawlers while the browser does not parse their JavaScript to paint the hero.
 * Keep interactive reviews and the Connect preview below the initial page
 * bundle. The audience carousel remains available immediately.
 */
const Testimonials = import.meta.env.SSR
  ? TestimonialsSsr
  : lazy(() => import("@/components/landing/Testimonials"));
const CalendraConnectPromo = import.meta.env.SSR
  ? CalendraConnectPromoSsr
  : lazy(() => import("@/components/landing/CalendraConnectPromo"));

/** Height-reserving placeholder, so a lazy section cannot shift what is below it. */
const SectionFallback = ({ minHeight }: { minHeight: number }) => (
  <div style={{ minHeight }} className="bg-background" aria-hidden="true" />
);

const Index = () => (
  <div className="marketing-page homepage min-h-screen">
    <Navbar />
    <Hero />
    <AudienceSection />
    <PricingOverview />
    <Suspense fallback={<SectionFallback minHeight={640} />}>
      <Testimonials />
    </Suspense>
    <Features />
    <IntegrationsSection />
    <Suspense fallback={<SectionFallback minHeight={520} />}>
      <CalendraConnectPromo />
    </Suspense>
    <HomeFaq />
    <FinalCta />
    <Footer />
  </div>
);

export default Index;
