import Navbar from "@/components/landing/Navbar";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

const PricingPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="pb-16 pt-8 md:pb-20 md:pt-10">
      <Pricing standalone />
    </main>
    <Footer />
  </div>
);

export default PricingPage;
