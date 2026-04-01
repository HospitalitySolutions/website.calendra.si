import calendraLogo from "@/assets/calendra-logo.png";

const Footer = () => (
  <footer className="border-t border-border/60 bg-background py-12">
    <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 md:flex-row lg:px-8">
      <img src={calendraLogo} alt="Calendra" className="h-20" />
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Calendra. Vse pravice pridržane.
      </p>
      <div className="flex gap-6 text-sm text-muted-foreground">
        <a href="#" className="transition-colors hover:text-foreground">Pogoji uporabe</a>
        <a href="#" className="transition-colors hover:text-foreground">Zasebnost</a>
        <a href="#" className="transition-colors hover:text-foreground">Kontakt</a>
      </div>
    </div>
  </footer>
);

export default Footer;
