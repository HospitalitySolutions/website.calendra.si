import { lazy, Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import TestimonialsSsr from "@/components/landing/Testimonials";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";
import CalendraConnectPromoSsr from "@/components/landing/CalendraConnectPromo";
import ItServicesPromoSsr from "@/components/landing/ItServicesPromo";
import {
  AudienceSection,
  HomeFaq,
  PricingOverview,
} from "@/components/landing/HomepageSections";

/**
 * Below-fold sections are code-split on the client while staying statically
 * imported for SSR, so the prerendered HTML still contains their full copy for
 * crawlers while the browser does not parse their JavaScript to paint the hero.
 * Testimonials is here because it is the only homepage section that pulls in a
 * carousel library.
 */
const Testimonials = import.meta.env.SSR
  ? TestimonialsSsr
  : lazy(() => import("@/components/landing/Testimonials"));
const CalendraConnectPromo = import.meta.env.SSR
  ? CalendraConnectPromoSsr
  : lazy(() => import("@/components/landing/CalendraConnectPromo"));
const ItServicesPromo = import.meta.env.SSR
  ? ItServicesPromoSsr
  : lazy(() => import("@/components/landing/ItServicesPromo"));

/** Height-reserving placeholder, so a lazy section cannot shift what is below it. */
const SectionFallback = ({ minHeight }: { minHeight: number }) => (
  <div style={{ minHeight }} className="bg-background" aria-hidden="true" />
);

const Index = () => (
  <div className="marketing-page min-h-screen">
    <Navbar />
    <Hero />
    <AudienceSection />
    <PricingOverview />
    <Suspense fallback={<SectionFallback minHeight={640} />}>
      <Testimonials />
    </Suspense>
    <Features />
    <Suspense fallback={<SectionFallback minHeight={520} />}>
      <CalendraConnectPromo />
    </Suspense>
    <Suspense fallback={<SectionFallback minHeight={520} />}>
      <ItServicesPromo />
    </Suspense>
    <HomeFaq />
    <FinalCta />
    <Footer />
  </div>
);

export default Index;
