import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GOOGLE_BUSINESS_PROFILE_URL } from "@/lib/external-profiles";
import { getCustomerStoryPath } from "@/lib/customer-stories";
import { useSiteLanguage, type SiteLanguage } from "@/lib/site-language";
import { ExternalLink, Quote, Star } from "lucide-react";

type Review = {
  name: string;
  quote: string;
  context: string;
  initials: string;
  avatar?: string;
  avatarClassName?: string;
  translated?: boolean;
  sourceUrl?: string;
  sourceLabel?: string;
  sourceKind?: "google" | "customer";
  storySlug?: string;
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
  readStory: string;
  reviews: Review[];
};

const translations: Record<SiteLanguage, TestimonialsCopy> = {
  sl: {
    eyebrow: "Mnenja uporabnikov",
    title: "Izkušnje uporabnikov Calendre",
    description: "Izkušnje podjetij, ki Calendro uporabljajo pri vsakodnevnem naročanju strank.",
    rating: "5,0 na Googlu",
    reviewSource: "Google ocena",
    translated: "Prevedeno iz angleščine",
    viewAll: "Poglejte vse ocene na Googlu",
    permissionNote: "Mnenja so objavljena z dovoljenjem avtorjev.",
    previous: "Prejšnje mnenje",
    next: "Naslednje mnenje",
    readStory: "Preberite zgodbo stranke",
    reviews: [
      {
        name: "Latanya Powell",
        quote: "Calendro uporabljam na Irskem in se mi zdi preprosta, zanesljiva ter enostavna za upravljanje terminov. Prihrani mi čas in poskrbi, da je vse dobro organizirano. Zelo priporočam.",
        context: "Beauty Lounge",
        initials: "LP",
        avatar: "/reviews/latanya-powell.png",
        translated: true,
        sourceKind: "google",
      },
      {
        name: "Nina Piberčnik",
        quote: "Calendra nam omogoča, da imamo termine, stranke in organizacijo dela pregledno na enem mestu. Posebej nam je pomembno, da je sistem enostaven za uporabo tako za našo ekipo kot za stranke, ki se naročajo na termine.",
        context: "Direktor, Inštitut Avisensa",
        initials: "NP",
        avatarClassName: "bg-pink-500",
        sourceUrl: "https://avisensa.com/",
        sourceLabel: "Inštitut Avisensa",
        sourceKind: "customer",
        storySlug: "institut-avisensa",
      },
      {
        name: "Urška Grmek",
        quote: "S Calendro je organizacija terminov precej enostavnejša. Stranke se lahko naročijo same, mi pa imamo ves čas jasen pregled nad urnikom in manj usklajevanja po telefonu ali sporočilih.",
        context: "Lastnik, Depilacije UG",
        initials: "UG",
        avatarClassName: "bg-emerald-500",
        sourceUrl: "https://www.depilacijeug.si/",
        sourceLabel: "Depilacije UG",
        sourceKind: "customer",
        storySlug: "depilacije-ug",
      },
      {
        name: "Andrej Novak",
        quote: "Uporabljamo aplikacijo že nekaj časa, stvar deluje odlično in se vedno nadgrajuje. Toplo priporočam!",
        context: "Uporabnik Calendre",
        initials: "A",
        avatarClassName: "bg-violet-500",
        sourceKind: "google",
      },
    ],
  },
  en: {
    eyebrow: "Customer reviews",
    title: "Calendra customer experiences",
    description: "Experiences from businesses that use Calendra to manage appointments every day.",
    rating: "5.0 on Google",
    reviewSource: "Google review",
    translated: "Translated from Slovenian",
    viewAll: "See all reviews on Google",
    permissionNote: "Reviews are republished with the authors’ permission.",
    previous: "Previous review",
    next: "Next review",
    readStory: "Read the customer story",
    reviews: [
      {
        name: "Latanya Powell",
        quote: "I’ve been using Calendra in Ireland and find it simple, reliable and easy to manage appointments with. It saves time and keeps everything organised. Highly recommended.",
        context: "Beauty Lounge",
        initials: "LP",
        avatar: "/reviews/latanya-powell.png",
        sourceKind: "google",
      },
      {
        name: "Nina Piberčnik",
        quote: "Calendra lets us keep appointments, clients and work organisation clearly in one place. It is especially important to us that the system is easy to use both for our team and for clients booking appointments.",
        context: "Director, Inštitut Avisensa",
        initials: "NP",
        avatarClassName: "bg-pink-500",
        translated: true,
        sourceUrl: "https://avisensa.com/",
        sourceLabel: "Inštitut Avisensa",
        sourceKind: "customer",
        storySlug: "institut-avisensa",
      },
      {
        name: "Urška Grmek",
        quote: "Calendra makes appointment organisation much simpler. Customers can book themselves, while we always have a clear view of the schedule and spend less time coordinating by phone or messages.",
        context: "Owner, Depilacije UG",
        initials: "UG",
        avatarClassName: "bg-emerald-500",
        translated: true,
        sourceUrl: "https://www.depilacijeug.si/",
        sourceLabel: "Depilacije UG",
        sourceKind: "customer",
        storySlug: "depilacije-ug",
      },
      {
        name: "Andrej Novak",
        quote: "We have been using the app for some time. It works excellently and is continuously improving. Highly recommended!",
        context: "Calendra user",
        initials: "A",
        avatarClassName: "bg-violet-500",
        translated: true,
        sourceKind: "google",
      },
    ],
  },
};

