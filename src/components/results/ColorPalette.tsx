import type { ColorRecommendation } from "@/lib/colorAnalysis";

interface Props {
  title: string;
  colors: ColorRecommendation[];
  variant?: "recommended" | "avoid";
}

const ColorPalette = ({ title, colors, variant = "recommended" }: Props) => (
  <section className="py-10 px-6">
    <div className="max-w-2xl mx-auto">
      <h3 className="font-display text-xl font-semibold text-foreground mb-6 text-center">{title}</h3>
      <div className={`grid ${variant === "avoid" ? "grid-cols-4" : "grid-cols-5"} gap-3`}>
        {colors.map((color, i) => (
          <div
            key={i}
            className="group text-center animate-fade-in-up"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div
              className={`aspect-square rounded-2xl shadow-soft mb-2 transition-all duration-300 group-hover:shadow-medium group-hover:scale-105 ${
                variant === "avoid" ? "opacity-70 ring-1 ring-destructive/20" : ""
              }`}
              style={{ backgroundColor: color.hex }}
            />
            <p className="text-[10px] text-muted-foreground leading-tight">{color.name}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ColorPalette;
