import { Family, Shield, Star } from "./icons";

const items = [
  { icon: Family, label: "Family Owned", sub: "& Operated" },
  { icon: Shield, label: "BBB Accredited", sub: "Business" },
  { icon: Star, label: "100+ Five-Star", sub: "Reviews" },
];

export function TrustBar() {
  return (
    <div className="border-y border-white/[0.06] bg-coal">
      <ul className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-white/[0.06] px-2 sm:px-6 lg:px-8">
        {items.map(({ icon: Icon, label, sub }) => (
          <li key={label} className="flex flex-col items-center gap-2 px-1 py-4 text-center sm:flex-row sm:justify-center sm:gap-3 sm:py-5 sm:text-left">
            <Icon width={22} height={22} className="shrink-0 text-bone" />
            <span className="text-[0.7rem] font-semibold uppercase leading-tight tracking-[0.08em] text-mist sm:text-xs">
              {label}
              <br />
              <span className="text-fog">{sub}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
