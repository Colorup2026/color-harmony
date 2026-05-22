import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { analyzeUser, type UserProfile, type AIPhotoAnalysis } from "@/lib/colorAnalysis";
import { Sparkles, Share2, Mail, ArrowRight, Loader2, ExternalLink, ShieldX, Shirt, CheckCircle2, Wand2 } from "lucide-react";
import { sendResultsEmail } from "@/lib/EmailService";
import { useToast } from "@/hooks/use-toast";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const formData = location.state as (UserProfile & { name: string; email: string; sunReaction?: string; styles?: string[]; veinColor?: string; fingerPress?: string; eyeWhites?: string; freckles?: string }) | null;
  const [aiData, setAiData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [result, setResult] = useState(() => formData ? analyzeUser(formData) : null);

  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

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
          if (data.chromaticProfile) setResult(analyzeUser(formData, data as AIPhotoAnalysis));
        } else {
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
          <button onClick={() => navigate("/questionnaire")} className="px-8 py-3 rounded-full bg-foreground text-background font-medium shadow-soft hover:shadow-medium transition-all">
            Comenzar
          </button>
        </div>
      </div>
    );
  }

  const loadingSteps = [
    "Analizando tus rasgos…",
    "Identificando tu subtono…",
    "Construyendo tu paleta…",
    "Preparando tus recomendaciones…",
  ];
  const [loadingStep, setLoadingStep] = useState(0);
  useEffect(() => {
    if (!isAnalyzing) return;
    const id = setInterval(() => setLoadingStep((s) => (s + 1) % loadingSteps.length), 1600);
    return () => clearInterval(id);
  }, [isAnalyzing]);

  if (isAnalyzing || !result) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Navbar />
        <div className="text-center pt-16 px-6">
          <div className="relative w-28 h-28 mx-auto mb-10">
            <div className="absolute inset-0 rounded-full bg-gradient-accent blur-2xl opacity-60 animate-pulse-soft" />
            <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center shadow-medium">
              <Loader2 className="w-9 h-9 text-primary animate-spin" />
            </div>
          </div>
          <h2 className="font-display text-3xl font-medium text-foreground mb-3">
            Analizando tu <span className="italic text-gradient-editorial">esencia</span>
          </h2>
          <p key={loadingStep} className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed animate-fade-in-up">
            {loadingSteps[loadingStep]}
          </p>
          <div className="flex justify-center gap-1.5 mt-8">
            {loadingSteps.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= loadingStep ? "w-8 bg-primary" : "w-4 bg-border"}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const profileText = aiData?.profile || `Un perfil ${result.profile.temperature}, ${result.profile.intensity} y ${result.profile.depth}.`;
  const recommendedColors = aiData?.recommendedColors?.length ? aiData.recommendedColors : result.recommendedColors;
  const avoidColors = aiData?.avoidColors?.length ? aiData.avoidColors : result.avoidColors;
  const clothingSuggestions = aiData?.clothingSuggestions || [];
  const outfit = aiData?.outfit || null;
  const tips = aiData?.personalizedTips?.length ? aiData.personalizedTips : result.tips;
  const paletteHighlight = aiData?.paletteHighlight;
  const whyColorsWork = aiData?.whyColorsWork;
  const usageTip = aiData?.usageTip;
  const strengths: string[] = aiData?.strengths || [];
  const whyAvoid = aiData?.whyAvoid;
  const contrast = aiData?.chromaticProfile?.contrast || (formData as any).contrast || "medio";

  const handleSendEmail = async () => {
    if (isSendingEmail || emailSent) return;
    setIsSendingEmail(true);
    const emailData = {
      userName: formData.name,
      userEmail: formData.email,
      season: result.profile.season,
      profileText,
      palette: recommendedColors.slice(0, 6).map((c: any) => ({ name: c.name, hex: c.hex })),
      clothingSuggestions: clothingSuggestions.slice(0, 5).map((s: any) => ({ item: s.item, reason: s.reason })),
      tips: tips.slice(0, 4),
    };
    const res = await sendResultsEmail(emailData);
    setIsSendingEmail(false);
    if (res.success) {
      setEmailSent(true);
      toast({ title: "¡Resultados enviados!", description: `Hemos enviado el reporte a ${formData.email}` });
    } else {
      toast({ title: "Error al enviar", description: "No pudimos enviar el correo. Inténtalo más tarde.", variant: "destructive" });
    }
  };

  const genderLabel = formData.gender === "hombre" ? "hombre" : formData.gender === "mujer" ? "mujer" : "unisex";
  const stripAccents = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const buildSearchUrl = (item: string, color: string, suffix: "ropa" | "outfit") => {
    const q = stripAccents(`${item} ${color} ${genderLabel} ${suffix}`)
      .toLowerCase().replace(/[^\w\s-]/g, " ").replace(/\s+/g, " ").trim().replace(/\s/g, "%20");
    return `https://www.google.com/search?q=${q}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {/* HERO — Editorial */}
        <section className="relative py-20 md:py-28 text-center px-6 overflow-hidden bg-gradient-hero">
          <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-accent/40 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-secondary/30 blur-3xl" />
          <div className="relative z-10 max-w-3xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs uppercase tracking-[0.18em] text-foreground/70 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Tu análisis está listo
            </div>
            <p className="text-muted-foreground text-sm tracking-widest uppercase mb-3">{formData.name}, perteneces a</p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium leading-[1.05]">
              <span className="italic text-gradient-editorial">{result.profile.season}</span>
            </h1>
            {paletteHighlight?.description && (
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mx-auto mt-8">
                {paletteHighlight.description}
              </p>
            )}
            {analysisError && (
              <p className="mt-6 text-xs text-muted-foreground glass-card px-4 py-2 rounded-xl inline-block">{analysisError}</p>
            )}
          </div>
        </section>

        {/* PROFILE CHIPS */}
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-muted-foreground text-base md:text-lg text-center leading-relaxed mb-8 max-w-xl mx-auto italic font-display">
              "{profileText}"
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Subtono", value: result.profile.temperature },
                { label: "Profundidad", value: result.profile.depth },
                { label: "Contraste", value: contrast },
                { label: "Intensidad", value: result.profile.intensity },
              ].map((item) => (
                <div key={item.label} className="p-5 rounded-2xl bg-gradient-card shadow-soft text-center border border-border/40">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground capitalize font-display">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PALETTE IDENTIFIED */}
        {paletteHighlight && (
          <section className="py-14 px-6">
            <div className="max-w-2xl mx-auto text-center">
              <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-medium">✨ Paleta identificada</span>
              <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground mt-3 mb-5">
                {paletteHighlight.name || result.profile.season}
              </h2>
              {paletteHighlight.description && (
                <p className="text-muted-foreground text-base leading-relaxed max-w-xl mx-auto">
                  {paletteHighlight.description}
                </p>
              )}
            </div>
          </section>
        )}

        {/* IDEAL PALETTE — rich cards with personalized why */}
        <section className="py-14 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-medium">Tus colores ideales</span>
              <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground mt-3">Una paleta hecha para ti</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommendedColors.slice(0, 12).map((color: any, i: number) => (
                <div
                  key={i}
                  className="group rounded-2xl bg-background shadow-soft border border-border/40 overflow-hidden hover:shadow-editorial transition-all duration-500 animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <div className="h-16 w-full transition-transform duration-500 group-hover:scale-[1.02]" style={{ backgroundColor: color.hex }} />
                  <div className="p-3.5">
                    <p className="text-sm font-medium text-foreground leading-tight">{color.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">{color.hex}</p>
                    {color.why && <p className="text-xs text-muted-foreground leading-relaxed">{color.why}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY THESE COLORS */}
        {whyColorsWork && (
          <section className="py-12 px-6">
            <div className="max-w-2xl mx-auto p-8 md:p-10 rounded-3xl bg-gradient-card shadow-soft border border-border/40">
              <div className="flex items-center gap-2 mb-4">
                <Wand2 className="w-4 h-4 text-primary" />
                <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-medium">Por qué funcionan tus colores</span>
              </div>
              <p className="text-foreground/85 text-base leading-relaxed font-display italic">{whyColorsWork}</p>
              {strengths.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {strengths.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-background/70 border border-border/50 text-xs text-foreground">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* USAGE TIP */}
        {usageTip && (
          <section className="py-8 px-6">
            <div className="max-w-2xl mx-auto p-6 md:p-8 rounded-3xl glass-card text-center">
              <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-medium">Consejo de uso</span>
              <p className="text-foreground/85 text-sm md:text-base leading-relaxed mt-3">{usageTip}</p>
            </div>
          </section>
        )}

        {/* COLORS TO WATCH */}
        <section className="py-14 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="font-display text-2xl md:text-3xl font-medium text-foreground mb-2 flex items-center justify-center gap-2">
                <ShieldX className="w-5 h-5 text-destructive/60" />
                Colores a vigilar
              </h3>
              {whyAvoid && <p className="text-sm text-muted-foreground max-w-lg mx-auto">{whyAvoid}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {avoidColors.slice(0, 6).map((color: any, i: number) => (
                <div key={i} className="flex gap-3 p-4 rounded-2xl bg-background shadow-soft border border-border/40 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="w-14 h-14 rounded-xl shrink-0 opacity-80 ring-1 ring-destructive/20" style={{ backgroundColor: color.hex }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{color.name}</p>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{color.hex}</span>
                    </div>
                    {color.why && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{color.why}</p>}
                    {color.advice && <p className="text-xs text-foreground/70 mt-1.5 leading-relaxed italic">💡 {color.advice}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* OUTFIT IDEAL */}
        {outfit?.pieces?.length > 0 && (
          <section className="py-16 px-6 bg-gradient-panel">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-medium">Outfit ideal</span>
                <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground mt-3">Tu look completo</h2>
                {outfit.description && <p className="text-muted-foreground text-sm mt-4 max-w-lg mx-auto leading-relaxed">{outfit.description}</p>}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {outfit.pieces.map((p: any, i: number) => {
                  const url = p.searchUrl || buildSearchUrl(p.piece, p.color, "ropa");
                  const altUrl = p.outfitUrl || buildSearchUrl(p.piece, p.color, "outfit");
                  return (
                    <div key={i} className="p-5 rounded-2xl bg-background shadow-soft border border-border/40 animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl shrink-0 shadow-soft border border-border/40" style={{ backgroundColor: recommendedColors.find((c: any) => c.name?.toLowerCase() === p.color?.toLowerCase())?.hex || recommendedColors[i]?.hex || "hsl(var(--primary))" }} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground capitalize">{p.piece}</p>
                          <p className="text-xs text-muted-foreground capitalize">{p.color}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 text-[11px]">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                          Buscar prenda <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className="text-muted-foreground/40">·</span>
                        <a href={altUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary hover:underline">
                          Ver outfits <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* CLOTHING SUGGESTIONS */}
        {clothingSuggestions.length > 0 && (
          <section className="py-14 px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-medium flex items-center justify-center gap-2">
                  <Shirt className="w-3.5 h-3.5" /> Prendas para ti
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground mt-3">Lo que mejor te queda</h2>
              </div>
              <div className="space-y-3">
                {clothingSuggestions.slice(0, 6).map((s: any, i: number) => {
                  const color = recommendedColors[i]?.name || recommendedColors[0]?.name || "";
                  const url = s.searchUrl || buildSearchUrl(s.item, color, "ropa");
                  const altUrl = s.outfitUrl || buildSearchUrl(s.item, color, "outfit");
                  return (
                    <div key={i} className="p-5 rounded-2xl bg-gradient-card shadow-soft border border-border/40 animate-fade-in-up" style={{ animationDelay: `${i * 0.07}s` }}>
                      <div className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{s.item}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{s.reason}</p>
                          <div className="flex gap-3 mt-2.5 text-[11px]">
                            <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                              Buscar prenda <ExternalLink className="w-3 h-3" />
                            </a>
                            <span className="text-muted-foreground/40">·</span>
                            <a href={altUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary hover:underline">
                              Ver outfits <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* TIPS */}
        {tips.length > 0 && (
          <section className="py-14 px-6 bg-gradient-panel">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-medium">Consejos de estilismo</span>
                <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground mt-3">Tips para ti</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {tips.slice(0, 4).map((tip: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-background shadow-soft border border-border/40 animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 font-medium">{i + 1}</span>
                    <p className="text-sm text-foreground/90 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="relative py-20 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero opacity-70" />
          <div className="relative z-10 max-w-md mx-auto">
            <span className="text-[11px] uppercase tracking-[0.22em] text-primary font-medium">Reporte completo</span>
            <h3 className="font-display text-3xl md:text-4xl font-medium text-foreground mt-3 mb-4">
              Llévate tu análisis
            </h3>
            <p className="text-muted-foreground text-sm mb-8">
              Te enviamos tu paleta, recomendaciones y outfit por correo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleSendEmail}
                disabled={isSendingEmail || emailSent}
                className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-medium shadow-soft transition-all duration-300 hover:scale-[1.03] ${
                  emailSent ? "bg-secondary text-secondary-foreground cursor-default" : "bg-foreground text-background hover:shadow-editorial"
                }`}
              >
                {isSendingEmail ? (<><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>)
                  : emailSent ? (<><CheckCircle2 className="w-4 h-4" /> Enviado</>)
                  : (<><Mail className="w-4 h-4" /> Enviar mis resultados</>)}
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-border bg-background/60 text-foreground hover:bg-background hover:border-primary transition-all duration-300">
                <Share2 className="w-4 h-4" />
                Compartir
              </button>
            </div>
            <button onClick={() => navigate("/questionnaire")} className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Repetir el análisis <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Results;
