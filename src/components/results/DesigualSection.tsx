import type { ChromaticProfile } from "@/lib/colorAnalysis";
import { getDesigualRecommendations, type DesigualProduct } from "@/lib/desigualCatalog";
import { ExternalLink } from "lucide-react";

interface Props {
  profile: ChromaticProfile;
  gender: string;
  style: string;
}

const DesigualSection = ({ profile, gender, style }: Props) => {
  const products = getDesigualRecommendations(profile, gender, style, 6);

  return (
    <section className="py-14 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Inspirado en</p>
          <h3 className="font-display text-2xl font-semibold text-foreground mb-3">Desigual × Tu Paleta</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Prendas de Desigual seleccionadas para tu perfil cromático, tu estilo y tu género. Cada recomendación está justificada por tu análisis.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Recomendaciones basadas en tu temperatura ({profile.temperature}), intensidad ({profile.intensity}) y estilo ({style}).
          Los links te llevan a las categorías correspondientes en Desigual.
        </p>
      </div>
    </section>
  );
};

const ProductCard = ({ product }: { product: DesigualProduct }) => (
  <div className="p-5 rounded-2xl bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 group flex flex-col">
    <div className="flex items-start justify-between mb-3">
      <span className="text-4xl group-hover:scale-110 transition-transform">{product.imageEmoji}</span>
      <span className="text-xs font-medium text-accent">{product.price}</span>
    </div>
    <h4 className="font-display text-sm font-semibold text-foreground mb-1">{product.name}</h4>
    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{product.description}</p>
    
    {/* Why it fits */}
    <div className="mb-3 p-2.5 rounded-lg bg-background/60">
      <p className="text-[10px] uppercase tracking-wider text-accent mb-1 font-medium">Por qué te favorece</p>
      <p className="text-xs text-foreground leading-relaxed">{product.whyItFits}</p>
    </div>

    {/* How to wear */}
    <div className="mb-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Cómo combinarlo</p>
      <p className="text-xs text-muted-foreground leading-relaxed">{product.howToWear}</p>
    </div>

    {/* Colors */}
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[10px] text-muted-foreground">Colores:</span>
      <div className="flex gap-1">
        {product.colors.map((hex, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full border border-border"
            style={{ backgroundColor: hex }}
          />
        ))}
      </div>
    </div>

    {/* Tags */}
    <div className="flex gap-1 mb-3 flex-wrap">
      <span className="text-[9px] px-2 py-0.5 rounded-full bg-secondary/30 text-foreground">{product.category}</span>
      <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/20 text-foreground capitalize">{product.gender}</span>
      <span className="text-[9px] px-2 py-0.5 rounded-full bg-accent/20 text-foreground">{product.occasion}</span>
    </div>

    {/* CTA Button */}
    <a
      href={product.categoryUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-warm text-foreground text-xs font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02]"
    >
      Ver en Desigual
      <ExternalLink className="w-3 h-3" />
    </a>
  </div>
);

export default DesigualSection;
