import type { ChromaticProfile } from "@/lib/colorAnalysis";

interface Props {
  name: string;
  profile: ChromaticProfile;
  gender: string;
  style: string;
}

const profileLabels: Record<string, string> = {
  mujer: "Mujer",
  hombre: "Hombre",
  neutro: "Sin preferencia",
};

const styleLabels: Record<string, string> = {
  casual: "Casual",
  elegante: "Elegante",
  streetwear: "Streetwear",
  clasico: "Clásico",
  minimalista: "Minimalista",
  bohemio: "Bohemio",
};

const ProfileSummary = ({ name, profile, gender, style }: Props) => (
  <section className="py-12 px-6">
    <div className="max-w-2xl mx-auto">
      <h3 className="font-display text-xl font-semibold text-foreground mb-6 text-center">Tu Perfil Cromático</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Temperatura", value: profile.temperature, capitalize: true },
          { label: "Intensidad", value: profile.intensity, capitalize: true },
          { label: "Profundidad", value: profile.depth, capitalize: true },
          { label: "Estación", value: profile.season },
        ].map((item) => (
          <div key={item.label} className="p-4 rounded-2xl bg-background shadow-soft text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{item.label}</p>
            <p className={`text-sm font-semibold text-foreground ${item.capitalize ? "capitalize" : ""}`}>{item.value}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        <span className="px-3 py-1 rounded-full bg-secondary/30 text-xs text-foreground">{profileLabels[gender] || gender}</span>
        <span className="px-3 py-1 rounded-full bg-secondary/30 text-xs text-foreground">{styleLabels[style] || style}</span>
      </div>
    </div>
  </section>
);

export default ProfileSummary;
