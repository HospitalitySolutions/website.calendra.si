import { motion } from "framer-motion";

const stats = [
  { value: "1.200+", label: "Aktivnih uporabnikov", accent: false },
  { value: "85.000+", label: "Rezervacij mesečno", accent: true },
  { value: "99,9%", label: "Zanesljivost", accent: false },
  { value: "4,8★", label: "Ocena uporabnikov", accent: false },
];

const Stats = () => (
  <section className="relative bg-background py-16">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className={`rounded-2xl border border-border/60 p-6 text-center ${s.accent ? "bg-primary text-primary-foreground" : "bg-card"}`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <p className={`font-display text-3xl font-extrabold md:text-4xl ${s.accent ? "" : "text-foreground"}`}>{s.value}</p>
            <p className={`mt-1 text-sm font-medium ${s.accent ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Stats;
