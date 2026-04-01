import { Button } from "@/components/ui/button";
import { REGISTER_ROUTE } from "@/lib/routes";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const FinalCta = () => (
  <section className="relative overflow-hidden bg-background py-20 md:py-28">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-primary/[0.04] blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-accent/[0.06] blur-3xl" />
    </div>
    <div className="container relative mx-auto px-4 lg:px-8">
      <motion.div
        className="mx-auto max-w-2xl rounded-3xl border border-border/60 bg-card p-10 text-center shadow-soft md:p-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "hsl(var(--text-heading))" }}>
          Pripravljeni na spremembo?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
          Začnite brezplačno in odkrijte, zakaj nas izbirajo podjetniki po vsej Sloveniji.
        </p>
        <Button variant="hero" size="lg" className="mt-8 h-14 rounded-xl px-10 text-base" asChild>
          <a href={REGISTER_ROUTE}>
            Začni 14-dnevni preizkus
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </Button>
      </motion.div>
    </div>
  </section>
);

export default FinalCta;
