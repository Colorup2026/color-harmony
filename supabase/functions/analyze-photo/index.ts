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

    const systemPrompt = `Eres un experto en análisis cromático y colorimetría personal. Analiza la foto del usuario y genera un perfil cromático preciso.

INSTRUCCIONES ESTRICTAS:

1. PRIORIDAD DE IMAGEN: La foto es la fuente principal. Si hay contradicción entre foto y cuestionario, prioriza lo que ves en la imagen.

2. CONTROL DE CALIDAD DE IMAGEN:
   - Si la imagen es demasiado oscura, borrosa o no se ve claramente el rostro, responde SOLO con:
   {"imageQualityError": "La imagen no tiene suficiente calidad para un análisis preciso. Te recomendamos subir una foto con mejor iluminación y el rostro visible."}
   - No inventes rasgos que no puedas detectar claramente.

3. DETECCIÓN OBLIGATORIA en la foto:
   - Subtono: cálido / frío / neutro
   - Profundidad: claro / medio / oscuro
   - Contraste: bajo / medio / alto
   - Intensidad: suave / intenso

4. VALIDACIÓN: La respuesta sobre reacción al sol (sunReaction: burn=frío, tan=cálido, mixed=neutro) se usa SOLO como confirmación, no como factor principal.

5. NO INVENTAR: Si no puedes detectar algo, indícalo brevemente.

6. COHERENCIA: Ajusta silenciosamente si hay contradicciones menores.

7. RESPUESTA CONCISA: El perfil y la explicación deben ser directos, ~100 palabras máximo total.

DEBES responder ÚNICAMENTE con JSON válido. Formato:
{
  "photoAnalysis": {
    "detectedSkinTone": "string",
    "detectedUndertone": "cálido" | "frío" | "neutro",
    "detectedHairColor": "string",
    "detectedHairDepth": "claro" | "medio" | "oscuro",
    "detectedEyeColor": "string",
    "detectedContrast": "bajo" | "medio" | "alto",
    "overallIntensity": "suave" | "intenso",
    "confidence": number (0-100)
  },
  "crossValidation": {
    "skinToneMatch": boolean,
    "hairColorMatch": boolean,
    "eyeColorMatch": boolean,
    "contrastMatch": boolean,
    "overallAgreement": "alta" | "media" | "baja",
    "adjustments": "string breve"
  },
  "chromaticProfile": {
    "temperature": "cálido" | "frío" | "neutro",
    "intensity": "suave" | "intenso",
    "depth": "claro" | "medio" | "profundo",
    "season": "string (ej: Otoño Suave)",
    "seasonKey": "warm-soft" | "warm-intense" | "cool-soft" | "cool-intense" | "neutral-soft" | "neutral-intense"
  },
  "profile": "string - 1-2 líneas claras y naturales describiendo el perfil del usuario",
  "recommendedColors": [{"name": "string", "hex": "string"}],
  "avoidColors": [{"name": "string", "hex": "string"}],
  "clothingSuggestions": [{"item": "string", "reason": "string"}],
  "personalizedTips": ["array de 3-4 tips cortos y directos"]
}

REGLAS DE RECOMENDACIÓN DE ROPA:
- Las prendas DEBEN coincidir estrictamente con el estilo seleccionado (${questionnaire.style}). No mezcles estilos.
- Adapta al género: ${questionnaire.gender}
- Máximo 4-5 prendas recomendadas, cada una con razón breve.
- Genera 5-6 colores recomendados y 2-3 a evitar con nombre y hex.`;

    const userPrompt = `Analiza esta foto y compárala con el cuestionario:

CUESTIONARIO:
- Tono de piel: ${questionnaire.skinTone}
- Color de ojos: ${questionnaire.eyeColor}
- Color de cabello: ${questionnaire.hairColor}
- Estilo: ${questionnaire.style}
- Género: ${questionnaire.gender}
- Reacción al sol: ${questionnaire.sunReaction || "no especificado"} (solo validación)

Genera el análisis cromático completo.`;

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
