import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { photoBase64, questionnaire } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const genderLabel = questionnaire.gender === "hombre" ? "hombre" : questionnaire.gender === "mujer" ? "mujer" : "unisex";
    const stylesText = (questionnaire.styles || [questionnaire.style]).join(", ");

    const systemPrompt = `Eres un asesor experto en colorimetría personal y estilismo moderno.
Tu objetivo es analizar con precisión al usuario y recomendar colores, prendas y outfits que realmente le favorezcan.

PRIORIDAD:
1. La imagen SIEMPRE tiene prioridad.
2. El resto de respuestas sirven como validación.

CONTROL DE CALIDAD DE IMAGEN:
Si la imagen está oscura, borrosa o no se ve bien el rostro, responde SOLO con:
{"imageQualityError": "La imagen no tiene suficiente calidad para un análisis preciso. Sube una foto con buena iluminación y el rostro visible."}

ANÁLISIS OBLIGATORIO — detectar en la foto:
- subtono: frío / cálido / neutro
- profundidad: claro / medio / oscuro
- contraste: bajo / medio / alto
- intensidad: suave / brillante

Si hay contradicciones entre imagen y cuestionario → prioriza imagen y ajusta sin explicarlo.

COLOR PRECISION RULE:
Usa siempre nombres de colores reales y específicos (verde oliva, azul marino, beige, burdeos). NUNCA términos genéricos o vagos.

STYLE TRANSLATION RULE (CRITICAL):
Convierte los estilos seleccionados en prendas reales:
- Streetwear → sudadera oversize, pantalón cargo
- Casual → camiseta básica, vaqueros
- Elegante/Classic → blazer, camisa, pantalón de vestir
- Deportivo/Athleisure → sudadera, chándal, zapatillas
- Trendy → prendas actuales con nombres reales
- Minimal → camiseta básica, pantalón recto
- Romantic → blusa, falda
- Edgy → chaqueta de cuero, botas
NO uses palabras abstractas como minimal, romantic, edgy, aesthetic en las prendas ni en los links.

QUERY NORMALIZATION (CRITICAL):
Antes de generar links, normaliza las palabras:
- minúsculas
- singular
- sin acentos (oliva, marron, burdeos)
- palabras simples y reales

LINK GENERATION RULES (CRITICAL):
Genera SOLO URLs planas y crudas (NO markdown, NO corchetes, NO paréntesis).
Formato OBLIGATORIO con %20 (NUNCA usar "+"):
https://www.google.com/search?q=camiseta%20blanca%20${genderLabel}%20ropa

REGLAS:
- reemplazar TODOS los espacios con "%20" (nunca "+")
- NO usar acentos
- solo minúsculas
- palabras reales y simples
- NO usar [ ] ni ( ) ni markdown
- NO incluir nombres de estilos en el link

SEARCH FALLBACK RULE:
Para cada prenda, generar DOS links:
1. searchUrl  → ...%20${genderLabel}%20ropa
2. outfitUrl  → ...%20${genderLabel}%20outfit

Ejemplos correctos:
https://www.google.com/search?q=camiseta%20blanca%20hombre%20ropa
https://www.google.com/search?q=camiseta%20blanca%20hombre%20outfit

RESPONDE ÚNICAMENTE con JSON válido. Formato exacto:
{
  "imageQualityError": null,
  "photoAnalysis": {
    "detectedSkinTone": "string",
    "detectedUndertone": "cálido" | "frío" | "neutro",
    "detectedHairColor": "string",
    "detectedHairDepth": "claro" | "medio" | "oscuro",
    "detectedEyeColor": "string",
    "detectedContrast": "bajo" | "medio" | "alto",
    "overallIntensity": "suave" | "brillante",
    "confidence": number (0-100)
  },
  "chromaticProfile": {
    "temperature": "cálido" | "frío" | "neutro",
    "intensity": "suave" | "brillante",
    "depth": "claro" | "medio" | "profundo",
    "season": "string (ej: 'Primavera Cálida', 'Invierno Frío')",
    "seasonKey": "warm-soft" | "warm-intense" | "cool-soft" | "cool-intense" | "neutral-soft" | "neutral-intense"
  },
  "profile": "string — 1-2 líneas claras y personalizadas",
  "paletteHighlight": {
    "name": "string — nombre de la paleta en mayúsculas (ej: 'PRIMAVERA CÁLIDA')",
    "description": "string — 1-2 líneas conectando piel, ojos, pelo y contraste con la paleta",
    "highlights": [
      {"color": "string (ej: 'Verde oliva')", "effect": "string (ej: 'resalta tu tono natural')"}
    ]
  },
  "recommendedColors": [{"name": "string", "hex": "string"}],
  "whyColorsWork": "string — explicación conectando con piel, ojos, pelo y contraste del usuario. Natural, no técnico.",
  "strengths": ["string — 2-3 puntos fuertes"],
  "avoidColors": [{"name": "string", "hex": "string"}],
  "whyAvoid": "string — explicación breve y clara",
  "clothingSuggestions": [{"item": "string", "reason": "string", "searchUrl": "string", "outfitUrl": "string"}],
  "outfit": {
    "description": "string — descripción corta del look completo",
    "pieces": [{"piece": "string", "color": "string", "searchUrl": "string", "outfitUrl": "string"}]
  },
  "personalizedTips": ["array de 3-4 tips cortos"]
}

REGLAS:
- Género: ${genderLabel}. Si es unisex, usar prendas neutras.
- Estilos: ${stylesText}. Las prendas DEBEN coincidir con estos estilos.
- 5-6 colores recomendados, 2-3 a evitar (todos con nombre real y hex).
- 4-5 prendas con razón breve, searchUrl Y outfitUrl.
- paletteHighlight: 3-5 colores destacados con su efecto en la persona.
- Outfit completo: parte superior, parte inferior, capa extra (si aplica), calzado. Cada pieza con searchUrl Y outfitUrl.
- whyColorsWork DEBE mencionar piel, ojos, pelo y contraste.
- Máximo ~140 palabras totales en textos.
- Tono: moderno, directo, premium. Sin lenguaje técnico.
- Debe parecer una recomendación real de un estilista profesional.`;

    const userPrompt = `Analiza esta persona y genera su perfil cromático completo.

CUESTIONARIO:
- Género: ${questionnaire.gender}
- Tono de piel: ${questionnaire.skinTone}
- Color de ojos: ${questionnaire.eyeColor}
- Color de cabello: ${questionnaire.hairColor}
- Contraste visual: ${questionnaire.contrast || "no especificado"}
- Estilos seleccionados: ${stylesText}
- Reacción al sol: ${questionnaire.sunReaction || "no especificado"} (solo validación)
- Blanco de los ojos: ${questionnaire.eyeWhites || "no especificado"} (solo validación)
- Pecas: ${questionnaire.freckles || "no especificado"} (solo validación)

Genera el análisis cromático completo siguiendo la estructura indicada. Respeta el género y los estilos del usuario en TODAS las prendas y outfits.`;

    const messages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    if (photoBase64) {
      messages.push({
        role: "user",
        content: [
          { type: "image_url", image_url: { url: photoBase64 } },
          { type: "text", text: userPrompt },
        ],
      });
    } else {
      messages.push({
        role: "user",
        content: userPrompt + "\n\nNOTA: No se proporcionó foto. Basa el análisis únicamente en las respuestas del cuestionario.",
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos agotados." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error("No content in AI response");

    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI analysis");
    }

    // Defensive URL sanitizer: enforce %20, lowercase, no accents, no markdown
    const stripAccents = (s: string) =>
      s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const cleanQuery = (s: string) =>
      stripAccents(String(s || ""))
        .toLowerCase()
        .replace(/[\[\]\(\)]/g, "")
        .replace(/[^\w\s%-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    const buildUrl = (item: string, color: string, suffix: "ropa" | "outfit") => {
      const q = cleanQuery(`${item} ${color} ${genderLabel} ${suffix}`);
      return `https://www.google.com/search?q=${q.replace(/\s/g, "%20")}`;
    };

    if (Array.isArray(parsed?.clothingSuggestions)) {
      const colors = parsed.recommendedColors || [];
      parsed.clothingSuggestions = parsed.clothingSuggestions.map((s: any, i: number) => {
        const color = colors[i]?.name || colors[0]?.name || "";
        return {
          ...s,
          searchUrl: buildUrl(s.item || "", color, "ropa"),
          outfitUrl: buildUrl(s.item || "", color, "outfit"),
        };
      });
    }
    if (parsed?.outfit?.pieces?.length) {
      parsed.outfit.pieces = parsed.outfit.pieces.map((p: any) => ({
        ...p,
        searchUrl: buildUrl(p.piece || "", p.color || "", "ropa"),
        outfitUrl: buildUrl(p.piece || "", p.color || "", "outfit"),
      }));
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-photo error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
