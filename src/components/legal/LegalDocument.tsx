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
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="py-16 md:py-20">
      <div className={cn("container mx-auto max-w-4xl px-4 lg:px-8", className)}>
        <section className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-12">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-sm font-semibold text-primary">
              {badge}
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ color: "hsl(var(--text-heading))" }}>
              {title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{intro}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="rounded-full bg-muted px-3 py-1">{lastUpdated}</span>
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
      ? "border-primary/20 bg-primary/[0.04]"
      : tone === "warning"
        ? "border-amber-500/20 bg-amber-500/[0.06]"
        : "border-border/60 bg-card";

  return (
    <section id={id} className={cn("rounded-3xl border p-8 shadow-soft md:p-10", toneClass)}>
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
  <div className="rounded-2xl border border-border/60 bg-muted/40 p-5 text-sm leading-6 text-muted-foreground">{children}</div>
);
