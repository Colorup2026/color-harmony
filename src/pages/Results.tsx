import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileSummary from "@/components/results/ProfileSummary";
import ColorPalette from "@/components/results/ColorPalette";
import ExplanationSection from "@/components/results/ExplanationSection";
import ClothingSuggestions from "@/components/results/ClothingSuggestions";
import DesigualSection from "@/components/results/DesigualSection";
import { analyzeUser, type UserProfile } from "@/lib/colorAnalysis";
import { Sparkles, Share2, Mail, ArrowRight } from "lucide-react";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state as UserProfile | null;

  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Navbar />
        <div className="text-center pt-16">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Aún no hay resultados</h2>
          <p className="text-muted-foreground mb-6">¡Haz el quiz para descubrir tus colores!</p>
          <button
            onClick={() => navigate("/questionnaire")}
            className="px-8 py-3 rounded-full bg-gradient-warm text-foreground font-medium shadow-soft hover:shadow-medium transition-all"
          >
            Comenzar Quiz
          </button>
        </div>
      </div>
    );
  }

  const result = analyzeUser(formData);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-16 md:py-20 text-center px-6 relative overflow-hidden">
          <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-secondary/15 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-foreground text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Tu análisis está listo
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
              {formData.name ? `${formData.name}, eres` : "Eres"}
            </h1>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-gradient-warm mb-6">
              {result.profile.season}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-lg mx-auto">
              Un perfil <span className="capitalize">{result.profile.temperature}</span>, <span className="capitalize">{result.profile.intensity}</span> y <span className="capitalize">{result.profile.depth}</span> que define tu armonía cromática personal.
            </p>
          </div>
        </section>

        <ProfileSummary
          name={formData.name}
          profile={result.profile}
          gender={formData.gender}
          style={formData.style}
        />

        <ColorPalette title="Colores Que Te Favorecen" colors={result.recommendedColors} variant="recommended" />

        <ColorPalette title="Colores a Usar con Moderación" colors={result.avoidColors} variant="avoid" />

        <ExplanationSection explanation={result.explanation} tips={result.tips} />

        <ClothingSuggestions profile={result.profile} style={formData.style} gender={formData.gender} />

        <DesigualSection profile={result.profile} gender={formData.gender} style={formData.style} />

        {/* CTA */}
        <section className="py-16 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-secondary/10" />
          <div className="relative z-10 max-w-md mx-auto">
            <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
              Obtén Tu Reporte Completo
            </h3>
            <p className="text-muted-foreground text-sm mb-8">
              Te enviaremos tu análisis cromático completo, tu paleta y las recomendaciones a tu correo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-warm text-foreground font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105">
                <Mail className="w-4 h-4" />
                Enviar Mis Resultados
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-accent transition-all duration-300">
                <Share2 className="w-4 h-4" />
                Compartir
              </button>
            </div>
            <button
              onClick={() => navigate("/questionnaire")}
              className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Repetir el análisis
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
