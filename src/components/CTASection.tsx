import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            ¿Preparado/a para descubrir tus colores?
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Solo toma 2 minutos. Descubre la paleta que fue hecha para ti.
          </p>
          <button
            onClick={() => navigate("/questionnaire")}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-button text-primary-foreground font-medium text-lg shadow-medium hover:shadow-glow transition-all duration-300 hover:scale-105 active:scale-[0.98]"
          >
            Comenzar Ahora
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