const RatingStars = ({ label }: { label: string }) => (
  <div className="flex items-center gap-1" role="img" aria-label={label}>
    {Array.from({ length: 5 }).map((_, index) => (
      <Star key={index} className="h-5 w-5 fill-accent text-accent" aria-hidden="true" />
    ))}
  </div>
);

const Testimonials = () => {
  const { language } = useSiteLanguage();
  const copy = translations[language];

  return (
    <section id="mnenja" className="editorial-testimonials overflow-hidden py-16 md:py-20 lg:py-24">
      <div className="container mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <Carousel opts={{ align: "start", loop: true }}>
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="marketing-eyebrow">{copy.eyebrow}</span>
              <h2 className="marketing-section-title mt-3 text-3xl sm:text-4xl lg:text-[2.8rem]">{copy.title}</h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{copy.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <a
                href={GOOGLE_BUSINESS_PROFILE_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center gap-3 text-sm font-medium text-foreground"
                aria-label={copy.viewAll}
              >
                <RatingStars label={copy.rating} />
                <span>{copy.rating}</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" aria-hidden="true" />
              </a>
              <span className="hidden h-8 w-px bg-border sm:block" aria-hidden="true" />
              <div className="flex items-center gap-3">
                <CarouselPrevious
                  aria-label={copy.previous}
                  className="static h-11 w-11 translate-x-0 translate-y-0 border-border bg-white text-primary shadow-none hover:bg-primary hover:text-white"
                />
                <CarouselNext
                  aria-label={copy.next}
                  className="static h-11 w-11 translate-x-0 translate-y-0 border-primary bg-primary text-white shadow-none hover:bg-primary/90"
                />
              </div>
            </div>
          </div>

          <CarouselContent className="mt-10 -ml-8 items-stretch overflow-visible">
            {copy.reviews.map((review) => (
              <CarouselItem key={review.name} className="basis-[92%] pl-8 md:basis-[76%] lg:basis-[66%] xl:basis-[61%]">
                <article className="flex h-full min-h-[265px] flex-col border-l-[3px] border-primary py-2 pl-7 pr-4 sm:pl-10 lg:min-h-[290px]">
                  <Quote className="h-9 w-9 fill-primary text-primary" aria-hidden="true" />
                  <blockquote className="mt-3 flex-1 font-display text-[1.45rem] font-medium leading-[1.36] tracking-[-0.03em] text-foreground sm:text-[1.75rem] lg:text-[2rem]">
                    {review.quote}
                  </blockquote>

                  <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {review.avatar ? (
                        <img
                          src={review.avatar}
                          alt=""
                          aria-hidden="true"
                          width="44"
                          height="44"
                          className="h-11 w-11 rounded-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <span className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white ${review.avatarClassName ?? "bg-primary"}`} aria-hidden="true">
                          {review.initials}
                        </span>
                      )}
                      <div>
                        <p className="font-semibold text-foreground">{review.name}</p>
                        <p className="text-sm text-muted-foreground">{review.context}</p>
                        {review.translated ? <p className="mt-0.5 text-xs text-muted-foreground">{copy.translated}</p> : null}
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-1 text-xs sm:items-end">
                      <a
                        href={review.sourceUrl ?? GOOGLE_BUSINESS_PROFILE_URL}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground transition hover:text-primary"
                      >
                        {review.sourceKind === "google" ? <span className="font-bold text-blue-600">G</span> : <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />}
                        {review.sourceLabel ?? copy.reviewSource}
                      </a>
                      {review.storySlug ? (
                        <a href={getCustomerStoryPath(review.storySlug, language)} className="font-semibold text-primary hover:underline">
                          {copy.readStory}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <p className="mt-8 text-xs text-muted-foreground">{copy.permissionNote}</p>
      </div>
    </section>
  );
};

export default Testimonials;
