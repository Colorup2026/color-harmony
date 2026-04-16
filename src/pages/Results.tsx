import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { analyzeUser, type UserProfile, type AIPhotoAnalysis } from "@/lib/colorAnalysis";
import { Sparkles, Share2, Mail, ArrowRight, Loader2, ExternalLink, Star, ShieldX, Shirt } from "lucide-react";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state as (UserProfile & { sunReaction?: string; styles?: string[]; veinColor?: string; fingerPress?: string; eyeWhites?: string; freckles?: string }) | null;
  const [aiData, setAiData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [result, setResult] = useState(() => formData ? analyzeUser(formData) : null);

  useEffect(() => {
    if (!formData) return;

    const runAIAnalysis = async () => {
      setIsAnalyzing(true);
      setAnalysisError(null);
      try {
        const { data, error } = await supabase.functions.invoke("analyze-photo", {
          body: {
            photoBase64: formData.photo || null,
            questionnaire: {
              skinTone: formData.skinTone,
              undertone: formData.undertone,
              hairColor: formData.hairColor,
              eyeColor: formData.eyeColor,
              gender: formData.gender,
              style: formData.style,
              styles: (formData as any).styles || [formData.style],
              sunReaction: formData.sunReaction || "",
              veinColor: (formData as any).veinColor || "",
              fingerPress: (formData as any).fingerPress || "",
              eyeWhites: (formData as any).eyeWhites || "",
              freckles: (formData as any).freckles || "",
            },
          },
        });

        if (error) throw error;

        if (data?.imageQualityError) {
          setAnalysisError(data.imageQualityError);
          setResult(analyzeUser(formData));
        } else if (data && !data.error) {
          setAiData(data);
          if (data.chromaticProfile) {
            setResult(analyzeUser(formData, data as AIPhotoAnalysis));
          }
        } else {
          console.warn("AI error, using local:", data?.error);
          setResult(analyzeUser(formData));
        }
      } catch (err) {
        console.error("AI analysis failed:", err);
        setAnalysisError("No pudimos completar el análisis con IA. Mostramos resultados basados en tus respuestas.");
        setResult(analyzeUser(formData));
      } finally {
        setIsAnalyzing(false);
      }
    };

    runAIAnalysis();
  }, []);

  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Navbar />
        <div className="text-center pt-16">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Aún no hay resultados</h2>
          <p className="text-muted-foreground mb-6">¡Haz el análisis para descubrir tus colores!</p>
          <button onClick={() => navigate("/questionnaire")} className="px-8 py-3 rounded-full bg-gradient-button text-primary-foreground font-medium shadow-soft hover:shadow-medium transition-all">
            Comenzar
          </button>
        </div>
      </div>
    );
  }

  if (isAnalyzing || !result) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Navbar />
        <div className="text-center pt-16">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-button animate-pulse-soft" />
            <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
          </div>
          <h2 className="font-display text-2xl font-semibold text-foreground mb-3">Analizando tu perfil…</h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Nuestra IA está estudiando tu foto y tus respuestas para darte el resultado más preciso.
          </p>
          <div className="flex justify-center gap-1 mt-6">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-accent animate-pulse-soft" style={{ animationDelay: `${i * 0.3}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const profileText = aiData?.profile || `Un perfil ${result.profile.temperature}, ${result.profile.intensity} y ${result.profile.depth}.`;
  const recommendedColors = aiData?.recommendedColors?.length ? aiData.recommendedColors : result.recommendedColors;
  const avoidColors = aiData?.avoidColors?.length ? aiData.avoidColors : result.avoidColors;
  const whyColorsWork = aiData?.whyColorsWork || "";
  const strengths: string[] = aiData?.strengths || [];
  const whyAvoid = aiData?.whyAvoid || "";
  const clothingSuggestions = aiData?.clothingSuggestions || [];
  const outfit = aiData?.outfit || null;
  const tips = aiData?.personalizedTips?.length ? aiData.personalizedTips : result.tips;

  const genderLabel = formData.gender === "hombre" ? "hombre" : formData.gender === "mujer" ? "mujer" : "persona";

  const generateSearchUrl = (garment: string, color: string) => {
    const query = encodeURIComponent(`${garment} ${color} ${genderLabel}`);
    return `https://www.google.com/search?q=${query}`;
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-16 md:py-20 text-center px-6 relative overflow-hidden">
          <div className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-72 h-72 rounded-full bg-primary/8 blur-3xl" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-foreground text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Tu análisis está listo
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
              {formData.name}, eres
            </h1>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-gradient-rainbow mb-6">
              {result.profile.season}
            </h2>
            {analysisError && (
              <p className="mt-4 text-xs text-muted-foreground bg-background/80 px-4 py-2 rounded-xl inline-block">
                {analysisError}
              </p>
            )}
          </div>
        </section>

        {/* Profile */}
        <section className="py-10 px-6">
          <div className="max-w-2xl mx-auto">
            <h3 className="font-display text-xl font-semibold text-foreground mb-4 text-center">Perfil</h3>
            <p className="text-muted-foreground text-sm text-center leading-relaxed mb-6 max-w-lg mx-auto">{profileText}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Temperatura", value: result.profile.temperature },
                { label: "Intensidad", value: result.profile.intensity },
                { label: "Profundidad", value: result.profile.depth },
                { label: "Estación", value: result.profile.season },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-2xl bg-background shadow-soft text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground capitalize">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recommended Colors */}
        <section className="py-10 px-6">
          <div className="max-w-2xl mx-auto">
            <h3 className="font-display text-xl font-semibold text-foreground mb-6 text-center">Tu Paleta Ideal</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {recommendedColors.slice(0, 6).map((color: any, i: number) => (
                <div key={i} className="group text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="aspect-square rounded-2xl shadow-soft mb-2 transition-all duration-300 group-hover:shadow-medium group-hover:scale-105" style={{ backgroundColor: color.hex }} />
                  <p className="text-[10px] text-muted-foreground leading-tight">{color.name}</p>
                </div>
              ))}
            </div>
            {whyColorsWork && (
              <p className="text-muted-foreground text-sm text-center mt-6 max-w-lg mx-auto leading-relaxed">{whyColorsWork}</p>
            )}
          </div>
        </section>

        {/* Strengths */}
        {strengths.length > 0 && (
          <section className="py-8 px-6">
            <div className="max-w-2xl mx-auto">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4 text-center flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-accent" />
                Puntos Fuertes
              </h3>
              <div className="space-y-2">
                {strengths.map((s: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-card shadow-soft animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                    <p className="text-sm text-foreground">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Avoid Colors */}
        <section className="py-8 px-6">
          <div className="max-w-2xl mx-auto">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4 text-center flex items-center justify-center gap-2">
              <ShieldX className="w-5 h-5 text-destructive/60" />
              Mejor Evitar
            </h3>
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {avoidColors.slice(0, 3).map((color: any, i: number) => (
                <div key={i} className="group text-center">
                  <div className="aspect-square rounded-2xl shadow-soft mb-2 opacity-60 ring-1 ring-destructive/20" style={{ backgroundColor: color.hex }} />
                  <p className="text-[10px] text-muted-foreground leading-tight">{color.name}</p>
                </div>
              ))}
            </div>
            {whyAvoid && (
              <p className="text-muted-foreground text-xs text-center mt-4 max-w-md mx-auto leading-relaxed">{whyAvoid}</p>
            )}
          </div>
        </section>

        {/* Clothing Suggestions with links */}
        {clothingSuggestions.length > 0 && (
          <section className="py-12 px-6">
            <div className="max-w-2xl mx-auto">
              <h3 className="font-display text-xl font-semibold text-foreground mb-2 text-center flex items-center justify-center gap-2">
                <Shirt className="w-5 h-5 text-accent" />
                Prendas Que Te Van Mejor
              </h3>
              <p className="text-muted-foreground text-xs text-center mb-6">Según tu paleta y estilo</p>
              <div className="space-y-3">
                {clothingSuggestions.slice(0, 5).map((s: any, i: number) => {
                  const url = s.searchUrl || generateSearchUrl(s.item, recommendedColors[i]?.name || "");
                  return (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-4 rounded-xl bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 group animate-fade-in-up"
                      style={{ animationDelay: `${i * 0.08}s` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{s.item}</p>
                        <p className="text-xs text-muted-foreground">{s.reason}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent mt-1 shrink-0 transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Outfit */}
        {outfit && outfit.pieces?.length > 0 && (
          <section className="py-12 px-6 bg-muted/20">
            <div className="max-w-2xl mx-auto">
              <h3 className="font-display text-xl font-semibold text-foreground mb-2 text-center">Tu Outfit Ideal</h3>
              {outfit.description && (
                <p className="text-muted-foreground text-sm text-center mb-6 max-w-md mx-auto">{outfit.description}</p>
              )}
              <div className="grid sm:grid-cols-2 gap-3">
                {outfit.pieces.map((p: any, i: number) => {
                  const url = p.searchUrl || generateSearchUrl(p.piece, p.color);
                  return (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-2xl bg-background shadow-soft hover:shadow-medium transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                        <Shirt className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{p.piece}</p>
                        <p className="text-xs text-muted-foreground">{p.color}</p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent shrink-0 transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Tips */}
        {tips.length > 0 && (
          <section className="py-10 px-6 bg-background">
            <div className="max-w-2xl mx-auto">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4 text-center">Tips Para Ti</h3>
              <div className="space-y-2">
                {tips.slice(0, 4).map((tip: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gradient-card shadow-soft">
                    <span className="text-accent text-xs mt-0.5">💡</span>
                    <p className="text-sm text-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-secondary/5" />
          <div className="relative z-10 max-w-md mx-auto">
            <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
              Obtén Tu Reporte Completo
            </h3>
            <p className="text-muted-foreground text-sm mb-8">
              Te enviaremos tu análisis cromático, paleta y recomendaciones a tu correo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-button text-primary-foreground font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105">
                <Mail className="w-4 h-4" />
                Enviar Mis Resultados
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-accent transition-all duration-300">
                <Share2 className="w-4 h-4" />
                Compartir
              </button>
            </div>
            <button
              onClick={() => navigate("/questionnaire")}
              className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Repetir el análisis
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
