import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    initials: "TM",
    name: "Tina M.",
    role: "Lastnica kozmetičnega salona",
    quote:
      "Calendra mi je popolnoma spremenila način dela. Prej sem porabila ure za telefonske rezervacije, zdaj stranke same izberejo termin. Glasovni ukazi pa so čista magija!",
  },
  {
    initials: "JN",
    name: "Janez N.",
    role: "Fizioterapevt",
    quote:
      "Račune izdam v enem kliku, analitika mi pokaže kateri dnevi so najbolj zasedeni, stranke pa dobijo avtomatske opomnike. Vse na enem mestu.",
  },
  {
    initials: "SB",
    name: "Sara B.",
    role: "Vodja wellness centra",
    quote:
      "Z 8 zaposlenimi in 200+ strankami mesečno smo potrebovali sistem, ki raste z nami. Calendra to omogoča brez stresa.",
  },
];

const Testimonials = () => (
  <section className="bg-background py-20 md:py-28">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="mb-14 text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">Mnenja</span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "hsl(var(--text-heading))" }}>
          Zaupajo nam podjetniki
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            className="relative flex flex-col rounded-2xl border border-border/50 bg-card p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Quote className="mb-4 h-8 w-8 text-primary/20" />
            <p className="flex-1 text-base leading-relaxed" style={{ color: "hsl(var(--text-body))" }}>{t.quote}</p>
            <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
