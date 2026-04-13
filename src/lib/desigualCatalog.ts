// Desigual-inspired product catalog with gender/palette/style filtering

import type { ChromaticProfile } from "./colorAnalysis";

export interface DesigualProduct {
  id: string;
  name: string;
  description: string;
  colors: string[]; // hex colors present in the garment
  imageEmoji: string; // visual placeholder
  price: string;
  gender: "mujer" | "hombre" | "unisex";
  style: string[]; // casual, elegante, streetwear, etc.
  temperatureMatch: ("cálido" | "frío" | "neutro")[];
  intensityMatch: ("suave" | "intenso")[];
  category: string;
}

const catalog: DesigualProduct[] = [
  // MUJER — Cálidos
  { id: "w1", name: "Vestido Floral Terracota", description: "Vestido midi con estampado floral en tonos tierra y naranja cálido. Perfecto para resaltar subtonos dorados.", colors: ["#D2691E", "#CD853F", "#556B2F"], imageEmoji: "👗", price: "89,95€", gender: "mujer", style: ["casual", "bohemio"], temperatureMatch: ["cálido"], intensityMatch: ["suave", "intenso"], category: "Vestidos" },
  { id: "w2", name: "Blusa Bordada Dorada", description: "Blusa con bordados artesanales en tonos dorados y ámbar. Elegancia con calidez.", colors: ["#DAA520", "#C9956B", "#F5DEB3"], imageEmoji: "👚", price: "69,95€", gender: "mujer", style: ["elegante", "bohemio"], temperatureMatch: ["cálido"], intensityMatch: ["suave"], category: "Blusas" },
  { id: "w3", name: "Falda Midi Canela", description: "Falda plisada en tono canela con detalles geométricos. Versátil y favorecedora.", colors: ["#A67B5B", "#D4A373"], imageEmoji: "🩳", price: "59,95€", gender: "mujer", style: ["elegante", "clasico"], temperatureMatch: ["cálido"], intensityMatch: ["suave"], category: "Faldas" },
  { id: "w4", name: "Chaqueta Oversize Ocre", description: "Chaqueta oversize en ocre con detalles étnicos. Presencia cálida e impactante.", colors: ["#CC7722", "#8B4513", "#DAA520"], imageEmoji: "🧥", price: "129,95€", gender: "mujer", style: ["streetwear", "casual"], temperatureMatch: ["cálido"], intensityMatch: ["intenso"], category: "Chaquetas" },

  // MUJER — Fríos
  { id: "w5", name: "Vestido Azul Noche", description: "Vestido ajustado en azul marino con detalles en plata. Sofisticación fría y elegante.", colors: ["#191970", "#B0C4DE"], imageEmoji: "👗", price: "99,95€", gender: "mujer", style: ["elegante", "clasico"], temperatureMatch: ["frío"], intensityMatch: ["intenso"], category: "Vestidos" },
  { id: "w6", name: "Blusa Lila Empolvado", description: "Blusa fluida en lila suave con mangas abullonadas. Romanticismo en tonos fríos.", colors: ["#D8BFD8", "#DDA0DD"], imageEmoji: "👚", price: "49,95€", gender: "mujer", style: ["casual", "bohemio"], temperatureMatch: ["frío"], intensityMatch: ["suave"], category: "Blusas" },
  { id: "w7", name: "Pantalón Wide Leg Borgoña", description: "Pantalón de corte amplio en borgoña profundo. Elegancia con carácter.", colors: ["#800020", "#4B0082"], imageEmoji: "👖", price: "79,95€", gender: "mujer", style: ["elegante", "clasico"], temperatureMatch: ["frío"], intensityMatch: ["intenso"], category: "Pantalones" },
  { id: "w8", name: "Cárdigan Salvia Suave", description: "Cárdigan largo en verde salvia con textura de punto. Confort en tonos fríos.", colors: ["#8FBC8F", "#778899"], imageEmoji: "🧥", price: "69,95€", gender: "mujer", style: ["casual", "minimalista"], temperatureMatch: ["frío"], intensityMatch: ["suave"], category: "Chaquetas" },

  // MUJER — Neutros
  { id: "w9", name: "Vestido Camisero Greige", description: "Vestido camisero en greige con cinturón. Versatilidad equilibrada.", colors: ["#C4B7A6", "#B5A8A0"], imageEmoji: "👗", price: "79,95€", gender: "mujer", style: ["clasico", "minimalista"], temperatureMatch: ["neutro", "cálido", "frío"], intensityMatch: ["suave"], category: "Vestidos" },
  { id: "w10", name: "Top Estampado Malva", description: "Top con estampado abstracto en malva y rosa antiguo. Versatilidad cromática.", colors: ["#C8A2C8", "#C9ADA7"], imageEmoji: "👚", price: "39,95€", gender: "mujer", style: ["casual", "bohemio"], temperatureMatch: ["neutro"], intensityMatch: ["suave"], category: "Blusas" },

  // HOMBRE — Cálidos
  { id: "h1", name: "Camisa Lino Terracota", description: "Camisa de lino en tono terracota con cuello mao. Calidez mediterránea.", colors: ["#CD853F", "#D2691E"], imageEmoji: "👔", price: "69,95€", gender: "hombre", style: ["casual", "bohemio"], temperatureMatch: ["cálido"], intensityMatch: ["suave", "intenso"], category: "Camisas" },
  { id: "h2", name: "Polo Ocre Bordado", description: "Polo de algodón en ocre con bordado discreto. Casual elegante en tonos cálidos.", colors: ["#CC7722", "#DAA520"], imageEmoji: "👕", price: "49,95€", gender: "hombre", style: ["casual", "clasico"], temperatureMatch: ["cálido"], intensityMatch: ["intenso"], category: "Polos" },
  { id: "h3", name: "Chaqueta Bomber Camel", description: "Bomber en tono camel con detalles en ante. Urbano y cálido.", colors: ["#C9956B", "#A67B5B", "#8B6F47"], imageEmoji: "🧥", price: "119,95€", gender: "hombre", style: ["streetwear", "casual"], temperatureMatch: ["cálido"], intensityMatch: ["suave"], category: "Chaquetas" },
  { id: "h4", name: "Pantalón Chino Oliva", description: "Chino slim fit en verde oliva. Base cálida para cualquier look.", colors: ["#556B2F", "#6B8E23"], imageEmoji: "👖", price: "59,95€", gender: "hombre", style: ["casual", "clasico"], temperatureMatch: ["cálido"], intensityMatch: ["suave", "intenso"], category: "Pantalones" },

  // HOMBRE — Fríos
  { id: "h5", name: "Camisa Azul Petróleo", description: "Camisa slim en azul petróleo con acabado satinado. Sofisticación fría.", colors: ["#2C3E50", "#36454F"], imageEmoji: "👔", price: "59,95€", gender: "hombre", style: ["elegante", "clasico"], temperatureMatch: ["frío"], intensityMatch: ["intenso"], category: "Camisas" },
  { id: "h6", name: "Jersey Gris Azulado", description: "Jersey de punto fino en gris azulado. Elegancia fría y minimalista.", colors: ["#778899", "#B0C4DE"], imageEmoji: "🧶", price: "69,95€", gender: "hombre", style: ["clasico", "minimalista"], temperatureMatch: ["frío"], intensityMatch: ["suave"], category: "Jerseys" },
  { id: "h7", name: "Blazer Azul Marino", description: "Blazer desestructurado en azul marino con forro estampado. Impacto frío y definido.", colors: ["#191970", "#000080"], imageEmoji: "🧥", price: "149,95€", gender: "hombre", style: ["elegante", "clasico"], temperatureMatch: ["frío"], intensityMatch: ["intenso"], category: "Chaquetas" },
  { id: "h8", name: "Camiseta Esmeralda", description: "Camiseta de algodón orgánico en verde esmeralda. Frescura con profundidad.", colors: ["#2E8B57", "#1B4332"], imageEmoji: "👕", price: "29,95€", gender: "hombre", style: ["casual", "streetwear"], temperatureMatch: ["frío", "neutro"], intensityMatch: ["intenso"], category: "Camisetas" },

  // HOMBRE — Neutros
  { id: "h9", name: "Camisa Estampada Topo", description: "Camisa con estampado paisley en tonos topo y piedra. Equilibrio versátil.", colors: ["#B5A8A0", "#A89F91"], imageEmoji: "👔", price: "59,95€", gender: "hombre", style: ["casual", "bohemio"], temperatureMatch: ["neutro"], intensityMatch: ["suave"], category: "Camisas" },
  { id: "h10", name: "Sudadera Grafito", description: "Sudadera oversize en grafito con logo bordado. Urbano y neutro.", colors: ["#36454F", "#2F2F2F"], imageEmoji: "👕", price: "59,95€", gender: "hombre", style: ["streetwear", "casual"], temperatureMatch: ["neutro", "frío"], intensityMatch: ["intenso"], category: "Sudaderas" },

  // UNISEX
  { id: "u1", name: "Hoodie Oversize Arena", description: "Hoodie unisex oversize en tono arena con estampado artístico. Confort cálido.", colors: ["#D4A373", "#C9B89E"], imageEmoji: "👕", price: "79,95€", gender: "unisex", style: ["streetwear", "casual"], temperatureMatch: ["cálido", "neutro"], intensityMatch: ["suave"], category: "Sudaderas" },
  { id: "u2", name: "Camiseta Oversize Lavanda", description: "Camiseta unisex en lavanda suave con gráfico abstracto. Frescura versátil.", colors: ["#D8BFD8", "#B0C4DE"], imageEmoji: "👕", price: "35,95€", gender: "unisex", style: ["casual", "streetwear"], temperatureMatch: ["frío", "neutro"], intensityMatch: ["suave"], category: "Camisetas" },
  { id: "u3", name: "Chaqueta Denim Artística", description: "Chaqueta vaquera con parches artísticos multicolor. Expresión libre de género.", colors: ["#4682B4", "#CD5C5C", "#DAA520"], imageEmoji: "🧥", price: "109,95€", gender: "unisex", style: ["streetwear", "bohemio", "casual"], temperatureMatch: ["cálido", "frío", "neutro"], intensityMatch: ["intenso"], category: "Chaquetas" },
  { id: "u4", name: "Pantalón Cargo Musgo", description: "Pantalón cargo unisex en verde musgo. Funcionalidad con estilo.", colors: ["#8A9A5B", "#556B2F"], imageEmoji: "👖", price: "69,95€", gender: "unisex", style: ["streetwear", "casual"], temperatureMatch: ["cálido", "neutro"], intensityMatch: ["suave", "intenso"], category: "Pantalones" },
  { id: "u5", name: "Bufanda Estampada Abstracta", description: "Bufanda amplia con print abstracto en tonos ricos. Accesorio statement.", colors: ["#800020", "#2C3E50", "#DAA520"], imageEmoji: "🧣", price: "39,95€", gender: "unisex", style: ["elegante", "bohemio"], temperatureMatch: ["cálido", "frío", "neutro"], intensityMatch: ["intenso"], category: "Accesorios" },
];

