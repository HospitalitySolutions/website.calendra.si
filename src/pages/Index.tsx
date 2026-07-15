import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";
import {
  AudienceSection,
  HomeFaq,
  HowItWorksSection,
  IntegrationsSection,
  PricingOverview,
  ProblemsAndOutcomes,
} from "@/components/landing/HomepageSections";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <Hero />
    <ProblemsAndOutcomes />
    <AudienceSection />
    <HowItWorksSection />
    <Features />
    <IntegrationsSection />
    <Testimonials />
    <PricingOverview />
    <HomeFaq />
    <FinalCta />
    <Footer />
  </div>
);

export default Index;
