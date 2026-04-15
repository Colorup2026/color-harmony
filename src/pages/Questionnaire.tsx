import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ArrowLeft, ArrowRight, Upload, Sparkles, Camera, CheckCircle2 } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  photo: string | null;
  skinTone: string;
  undertone: string;
  sunReaction: string;
  hairColor: string;
  eyeColor: string;
  gender: string;
  style: string;
  contrast: string;
  photoConsent: boolean;
}

const skinTones = [
  { id: "fair", label: "Muy Clara", color: "#FDEBD0" },
  { id: "light", label: "Clara", color: "#F5CBA7" },
  { id: "medium", label: "Media", color: "#D4A574" },
  { id: "olive", label: "Oliva", color: "#C4A77D" },
  { id: "golden", label: "Dorada", color: "#B8860B" },
  { id: "tan", label: "Morena", color: "#A0785A" },
  { id: "dark", label: "Oscura", color: "#6F4E37" },
  { id: "porcelain", label: "Porcelana", color: "#FFF5EE" },
];

const eyeColors = [
  { id: "blue", label: "Azul", color: "#6CA0DC" },
  { id: "green", label: "Verde", color: "#7BA17C" },
  { id: "hazel", label: "Avellana", color: "#8E7618" },
  { id: "amber", label: "Ámbar", color: "#FFBF00" },
  { id: "honey", label: "Miel", color: "#B8860B" },
  { id: "brown", label: "Marrón", color: "#6B4226" },
  { id: "dark-brown", label: "Marrón Oscuro", color: "#3B2F2F" },
  { id: "grey", label: "Gris", color: "#A8B5C2" },
];

const hairColors = [
  { id: "blonde", label: "Rubio", color: "#E8D5A3" },
  { id: "strawberry", label: "Rubio Fresa", color: "#C78C6C" },
  { id: "light-brown", label: "Castaño Claro", color: "#A0785A" },
  { id: "dark-brown", label: "Castaño Oscuro", color: "#5C4033" },
  { id: "black", label: "Negro", color: "#2C2C2C" },
  { id: "red", label: "Pelirrojo", color: "#A0522D" },
  { id: "ash-brown", label: "Castaño Ceniza", color: "#8B7D6B" },
  { id: "grey", label: "Gris / Blanco", color: "#C0C0C0" },
];

const genderOptions = [
  { id: "mujer", label: "Mujer", emoji: "👩" },
  { id: "hombre", label: "Hombre", emoji: "👨" },
  { id: "neutro", label: "Sin preferencia", emoji: "✨" },
];

const styleOptions = [
  { id: "streetwear", label: "Streetwear", emoji: "🧢", desc: "Urbano y moderno" },
  { id: "casual", label: "Casual", emoji: "👕", desc: "Cómodo y relajado" },
  { id: "elegante", label: "Elegante / Smart", emoji: "👔", desc: "Sofisticado y pulido" },
  { id: "deportivo", label: "Deportivo / Active", emoji: "🏃", desc: "Funcional y dinámico" },
  { id: "trendy", label: "Trendy / Fashion", emoji: "💎", desc: "A la última tendencia" },
];

const sunReactionOptions = [
  { id: "burn", label: "Me quemo fácilmente y me cuesta broncearme", hint: "Suele indicar subtono frío", visual: "☀️🔥" },
  { id: "tan", label: "Me bronceo con facilidad y rara vez me quemo", hint: "Suele indicar subtono cálido", visual: "☀️✨" },
  { id: "mixed", label: "A veces me quemo y a veces me bronceo / No estoy seguro/a", hint: "Puede indicar subtono neutro", visual: "☀️🤷" },
];

const totalSteps = 9;

