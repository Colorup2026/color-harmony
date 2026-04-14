// Color Analysis Engine — independent from brand palette
// Classifies users into chromatic profiles and generates personalized palettes

export interface UserProfile {
  name: string;
  email: string;
  photo: string | null;
  skinTone: string;
  undertone: string;
  hairColor: string;
  hairDepth: string;
  eyeColor: string;
  gender: string;
  style: string;
  contrast: string;
}

export interface ChromaticProfile {
  temperature: "cálido" | "frío" | "neutro";
  intensity: "suave" | "intenso";
  depth: "claro" | "profundo" | "medio";
  season: string;
  seasonKey: string;
}

export interface ColorRecommendation {
  hex: string;
  name: string;
}

export interface AIPhotoAnalysis {
  photoAnalysis: {
    detectedSkinTone: string;
    detectedUndertone: "cálido" | "frío" | "neutro";
    detectedHairColor: string;
    detectedHairDepth: "claro" | "medio" | "oscuro";
    detectedEyeColor: string;
    detectedContrast: "bajo" | "medio" | "alto";
    overallIntensity: "suave" | "intenso";
    confidence: number;
  };
  crossValidation: {
    skinToneMatch: boolean;
    hairColorMatch: boolean;
    eyeColorMatch: boolean;
    contrastMatch: boolean;
    overallAgreement: "alta" | "media" | "baja";
    adjustments: string;
  };
  chromaticProfile: ChromaticProfile;
  personalizedExplanation: string;
  personalizedTips: string[];
}

export interface AnalysisResult {
  profile: ChromaticProfile;
  recommendedColors: ColorRecommendation[];
  avoidColors: ColorRecommendation[];
  explanation: string;
  tips: string[];
  aiAnalysis?: AIPhotoAnalysis;
  confidence: number;
}

// Scoring helpers
function temperatureScore(skinTone: string, hairColor: string, eyeColor: string, undertone: string): number {
  let score = 0;
  const warmSkins = ["tan", "medium", "olive", "golden"];
  const coolSkins = ["fair", "light", "porcelain"];
  const warmHair = ["blonde", "red", "light-brown", "strawberry"];
  const coolHair = ["black", "dark-brown", "grey", "ash-brown"];
  const warmEyes = ["hazel", "brown", "amber", "honey"];
  const coolEyes = ["blue", "grey", "green", "dark-brown"];

  if (warmSkins.includes(skinTone)) score += 2;
  if (coolSkins.includes(skinTone)) score -= 2;
  if (warmHair.includes(hairColor)) score += 1.5;
  if (coolHair.includes(hairColor)) score -= 1.5;
  if (warmEyes.includes(eyeColor)) score += 1;
  if (coolEyes.includes(eyeColor)) score -= 1;

  // Undertone adds strong signal
  if (undertone === "warm") score += 3;
  if (undertone === "cool") score -= 3;

  return score;
}

function intensityScore(skinTone: string, hairColor: string, eyeColor: string, contrast: string): number {
  let score = 0;
  if (contrast === "high") score += 3;
  if (contrast === "medium") score += 1;
  if (contrast === "low") score -= 2;

  if (["black", "dark-brown"].includes(hairColor) && ["fair", "light"].includes(skinTone)) score += 2;
  if (["blonde", "red"].includes(hairColor) && ["blue", "green"].includes(eyeColor)) score += 1;
  if (["blonde", "light-brown"].includes(hairColor) && ["fair", "light"].includes(skinTone)) score -= 1;

  return score;
}

function depthScore(skinTone: string, hairColor: string, eyeColor: string, hairDepth: string): number {
  let score = 0;
  const deepSkins = ["tan", "dark", "olive"];
  const lightSkins = ["fair", "light", "porcelain"];
  const deepHair = ["black", "dark-brown"];
  const lightHair = ["blonde", "light-brown", "red", "grey", "strawberry"];

  if (deepSkins.includes(skinTone)) score += 2;
  if (lightSkins.includes(skinTone)) score -= 2;
  if (deepHair.includes(hairColor)) score += 1.5;
  if (lightHair.includes(hairColor)) score -= 1.5;
  if (["dark-brown", "brown"].includes(eyeColor)) score += 1;
  if (["blue", "green", "grey", "hazel"].includes(eyeColor)) score -= 1;

  // Hair depth signal
  if (hairDepth === "dark") score += 1.5;
  if (hairDepth === "light") score -= 1.5;

  return score;
}

