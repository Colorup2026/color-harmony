import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  photo: string | null;
  skinTone: string;
  hairColor: string;
  eyeColor: string;
}

const skinTones = [
  { id: "fair", label: "Fair", color: "#FDEBD0" },
  { id: "light", label: "Light", color: "#F5CBA7" },
  { id: "medium", label: "Medium", color: "#D4A574" },
  { id: "olive", label: "Olive", color: "#C4A77D" },
  { id: "tan", label: "Tan", color: "#A0785A" },
  { id: "dark", label: "Dark", color: "#6F4E37" },
];

const hairColors = [
  { id: "blonde", label: "Blonde", color: "#E8D5A3" },
  { id: "light-brown", label: "Light Brown", color: "#A0785A" },
  { id: "dark-brown", label: "Dark Brown", color: "#5C4033" },
  { id: "black", label: "Black", color: "#2C2C2C" },
  { id: "red", label: "Red", color: "#A0522D" },
  { id: "grey", label: "Grey/White", color: "#C0C0C0" },
];

const eyeColors = [
  { id: "blue", label: "Blue", color: "#6CA0DC" },
  { id: "green", label: "Green", color: "#7BA17C" },
  { id: "hazel", label: "Hazel", color: "#8E7618" },
  { id: "brown", label: "Brown", color: "#6B4226" },
  { id: "dark-brown", label: "Dark Brown", color: "#3B2F2F" },
  { id: "grey", label: "Grey", color: "#A8B5C2" },
];

const totalSteps = 5;

const Questionnaire = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    photo: null,
    skinTone: "",
    hairColor: "",
    eyeColor: "",
  });

  const progress = ((step + 1) / totalSteps) * 100;

  const canNext = useCallback(() => {
    switch (step) {
      case 0: return formData.name.trim() !== "" && formData.email.trim() !== "";
      case 1: return true; // photo is optional
      case 2: return formData.skinTone !== "";
      case 3: return formData.hairColor !== "";
      case 4: return formData.eyeColor !== "";
      default: return false;
    }
  }, [step, formData]);

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else {
      // Navigate to results with data
      navigate("/results", { state: formData });
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
      reader.onloadend = () => setFormData({ ...formData, photo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const OptionGrid = ({
    items,
    selected,
    onSelect,
  }: {
    items: { id: string; label: string; color: string }[];
    selected: string;
    onSelect: (id: string) => void;
  }) => (
    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
            selected === item.id
              ? "shadow-medium scale-105 ring-2 ring-warm-peach"
              : "shadow-soft hover:shadow-medium hover:scale-[1.02]"
          } bg-background`}
        >
          <div
            className="w-14 h-14 rounded-full shadow-sm"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-xs font-medium text-foreground">{item.label}</span>
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
              <label className="block text-sm font-medium text-foreground mb-2">Your Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-5 py-3.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warm-peach transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-5 py-3.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warm-peach transition-all"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="max-w-sm mx-auto text-center animate-fade-in-up">
            <label className="block cursor-pointer">
              <div
                className={`w-48 h-48 mx-auto rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-300 ${
                  formData.photo
                    ? "border-warm-peach"
                    : "border-border hover:border-warm-peach/50"
                }`}
              >
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt="Your photo"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Upload a selfie</span>
                    <span className="text-xs text-muted-foreground mt-1">(Optional)</span>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
            {formData.photo && (
              <button
                onClick={() => setFormData({ ...formData, photo: null })}
                className="mt-4 text-sm text-muted-foreground underline"
              >
                Remove photo
              </button>
            )}
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in-up">
            <OptionGrid
              items={skinTones}
              selected={formData.skinTone}
              onSelect={(id) => setFormData({ ...formData, skinTone: id })}
            />
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in-up">
            <OptionGrid
              items={hairColors}
              selected={formData.hairColor}
              onSelect={(id) => setFormData({ ...formData, hairColor: id })}
            />
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in-up">
            <OptionGrid
              items={eyeColors}
              selected={formData.eyeColor}
              onSelect={(id) => setFormData({ ...formData, eyeColor: id })}
            />
          </div>
        );
    }
  };

  const stepTitles = [
    "Let's get to know you",
    "Upload a photo",
    "What's your skin tone?",
    "What's your hair color?",
    "What's your eye color?",
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />
      <div className="pt-16 min-h-screen flex flex-col">
        {/* Progress bar */}
        <div className="w-full h-1 bg-muted">
          <div
            className="h-full bg-gradient-warm transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          {/* Step title */}
          <p className="text-muted-foreground text-sm mb-2 font-body">
            Step {step + 1} of {totalSteps}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-10 text-center">
            {stepTitles[step]}
          </h2>

          {/* Step content */}
          {renderStep()}

          {/* Navigation */}
          <div className="flex items-center gap-4 mt-12">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canNext()}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-warm text-foreground font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {step === totalSteps - 1 ? "See My Colors" : "Next"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
