import type { AIPhotoAnalysis } from "@/lib/colorAnalysis";
import { Camera, CheckCircle, AlertCircle, Eye } from "lucide-react";

interface Props {
  aiAnalysis: AIPhotoAnalysis;
}

const AIInsights = ({ aiAnalysis }: Props) => {
  const { photoAnalysis, crossValidation } = aiAnalysis;
  const agreementColor = {
    alta: "text-green-600",
    media: "text-amber-600",
    baja: "text-red-500",
  };

  return (
    <section className="py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/20 text-foreground text-xs mb-3">
            <Eye className="w-3 h-3" />
            Análisis Visual con IA
          </div>
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">Lo Que Detectamos en Tu Foto</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Nuestra IA analizó tus rasgos y los comparó con tus respuestas para asegurar la precisión del resultado.
          </p>
        </div>

        {/* Detected Features */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: "Tono de piel", value: photoAnalysis.detectedSkinTone },
            { label: "Subtono", value: photoAnalysis.detectedUndertone },
            { label: "Color de cabello", value: photoAnalysis.detectedHairColor },
            { label: "Profundidad cabello", value: photoAnalysis.detectedHairDepth },
            { label: "Color de ojos", value: photoAnalysis.detectedEyeColor },
            { label: "Contraste", value: photoAnalysis.detectedContrast },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-xl bg-background shadow-soft text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{item.label}</p>
              <p className="text-sm font-medium text-foreground capitalize">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Cross-validation */}
        <div className="p-5 rounded-2xl bg-gradient-card shadow-soft">
          <div className="flex items-center gap-2 mb-3">
            <Camera className="w-4 h-4 text-accent" />
            <h4 className="font-display text-sm font-semibold text-foreground">Validación Cruzada Foto × Cuestionario</h4>
          </div>
          <div className="flex flex-wrap gap-3 mb-3">
            {[
              { label: "Piel", match: crossValidation.skinToneMatch },
              { label: "Cabello", match: crossValidation.hairColorMatch },
              { label: "Ojos", match: crossValidation.eyeColorMatch },
              { label: "Contraste", match: crossValidation.contrastMatch },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-xs">
                {item.match ? (
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span className="text-foreground">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground">Concordancia general:</span>
            <span className={`text-xs font-semibold capitalize ${agreementColor[crossValidation.overallAgreement]}`}>
              {crossValidation.overallAgreement}
            </span>
          </div>
          {crossValidation.adjustments && (
            <p className="text-xs text-muted-foreground leading-relaxed mt-2 border-t border-border pt-2">
              {crossValidation.adjustments}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AIInsights;