const Questionnaire = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    photo: null,
    skinTone: "",
    undertone: "",
    sunReaction: "",
    hairColor: "",
    eyeColor: "",
    gender: "",
    style: "",
    contrast: "",
    photoConsent: false,
  });

  const progress = ((step + 1) / totalSteps) * 100;

  const canNext = useCallback(() => {
    switch (step) {
      case 0: return formData.name.trim() !== "" && formData.email.trim() !== "";
      case 1: return formData.gender !== "";
      case 2: return formData.skinTone !== "";
      case 3: return formData.eyeColor !== "";
      case 4: return formData.hairColor !== "";
      case 5: return formData.style !== "";
      case 6: return formData.sunReaction !== "";
      case 7: return formData.photo !== null && formData.photoConsent;
      case 8: return true; // summary
      default: return false;
    }
  }, [step, formData]);

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else {
      // Derive undertone from sun reaction for the analysis engine
      let undertone = "neutral";
      if (formData.sunReaction === "burn") undertone = "cool";
      else if (formData.sunReaction === "tan") undertone = "warm";

      navigate("/results", {
        state: {
          name: formData.name,
          email: formData.email,
          photo: formData.photo,
          skinTone: formData.skinTone,
          undertone,
          hairColor: formData.hairColor,
          hairDepth: "medium", // AI will detect from photo
          eyeColor: formData.eyeColor,
          gender: formData.gender,
          style: formData.style,
          contrast: "medium", // AI will detect from photo
          sunReaction: formData.sunReaction,
        },
      });
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else navigate("/");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxSize = 800;
          let w = img.width;
          let h = img.height;
          if (w > maxSize || h > maxSize) {
            if (w > h) { h = (h / w) * maxSize; w = maxSize; }
            else { w = (w / h) * maxSize; h = maxSize; }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, w, h);
          const resized = canvas.toDataURL("image/jpeg", 0.8);
          setFormData({ ...formData, photo: resized });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const ColorOptionGrid = ({
    items,
    selected,
    onSelect,
  }: {
    items: { id: string; label: string; color: string }[];
    selected: string;
    onSelect: (id: string) => void;
  }) => (
    <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 ${
            selected === item.id
              ? "shadow-medium scale-105 ring-2 ring-accent"
              : "shadow-soft hover:shadow-medium hover:scale-[1.02]"
          } bg-background`}
        >
          <div
            className="w-12 h-12 rounded-full shadow-sm border border-border"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-[11px] font-medium text-foreground leading-tight text-center">{item.label}</span>
        </button>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6 max-w-sm mx-auto animate-fade-in-up">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tu Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Escribe tu nombre"
                className="w-full px-5 py-3.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Correo Electrónico</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="tu@correo.com"
                className="w-full px-5 py-3.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto animate-fade-in-up">
            {genderOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFormData({ ...formData, gender: opt.id })}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-300 ${
                  formData.gender === opt.id
                    ? "shadow-medium scale-105 ring-2 ring-accent"
                    : "shadow-soft hover:shadow-medium hover:scale-[1.02]"
                } bg-background`}
              >
                <span className="text-4xl">{opt.emoji}</span>
                <span className="text-sm font-medium text-foreground">{opt.label}</span>
              </button>
            ))}
          </div>
        );
      case 2:
        return <div className="animate-fade-in-up"><ColorOptionGrid items={skinTones} selected={formData.skinTone} onSelect={(id) => setFormData({ ...formData, skinTone: id })} /></div>;
      case 3:
        return <div className="animate-fade-in-up"><ColorOptionGrid items={eyeColors} selected={formData.eyeColor} onSelect={(id) => setFormData({ ...formData, eyeColor: id })} /></div>;
      case 4:
        return <div className="animate-fade-in-up"><ColorOptionGrid items={hairColors} selected={formData.hairColor} onSelect={(id) => setFormData({ ...formData, hairColor: id })} /></div>;
      case 5:
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto animate-fade-in-up">
            {styleOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFormData({ ...formData, style: opt.id })}
                className={`flex flex-col items-center gap-2 p-5 rounded-2xl transition-all duration-300 ${
                  formData.style === opt.id
                    ? "shadow-medium scale-105 ring-2 ring-accent"
                    : "shadow-soft hover:shadow-medium hover:scale-[1.02]"
                } bg-background`}
              >
                <span className="text-3xl">{opt.emoji}</span>
                <span className="text-sm font-semibold text-foreground">{opt.label}</span>
                <span className="text-[10px] text-muted-foreground">{opt.desc}</span>
              </button>
            ))}
          </div>
        );
      case 6:
        return (
          <div className="flex flex-col gap-4 max-w-md mx-auto animate-fade-in-up">
            {sunReactionOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFormData({ ...formData, sunReaction: opt.id })}
                className={`flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 text-left ${
                  formData.sunReaction === opt.id
                    ? "shadow-medium scale-[1.02] ring-2 ring-accent"
                    : "shadow-soft hover:shadow-medium"
                } bg-background`}
              >
                <span className="text-2xl">{opt.visual}</span>
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground block">{opt.label}</span>
                  <span className="text-xs text-muted-foreground italic">{opt.hint}</span>
                </div>
              </button>
            ))}
          </div>
        );
      case 7:
        return (
          <div className="max-w-sm mx-auto text-center animate-fade-in-up">
            <p className="text-xs text-muted-foreground mb-6 max-w-xs mx-auto leading-relaxed">
              Sube una foto de frente, con buena iluminación natural o luz blanca, sin filtros, sin gafas de sol y con el rostro bien visible. Esto es clave para obtener un análisis preciso.
            </p>
            <label className="block cursor-pointer">
              <div
                className={`w-48 h-48 mx-auto rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 ${
                  formData.photo ? "border-accent" : "border-border hover:border-accent/50"
                }`}
              >
                {formData.photo ? (
                  <img src={formData.photo} alt="Tu foto" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Sube tu foto</span>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
            {formData.photo && (
              <button onClick={() => setFormData({ ...formData, photo: null })} className="mt-3 text-sm text-muted-foreground underline">
                Eliminar foto
              </button>
            )}
            <label className="flex items-start gap-3 mt-6 text-left max-w-xs mx-auto cursor-pointer">
              <input
                type="checkbox"
                checked={formData.photoConsent}
                onChange={(e) => setFormData({ ...formData, photoConsent: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded border-border accent-accent"
              />
              <span className="text-xs text-muted-foreground leading-relaxed">
                Consiento el uso de mi foto únicamente para esta recomendación personalizada
              </span>
            </label>
          </div>
        );
      case 8:
        return (
          <div className="max-w-md mx-auto animate-fade-in-up text-center">
            <div className="p-6 rounded-2xl bg-gradient-card shadow-soft mb-6">
              <p className="text-sm text-foreground font-medium mb-4">Resumen de tu perfil</p>
              <div className="grid grid-cols-2 gap-3 text-left text-xs text-muted-foreground">
                <div><span className="font-medium text-foreground">Nombre:</span> {formData.name}</div>
                <div><span className="font-medium text-foreground">Género:</span> {formData.gender}</div>
                <div><span className="font-medium text-foreground">Piel:</span> {skinTones.find(s => s.id === formData.skinTone)?.label}</div>
                <div><span className="font-medium text-foreground">Ojos:</span> {eyeColors.find(s => s.id === formData.eyeColor)?.label}</div>
                <div><span className="font-medium text-foreground">Cabello:</span> {hairColors.find(s => s.id === formData.hairColor)?.label}</div>
                <div><span className="font-medium text-foreground">Estilo:</span> {styleOptions.find(s => s.id === formData.style)?.label}</div>
              </div>
              {formData.photo && (
                <div className="mt-4">
                  <img src={formData.photo} alt="Tu foto" className="w-16 h-16 rounded-xl object-cover mx-auto" />
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">¿Todo correcto? Pulsa "Analizar" para obtener tus resultados.</p>
          </div>
        );
    }
  };

  const stepTitles = [
    "Vamos a conocerte",
    "¿Cómo te identificas?",
    "¿Cuál es tu tono de piel?",
    "¿Cuál es tu color de ojos?",
    "¿Cuál es tu color de cabello?",
    "¿Cuál es tu estilo?",
    "Cuando te expones al sol, ¿cómo reacciona tu piel?",
    "Sube una foto tuya",
    "Revisa tu perfil",
  ];

  const stepSubtitles = [
    "Cuéntanos un poco sobre ti",
    "Esto nos ayuda a personalizar tus recomendaciones",
    "Selecciona el que más se parezca al tuyo",
    "Selecciona tu color de ojos natural",
    "Elige el color más cercano al tuyo natural",
    "Define tu estilo para recomendaciones más precisas",
    "Esta pregunta nos ayuda a identificar si tu piel tiene un subtono cálido o frío",
    "Nuestra IA analizará tus rasgos para un resultado preciso",
    "Confirma tus datos antes de obtener el análisis",
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      <div className="pt-16 min-h-screen flex flex-col">
        <div className="w-full h-1.5 bg-muted">
          <div className="h-full bg-gradient-button transition-all duration-500 ease-out rounded-r-full" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
          <p className="text-muted-foreground text-sm mb-1 font-body">
            Paso {step + 1} de {totalSteps}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2 text-center">
            {stepTitles[step]}
          </h2>
          <p className="text-muted-foreground text-sm mb-8 text-center max-w-md">{stepSubtitles[step]}</p>

          {renderStep()}

          <div className="flex items-center gap-4 mt-10">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Atrás
            </button>
            <button
              onClick={handleNext}
              disabled={!canNext()}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-button text-primary-foreground font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {step === totalSteps - 1 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analizar Mis Colores
                </>
              ) : (
                <>
                  Siguiente
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
