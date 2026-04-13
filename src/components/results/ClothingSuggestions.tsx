import type { ChromaticProfile } from "@/lib/colorAnalysis";

interface Props {
  profile: ChromaticProfile;
  style: string;
  gender: string;
}

interface Outfit {
  label: string;
  pieces: string[];
  occasion: string;
}

function getOutfits(profile: ChromaticProfile, style: string, gender: string): Outfit[] {
  const isFeminine = gender === "mujer";
  const isMasculine = gender === "hombre";
  const warm = profile.temperature === "cálido";
  const cool = profile.temperature === "frío";

  const base: Outfit[] = [];

  if (isFeminine || gender === "neutro") {
    if (warm) {
      base.push(
        { label: "Look Diario", pieces: ["Blusa terracota", "Jeans claros", "Sandalias doradas", "Bolso camel"], occasion: "Día a día" },
        { label: "Look de Noche", pieces: ["Vestido en tono miel", "Tacones nude", "Pendientes dorados", "Clutch ámbar"], occasion: "Cenas y eventos" },
        { label: "Look Profesional", pieces: ["Blazer caramelo", "Pantalón beige", "Blusa crema", "Zapatos tostados"], occasion: "Oficina" },
      );
    } else if (cool) {
      base.push(
        { label: "Look Diario", pieces: ["Camiseta lavanda", "Jeans oscuros", "Sneakers blancas", "Bolso gris"], occasion: "Día a día" },
        { label: "Look de Noche", pieces: ["Vestido azul marino", "Tacones plateados", "Pendientes de plata", "Clutch borgoña"], occasion: "Cenas y eventos" },
        { label: "Look Profesional", pieces: ["Blazer gris azulado", "Pantalón negro", "Blusa lila", "Zapatos negros"], occasion: "Oficina" },
      );
    } else {
      base.push(
        { label: "Look Diario", pieces: ["Camiseta verde sage", "Jeans medio", "Tenis beige", "Bolso topo"], occasion: "Día a día" },
        { label: "Look de Noche", pieces: ["Vestido malva", "Tacones nude", "Pendientes minimalistas", "Clutch rosa antiguo"], occasion: "Cenas y eventos" },
        { label: "Look Profesional", pieces: ["Blazer greige", "Pantalón oliva", "Blusa crema", "Zapatos piedra"], occasion: "Oficina" },
      );
    }
  }

  if (isMasculine || gender === "neutro") {
    if (warm) {
      base.push(
        { label: "Look Casual", pieces: ["Camiseta camel", "Chinos oliva", "Zapatillas arena", "Reloj dorado"], occasion: "Día a día" },
        { label: "Look Elegante", pieces: ["Camisa terracota", "Pantalón marrón", "Mocasines caramelo", "Cinturón cuero"], occasion: "Eventos" },
        { label: "Look Urbano", pieces: ["Hoodie ocre", "Joggers caqui", "Sneakers blancas", "Gorra arena"], occasion: "Fin de semana" },
      );
    } else if (cool) {
      base.push(
        { label: "Look Casual", pieces: ["Camiseta azul acero", "Jeans oscuros", "Sneakers grises", "Reloj plateado"], occasion: "Día a día" },
        { label: "Look Elegante", pieces: ["Camisa azul marino", "Pantalón carbón", "Zapatos negros", "Cinturón negro"], occasion: "Eventos" },
        { label: "Look Urbano", pieces: ["Sudadera grafito", "Joggers negros", "Sneakers negras", "Gorra oscura"], occasion: "Fin de semana" },
      );
    } else {
      base.push(
        { label: "Look Casual", pieces: ["Camiseta verde musgo", "Chinos piedra", "Zapatillas beige", "Reloj minimal"], occasion: "Día a día" },
        { label: "Look Elegante", pieces: ["Camisa greige", "Pantalón topo", "Zapatos marrones", "Cinturón cuero"], occasion: "Eventos" },
        { label: "Look Urbano", pieces: ["Sudadera avena", "Joggers oliva", "Sneakers blancas", "Mochila arena"], occasion: "Fin de semana" },
      );
    }
  }

  return base.slice(0, 3);
}

const ClothingSuggestions = ({ profile, style, gender }: Props) => {
  const outfits = getOutfits(profile, style, gender);

  return (
    <section className="py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2 text-center">
          Looks Sugeridos Para Ti
        </h3>
        <p className="text-muted-foreground text-sm mb-8 text-center">
          Combinaciones pensadas para tu perfil cromático y estilo
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {outfits.map((outfit) => (
            <div key={outfit.label} className="p-6 rounded-2xl bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300">
              <h4 className="font-display text-lg font-semibold text-foreground mb-1">{outfit.label}</h4>
              <p className="text-[10px] text-muted-foreground mb-4 uppercase tracking-wider">{outfit.occasion}</p>
              <ul className="space-y-2">
                {outfit.pieces.map((piece) => (
                  <li key={piece} className="text-muted-foreground text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {piece}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClothingSuggestions;
