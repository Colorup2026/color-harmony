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

    const genderLabel = questionnaire.gender === "hombre" ? "hombre" : questionnaire.gender === "mujer" ? "mujer" : "persona";
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

LINK GENERATION RULES (CRITICAL):
Para cada prenda recomendada y cada prenda del outfit, genera un link de búsqueda en Google.
Formato OBLIGATORIO: https://www.google.com/search?q={prenda}+{color}+${genderLabel}+ropa
- Usar solo palabras simples y reales en español
- NO añadir palabras de estilo ni innecesarias
- Asegurar que el link sea limpio y funcional
Ejemplos:
https://www.google.com/search?q=camiseta+blanca+hombre+ropa
https://www.google.com/search?q=sudadera+gris+mujer+outfit

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
    "season": "string",
    "seasonKey": "warm-soft" | "warm-intense" | "cool-soft" | "cool-intense" | "neutral-soft" | "neutral-intense"
  },
  "profile": "string — 1-2 líneas claras y personalizadas describiendo el perfil cromático del usuario",
  "recommendedColors": [{"name": "string", "hex": "string"}],
  "whyColorsWork": "string — explicación conectando directamente con los rasgos del usuario (piel, ojos, pelo, contraste). Debe ser personalizado, natural, no técnico. Ejemplo: 'Tienes un subtono cálido con ojos miel y cabello castaño, lo que hace que tonos como el verde oliva o el beige potencien tu piel y te den un aspecto más equilibrado y luminoso.'",
  "strengths": ["string — 2-3 puntos fuertes del usuario"],
  "avoidColors": [{"name": "string", "hex": "string"}],
  "whyAvoid": "string — explicación breve y clara de por qué evitarlos, conectando con los rasgos",
  "clothingSuggestions": [{"item": "string", "reason": "string", "searchUrl": "string"}],
  "outfit": {
    "description": "string — descripción corta del look completo",
    "pieces": [{"piece": "string", "color": "string", "searchUrl": "string"}]
  },
  "personalizedTips": ["array de 3-4 tips cortos"]
}

REGLAS:
- Género: ${genderLabel}. Si es neutro, usar opciones unisex.
- Estilos: ${stylesText}. Las prendas DEBEN coincidir con estos estilos. No mezclar estilos no seleccionados.
- 5-6 colores recomendados y 2-3 a evitar, todos con nombre específico y hex.
- 4-5 prendas recomendadas con razón breve y searchUrl.
- Outfit completo: parte superior, parte inferior, capa extra (si aplica), calzado. Cada pieza con searchUrl.
- El outfit debe tener sentido real, no mezclar prendas incompatibles.
- whyColorsWork DEBE mencionar piel, ojos, pelo y contraste del usuario. Debe sentirse personal.
- Máximo ~140 palabras en total para textos.
- Tono: moderno, directo, premium. Sin lenguaje técnico.
- Debe sentirse personalizado, específico, hecho para esa persona.
- Debe parecer una recomendación real de un estilista profesional.`;

    const userPrompt = `Analiza esta persona y genera su perfil cromático completo.

CUESTIONARIO:
- Tono de piel: ${questionnaire.skinTone}
- Color de ojos: ${questionnaire.eyeColor}
- Color de cabello: ${questionnaire.hairColor}
- Género: ${questionnaire.gender}
- Estilos: ${stylesText}
- Reacción al sol: ${questionnaire.sunReaction || "no especificado"} (solo validación)
- Color de venas: ${questionnaire.veinColor || "no especificado"} (solo validación)
- Reacción dedo: ${questionnaire.fingerPress || "no especificado"} (solo validación)
- Blanco de ojos: ${questionnaire.eyeWhites || "no especificado"} (solo validación)
- Pecas: ${questionnaire.freckles || "no especificado"} (solo validación)

Genera el análisis cromático completo con todos los campos requeridos.`;

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
