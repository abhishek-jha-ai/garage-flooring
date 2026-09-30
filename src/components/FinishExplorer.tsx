"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { finishes, flakeBlends, type Finish } from "@/lib/content";
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

        <div className="mt-8 grid grid-cols-[minmax(0,44%)_1fr] gap-4 sm:mt-10 sm:gap-8 md:grid-cols-[18rem_1fr] lg:grid-cols-[20rem_1fr] lg:gap-14">
          {/* Floor preview — tall crop keeps the photo near native resolution */}
          <div className="relative aspect-[1/2] self-start overflow-hidden rounded-3xl bg-slate ring-1 ring-white/10">
            <AnimatePresence initial={false}>
              <motion.div
                key={finish.id}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image src={finish.floor} alt={`${finish.name} flake finish on a garage floor`} fill sizes="(min-width:1024px) 20rem, (min-width:768px) 18rem, 44vw" className="object-cover" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent p-4 pt-14 sm:p-5">
              <p className="font-display text-xl font-extrabold uppercase tracking-wide sm:text-2xl">{finish.name}</p>
              <p className="mt-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-mist sm:text-xs">{finish.tone}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex min-w-0 flex-col">
            <div role="radiogroup" aria-label="Floor finish" className="grid gap-2 sm:gap-3 lg:grid-cols-2">
              {finishes.map((f) => {
                const on = f.id === id;
                return (
                  <div key={f.id}>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => {
                        setId(f.id);
                        trackEvent("finish_selected", { finish: f.id });
                      }}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-1.5 pr-3 text-left transition sm:p-2 sm:pr-4 ${
                        on ? "border-bone bg-white/[0.07]" : "border-white/[0.08] hover:border-white/30"
                      }`}
                    >
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl sm:h-16 sm:w-16">
                        <Image src={f.swatch} alt="" fill sizes="64px" className="object-cover" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-sm font-bold uppercase tracking-wide sm:text-base">{f.name}</span>
                        <span className="hidden truncate text-xs text-fog sm:block">{f.tone}</span>
                      </span>
                      {on && (
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-bone text-ink">
                          <Check width={12} height={12} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 hidden md:block">
              <FinishDetails finish={finish} />
            </div>
          </div>
        </div>

        <div className="mt-6 md:hidden">
          <FinishDetails finish={finish} />
        </div>
      </div>
    </section>
  );
}

function FinishDetails({ finish }: { finish: Finish }) {
  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={finish.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-lg leading-relaxed text-bone sm:text-xl"
        >
          {finish.description}
        </motion.p>
      </AnimatePresence>
      <EstimateButton source="finish_explorer" finish={finish.name} className="btn btn-primary mt-5 w-full sm:w-auto sm:px-8">
        Get This Look <ArrowRight width={18} height={18} />
      </EstimateButton>
      <div className="mt-7 border-t border-white/[0.07] pt-5">
        <p className="text-sm font-semibold text-bone">{flakeBlends.length}+ flake blends available</p>
        <p className="mt-1.5 text-sm leading-relaxed text-fog">
          {flakeBlends.slice(0, 8).join(" · ")} and more. We’ll bring real samples to your estimate.
        </p>
      </div>
    </>
  );
}
