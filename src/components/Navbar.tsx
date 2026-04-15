import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo-colorup.png";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={logo} alt="Color Up" className="h-10 w-auto" />
        </button>
        <button
          onClick={() => navigate("/questionnaire")}
          className="px-5 py-2 rounded-full bg-gradient-button text-primary-foreground text-sm font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
        >
          Comenzar
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
