"use client";

import { trackEvent } from "@/lib/analytics";
import { site } from "@/lib/site";
import { ArrowRight, Google, Shield, Stars } from "./icons";

/** Verbatim customer review from titangarage.org. Add more real reviews here. */
const testimonials = [
  {
    quote:
      "Had our garage floor done by them a couple of years ago and it still looks great. Very pleased with their customer service and have recommended them to others in the Englewood area. Highly recommend.",
    name: "Mary C.",
    detail: "Garage floor · Englewood",
  },
];

export function Testimonials() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-ink py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow">Reviews</p>
        <h2 id="reviews-title" className="headline mt-3 text-3xl sm:text-5xl">
          Bradenton’s five-star floor team.
        </h2>

        <div className="mt-8 grid gap-4 sm:mt-10 lg:grid-cols-[20rem_1fr]">
          <div className="flex flex-col justify-between gap-6 rounded-3xl bg-bone p-6 text-ink sm:p-8">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-ink/70">
                <Google width={22} height={22} /> Google Rating
              </div>
              <p className="mt-4 font-display text-7xl font-extrabold leading-none tracking-tight">{site.rating.value}</p>
              <Stars className="mt-3 [&_svg]:h-6 [&_svg]:w-6" />
              <p className="mt-2 text-sm font-semibold text-ink/70">Based on {site.rating.count} reviews</p>
            </div>
            <a
              href={site.reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("reviews_clicked")}
              className="inline-flex items-center gap-1.5 text-sm font-bold underline-offset-4 hover:underline"
            >
              Read reviews on Google <ArrowRight width={16} height={16} />
            </a>
          </div>

          <div className="grid gap-4">
            {testimonials.map((t) => (
              <figure key={t.name} className="flex flex-col justify-between rounded-3xl border border-white/[0.07] bg-coal p-6 sm:p-10">
                <Stars />
                <blockquote className="mt-5 font-display text-xl font-semibold leading-snug sm:text-2xl lg:text-[1.75rem]">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-steel font-bold">{t.name[0]}</span>
                  <span>
                    <span className="block text-sm font-bold">{t.name}</span>
                    <span className="block text-xs text-fog">{t.detail}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
            <div className="flex items-center gap-4 rounded-3xl border border-white/[0.07] bg-coal p-5 sm:p-6">
              <Shield width={32} height={32} className="shrink-0 text-bone" />
              <p className="text-sm leading-snug text-mist">
                <span className="font-bold text-bone">BBB Accredited Business.</span> Family owned and operated, backed by a Life of the Home Warranty.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
