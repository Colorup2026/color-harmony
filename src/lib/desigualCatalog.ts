// Desigual product catalog with real category links

import type { ChromaticProfile } from "./colorAnalysis";

export interface DesigualProduct {
  id: string;
  name: string;
  description: string;
  colors: string[];
  imageEmoji: string;
  price: string;
  gender: "mujer" | "hombre" | "unisex";
  style: string[];
  temperatureMatch: ("cálido" | "frío" | "neutro")[];
  intensityMatch: ("suave" | "intenso")[];
  category: string;
  categoryUrl: string;
  whyItFits: string;
  howToWear: string;
  occasion: string;
}

const catalog: DesigualProduct[] = [
  // MUJER — Cálidos
  {
    id: "w1", name: "Vestido Floral Estampado", description: "Vestido midi con estampado floral en tonos tierra y naranja cálido.",
    colors: ["#D2691E", "#CD853F", "#556B2F"], imageEmoji: "👗", price: "89,95€",
    gender: "mujer", style: ["casual", "bohemio"], temperatureMatch: ["cálido"], intensityMatch: ["suave", "intenso"],
    category: "Vestidos", categoryUrl: "https://www.desigual.com/es_ES/mujer/ropa/vestidos/",
    whyItFits: "Los tonos tierra y naranja del estampado armonizan con tu subtono cálido, resaltando el brillo natural de tu piel.",
    howToWear: "Combínalo con sandalias en tono camel y accesorios dorados para un look cohesivo.",
    occasion: "Día a día, brunch, paseos",
  },
  {
    id: "w2", name: "Blusa Bordada Cálida", description: "Blusa con bordados artesanales en tonos dorados y ámbar.",
    colors: ["#DAA520", "#C9956B", "#F5DEB3"], imageEmoji: "👚", price: "69,95€",
    gender: "mujer", style: ["elegante", "bohemio"], temperatureMatch: ["cálido"], intensityMatch: ["suave"],
    category: "Blusas y camisas", categoryUrl: "https://www.desigual.com/es_ES/mujer/ropa/camisetas-y-tops/",
    whyItFits: "Los tonos dorados del bordado complementan tu subtono cálido y añaden luminosidad cerca del rostro.",
    howToWear: "Úsala con unos jeans de corte recto y pendientes de aro dorados.",
    occasion: "Oficina, citas, cenas informales",
  },
  {
    id: "w3", name: "Falda Estampada Midi", description: "Falda plisada con print geométrico en tonos tierra.",
    colors: ["#A67B5B", "#D4A373"], imageEmoji: "🩳", price: "59,95€",
    gender: "mujer", style: ["elegante", "clasico"], temperatureMatch: ["cálido"], intensityMatch: ["suave"],
    category: "Faldas", categoryUrl: "https://www.desigual.com/es_ES/mujer/ropa/faldas/",
    whyItFits: "Los tonos canela y arena dorada se integran con tu paleta cálida sin competir con tus rasgos.",
    howToWear: "Combínala con una blusa crema y botines en marrón tostado.",
    occasion: "Trabajo, eventos semi-formales",
  },
  {
    id: "w4", name: "Chaqueta Oversize Artística", description: "Chaqueta oversize con estampado artístico en tonos cálidos.",
    colors: ["#CC7722", "#8B4513", "#DAA520"], imageEmoji: "🧥", price: "129,95€",
    gender: "mujer", style: ["streetwear", "casual"], temperatureMatch: ["cálido"], intensityMatch: ["intenso"],
    category: "Abrigos y chaquetas", categoryUrl: "https://www.desigual.com/es_ES/mujer/ropa/abrigos-y-chaquetas/",
    whyItFits: "Los colores ocre y dorado aportan energía cálida que potencia el brillo de tu piel y cabello.",
    howToWear: "Llévala sobre una camiseta básica blanca con jeans oscuros y sneakers.",
    occasion: "Fin de semana, salidas urbanas",
  },

  // MUJER — Fríos
  {
    id: "w5", name: "Vestido Azul Noche", description: "Vestido ajustado en azul marino con detalles bordados.",
    colors: ["#191970", "#B0C4DE"], imageEmoji: "👗", price: "99,95€",
    gender: "mujer", style: ["elegante", "clasico"], temperatureMatch: ["frío"], intensityMatch: ["intenso"],
    category: "Vestidos", categoryUrl: "https://www.desigual.com/es_ES/mujer/ropa/vestidos/",
    whyItFits: "El azul marino profundo resalta tu subtono frío y da un efecto luminoso a tu piel.",
    howToWear: "Acompáñalo con tacones plateados y accesorios en plata o cristal.",
    occasion: "Cenas, eventos formales",
  },
  {
    id: "w6", name: "Blusa Lila Empolvado", description: "Blusa fluida en lila suave con mangas abullonadas.",
    colors: ["#D8BFD8", "#DDA0DD"], imageEmoji: "👚", price: "49,95€",
    gender: "mujer", style: ["casual", "bohemio"], temperatureMatch: ["frío"], intensityMatch: ["suave"],
    category: "Blusas y camisas", categoryUrl: "https://www.desigual.com/es_ES/mujer/ropa/camisetas-y-tops/",
    whyItFits: "El lila empolvado armoniza con tu subtono frío y añade suavidad a tu look.",
    howToWear: "Combínala con pantalón gris perla y zapatos nude.",
    occasion: "Día a día, trabajo creativo",
  },
  {
    id: "w7", name: "Pantalón Wide Leg", description: "Pantalón de corte amplio en tonos fríos profundos.",
    colors: ["#800020", "#4B0082"], imageEmoji: "👖", price: "79,95€",
    gender: "mujer", style: ["elegante", "clasico"], temperatureMatch: ["frío"], intensityMatch: ["intenso"],
    category: "Pantalones", categoryUrl: "https://www.desigual.com/es_ES/mujer/ropa/pantalones/",
    whyItFits: "El borgoña profundo potencia tu contraste visual sin opacar tu tono de piel frío.",
    howToWear: "Úsalo con una blusa azul cielo y tacones negros para equilibrio.",
    occasion: "Oficina, cenas de negocios",
  },
  {
    id: "w8", name: "Cárdigan Punto Suave", description: "Cárdigan largo en verde salvia con textura de punto.",
    colors: ["#8FBC8F", "#778899"], imageEmoji: "🧥", price: "69,95€",
    gender: "mujer", style: ["casual", "minimalista"], temperatureMatch: ["frío"], intensityMatch: ["suave"],
    category: "Jerséis y cárdigans", categoryUrl: "https://www.desigual.com/es_ES/mujer/ropa/jerseis-y-cardigans/",
    whyItFits: "El verde salvia es un tono frío suave que se funde con tu armonía cromática de forma natural.",
    howToWear: "Combínalo con jeans y una camiseta gris para un look relajado pero pulido.",
    occasion: "Fin de semana, viajes, teletrabajo",
  },

  // MUJER — Neutros
  {
    id: "w9", name: "Vestido Camisero", description: "Vestido camisero en tono greige con cinturón.",
    colors: ["#C4B7A6", "#B5A8A0"], imageEmoji: "👗", price: "79,95€",
    gender: "mujer", style: ["clasico", "minimalista"], temperatureMatch: ["neutro", "cálido", "frío"], intensityMatch: ["suave"],
    category: "Vestidos", categoryUrl: "https://www.desigual.com/es_ES/mujer/ropa/vestidos/",
    whyItFits: "El greige es el tono perfecto para subtonos neutros: ni demasiado cálido ni frío, siempre favorecedor.",
    howToWear: "Añade un cinturón en contraste y zapatos según la ocasión para transformar el look.",
    occasion: "Trabajo, eventos diurnos",
  },
  {
    id: "w10", name: "Top Estampado Abstracto", description: "Top con print abstracto en malva y rosa antiguo.",
    colors: ["#C8A2C8", "#C9ADA7"], imageEmoji: "👚", price: "39,95€",
    gender: "mujer", style: ["casual", "bohemio"], temperatureMatch: ["neutro"], intensityMatch: ["suave"],
    category: "Camisetas y tops", categoryUrl: "https://www.desigual.com/es_ES/mujer/ropa/camisetas-y-tops/",
    whyItFits: "Los tonos malva y rosa antiguo respetan tu equilibrio cromático sin saturar.",
    howToWear: "Ideal con jeans claros y sandalias planas para un look fresco.",
    occasion: "Día a día, paseos",
  },

  // HOMBRE — Cálidos
  {
    id: "h1", name: "Camisa Lino Estampada", description: "Camisa de lino con estampado en tonos cálidos.",
    colors: ["#CD853F", "#D2691E"], imageEmoji: "👔", price: "69,95€",
    gender: "hombre", style: ["casual", "bohemio"], temperatureMatch: ["cálido"], intensityMatch: ["suave", "intenso"],
    category: "Camisas", categoryUrl: "https://www.desigual.com/es_ES/hombre/ropa/camisas/",
    whyItFits: "Los tonos terracota armonizan con tu subtono cálido, dándote un aspecto saludable y vital.",
    howToWear: "Combínala con chinos beige y mocasines de ante.",
    occasion: "Planes de verano, cenas al aire libre",
  },
  {
    id: "h2", name: "Polo con Detalle", description: "Polo de algodón en tono ocre con detalle bordado.",
    colors: ["#CC7722", "#DAA520"], imageEmoji: "👕", price: "49,95€",
    gender: "hombre", style: ["casual", "clasico"], temperatureMatch: ["cálido"], intensityMatch: ["intenso"],
    category: "Polos", categoryUrl: "https://www.desigual.com/es_ES/hombre/ropa/polos/",
    whyItFits: "El ocre potencia tu calidez natural y te da presencia sin esfuerzo.",
    howToWear: "Ideal con pantalón chino oliva y cinturón de cuero marrón.",
    occasion: "Casual elegante, planes de día",
  },
  {
    id: "h3", name: "Chaqueta Bomber", description: "Bomber en tono camel con detalles artísticos.",
    colors: ["#C9956B", "#A67B5B", "#8B6F47"], imageEmoji: "🧥", price: "119,95€",
    gender: "hombre", style: ["streetwear", "casual"], temperatureMatch: ["cálido"], intensityMatch: ["suave"],
    category: "Chaquetas", categoryUrl: "https://www.desigual.com/es_ES/hombre/ropa/abrigos-y-chaquetas/",
    whyItFits: "Los tonos camel complementan tu subtono dorado y crean un look cohesivo y sofisticado.",
    howToWear: "Sobre camiseta blanca con jeans oscuros y zapatillas blancas.",
    occasion: "Fin de semana, salidas urbanas",
  },
  {
    id: "h4", name: "Pantalón Chino Estampado", description: "Chino slim fit en verde oliva con estampado sutil.",
    colors: ["#556B2F", "#6B8E23"], imageEmoji: "👖", price: "59,95€",
    gender: "hombre", style: ["casual", "clasico"], temperatureMatch: ["cálido"], intensityMatch: ["suave", "intenso"],
    category: "Pantalones", categoryUrl: "https://www.desigual.com/es_ES/hombre/ropa/pantalones/",
    whyItFits: "El verde oliva es un neutro cálido que funciona como base perfecta para tu paleta.",
    howToWear: "Combínalo con camisa en tono tostado y zapatos marrones.",
    occasion: "Trabajo casual, citas",
  },

  // HOMBRE — Fríos
  {
    id: "h5", name: "Camisa Azul Petróleo", description: "Camisa slim en azul petróleo con acabado moderno.",
    colors: ["#2C3E50", "#36454F"], imageEmoji: "👔", price: "59,95€",
    gender: "hombre", style: ["elegante", "clasico"], temperatureMatch: ["frío"], intensityMatch: ["intenso"],
    category: "Camisas", categoryUrl: "https://www.desigual.com/es_ES/hombre/ropa/camisas/",
    whyItFits: "El azul petróleo es un tono frío profundo que resalta tu contraste y aporta sofisticación.",
    howToWear: "Con pantalón negro o gris carbón y zapatos de vestir.",
    occasion: "Eventos, trabajo formal",
  },
  {
    id: "h6", name: "Jersey Punto Fino", description: "Jersey de punto fino en gris azulado.",
    colors: ["#778899", "#B0C4DE"], imageEmoji: "🧶", price: "69,95€",
    gender: "hombre", style: ["clasico", "minimalista"], temperatureMatch: ["frío"], intensityMatch: ["suave"],
    category: "Jerséis", categoryUrl: "https://www.desigual.com/es_ES/hombre/ropa/jerseis-y-cardigans/",
    whyItFits: "El gris azulado suave armoniza con tu subtono frío sin crear contraste excesivo.",
    howToWear: "Combínalo con camisa blanca debajo y chinos grises.",
    occasion: "Trabajo, cenas casuales",
  },
  {
    id: "h7", name: "Blazer Desestructurado", description: "Blazer en azul marino con forro estampado signature.",
    colors: ["#191970", "#000080"], imageEmoji: "🧥", price: "149,95€",
    gender: "hombre", style: ["elegante", "clasico"], temperatureMatch: ["frío"], intensityMatch: ["intenso"],
    category: "Chaquetas", categoryUrl: "https://www.desigual.com/es_ES/hombre/ropa/abrigos-y-chaquetas/",
    whyItFits: "El azul marino profundo potencia tu contraste frío con máxima elegancia.",
    howToWear: "Sobre camiseta gris o camisa blanca con pantalón slim oscuro.",
    occasion: "Eventos, trabajo, cenas formales",
  },
  {
    id: "h8", name: "Camiseta Estampada", description: "Camiseta de algodón orgánico en verde esmeralda.",
    colors: ["#2E8B57", "#1B4332"], imageEmoji: "👕", price: "29,95€",
    gender: "hombre", style: ["casual", "streetwear"], temperatureMatch: ["frío", "neutro"], intensityMatch: ["intenso"],
    category: "Camisetas", categoryUrl: "https://www.desigual.com/es_ES/hombre/ropa/camisetas/",
    whyItFits: "El verde esmeralda es un tono frío con profundidad que resalta tu tono de piel.",
    howToWear: "Combínala con jeans oscuros y sneakers en gris o negro.",
    occasion: "Día a día, planes informales",
  },

  // HOMBRE — Neutros
  {
    id: "h9", name: "Camisa Estampada", description: "Camisa con print artístico en tonos neutros.",
    colors: ["#B5A8A0", "#A89F91"], imageEmoji: "👔", price: "59,95€",
    gender: "hombre", style: ["casual", "bohemio"], temperatureMatch: ["neutro"], intensityMatch: ["suave"],
    category: "Camisas", categoryUrl: "https://www.desigual.com/es_ES/hombre/ropa/camisas/",
    whyItFits: "Los tonos piedra y topo son neutros versátiles que respetan tu equilibrio cromático.",
    howToWear: "Con jeans claros o pantalón beige para un look sofisticado pero relajado.",
    occasion: "Casual elegante, planes con amigos",
  },
  {
    id: "h10", name: "Sudadera Oversize", description: "Sudadera oversize en grafito con estampado artístico.",
    colors: ["#36454F", "#2F2F2F"], imageEmoji: "👕", price: "59,95€",
    gender: "hombre", style: ["streetwear", "casual"], temperatureMatch: ["neutro", "frío"], intensityMatch: ["intenso"],
    category: "Sudaderas", categoryUrl: "https://www.desigual.com/es_ES/hombre/ropa/sudaderas/",
    whyItFits: "El grafito es un neutro intenso que funciona con subtonos mixtos y aporta presencia.",
    howToWear: "Úsala con joggers y sneakers para un look urbano cómodo.",
    occasion: "Fin de semana, viajes, casual",
  },

  // UNISEX
  {
    id: "u1", name: "Hoodie Oversize Artístico", description: "Hoodie unisex oversize con estampado artístico en tonos cálidos.",
    colors: ["#D4A373", "#C9B89E"], imageEmoji: "👕", price: "79,95€",
    gender: "unisex", style: ["streetwear", "casual"], temperatureMatch: ["cálido", "neutro"], intensityMatch: ["suave"],
    category: "Sudaderas", categoryUrl: "https://www.desigual.com/es_ES/unisex/",
    whyItFits: "Los tonos arena son universales y perfectos para subtonos cálidos y neutros.",
    howToWear: "Con joggers o jeans y zapatillas deportivas para un look cómodo con estilo.",
    occasion: "Día a día, fin de semana",
  },
  {
    id: "u2", name: "Camiseta Oversize Gráfica", description: "Camiseta unisex con gráfico abstracto en tonos fríos.",
    colors: ["#D8BFD8", "#B0C4DE"], imageEmoji: "👕", price: "35,95€",
    gender: "unisex", style: ["casual", "streetwear"], temperatureMatch: ["frío", "neutro"], intensityMatch: ["suave"],
    category: "Camisetas", categoryUrl: "https://www.desigual.com/es_ES/unisex/",
    whyItFits: "Los tonos lavanda y azul empolvado son frescos y versátiles para subtonos fríos.",
    howToWear: "Con pantalón wide leg en gris y sneakers blancas.",
    occasion: "Casual, paseos, planes de día",
  },
  {
    id: "u3", name: "Chaqueta Denim Artística", description: "Chaqueta vaquera con parches artísticos multicolor.",
    colors: ["#4682B4", "#CD5C5C", "#DAA520"], imageEmoji: "🧥", price: "109,95€",
    gender: "unisex", style: ["streetwear", "bohemio", "casual"], temperatureMatch: ["cálido", "frío", "neutro"], intensityMatch: ["intenso"],
    category: "Chaquetas", categoryUrl: "https://www.desigual.com/es_ES/unisex/",
    whyItFits: "La mezcla multicolor permite que funcione con varios perfiles cromáticos, ideal para contrastes altos.",
    howToWear: "Sobre cualquier look básico — camiseta + jeans. Es la pieza que transforma.",
    occasion: "Casual, festivales, expresión personal",
  },
  {
    id: "u4", name: "Pantalón Cargo", description: "Pantalón cargo unisex en verde musgo con detalles.",
    colors: ["#8A9A5B", "#556B2F"], imageEmoji: "👖", price: "69,95€",
    gender: "unisex", style: ["streetwear", "casual"], temperatureMatch: ["cálido", "neutro"], intensityMatch: ["suave", "intenso"],
    category: "Pantalones", categoryUrl: "https://www.desigual.com/es_ES/unisex/",
    whyItFits: "El verde musgo es un neutro cálido que funciona como base excelente.",
    howToWear: "Con camiseta básica y una chaqueta ligera en tono complementario.",
    occasion: "Día a día, viajes, streetwear",
  },
  {
    id: "u5", name: "Bufanda Estampada", description: "Bufanda amplia con print abstracto en tonos ricos.",
    colors: ["#800020", "#2C3E50", "#DAA520"], imageEmoji: "🧣", price: "39,95€",
    gender: "unisex", style: ["elegante", "bohemio"], temperatureMatch: ["cálido", "frío", "neutro"], intensityMatch: ["intenso"],
    category: "Accesorios", categoryUrl: "https://www.desigual.com/es_ES/accesorios/",
    whyItFits: "Los colores ricos y saturados de este accesorio potencian cualquier look con contraste alto.",
    howToWear: "Añádela sobre un abrigo liso para un punto de color estratégico cerca del rostro.",
    occasion: "Cualquier ocasión otoño/invierno",
  },
];

export function getDesigualRecommendations(
  profile: ChromaticProfile,
  gender: string,
  style: string,
  limit = 6
): DesigualProduct[] {
  const genderFilter = (p: DesigualProduct): boolean => {
    if (gender === "mujer") return p.gender === "mujer" || p.gender === "unisex";
    if (gender === "hombre") return p.gender === "hombre" || p.gender === "unisex";
    return true;
  };

  const scored = catalog
    .filter(genderFilter)
    .map((product) => {
      let score = 0;

      // 1. Temperature match (highest priority)
      if (product.temperatureMatch.includes(profile.temperature)) score += 5;

      // 2. Intensity match
      if (product.intensityMatch.includes(profile.intensity)) score += 3;

      // 3. Style match
      if (product.style.includes(style)) score += 4;

      // 4. Related style bonus
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
    .filter((s) => s.score >= 5)
    .sort((a, b) => b.score - a.score);

  if (scored.length < limit) {
    const relaxed = catalog
      .filter(genderFilter)
      .filter((p) => !scored.find((s) => s.product.id === p.id))
      .map((p) => ({ product: p, score: 1 }));
    scored.push(...relaxed);
  }

  return scored.slice(0, limit).map((s) => s.product);
}
