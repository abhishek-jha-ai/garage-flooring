import { Diamond, Drop, Family, Forever, Home, Wrench } from "./icons";

const reasons = [
  { icon: Diamond, title: "Durable", body: "Industrial-grade, high-abrasion coatings." },
  { icon: Drop, title: "Low Maintenance", body: "Sealed surface wipes clean." },
  { icon: Home, title: "Indoor or Outdoor", body: "Garages, lanais, pools, drives." },
  { icon: Wrench, title: "Pro Installation", body: "Most jobs done in one day." },
  { icon: Family, title: "Family Owned", body: "Local and owner-operated." },
  { icon: Forever, title: "Life of the Home", body: "Warranty on every install." },
];

export function WhyTitan() {
  return (
    <section id="why" aria-labelledby="why-title" className="grain bg-coal py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow">Why Titan</p>
        <h2 id="why-title" className="headline mt-3 text-3xl sm:text-5xl">
          Built to last.
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/[0.07] ring-1 ring-white/[0.07] sm:mt-10 lg:grid-cols-3">
          {reasons.map(({ icon: Icon, title, body }) => (
            <li key={title} className="bg-coal p-5 sm:p-8">
              <Icon width={28} height={28} className="text-bone" />
              <p className="mt-4 font-display text-base font-bold sm:text-lg">{title}</p>
              <p className="mt-1 text-[0.82rem] leading-snug text-fog sm:text-sm">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
