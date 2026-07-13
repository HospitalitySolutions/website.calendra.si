import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useSiteLanguage, type SiteLanguage } from "@/lib/site-language";
import { ExternalLink, Star } from "lucide-react";
import { motion } from "framer-motion";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/?api=1&query=Calendra&query_place_id=ChIJm6_tDR93b0cRZhhgh_KBCd0";

type Review = {
  name: string;
  quote: string;
  context: string;
  initials: string;
  avatar?: string;
  avatarClassName?: string;
  translated?: boolean;
};

type TestimonialsCopy = {
  eyebrow: string;
  title: string;
  description: string;
  rating: string;
  reviewSource: string;
  translated: string;
  viewAll: string;
  permissionNote: string;
  previous: string;
  next: string;
  reviews: Review[];
};

const translations: Record<SiteLanguage, TestimonialsCopy> = {
  sl: {
    eyebrow: "Mnenja uporabnikov",
    title: "Kaj o Calendri pravijo uporabniki",
    description: "Izkušnje podjetij, ki Calendro uporabljajo pri vsakodnevnem naročanju strank.",
    rating: "5,0 na Googlu",
    reviewSource: "Google ocena",
    translated: "Prevedeno iz angleščine",
    viewAll: "Poglejte vse ocene na Googlu",
    permissionNote: "Mnenja so objavljena z dovoljenjem avtorjev.",
    previous: "Prejšnje mnenje",
    next: "Naslednje mnenje",
    reviews: [
      {
        name: "Latanya Powell",
        quote:
          "Calendro uporabljam na Irskem in se mi zdi preprosta, zanesljiva ter enostavna za upravljanje terminov. Prihrani mi čas in poskrbi, da je vse dobro organizirano. Zelo priporočam.",
        context: "Uporabnica Calendre na Irskem",
        initials: "LP",
        avatar: "/reviews/latanya-powell.png",
        translated: true,
      },
      {
        name: "Nina",
        quote:
          "Ta sistem za naročanje strank uporabljamo pri Inštitutu Avisensa. Je zelo pregleden in vsebuje veliko pomembnih funkcionalnosti, s katerimi si prihranimo čas in energijo. Res priporočam!",
        context: "Inštitut Avisensa",
        initials: "N",
        avatarClassName: "bg-pink-500",
      },
      {
        name: "Andrej Novak",
        quote:
          "Uporabljamo aplikacijo že nekaj časa, stvar deluje odlično in se vedno nadgrajuje. Toplo priporočam!",
        context: "Uporabnik Calendre",
        initials: "A",
        avatarClassName: "bg-violet-500",
      },
    ],
  },
  en: {
    eyebrow: "Customer reviews",
    title: "What Calendra users say",
    description: "Experiences from businesses that use Calendra to manage appointments every day.",
    rating: "5.0 on Google",
    reviewSource: "Google review",
    translated: "Translated from Slovenian",
    viewAll: "See all reviews on Google",
    permissionNote: "Reviews are republished with the authors’ permission.",
    previous: "Previous review",
    next: "Next review",
    reviews: [
      {
        name: "Latanya Powell",
        quote:
          "I’ve been using Calendra in Ireland and find it simple, reliable and easy to manage appointments with. It saves time and keeps everything organised. Highly recommended.",
        context: "Calendra user in Ireland",
        initials: "LP",
        avatar: "/reviews/latanya-powell.png",
      },
      {
        name: "Nina",
        quote:
          "We use this client booking system at the Avisensa Institute. It is very clear and includes many important features that help us save time and energy. Highly recommended!",
        context: "Avisensa Institute",
        initials: "N",
        avatarClassName: "bg-pink-500",
        translated: true,
      },
      {
        name: "Andrej Novak",
        quote:
          "We have been using the app for some time. It works excellently and is continuously improving. Highly recommended!",
        context: "Calendra user",
        initials: "A",
        avatarClassName: "bg-violet-500",
        translated: true,
      },
    ],
  },
};

const RatingStars = () => (
  <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
    {Array.from({ length: 5 }).map((_, index) => (
      <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
    ))}
  </div>
);

const Testimonials = () => {
  const { language } = useSiteLanguage();
  const copy = translations[language];

  return (
    <section id="mnenja" className="overflow-hidden bg-background py-20 md:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">{copy.eyebrow}</span>
            <h2
              className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "hsl(var(--text-heading))" }}
            >
              {copy.title}
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">{copy.description}</p>
          </div>

          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex w-fit items-center gap-4 rounded-2xl border border-border/70 bg-card px-5 py-4 shadow-soft transition hover:-translate-y-0.5 hover:border-primary/30"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl font-bold text-blue-600 shadow-sm">
              G
            </span>
            <span>
              <span className="flex items-center gap-2">
                <RatingStars />
                <span className="text-sm font-semibold text-foreground">{copy.rating}</span>
              </span>
              <span className="mt-1 flex items-center gap-1.5 text-sm font-medium text-primary">
                {copy.viewAll}
                <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </span>
          </a>
        </div>

        <Carousel opts={{ align: "start", loop: true }} className="mx-auto max-w-6xl">
          <CarouselContent className="items-stretch">
            {copy.reviews.map((review, index) => (
              <CarouselItem key={review.name} className="md:basis-1/2">
                <motion.article
                  className="flex h-full min-h-[330px] flex-col rounded-3xl border border-border/60 bg-card p-7 shadow-soft sm:p-8"
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <RatingStars />
                    <a
                      href={GOOGLE_REVIEWS_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition hover:text-primary"
                    >
                      <span className="text-sm font-bold text-blue-600">G</span>
                      {copy.reviewSource}
                    </a>
                  </div>

                  <blockquote className="mt-7 flex-1 font-display text-xl font-medium leading-relaxed text-foreground sm:text-[1.35rem]">
                    “{review.quote}”
                  </blockquote>

                  <div className="mt-8 flex items-center gap-3 border-t border-border/60 pt-5">
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        alt=""
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-background"
                        loading="lazy"
                      />
                    ) : (
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold text-white ${review.avatarClassName ?? "bg-primary"}`}
                        aria-hidden="true"
                      >
                        {review.initials}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">{review.name}</p>
                      <p className="text-sm text-muted-foreground">{review.context}</p>
                      {review.translated && <p className="mt-0.5 text-xs text-muted-foreground/80">{copy.translated}</p>}
                    </div>
                  </div>
                </motion.article>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            className="-bottom-16 left-auto right-12 top-auto h-10 w-10 translate-y-0 bg-card"
            aria-label={copy.previous}
          />
          <CarouselNext
            className="-bottom-16 right-0 top-auto h-10 w-10 translate-y-0 bg-card"
            aria-label={copy.next}
          />
        </Carousel>

        <p className="mt-20 text-center text-xs text-muted-foreground">{copy.permissionNote}</p>
      </div>
    </section>
  );
};

export default Testimonials;
