const beforeColors = ["#808080", "#4A4A4A", "#696969", "#9E9E9E"];
const afterColors = ["#D4A574", "#C9956B", "#E8C5A0", "#B8845A"];

const WhyItMatters = () => {
  return (
    <section className="py-20 md:py-28 bg-warm-cream/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-warm-peach/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-muted-foreground font-body text-sm tracking-widest uppercase mb-3">
            The Power of Color
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground mb-6">
            Why It Matters
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Wearing the right colors can completely transform how you look and
            feel. The difference between looking washed out and radiant is often
            just a shade away.
          </p>
        </div>

        {/* Before / After concept */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Before */}
          <div className="rounded-2xl p-8 bg-background shadow-soft text-center">
            <p className="text-muted-foreground text-xs tracking-widest uppercase mb-6">
              Wrong Colors
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
              Dull, washed out, invisible
            </p>
          </div>

          {/* After */}
          <div className="rounded-2xl p-8 bg-gradient-card shadow-medium text-center ring-2 ring-warm-peach/30">
            <p className="text-foreground text-xs tracking-widest uppercase mb-6 font-medium">
              Your Perfect Colors ✨
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
              Vibrant, radiant, confident
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyItMatters;
