import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "@/assets/logo-colorup.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-border/60 shadow-soft"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img src={logo} alt="Color Up" className="h-9 w-auto" />
        </button>
        <button
          onClick={() => navigate("/questionnaire")}
          className="px-5 py-2 rounded-full bg-foreground text-background text-sm font-medium shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.03]"
        >
          Comenzar
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
