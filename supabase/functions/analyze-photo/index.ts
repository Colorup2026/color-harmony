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

    const systemPrompt = `Eres un experto en análisis cromático y colorimetría personal. Analiza la foto del usuario y compárala con las respuestas de su cuestionario para generar un perfil cromático preciso.

INSTRUCCIONES:
1. Analiza la foto para detectar: tono de piel, subtono (cálido/frío/neutro), color de cabello, profundidad del cabello, color de ojos, nivel de contraste visual, intensidad de rasgos.
2. Compara lo que ves en la foto con las respuestas del cuestionario.
3. Si coinciden, aumenta la confianza. Si hay diferencias menores, combina. Si hay contradicción, da un resultado equilibrado.
4. Genera un perfil cromático completo.

DEBES responder ÚNICAMENTE con JSON válido, sin texto adicional. El formato exacto es:
{
  "photoAnalysis": {
    "detectedSkinTone": "string (ej: medio-claro, oliva, dorado)",
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
    "adjustments": "string explicando ajustes realizados"
  },
  "chromaticProfile": {
    "temperature": "cálido" | "frío" | "neutro",
    "intensity": "suave" | "intenso",
    "depth": "claro" | "medio" | "profundo",
    "season": "string (ej: Otoño Suave, Invierno Brillante, Verano Suave, Primavera Clara, etc.)",
    "seasonKey": "warm-soft" | "warm-intense" | "cool-soft" | "cool-intense" | "neutral-soft" | "neutral-intense"
  },
  "personalizedExplanation": "string - explicación personalizada de 2-3 frases sobre por qué estos colores le favorecen, mencionando sus rasgos específicos",
  "personalizedTips": ["array de 4-6 tips específicos para esta persona"]
}`;

    const userPrompt = `Analiza esta foto y compárala con las respuestas del cuestionario:

RESPUESTAS DEL CUESTIONARIO:
- Tono de piel seleccionado: ${questionnaire.skinTone}
- Subtono seleccionado: ${questionnaire.undertone || "no especificado"}
- Color de cabello: ${questionnaire.hairColor}
- Profundidad del cabello: ${questionnaire.hairDepth || "no especificado"}
- Color de ojos: ${questionnaire.eyeColor}
- Contraste percibido: ${questionnaire.contrast}
- Género: ${questionnaire.gender}
- Estilo preferido: ${questionnaire.style}

Genera el análisis cromático completo comparando la foto con estas respuestas.`;

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

    // Parse JSON from response (handle markdown code blocks)
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
