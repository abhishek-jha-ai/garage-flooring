"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { finishes, flakeBlends } from "@/lib/content";
import { trackEvent } from "@/lib/analytics";
import { EstimateButton } from "./EstimateContext";
import { ArrowRight, Check } from "./icons";

export function FinishExplorer() {
  const [id, setId] = useState(finishes[0].id);
  const finish = finishes.find((f) => f.id === id)!;

  return (
    <section id="finishes" aria-labelledby="finishes-title" className="bg-ink py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow">Find your look</p>
        <h2 id="finishes-title" className="headline mt-3 text-3xl sm:text-5xl">
          Pick a finish. See it on the floor.
        </h2>

        <div className="mt-8 grid gap-6 sm:mt-10 md:grid-cols-[minmax(0,26rem)_1fr] md:gap-10 lg:gap-16">
          {/* Floor preview */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-slate ring-1 ring-white/10 md:aspect-[3/4]">
            <AnimatePresence initial={false}>
              <motion.div
                key={finish.id}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image src={finish.floor} alt={`${finish.name} flake finish on a garage floor`} fill sizes="(min-width:768px) 26rem, 100vw" className="object-cover object-bottom" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-5 pt-16">
              <p className="font-display text-2xl font-extrabold uppercase tracking-wide">{finish.name}</p>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-mist">{finish.tone}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col">
            <ul role="radiogroup" aria-label="Floor finish" className="grid grid-cols-5 gap-2 sm:gap-3">
              {finishes.map((f) => {
                const on = f.id === id;
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => {
                        setId(f.id);
                        trackEvent("finish_selected", { finish: f.id });
                      }}
                      className="group block w-full text-center"
                    >
                      <span
                        className={`relative block aspect-square overflow-hidden rounded-xl ring-offset-2 ring-offset-ink transition-all sm:rounded-2xl ${
                          on ? "ring-2 ring-bone" : "ring-1 ring-white/10 group-hover:ring-white/40"
                        }`}
                      >
                        <Image src={f.swatch} alt="" fill sizes="120px" className="object-cover" />
                        {on && (
                          <span className="absolute inset-0 grid place-items-center bg-ink/25">
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-bone text-ink">
                              <Check width={14} height={14} strokeWidth={3} />
                            </span>
                          </span>
                        )}
                      </span>
                      <span className={`mt-2 block text-[0.68rem] font-bold uppercase tracking-[0.1em] sm:text-xs ${on ? "text-bone" : "text-fog"}`}>
                        {f.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={finish.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-7 text-lg leading-relaxed text-bone sm:text-xl"
              >
                {finish.description}
              </motion.p>
            </AnimatePresence>

            <div className="mt-6">
              <EstimateButton source="finish_explorer" finish={finish.name} className="btn btn-primary w-full sm:w-auto sm:px-8">
                Get This Look <ArrowRight width={18} height={18} />
              </EstimateButton>
            </div>

            <div className="mt-8 border-t border-white/[0.07] pt-6">
              <p className="text-sm font-semibold text-bone">{flakeBlends.length}+ flake blends available</p>
              <p className="mt-1.5 text-sm leading-relaxed text-fog">
                {flakeBlends.slice(0, 8).join(" · ")} and more. We’ll bring real samples to your estimate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
