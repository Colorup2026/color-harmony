import { Lightbulb } from "lucide-react";

interface Props {
  explanation: string;
  tips: string[];
}

const ExplanationSection = ({ explanation, tips }: Props) => (
  <section className="py-12 px-6 bg-background">
    <div className="max-w-2xl mx-auto">
      <h3 className="font-display text-xl font-semibold text-foreground mb-4 text-center">¿Por Qué Estos Colores?</h3>
      <p className="text-muted-foreground text-sm leading-relaxed text-center mb-8 max-w-lg mx-auto">
        {explanation}
      </p>
      <div className="space-y-3">
        {tips.map((tip, i) => (
          <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-card shadow-soft animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <Lightbulb className="w-4 h-4 text-accent mt-0.5 shrink-0" />
            <p className="text-sm text-foreground">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ExplanationSection;
