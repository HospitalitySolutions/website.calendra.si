import calendraLogo from "@/assets/calendra-logo.png";

const Footer = () => (
  <footer className="border-t border-border/60 bg-background py-12">
    <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 md:flex-row lg:px-8">
      <a href="/" className="flex items-center">
        <img src={calendraLogo} alt="Calendra" className="h-20" />
      </a>
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Calendra. Vse pravice pridržane.
      </p>
      <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
        <a href="/privacy-policy" className="transition-colors hover:text-foreground">Politika zasebnosti</a>
        <a href="/privacy-policy#kontakt-in-pravice" className="transition-colors hover:text-foreground">Kontakt glede zasebnosti</a>
        <a href="/terms-of-service" className="transition-colors hover:text-foreground">Pogoji uporabe</a>
      </div>
    </div>
  </footer>
);

export default Footer;
