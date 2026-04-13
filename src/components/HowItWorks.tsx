import { Camera, MessageCircle, Palette } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Sube Tu Foto",
    description: "Comparte un selfie claro para analizar tus rasgos naturales.",
    step: "01",
  },
  {
    icon: MessageCircle,
    title: "Responde Preguntas",
    description: "Cuéntanos sobre tu tono de piel, color de cabello y ojos.",
    step: "02",
  },
  {
    icon: Palette,
    title: "Obtén Tu Paleta",
    description: "Recibe una paleta de colores personalizada hecha para ti.",
    step: "03",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-muted-foreground font-body text-sm tracking-widest uppercase mb-3">
            Proceso Simple
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground">
            Cómo Funciona
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.step}
              className="group relative text-center p-8 rounded-2xl bg-gradient-card hover:shadow-medium transition-all duration-500 hover:-translate-y-1"
            >
              <span className="absolute top-4 right-6 text-5xl font-display font-bold text-warm-peach/30">
                {step.step}
              </span>
              <div className="w-16 h-16 rounded-2xl bg-gradient-warm flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-500">
                <step.icon className="w-7 h-7 text-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
