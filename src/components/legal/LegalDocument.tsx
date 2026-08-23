import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type LegalDocumentProps = {
  badge: string;
  title: string;
  intro: string;
  lastUpdated: string;
  children: ReactNode;
  className?: string;
};

export const LegalDocument = ({ badge, title, intro, lastUpdated, children, className }: LegalDocumentProps) => (
  <div className="marketing-page marketing-redesign min-h-screen bg-background">
    <Navbar />
    <main className="py-16 md:py-20">
      <div className={cn("container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8", className)}>
        <section className="legal-hero-editorial border-b border-border pb-10 md:pb-12">
          <div className="max-w-3xl">
            <span className="marketing-pill inline-flex px-4 py-1.5 text-sm font-semibold text-primary">
              {badge}
            </span>
            <h1 className="marketing-section-title mt-5 text-4xl sm:text-5xl" style={{ color: "hsl(var(--text-heading))" }}>
              {title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{intro}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span>{lastUpdated}</span>
            </div>
          </div>
        </section>
        <div className="mt-8 space-y-6">{children}</div>
      </div>
    </main>
    <Footer />
  </div>
);

type LegalSectionProps = {
  id?: string;
  title: string;
  children: ReactNode;
  tone?: "default" | "highlight" | "warning";
};

export const LegalSection = ({ id, title, children, tone = "default" }: LegalSectionProps) => {
  const toneClass =
    tone === "highlight"
      ? "border-primary bg-primary/[0.035]"
      : tone === "warning"
        ? "border-amber-500 bg-amber-500/[0.045]"
        : "border-primary/25 bg-transparent";

  return (
    <section id={id} className={cn("legal-section-editorial border-l-[3px] px-6 py-5 md:px-8 md:py-6", toneClass)}>
      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">{title}</h2>
      <div className="mt-5 space-y-4 text-base leading-7 text-muted-foreground">{children}</div>
    </section>
  );
};

export const LegalList = ({ items }: { items: string[] }) => (
  <ul className="space-y-2">
    {items.map((item) => (
      <li key={item} className="flex gap-3">
        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export const LegalNotice = ({ children }: { children: ReactNode }) => (
  <div className="rounded-[10px] border border-border/60 bg-muted/40 p-5 text-sm leading-6 text-muted-foreground">{children}</div>
);
