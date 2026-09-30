import Image from "next/image";
import { EstimateButton } from "./EstimateContext";
import { ArrowRight, Facebook, Instagram, Mail, Phone, Pin } from "./icons";
import { Logo } from "./Logo";
import { PhoneLink } from "./PhoneLink";
import { demoMode, site } from "@/lib/site";

export function FinalCTA() {
  return (
    <section aria-labelledby="cta-title" className="relative isolate overflow-hidden">
      <Image src="/images/projects/driveway.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-32 lg:px-8">
        <h2 id="cta-title" className="headline mx-auto max-w-3xl text-4xl sm:text-6xl">
          Picture it at your house.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-mist">Free on-site estimate, real samples in hand, and most installs finished in one day.</p>
        <div className="mx-auto mt-8 grid max-w-md gap-3 sm:flex sm:max-w-none sm:justify-center">
          <EstimateButton source="final_cta" className="btn btn-primary sm:px-8">
            Get a Free Estimate <ArrowRight width={18} height={18} />
          </EstimateButton>
          <PhoneLink source="final_cta" className="btn btn-ghost sm:px-8">
            <Phone width={18} height={18} /> {site.phoneDisplay}
          </PhoneLink>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-ink pb-10 pt-12 text-sm text-fog">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs leading-relaxed">
            Epoxy &amp; polyaspartic floor coatings for homes and businesses across {site.areas.join(", ")} &amp; surrounding areas.
          </p>
          <div className="mt-5 flex gap-2">
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-mist hover:text-bone">
              <Instagram width={18} height={18} />
            </a>
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-mist hover:text-bone">
              <Facebook width={18} height={18} />
            </a>
          </div>
        </div>
        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-4 space-y-3">
            <li>
              <PhoneLink source="footer" className="inline-flex items-center gap-2.5 text-bone hover:text-gold">
                <Phone width={16} height={16} /> {site.phoneDisplay}
              </PhoneLink>
            </li>
            <li>
              <a href={`mailto:${site.email}?subject=Floor%20Coating%20Inquiry`} className="inline-flex items-center gap-2.5 break-all hover:text-bone">
                <Mail width={16} height={16} className="shrink-0" /> {site.email}
              </a>
            </li>
            <li className="inline-flex items-start gap-2.5">
              <Pin width={16} height={16} className="mt-0.5 shrink-0" />
              <span>
                {site.address.street}
                <br />
                {site.address.city}, {site.address.region}
              </span>
            </li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Services</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-1">
            {["Garage Floors", "Pool Decks", "Patios & Lanais", "Driveways", "Walkways", "Commercial"].map((s) => (
              <li key={s}>
                <a href="#explore" className="hover:text-bone">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t border-white/[0.06] px-4 pt-6 text-xs sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} {site.name}. Family owned &amp; operated. BBB Accredited.</p>
        {demoMode && <p className="text-fog">Interactive concept prepared for {site.shortName}</p>}
      </div>
    </footer>
  );
}
