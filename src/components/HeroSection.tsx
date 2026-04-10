import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-colors.jpg";

const FloatingPalette = () => (
  <div className="relative w-full max-w-sm mx-auto aspect-square">
    <div className="absolute inset-0 flex items-center justify-center">
      <img
        src={heroImage}
        alt="Color palette inspiration"
        className="w-full h-full object-cover rounded-2xl shadow-medium opacity-90"
      />
    </div>
    {/* Floating color dots */}
    <div className="absolute -top-4 -right-2 w-14 h-14 rounded-full bg-warm-peach shadow-soft animate-float" />
    <div className="absolute top-1/4 -left-4 w-10 h-10 rounded-full bg-warm-nude shadow-soft animate-float stagger-2" />
    <div className="absolute -bottom-2 right-1/4 w-12 h-12 rounded-full bg-warm-brown/30 shadow-soft animate-float stagger-3" />
    <div className="absolute bottom-1/3 -right-3 w-8 h-8 rounded-full bg-warm-cream shadow-soft animate-float stagger-4" />
  </div>
);

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-[90vh] flex items-center bg-gradient-hero relative overflow-hidden">
      {/* Subtle background orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-warm-peach/20 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-warm-nude/30 blur-3xl" />

      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Text */}
          <div className="text-center md:text-left order-2 md:order-1">
            <p className="text-muted-foreground font-body text-sm tracking-widest uppercase mb-4 animate-fade-in-up">
              AI-Powered Style
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6 animate-fade-in-up stagger-1">
              Discover Your{" "}
              <span className="text-gradient-warm">Perfect Colors</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8 max-w-lg mx-auto md:mx-0 animate-fade-in-up stagger-2">
              Based on your natural features, we reveal the colors that make you
              stand out. Unlock your personal palette in minutes.
            </p>
            <div className="animate-fade-in-up stagger-3">
              <button
                onClick={() => navigate("/questionnaire")}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-warm text-foreground font-medium text-lg shadow-medium hover:shadow-glow transition-all duration-300 hover:scale-105 active:scale-[0.98]"
              >
                Start Your Analysis
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Visual */}
          <div className="order-1 md:order-2 animate-fade-in-up stagger-2">
            <FloatingPalette />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
