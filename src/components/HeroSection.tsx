import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[92vh] flex items-center bg-gradient-hero overflow-hidden">
      {/* Editorial ambient blobs */}
      <div className="absolute -top-20 -left-20 w-[28rem] h-[28rem] rounded-full bg-accent/40 blur-3xl animate-float" />
      <div className="absolute bottom-0 -right-24 w-[32rem] h-[32rem] rounded-full bg-secondary/40 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
      <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />

      <div className="container relative z-10 mx-auto px-6 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-foreground/80 text-xs tracking-widest uppercase mb-8 animate-fade-in-up">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Asesoría de color con IA
          </div>

          <h1 className="font-display text-[2.75rem] sm:text-6xl lg:text-7xl font-medium text-foreground leading-[1.05] mb-8 animate-fade-in-up stagger-1">
            Descubre los colores
            <br />
            <span className="italic text-gradient-editorial">que te hacen brillar</span>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-12 max-w-xl mx-auto animate-fade-in-up stagger-2">
            Analizamos tu rostro y tus rasgos para revelarte una paleta única,
            prendas y un estilo hecho para ti.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3">
            <button
              onClick={() => navigate("/questionnaire")}
              className="group inline-flex items-center gap-2 px-10 py-4 rounded-full bg-foreground text-background font-medium text-base shadow-medium hover:shadow-editorial transition-all duration-500 hover:scale-[1.03] active:scale-[0.98]"
            >
              Empieza tu análisis
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <p className="text-xs text-muted-foreground tracking-wide">
              Gratis · 2 minutos · Sin registro
            </p>
          </div>

          {/* Trust strip */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80 animate-fade-in-up stagger-4">
            <span>Colorimetría personal</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <span>IA Visual</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <span>Estilismo editorial</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
