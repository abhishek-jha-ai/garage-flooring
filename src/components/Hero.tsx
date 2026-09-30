import Image from "next/image";
import { EstimateButton } from "./EstimateContext";
import { ArrowRight, Google, Stars } from "./icons";
import { demoMode, site } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden">
      <Image
        src="/images/projects/garage-showroom.jpg"
        alt="Finished Titan garage floor with high-gloss flake coating"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[28%_center] md:object-center"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/70 via-transparent to-transparent md:from-ink/80" />
      <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-ink/70 to-transparent" />

      {demoMode && (
        <p className="absolute left-1/2 top-[4.6rem] -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-ink/50 px-3 py-1 text-[0.62rem] font-medium tracking-wide text-fog backdrop-blur">
          Interactive concept for {site.shortName}
        </p>
      )}

      <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-32 sm:px-6 md:pb-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4 !text-mist">{site.name}</p>
          <h1 id="hero-title" className="headline text-[2.6rem] sm:text-6xl lg:text-7xl">
            Epoxy &amp; Polyaspartic Floor Coatings
          </h1>
          <p className="mt-4 text-base font-medium tracking-wide text-mist sm:text-lg">{site.serviceArea}</p>

          <a
            href="#reviews"
            className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-ink/40 py-1.5 pl-2 pr-3.5 text-sm backdrop-blur"
          >
            <Google width={18} height={18} />
            <Stars />
            <span className="font-bold text-bone">{site.rating.value}</span>
            <span className="h-3.5 w-px bg-white/25" />
            <span className="text-mist">{site.rating.count} Reviews</span>
          </a>

          <div className="mt-7 grid gap-3 sm:flex">
            <EstimateButton source="hero" className="btn btn-primary w-full sm:w-auto sm:px-8">
              Get a Free Estimate <ArrowRight width={18} height={18} />
            </EstimateButton>
            <a href="#explore" className="btn btn-ghost w-full sm:w-auto sm:px-8">
              Explore Our Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