function classifyProfile(user: UserProfile): ChromaticProfile {
  const temp = temperatureScore(user.skinTone, user.hairColor, user.eyeColor, user.undertone);
  const intens = intensityScore(user.skinTone, user.hairColor, user.eyeColor, user.contrast);
  const depth = depthScore(user.skinTone, user.hairColor, user.eyeColor, user.hairDepth);

  const temperature: ChromaticProfile["temperature"] = temp > 1 ? "cálido" : temp < -1 ? "frío" : "neutro";
  const intensity: ChromaticProfile["intensity"] = intens > 1 ? "intenso" : "suave";
  const depthVal: ChromaticProfile["depth"] = depth > 1 ? "profundo" : depth < -1 ? "claro" : "medio";

  let season = "";
  let seasonKey = "";
  if (temperature === "cálido" && intensity === "suave") { season = "Otoño Suave"; seasonKey = "warm-soft"; }
  else if (temperature === "cálido" && intensity === "intenso") { season = "Otoño Intenso"; seasonKey = "warm-intense"; }
  else if (temperature === "frío" && intensity === "suave") { season = "Verano Suave"; seasonKey = "cool-soft"; }
  else if (temperature === "frío" && intensity === "intenso") { season = "Invierno Brillante"; seasonKey = "cool-intense"; }
  else if (temperature === "neutro" && intensity === "suave") { season = "Verano Natural"; seasonKey = "neutral-soft"; }
  else { season = "Invierno Profundo"; seasonKey = "neutral-intense"; }

  return { temperature, intensity, depth: depthVal, season, seasonKey };
}

