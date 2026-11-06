import Navbar from "@/components/landing/Navbar";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";
import "@/styles/pricing.css";

const PricingPage = () => {
  return (
    <div className="marketing-page pricing-page min-h-screen bg-background">
      <Navbar />
      <main>
        <Pricing standalone />
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