export function getDesigualRecommendations(
  profile: ChromaticProfile,
  gender: string,
  style: string,
  limit = 6
): DesigualProduct[] {
  // Map gender input to filter
  const genderFilter = (p: DesigualProduct): boolean => {
    if (gender === "mujer") return p.gender === "mujer" || p.gender === "unisex";
    if (gender === "hombre") return p.gender === "hombre" || p.gender === "unisex";
    return true; // neutro/otro — show all
  };

  // Score each product
  const scored = catalog
    .filter(genderFilter)
    .map((product) => {
      let score = 0;

      // Temperature match (most important)
      if (product.temperatureMatch.includes(profile.temperature)) score += 5;

      // Intensity match
      if (product.intensityMatch.includes(profile.intensity)) score += 3;

      // Style match
      if (product.style.includes(style)) score += 4;

      // Partial style matches
      const relatedStyles: Record<string, string[]> = {
        casual: ["streetwear", "bohemio"],
        elegante: ["clasico", "minimalista"],
        streetwear: ["casual"],
        clasico: ["elegante", "minimalista"],
        minimalista: ["clasico", "elegante"],
        bohemio: ["casual"],
      };
      if (relatedStyles[style]?.some((s) => product.style.includes(s))) score += 1;

      return { product, score };
    })
    .filter((s) => s.score >= 5) // Must at least match temperature
    .sort((a, b) => b.score - a.score);

  // If too few results, relax the filter
  if (scored.length < limit) {
    const relaxed = catalog
      .filter(genderFilter)
      .filter((p) => !scored.find((s) => s.product.id === p.id))
      .map((p) => ({ product: p, score: 1 }));
    scored.push(...relaxed);
  }

  return scored.slice(0, limit).map((s) => s.product);
}
