import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LOGIN_ROUTE, REGISTER_ROUTE, FEATURES_SECTION, PRICING_SECTION } from "@/lib/routes";
import { Menu, X } from "lucide-react";
import calendraLogo from "@/assets/calendra-logo.png";

const navLinks = [
  { label: "Funkcionalnosti", href: FEATURES_SECTION },
  { label: "Cenik", href: PRICING_SECTION },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-card/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
        <a href="/" className="flex items-center">
          <img src={calendraLogo} alt="Calendra" className="h-14 md:h-16" />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="default" className="font-medium" asChild>
            <a href={LOGIN_ROUTE}>Prijava</a>
          </Button>
          <Button variant="hero" size="default" className="rounded-xl px-5" asChild>
            <a href={REGISTER_ROUTE}>Preizkusi brezplačno</a>
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-card px-4 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-base font-medium text-muted-foreground" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <Button variant="hero" size="lg" className="rounded-xl" asChild>
              <a href={REGISTER_ROUTE}>Preizkusi brezplačno</a>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <a href={LOGIN_ROUTE}>Prijava</a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
