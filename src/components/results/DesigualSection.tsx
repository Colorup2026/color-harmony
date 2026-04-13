import type { ChromaticProfile } from "@/lib/colorAnalysis";
import { getDesigualRecommendations, type DesigualProduct } from "@/lib/desigualCatalog";

interface Props {
  profile: ChromaticProfile;
  gender: string;
  style: string;
}

const DesigualSection = ({ profile, gender, style }: Props) => {
  const products = getDesigualRecommendations(profile, gender, style, 6);

  return (
    <section className="py-14 px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Inspirado en</p>
          <h3 className="font-display text-2xl font-semibold text-foreground mb-3">Desigual × Tu Paleta</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Prendas seleccionadas de Desigual que se alinean con tu análisis cromático, tu estilo y tu perfil.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Las recomendaciones se generan según tu temperatura ({profile.temperature}), intensidad ({profile.intensity}) y estilo ({style}).
        </p>
      </div>
    </section>
  );
};

const ProductCard = ({ product }: { product: DesigualProduct }) => (
  <div className="p-5 rounded-2xl bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 group">
    <div className="flex items-start justify-between mb-3">
      <span className="text-4xl group-hover:scale-110 transition-transform">{product.imageEmoji}</span>
      <span className="text-xs font-medium text-accent">{product.price}</span>
    </div>
    <h4 className="font-display text-sm font-semibold text-foreground mb-1">{product.name}</h4>
    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{product.description}</p>
    <div className="flex items-center gap-2">
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
    <div className="flex gap-1 mt-2 flex-wrap">
      <span className="text-[9px] px-2 py-0.5 rounded-full bg-secondary/30 text-foreground">{product.category}</span>
      <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/20 text-foreground capitalize">{product.gender}</span>
    </div>
  </div>
);

export default DesigualSection;
