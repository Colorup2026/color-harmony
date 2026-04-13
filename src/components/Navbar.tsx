import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="font-display text-xl font-semibold text-foreground tracking-tight">
          COLOR<span className="text-gradient-warm"> UP</span>
        </button>
        <button
          onClick={() => navigate("/questionnaire")}
          className="px-5 py-2 rounded-full bg-gradient-warm text-foreground text-sm font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
        >
          Comenzar
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
