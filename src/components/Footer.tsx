import logo from "@/assets/logo-colorup.png";

const Footer = () => (
  <footer className="py-10 bg-background border-t border-border/50">
    <div className="container mx-auto px-6 flex flex-col items-center gap-3">
      <img src={logo} alt="Color Up" className="h-8 w-auto opacity-70" />
      <p className="text-muted-foreground text-sm">
        Descubre los colores que te hacen brillar.
      </p>
    </div>
  </footer>
);

export default Footer;
