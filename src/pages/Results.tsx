import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, Share2, Mail } from "lucide-react";

// Simple palette generation based on features
const generatePalette = (skinTone: string, hairColor: string, eyeColor: string) => {
  const palettes: Record<string, { colors: { hex: string; name: string }[]; season: string; description: string }> = {
    warm: {
      season: "Warm Autumn",
      description: "Your warm undertones and rich features are perfectly complemented by earthy, golden tones. Think sunset shades and spiced warmth.",
      colors: [
        { hex: "#C9956B", name: "Warm Camel" },
        { hex: "#8B5E3C", name: "Rich Cognac" },
        { hex: "#D4A574", name: "Golden Sand" },
        { hex: "#A0522D", name: "Burnt Sienna" },
        { hex: "#E8C5A0", name: "Soft Honey" },
        { hex: "#6B4226", name: "Deep Espresso" },
        { hex: "#CC7722", name: "Amber Glow" },
        { hex: "#F5DEB3", name: "Wheat" },
      ],
    },
    cool: {
      season: "Cool Summer",
      description: "Your cool undertones shine brightest with soft, muted tones. Dusty roses, cool greys, and gentle lavenders bring out your natural glow.",
      colors: [
        { hex: "#B0A4C7", name: "Soft Lavender" },
        { hex: "#8E7BA4", name: "Dusty Mauve" },
        { hex: "#A8B5C2", name: "Cool Slate" },
        { hex: "#D4A5A5", name: "Dusty Rose" },
        { hex: "#7BA17C", name: "Sage Green" },
        { hex: "#6CA0DC", name: "Powder Blue" },
        { hex: "#C4B7A6", name: "Greige" },
        { hex: "#9B8CA0", name: "Plum Mist" },
      ],
    },
    neutral: {
      season: "Soft Natural",
      description: "Your balanced features work beautifully with a versatile palette. Soft neutrals and muted earth tones keep you looking effortlessly elegant.",
      colors: [
        { hex: "#C4A77D", name: "Warm Beige" },
        { hex: "#A0785A", name: "Toasted Almond" },
        { hex: "#8B8B83", name: "Soft Olive" },
        { hex: "#D2B48C", name: "Tan" },
        { hex: "#BDB76B", name: "Dark Khaki" },
        { hex: "#BC8F8F", name: "Rosy Brown" },
        { hex: "#7B8D6E", name: "Moss" },
        { hex: "#C9B89E", name: "Sand Dune" },
      ],
    },
  };

  // Simplified logic
  const warmSkins = ["tan", "medium", "olive"];
  const coolSkins = ["fair", "light"];
  const warmHair = ["blonde", "red", "light-brown"];
  const coolHair = ["black", "grey"];

  let warmScore = 0;
  if (warmSkins.includes(skinTone)) warmScore++;
  if (warmHair.includes(hairColor)) warmScore++;
  if (["hazel", "brown"].includes(eyeColor)) warmScore++;
  if (coolSkins.includes(skinTone)) warmScore--;
  if (coolHair.includes(hairColor)) warmScore--;
  if (["blue", "grey", "green"].includes(eyeColor)) warmScore--;

  if (warmScore > 0) return palettes.warm;
  if (warmScore < 0) return palettes.cool;
  return palettes.neutral;
};

const outfitSuggestions = [
  { label: "Casual", pieces: ["Linen shirt", "Chinos", "Sneakers"] },
  { label: "Smart", pieces: ["Blazer", "Turtleneck", "Tailored trousers"] },
  { label: "Weekend", pieces: ["Knit sweater", "Denim", "Boots"] },
];

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state as { name: string; email: string; skinTone: string; hairColor: string; eyeColor: string } | null;

  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Navbar />
        <div className="text-center pt-16">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-4">No results yet</h2>
          <p className="text-muted-foreground mb-6">Take the quiz to discover your colors!</p>
          <button
            onClick={() => navigate("/questionnaire")}
            className="px-8 py-3 rounded-full bg-gradient-warm text-foreground font-medium shadow-soft hover:shadow-medium transition-all"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  const palette = generatePalette(formData.skinTone, formData.hairColor, formData.eyeColor);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      <main className="pt-16">
        {/* Header */}
        <section className="py-16 md:py-20 text-center px-6 relative overflow-hidden">
          <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-warm-peach/15 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-72 h-72 rounded-full bg-warm-nude/20 blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warm-peach/20 text-foreground text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Your results are ready
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
              {formData.name ? `${formData.name}, you're a` : "You're a"}
            </h1>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-gradient-warm mb-6">
              {palette.season}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-lg mx-auto">
              {palette.description}
            </p>
          </div>
        </section>

        {/* Color Palette */}
        <section className="pb-16 px-6">
          <div className="max-w-2xl mx-auto">
            <h3 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
              Your Personal Palette
            </h3>
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {palette.colors.map((color, i) => (
                <div
                  key={i}
                  className="group text-center animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div
                    className="aspect-square rounded-2xl shadow-soft mb-2 transition-all duration-300 group-hover:shadow-medium group-hover:scale-105"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-xs text-muted-foreground">{color.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Outfit Suggestions */}
        <section className="py-16 px-6 bg-background">
          <div className="max-w-2xl mx-auto">
            <h3 className="font-display text-xl font-semibold text-foreground mb-8 text-center">
              Outfit Ideas For You
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {outfitSuggestions.map((outfit) => (
                <div
                  key={outfit.label}
                  className="p-6 rounded-2xl bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300"
                >
                  <h4 className="font-display text-lg font-semibold text-foreground mb-3">
                    {outfit.label}
                  </h4>
                  <ul className="space-y-2">
                    {outfit.pieces.map((piece) => (
                      <li key={piece} className="text-muted-foreground text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-warm-peach" />
                        {piece}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-warm-cream/30" />
          <div className="relative z-10 max-w-md mx-auto">
            <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
              Get Your Full Report
            </h3>
            <p className="text-muted-foreground text-sm mb-8">
              We'll send your complete color analysis to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-warm text-foreground font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105">
                <Mail className="w-4 h-4" />
                Send My Results
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-warm-peach transition-all duration-300">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