// Palettes keyed by seasonKey
const seasonPalettes: Record<string, { recommended: ColorRecommendation[]; avoid: ColorRecommendation[] }> = {
  "warm-soft": {
    recommended: [
      { hex: "#C9956B", name: "Caramelo" },
      { hex: "#D4A373", name: "Arena Dorada" },
      { hex: "#E8C5A0", name: "Miel Suave" },
      { hex: "#A67B5B", name: "Canela" },
      { hex: "#8B6F47", name: "Marrón Tostado" },
      { hex: "#C4A77D", name: "Champagne" },
      { hex: "#B5651D", name: "Ámbar" },
      { hex: "#D2B48C", name: "Trigo" },
      { hex: "#556B2F", name: "Verde Oliva" },
      { hex: "#CD853F", name: "Terracota Suave" },
    ],
    avoid: [
      { hex: "#FF00FF", name: "Fucsia Neón" },
      { hex: "#0000FF", name: "Azul Eléctrico" },
      { hex: "#C0C0C0", name: "Gris Plateado" },
      { hex: "#FF1493", name: "Rosa Intenso" },
    ],
  },
  "warm-intense": {
    recommended: [
      { hex: "#B22222", name: "Rojo Ladrillo" },
      { hex: "#D2691E", name: "Terracota" },
      { hex: "#FF8C00", name: "Naranja Cálido" },
      { hex: "#DAA520", name: "Dorado" },
      { hex: "#8B4513", name: "Marrón Chocolate" },
      { hex: "#CD5C5C", name: "Rojo Indio" },
      { hex: "#CC7722", name: "Ocre" },
      { hex: "#228B22", name: "Verde Bosque" },
      { hex: "#BDB76B", name: "Caqui" },
      { hex: "#A0522D", name: "Siena" },
    ],
    avoid: [
      { hex: "#E6E6FA", name: "Lavanda Pastel" },
      { hex: "#ADD8E6", name: "Azul Bebé" },
      { hex: "#FFB6C1", name: "Rosa Pastel" },
      { hex: "#808080", name: "Gris Medio" },
    ],
  },
  "cool-soft": {
    recommended: [
      { hex: "#B0C4DE", name: "Azul Acero Suave" },
      { hex: "#DDA0DD", name: "Ciruela Suave" },
      { hex: "#BC8F8F", name: "Rosa Empolvado" },
      { hex: "#778899", name: "Gris Azulado" },
      { hex: "#C4B7A6", name: "Greige" },
      { hex: "#8FBC8F", name: "Verde Salvia" },
      { hex: "#D8BFD8", name: "Lila" },
      { hex: "#87CEEB", name: "Azul Cielo" },
      { hex: "#AFBFAF", name: "Musgo Suave" },
      { hex: "#E0C8D0", name: "Rosa Ceniza" },
    ],
    avoid: [
      { hex: "#FF4500", name: "Naranja Fuego" },
      { hex: "#FFD700", name: "Amarillo Dorado" },
      { hex: "#FF6347", name: "Tomate" },
      { hex: "#8B4513", name: "Marrón Tierra" },
    ],
  },
  "cool-intense": {
    recommended: [
      { hex: "#191970", name: "Azul Marino" },
      { hex: "#800020", name: "Borgoña" },
      { hex: "#2F4F4F", name: "Verde Oscuro" },
      { hex: "#4B0082", name: "Índigo" },
      { hex: "#DC143C", name: "Carmesí" },
      { hex: "#008080", name: "Verde Azulado" },
      { hex: "#6A0DAD", name: "Púrpura" },
      { hex: "#000080", name: "Azul Noche" },
      { hex: "#FFFFFF", name: "Blanco Puro" },
      { hex: "#000000", name: "Negro" },
    ],
    avoid: [
      { hex: "#FFDAB9", name: "Melocotón" },
      { hex: "#F5DEB3", name: "Trigo" },
      { hex: "#FFE4B5", name: "Beige Cálido" },
      { hex: "#DEB887", name: "Arena" },
    ],
  },
  "neutral-soft": {
    recommended: [
      { hex: "#A89F91", name: "Piedra" },
      { hex: "#C9B89E", name: "Duna de Arena" },
      { hex: "#9CAF88", name: "Verde Jade Suave" },
      { hex: "#B5A8A0", name: "Topo" },
      { hex: "#C8A2C8", name: "Malva" },
      { hex: "#A0B2C6", name: "Azul Empolvado" },
      { hex: "#D4C5B2", name: "Lino" },
      { hex: "#8A9A5B", name: "Verde Musgo" },
      { hex: "#C9ADA7", name: "Rosa Antiguo" },
      { hex: "#B8B0A2", name: "Avena" },
    ],
    avoid: [
      { hex: "#FF0000", name: "Rojo Puro" },
      { hex: "#00FF00", name: "Verde Neón" },
      { hex: "#FF00FF", name: "Magenta" },
      { hex: "#FFFF00", name: "Amarillo Brillante" },
    ],
  },
  "neutral-intense": {
    recommended: [
      { hex: "#2C3E50", name: "Azul Petróleo" },
      { hex: "#8B0000", name: "Rojo Oscuro" },
      { hex: "#1B4332", name: "Verde Esmeralda" },
      { hex: "#483D8B", name: "Azul Pizarra" },
      { hex: "#36454F", name: "Carbón" },
      { hex: "#8B008B", name: "Magenta Oscuro" },
      { hex: "#2E8B57", name: "Verde Mar" },
      { hex: "#800000", name: "Granate" },
      { hex: "#FFFAF0", name: "Blanco Floral" },
      { hex: "#2F2F2F", name: "Grafito" },
    ],
    avoid: [
      { hex: "#FAEBD7", name: "Blanco Antiguo" },
      { hex: "#F0E68C", name: "Caqui Claro" },
      { hex: "#FFE4C4", name: "Bisque" },
      { hex: "#FFF0F5", name: "Rosa Lavanda" },
    ],
  },
};

