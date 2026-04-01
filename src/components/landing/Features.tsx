import { CalendarDays, Receipt, BarChart3, Users, Mic, Shield, Bell, Plug } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: CalendarDays,
    title: "Upravljanje rezervacij",
    description: "Koledar z dnevnim, tedenskim in mesečnim pogledom. Avtomatska sinhronizacija z Google koledarjem.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Receipt,
    title: "Izdajanje računov",
    description: "Samodejno generiranje računov ob zaključku termina. Izvoz za računovodstvo v enem kliku.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: BarChart3,
    title: "Analitika",
    description: "Pregled prihodkov, zasedenosti, trendov in konverzij strank z vizualnimi poročili.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Users,
    title: "Podatki o strankah",
    description: "Centraliziran pregled strank z zgodovino terminov, zapiski in kontaktnimi podatki.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: Mic,
    title: "AI glasovni ukazi",
    description: "Ustvarjajte in upravljajte rezervacije z glasom. »Rezerviraj Ano za torek ob 10h« — in je narejeno.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Bell,
    title: "Opomniki",
    description: "Avtomatski SMS in e-poštni opomniki za termine in neplačane račune.",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    icon: Shield,
    title: "Varnost in GDPR",
    description: "Šifrirani podatki, varno gostovanje v EU in skladnost z uredbo GDPR.",
    color: "bg-slate-100 text-slate-600",
  },
  {
    icon: Plug,
    title: "Integracije",
    description: "Google Calendar, Stripe plačila, Zoom video klici in še več — vse povezano.",
    color: "bg-orange-50 text-orange-600",
  },
];

const Features = () => (
  <section id="funkcionalnosti" className="scroll-mt-20 bg-card py-20 md:py-28">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="mb-16 max-w-xl">
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">Funkcionalnosti</span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "hsl(var(--text-heading))" }}>
          Vse kar potrebujete,<br />na enem mestu.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Od prve rezervacije do zadnjega računa — Calendra pokriva celoten proces.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            className="group relative rounded-2xl border border-border/50 bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.color}`}>
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-base font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
