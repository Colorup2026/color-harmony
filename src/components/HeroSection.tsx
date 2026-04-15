import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-[90vh] flex items-center bg-gradient-hero relative overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-secondary/10 blur-3xl" />

      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-muted-foreground font-body text-sm tracking-widest uppercase mb-4 animate-fade-in-up">
            Tu asesora de color con IA
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6 animate-fade-in-up stagger-1">
            Descubre tus colores{" "}
            <span className="text-gradient-rainbow">y tu estilo ideal</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto animate-fade-in-up stagger-2">
            Analizamos tus rasgos y estilo para recomendarte lo que realmente te favorece.
          </p>
          <div className="animate-fade-in-up stagger-3">
            <button
              onClick={() => navigate("/questionnaire")}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-button text-primary-foreground font-medium text-lg shadow-medium hover:shadow-glow transition-all duration-300 hover:scale-105 active:scale-[0.98]"
            >
              Empieza tu análisis
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
