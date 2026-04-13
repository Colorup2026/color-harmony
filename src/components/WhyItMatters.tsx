const beforeColors = ["#808080", "#4A4A4A", "#696969", "#9E9E9E"];
const afterColors = ["#CDB4DB", "#FFC8DD", "#FFAFCC", "#A2D2FF"];

const WhyItMatters = () => {
  return (
    <section className="py-20 md:py-28 bg-warm-cream/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-warm-peach/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-muted-foreground font-body text-sm tracking-widest uppercase mb-3">
            El Poder del Color
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-6">
            Por Qué Importa
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Usar los colores correctos puede transformar completamente cómo te
            ves y cómo te sientes. La diferencia entre verte apagado/a y
            radiante está a solo un tono de distancia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="rounded-2xl p-8 bg-background shadow-soft text-center">
            <p className="text-muted-foreground text-xs tracking-widest uppercase mb-6">
              Colores Incorrectos
            </p>
            <div className="flex gap-3 justify-center mb-6">
              {beforeColors.map((color, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-xl shadow-sm transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <p className="text-muted-foreground text-sm">
              Apagado, sin vida, invisible
            </p>
          </div>

          <div className="rounded-2xl p-8 bg-gradient-card shadow-medium text-center ring-2 ring-warm-peach/30">
            <p className="text-foreground text-xs tracking-widest uppercase mb-6 font-medium">
              Tus Colores Perfectos ✨
            </p>
            <div className="flex gap-3 justify-center mb-6">
              {afterColors.map((color, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-xl shadow-sm transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <p className="text-foreground text-sm font-medium">
              Vibrante, radiante, con confianza
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyItMatters;
