"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useEstimate } from "./EstimateContext";
import { Phone } from "./icons";
import { PhoneLink } from "./PhoneLink";

/** Mobile-only bottom bar. Appears after the hero, steps aside near the footer CTA. */
export function StickyCTA() {
  const { isOpen, openEstimate } = useEstimate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.75;
      const nearEnd = window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 520;
      setShow(past && !nearEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && !isOpen && (
        <motion.div
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-ink/85 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden"
        >
          <div className="grid grid-cols-[1fr_1.4fr] gap-2.5">
            <PhoneLink source="sticky_bar" className="btn btn-ghost !min-h-12 !bg-transparent">
              <Phone width={18} height={18} /> Call Now
            </PhoneLink>
            <button type="button" onClick={() => openEstimate({ source: "sticky_bar" })} className="btn btn-primary !min-h-12">
              Free Estimate
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
