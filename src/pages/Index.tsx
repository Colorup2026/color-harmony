import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import WhyItMatters from "@/components/WhyItMatters";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-screen">
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <HowItWorks />
        <WhyItMatters />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