function generateExplanation(profile: ChromaticProfile, style: string): string {
  const tempText = {
    cálido: "Tu subtono de piel tiene matices cálidos (dorados, melocotón). Los colores con base amarilla, naranja y terrosa se fusionan armoniosamente con tu tono natural.",
    frío: "Tu subtono de piel tiene matices fríos (rosados, azulados). Los colores con base azul, púrpura y gris resaltan tu luminosidad natural de forma elegante.",
    neutro: "Tu subtono es equilibrado, con matices tanto cálidos como fríos. Tienes la versatilidad de usar una amplia gama de colores con soltura.",
  };

  const intensText = {
    suave: "Tus rasgos tienen un contraste suave y armonioso — los tonos apagados, empolvados y sutiles te favorecen especialmente.",
    intenso: "Tus rasgos tienen un contraste marcado y definido. Los colores vibrantes, profundos y saturados te dan presencia y resaltan tu expresividad.",
  };

  const styleText: Record<string, string> = {
    casual: "Con tu estilo casual, puedes integrar estos colores en piezas relajadas como camisetas, sudaderas y jeans.",
    elegante: "Tu preferencia por lo elegante te permite lucir estos colores en blazers, camisas estructuradas y pantalones de vestir.",
    streetwear: "Tu estilo streetwear combina perfecto con estas tonalidades en hoodies, sneakers y capas urbanas.",
    clasico: "Tu estilo clásico se potencia con estos colores en prendas atemporales y combinaciones sofisticadas.",
    minimalista: "Tu enfoque minimalista brilla con estos tonos en piezas limpias, monocromáticas y bien cortadas.",
    bohemio: "Tu espíritu bohemio se expresa naturalmente con estos colores en texturas naturales, estampados fluidos y capas.",
  };

  return `${tempText[profile.temperature]} ${intensText[profile.intensity]} ${styleText[style] || ""}`.trim();
}

function generateTips(profile: ChromaticProfile): string[] {
  const tips: string[] = [];

  if (profile.temperature === "cálido") {
    tips.push("Busca joyas en tonos dorados — complementarán tu subtono a la perfección.");
    tips.push("Los estampados con tonos tierra y anaranjados serán tus aliados.");
  } else if (profile.temperature === "frío") {
    tips.push("Las joyas plateadas y en platino resaltarán tu tono de piel.");
    tips.push("Los estampados en azules y morados te darán un look sofisticado.");
  } else {
    tips.push("Puedes alternar entre joyas doradas y plateadas según la ocasión.");
    tips.push("Los tonos neutros como beige, gris y verde sage son tu base ideal.");
  }

  if (profile.intensity === "intenso") {
    tips.push("No temas usar colores vibrantes — tu nivel de contraste los soporta perfectamente.");
    tips.push("El blanco y negro puros te sientan especialmente bien.");
  } else {
    tips.push("Opta por versiones más suaves de cada color en lugar de sus versiones más puras.");
    tips.push("Las mezclas de tono sobre tono crearán looks armoniosos en ti.");
  }

  if (profile.depth === "profundo") {
    tips.push("Los colores oscuros y ricos son tu territorio natural — úsalos como base.");
  } else if (profile.depth === "claro") {
    tips.push("Los colores claros y luminosos iluminarán tu rostro — úsalos cerca de la cara.");
  }

  return tips;
}

export function analyzeUser(user: UserProfile, aiAnalysis?: AIPhotoAnalysis): AnalysisResult {
  const localProfile = classifyProfile(user);
  
  // If we have AI analysis, use it as primary source with local as fallback
  if (aiAnalysis?.chromaticProfile) {
    const aiProfile = aiAnalysis.chromaticProfile;
    const paletteData = seasonPalettes[aiProfile.seasonKey] || seasonPalettes[localProfile.seasonKey] || seasonPalettes["neutral-soft"];

    return {
      profile: aiProfile,
      recommendedColors: paletteData.recommended,
      avoidColors: paletteData.avoid,
      explanation: aiAnalysis.personalizedExplanation || generateExplanation(aiProfile, user.style),
      tips: aiAnalysis.personalizedTips?.length ? aiAnalysis.personalizedTips : generateTips(aiProfile),
      aiAnalysis,
      confidence: aiAnalysis.photoAnalysis?.confidence || 75,
    };
  }

  // Fallback to local analysis
  const paletteData = seasonPalettes[localProfile.seasonKey] || seasonPalettes["neutral-soft"];
  return {
    profile: localProfile,
    recommendedColors: paletteData.recommended,
    avoidColors: paletteData.avoid,
    explanation: generateExplanation(localProfile, user.style),
    tips: generateTips(localProfile),
    confidence: 60,
  };
}
