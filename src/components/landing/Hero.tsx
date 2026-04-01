import { Button } from "@/components/ui/button";
import { REGISTER_ROUTE, LOGIN_ROUTE } from "@/lib/routes";
import { ArrowRight, Mic } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => (
  <section className="relative overflow-hidden bg-background pb-20 pt-24 md:pb-32 md:pt-36">
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/[0.04] blur-3xl" />
      <div className="absolute -left-20 top-1/2 h-[300px] w-[300px] rounded-full bg-accent/[0.06] blur-3xl" />
    </div>

    <div className="container relative mx-auto px-4 lg:px-8">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-sm font-semibold text-primary">
              <Mic className="h-3.5 w-3.5" />
              Glasovni AI ukazi za hitrejše delo
            </span>
          </motion.div>

          <motion.h1
            className="mt-4 font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
            style={{ color: "hsl(var(--text-heading))" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Rezervacije,
            <br />
            <span className="text-gradient">brez komplikacij.</span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-lg text-lg leading-relaxed md:text-xl"
            style={{ color: "hsl(var(--text-body))" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Calendra je booking platforma, ki združuje upravljanje terminov, izdajanje računov, analitiko, podatke o strankah in glasovne AI ukaze — vse na enem mestu.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button variant="hero" size="lg" className="h-13 rounded-xl px-7 text-base" asChild>
              <a href={REGISTER_ROUTE}>
                Preizkusi brezplačno
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button variant="hero-outline" size="lg" className="h-13 rounded-xl px-7 text-base" asChild>
              <a href={LOGIN_ROUTE}>Vstopi v aplikacijo</a>
            </Button>
          </motion.div>

          <motion.div
            className="mt-8 flex items-center gap-4 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> 14 dni brezplačno
            </span>
            <span className="h-3 w-px bg-border" />
            <span>Brez kreditne kartice</span>
          </motion.div>
        </div>

        {/* Dashboard mockup */}
        <motion.div
          className="relative hidden lg:block"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-accent/60" />
              <div className="h-3 w-3 rounded-full bg-primary/40" />
              <div className="ml-3 h-6 flex-1 rounded-md bg-muted" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Rezervacije danes", val: "12" },
                { label: "Prihodek ta mesec", val: "€3.240" },
                { label: "Novih strank", val: "8" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl bg-muted/60 p-4 text-center">
                  <p className="font-display text-2xl font-bold text-foreground">{s.val}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              {[
                { time: "09:00", name: "Maja K.", status: "Potrjeno" },
                { time: "10:30", name: "Peter N.", status: "Čaka" },
                { time: "13:00", name: "Ana S.", status: "Potrjeno" },
              ].map((row) => (
                <div key={row.time} className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-2.5">
                  <span className="text-sm font-medium text-foreground">{row.time} — {row.name}</span>
                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                    row.status === "Potrjeno" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                  }`}>{row.status}</span>
                </div>
              ))}
            </div>

            <div className="absolute -bottom-4 -left-4 animate-float rounded-xl border border-border bg-card px-4 py-2.5 shadow-soft">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Mic className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">"Rezerviraj Petru za petek ob 14h"</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
