import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { LEGAL, LEGAL_FULL_ADDRESS } from "@/lib/legal";
import { AlertTriangle, CheckCircle2, Clock, Database, Mail, Shield, Smartphone } from "lucide-react";

const deletionEmail = LEGAL.privacyEmail;
const mailSubject = "Calendra Guest App account deletion request";
const mailBody = `Hello,\n\nI would like to request deletion of my Calendra Guest App account and associated personal data.\n\nEmail used for the guest account:\nPhone number, if used:\n\nThank you.`;

const deletedData = [
  "Guest account profile data, including name, email address, phone number and language preference.",
  "Authentication data that is no longer needed for access, including local guest account credentials where applicable.",
  "Profile picture and guest app preferences where they are not required for legal or security reasons.",
  "Tenant links and client profile data where deletion or anonymisation is legally and operationally possible.",
];

const retainedData = [
  "Booking, order, invoice, payment and receipt records may be retained where required for tax, accounting, fraud-prevention, dispute handling or legal obligations.",
  "Security logs may be retained for a limited period to protect Calendra, tenants and users from abuse or unauthorised access.",
  "Data connected to a tenant's statutory business records may be anonymised instead of fully deleted when deletion is not legally possible.",
];

const AccountDeletion = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <main className="py-16 md:py-20">
      <div className="container mx-auto max-w-4xl px-4 lg:px-8">
        <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-12">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-sm font-semibold text-primary">
              Calendra Guest App
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ color: "hsl(var(--text-heading))" }}>
              Account deletion request
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              This public page explains how guests can request deletion of their Calendra Guest App account and associated personal data.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="rounded-full bg-muted px-3 py-1">Last updated: 24 May 2026</span>
              <span className="rounded-full bg-muted px-3 py-1">Developer: {LEGAL.entityName}</span>
            </div>
          </div>
        </div>

        <section className="mt-8 rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
              <Smartphone className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">How to request account deletion</h2>
          </div>
          <div className="space-y-4 text-base leading-7 text-muted-foreground">
            <p>
              You can request deletion from the Calendra Guest mobile app by opening <strong className="text-foreground">Profile</strong> and choosing <strong className="text-foreground">Delete account</strong>. The app opens this page so you can complete the request.
            </p>
            <p>
              If you cannot access the app, send an account deletion request to our privacy contact. Include the email address used for your Calendra Guest account so we can identify the correct account.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="font-semibold">
              <a href={`mailto:${deletionEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`}>
                Email deletion request
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-semibold">
              <a href="/en/privacy-policy#kontakt-in-pravice">View privacy contact details</a>
            </Button>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
              <Database className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Data deleted after account deletion</h2>
          </div>
          <ul className="space-y-3 text-base leading-7 text-muted-foreground">
            {deletedData.map((item) => (
              <li key={item} className="flex gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/[0.10] text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Data that may be retained</h2>
          </div>
          <div className="space-y-4 text-base leading-7 text-muted-foreground">
            {retainedData.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Processing time</h2>
              </div>
              <p className="text-base leading-7 text-muted-foreground">
                We normally process account deletion requests within 30 days after we verify the account and understand any legal retention requirements.
              </p>
            </div>
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
                  <Shield className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Controller details</h2>
              </div>
              <div className="space-y-2 text-base leading-7 text-muted-foreground">
                <p><strong className="text-foreground">App:</strong> Calendra Guest App</p>
                <p><strong className="text-foreground">Developer:</strong> {LEGAL.entityName}</p>
                <p><strong className="text-foreground">Address:</strong> {LEGAL_FULL_ADDRESS}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Contact</h2>
          </div>
          <p className="text-base leading-7 text-muted-foreground">
            For account deletion, privacy questions or data rights requests, contact us at{" "}
            <a className="font-medium text-primary underline underline-offset-4" href={`mailto:${deletionEmail}`}>
              {deletionEmail}
            </a>
            .
          </p>
        </section>
      </div>
    </main>

    <Footer />
  </div>
);

export default AccountDeletion;
