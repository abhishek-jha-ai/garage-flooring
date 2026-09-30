"use client";

import { useEffect, useState } from "react";
import { EstimateButton } from "./EstimateContext";
import { Phone } from "./icons";
import { Logo } from "./Logo";
import { PhoneLink } from "./PhoneLink";
import { site } from "@/lib/site";

const nav = [
  { href: "#explore", label: "Explore" },
  { href: "#finishes", label: "Finishes" },
  { href: "#projects", label: "Projects" },
  { href: "#reviews", label: "Reviews" },
];

export function Header() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        solid ? "border-b border-white/[0.06] bg-ink/80 backdrop-blur-xl" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 max-[359px]:px-3 sm:px-6 lg:px-8">
        <a href="#top" className="rounded-md">
          <Logo />
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-8 text-sm font-medium text-mist lg:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="transition-colors hover:text-bone">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <PhoneLink
            source="header"
            className="hidden items-center gap-2 px-3 text-sm font-semibold text-bone transition-colors hover:text-gold md:inline-flex"
          >
            <Phone width={16} height={16} />
            {site.phoneDisplay}
          </PhoneLink>
          <PhoneLink
            source="header_icon"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-bone max-[359px]:hidden md:hidden"
          >
            <Phone width={18} height={18} />
            <span className="sr-only">Call {site.phoneDisplay}</span>
          </PhoneLink>
          <EstimateButton source="header" className="btn btn-primary !min-h-10 !rounded-full !px-4 whitespace-nowrap text-[0.82rem] max-[359px]:!px-3 max-[359px]:text-[0.75rem]">
            Free Estimate
          </EstimateButton>
        </div>
      </div>
    </header>
  );
}
