import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LEGAL } from "@/lib/legal";
import { useInquiry } from "@/lib/use-inquiry";
import { TrialSignupLink } from "@/components/TrialSignupLink";
import { useSiteLanguage } from "@/lib/site-language";
import {
  ArrowRight,
  Clock3,
  Headphones,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

const copy = {
  sl: {
    badge: "Kontakt",
    title: "Kako vam lahko pomagamo?",
    intro:
      "Pišite nam o paketih, funkcionalnostih, predstavitvi, preizkusnem računu, obračunu ali podpori za aplikacijo Calendra.",
    calendraTrial: "Preizkusite brezplačno",
    common: {
      name: "Ime in priimek",
      company: "Podjetje",
      email: "E-pošta",
      phone: "Telefon",
      message: "Sporočilo",
      privacy: "Podatke bomo uporabili samo za obravnavo vašega vprašanja ali povpraševanja.",
      formIntro: "Sporočilo bomo prejeli neposredno prek obrazca. Potrdilo o prejemu vam pošljemo po e-pošti.",
    },
    calendra: {
      formTitle: "Vprašanje o Calendri",
      topic: "Tema vprašanja",
      selectTopic: "Izberite temo",
      topics: ["Paketi in cena", "Funkcionalnosti", "Predstavitev / demo", "Preizkusni račun", "Obračun in naročnina", "Tehnična podpora za aplikacijo", "Drugo"],
      messagePlaceholder: "Opišite vprašanje, težavo ali funkcionalnost, ki vas zanima.",
      submit: "Pošlji vprašanje",
      subject: "Vprašanje o Calendri",
    },
    directTitle: "Raje stopite v stik neposredno?",
    directBody: "Dosegljivi smo po e-pošti in telefonu. Za učinkovitejši prvi odgovor vključite kratek opis vprašanja ali težave.",
    hours: "Delovni čas podpore",
    hoursValue: "ponedeljek–petek, 8.00–16.00",
    location: "Lokacija",
    locationValue: "Slovenija; podpora na daljavo",
    trustTitle: "Preizkusite Calendro",
    trustBody: "Calendro lahko 14 dni brezplačno preizkusite brez kreditne kartice in jo nastavite na svojih podatkih.",
  },
  en: {
    badge: "Contact",
    title: "How can we help?",
    intro:
      "Write to us about plans, features, a product demonstration, trial accounts, billing or support for the Calendra application.",
    calendraTrial: "Start a free trial",
    common: {
      name: "Full name",
      company: "Company",
      email: "Email",
      phone: "Phone",
      message: "Message",
      privacy: "We will use the information only to respond to your question or enquiry.",
      formIntro: "Your message is sent directly through this form. We will email you a receipt confirmation.",
    },
    calendra: {
      formTitle: "Question about Calendra",
      topic: "Question topic",
      selectTopic: "Choose a topic",
      topics: ["Plans and pricing", "Features", "Product demonstration", "Trial account", "Billing and subscription", "Application support", "Other"],
      messagePlaceholder: "Describe your question, issue or the feature you are interested in.",
      submit: "Send question",
      subject: "Question about Calendra",
    },
    directTitle: "Prefer to contact us directly?",
    directBody: "We are available by email and phone. Include a short description of your question or issue for a more useful first response.",
    hours: "Support hours",
    hoursValue: "Monday–Friday, 08:00–16:00",
    location: "Location",
    locationValue: "Slovenia; remote support",
    trustTitle: "Try Calendra",
    trustBody: "You can try Calendra free for 14 days without a credit card and set it up with your own data.",
  },
} as const;

const ContactPage = () => {
  const { language } = useSiteLanguage();
  const page = copy[language];
  const inquiry = useInquiry(language);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState("");
  // The form is prerendered. Until React hydrates, a submit would fall back to a
  // native GET and put the visitor's details in the URL, so keep it disabled.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const handleCalendraSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = [
      `${page.common.name}: ${name}`,
      `${page.common.company}: ${company || "-"}`,
      `${page.common.email}: ${email}`,
      `${page.common.phone}: ${phone || "-"}`,
      `${page.calendra.topic}: ${topic || "-"}`,
      "",
      `${page.common.message}:`,
      message,
    ].join("\n");

    void inquiry.submit({ name, email, phone, message: body, locale: language }, "calendra");
  };

  return (
    <div className="marketing-page marketing-redesign min-h-screen bg-background">
      <Navbar />
      <main className="py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/[0.07] px-4 py-2 text-sm font-semibold text-primary">{page.badge}</span>
            <h1 className="mt-6 font-display text-4xl font-extrabold tracking-[-0.03em] text-foreground sm:text-5xl">{page.title}</h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{page.intro}</p>
          </div>

          <div id="contact-form" className="mx-auto mt-12 grid max-w-6xl scroll-mt-28 gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
            <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft md:p-9" aria-labelledby="contact-form-title">
              <div>
                <h2 id="contact-form-title" className="font-display text-2xl font-bold text-foreground">{page.calendra.formTitle}</h2>
                <p className="mt-3 leading-7 text-muted-foreground">{page.common.formIntro}</p>
              </div>

              <form method="post" className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleCalendraSubmit}>
                <CommonFields page={page.common} name={name} company={company} email={email} phone={phone} setName={setName} setCompany={setCompany} setEmail={setEmail} setPhone={setPhone} />
                <div className="md:col-span-2">
                  <label htmlFor="calendra-contact-topic" className="mb-2 block text-sm font-semibold text-foreground">{page.calendra.topic}</label>
                  <select id="calendra-contact-topic" value={topic} onChange={(event) => setTopic(event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="">{page.calendra.selectTopic}</option>
                    {page.calendra.topics.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <MessageAndSubmit page={page.common} message={message} setMessage={setMessage} placeholder={page.calendra.messagePlaceholder} submit={page.calendra.submit} disabled={inquiry.disabled || !hydrated} />
              </form>
              <p role={inquiry.status === "error" ? "alert" : "status"} className="mt-4 text-sm">{inquiry.message}</p>
            </section>

            <ContactAside page={page} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

type CommonCopy = (typeof copy)["sl"]["common"] | (typeof copy)["en"]["common"];

const CommonFields = ({
  page,
  name,
  company,
  email,
  phone,
  setName,
  setCompany,
  setEmail,
  setPhone,
}: {
  page: CommonCopy;
  name: string;
  company: string;
  email: string;
  phone: string;
  setName: (value: string) => void;
  setCompany: (value: string) => void;
  setEmail: (value: string) => void;
  setPhone: (value: string) => void;
}) => (
  <>
    <div>
      <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-foreground">{page.name} *</label>
      <Input id="contact-name" maxLength={120} required autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
    </div>
    <div>
      <label htmlFor="contact-company" className="mb-2 block text-sm font-semibold text-foreground">{page.company}</label>
      <Input id="contact-company" maxLength={200} autoComplete="organization" value={company} onChange={(event) => setCompany(event.target.value)} />
    </div>
    <div>
      <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-foreground">{page.email} *</label>
      <Input id="contact-email" maxLength={254} required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
    </div>
    <div>
      <label htmlFor="contact-phone" className="mb-2 block text-sm font-semibold text-foreground">{page.phone}</label>
      <Input id="contact-phone" maxLength={50} type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
    </div>
  </>
);

const MessageAndSubmit = ({ page, message, setMessage, placeholder, submit, disabled }: { page: CommonCopy; message: string; setMessage: (value: string) => void; placeholder: string; submit: string; disabled: boolean }) => (
  <>
    <div className="md:col-span-2">
      <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-foreground">{page.message} *</label>
      <Textarea id="contact-message" required maxLength={2500} className="min-h-40" placeholder={placeholder} value={message} onChange={(event) => setMessage(event.target.value)} />
    </div>
    <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="max-w-xl text-sm leading-6 text-muted-foreground">{page.privacy}</p>
      <Button type="submit" disabled={disabled} variant="hero" size="lg" className="shrink-0 rounded-xl"><Send className="h-4 w-4" />{submit}</Button>
    </div>
  </>
);

const ContactAside = ({ page }: { page: (typeof copy)["sl"] | (typeof copy)["en"] }) => (
  <aside className="grid gap-5">
    <section className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
      <Mail className="h-7 w-7 text-primary" aria-hidden="true" />
      <h2 className="mt-5 text-xl font-bold text-foreground">{page.directTitle}</h2>
      <p className="mt-3 leading-7 text-muted-foreground">{page.directBody}</p>
      <div className="mt-6 grid gap-3 text-sm">
        <a href={`mailto:${LEGAL.generalEmail}`} className="flex items-center gap-3 font-semibold text-primary"><Mail className="h-4 w-4" />{LEGAL.generalEmail}</a>
        <a href={`tel:${LEGAL.supportPhoneTel}`} className="flex items-center gap-3 font-semibold text-primary"><Phone className="h-4 w-4" />{LEGAL.supportPhone}</a>
      </div>
    </section>

    <section className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
      <Headphones className="h-7 w-7 text-primary" aria-hidden="true" />
      <div className="mt-5 flex items-start gap-3"><Clock3 className="mt-1 h-5 w-5 shrink-0 text-primary" /><div><p className="font-semibold text-foreground">{page.hours}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{page.hoursValue}</p></div></div>
      <div className="mt-5 flex items-start gap-3"><MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" /><div><p className="font-semibold text-foreground">{page.location}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{page.locationValue}</p></div></div>
    </section>

    <section className="rounded-3xl border border-primary/15 bg-primary/[0.05] p-7">
      <ShieldCheck className="h-7 w-7 text-primary" aria-hidden="true" />
      <h2 className="mt-5 text-xl font-bold text-foreground">{page.trustTitle}</h2>
      <p className="mt-3 leading-7 text-muted-foreground">{page.trustBody}</p>
      <Button variant="outline" className="mt-5 rounded-xl" asChild><TrialSignupLink>{page.calendraTrial}<ArrowRight className="h-4 w-4" /></TrialSignupLink></Button>
    </section>
  </aside>
);

export default ContactPage;
