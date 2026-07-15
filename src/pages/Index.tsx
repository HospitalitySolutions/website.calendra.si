import { lazy, Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import PricingSsr from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

// Keep the complete pricing content in prerendered HTML for search engines,
// but defer its interactive calculator code in the browser until the homepage
// route has loaded.
const Pricing = import.meta.env.SSR ? PricingSsr : lazy(() => import("@/components/landing/Pricing"));

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <Hero />
    <Features />
    <Testimonials />
    <Suspense fallback={<section id="cenik" className="min-h-[720px] bg-card" aria-hidden="true" />}>
      <Pricing />
    </Suspense>
    <Footer />
  </div>
);

export default Index;
