import { lazy, Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";
import CalendraConnectPromoSsr from "@/components/landing/CalendraConnectPromo";
import ItServicesPromoSsr from "@/components/landing/ItServicesPromo";
import {
  AudienceSection,
  HomeFaq,
  PricingOverview,
  ProblemsAndOutcomes,
} from "@/components/landing/HomepageSections";

const CalendraConnectPromo = import.meta.env.SSR
  ? CalendraConnectPromoSsr
  : lazy(() => import("@/components/landing/CalendraConnectPromo"));
const ItServicesPromo = import.meta.env.SSR
  ? ItServicesPromoSsr
  : lazy(() => import("@/components/landing/ItServicesPromo"));

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <Hero />
    <ProblemsAndOutcomes />
    <AudienceSection />
    <PricingOverview />
    <Testimonials />
    <Features />
    <Suspense fallback={<div className="min-h-[520px] bg-background" aria-hidden="true" />}>
      <CalendraConnectPromo />
    </Suspense>
    <Suspense fallback={<div className="min-h-[520px] bg-background" aria-hidden="true" />}>
      <ItServicesPromo />
    </Suspense>
    <HomeFaq />
    <FinalCta />
    <Footer />
  </div>
);

export default Index;
