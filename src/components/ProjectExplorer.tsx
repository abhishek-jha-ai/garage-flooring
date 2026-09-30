"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { projectCategories, type ExplorerView, type ProjectType } from "@/lib/content";
import { trackEvent } from "@/lib/analytics";
import { EstimateButton } from "./EstimateContext";
import { ExplorerStage } from "./ExplorerStage";
import { ArrowRight, Check, Expand } from "./icons";
import { Lightbox } from "./Lightbox";
import { focusGallery } from "./ProjectGallery";

export function ProjectExplorer() {
  const [typeId, setTypeId] = useState<ProjectType>("garage");
  const [viewIndex, setViewIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const category = projectCategories.find((c) => c.id === typeId)!;
  const view = category.views[viewIndex] ?? category.views[0];
  const photoViews = category.views.filter((v): v is Extract<ExplorerView, { kind: "photo" }> => v.kind === "photo");

  const select = (id: ProjectType) => {
    if (id === typeId) return;
    setTypeId(id);
    setViewIndex(0);
    trackEvent("project_type_selected", { project_type: id });
  };

  return (
    <section id="explore" aria-labelledby="explore-title" className="bg-ink py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="eyebrow">Explore your project</p>
        <h2 id="explore-title" className="headline mt-3 text-3xl sm:text-5xl">
          What are you looking to transform?
        </h2>
      </div>

      {/* Category picker — horizontal swipe on mobile, grid on desktop */}
      <div className="no-scrollbar mt-7 overflow-x-auto sm:mt-10">
        <ul
          role="radiogroup"
          aria-label="Project type"
          className="mx-auto flex w-max gap-2.5 px-4 sm:px-6 lg:grid lg:w-auto lg:max-w-7xl lg:grid-cols-6 lg:gap-4 lg:px-8"
        >
          {projectCategories.map((c) => {
            const selected = c.id === typeId;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => select(c.id)}
                  className={`group relative block w-[7.6rem] overflow-hidden rounded-2xl text-left ring-1 transition-all duration-300 sm:w-40 lg:w-full ${
                    selected ? "ring-2 ring-bone" : "ring-white/10 hover:ring-white/30"
                  }`}
                >
                  <span className="relative block aspect-[4/5]">
                    <Image
                      src={c.cover}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 16vw, 160px"
                      className={`object-cover transition-transform duration-500 group-hover:scale-105 ${selected ? "" : "opacity-70 grayscale-[35%]"}`}
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                    {selected && (
                      <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-bone text-ink">
                        <Check width={14} height={14} strokeWidth={3} />
                      </span>
                    )}
                    <span className="absolute inset-x-3 bottom-3 font-display text-sm font-bold uppercase tracking-wide">{c.label}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mx-auto mt-6 max-w-7xl px-4 sm:mt-8 sm:px-6 lg:grid lg:grid-cols-[1fr_22rem] lg:gap-8 lg:px-8">
        {/* Stage */}
        <div>
          <div className="relative aspect-[4/5] max-h-[68svh] w-full overflow-hidden rounded-3xl bg-slate ring-1 ring-white/10 sm:aspect-[16/10] lg:max-h-none">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={`${typeId}-${viewIndex}`}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <ExplorerStage view={view} onInteract={() => trackEvent("explorer_view_changed", { project_type: typeId, action: "pan" })} />
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3 sm:p-4">
              <span className="rounded-full bg-ink/70 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                {category.label} · {view.label}
              </span>
              {view.kind === "photo" && (
                <button
                  type="button"
                  onClick={() => setZoomOpen(true)}
                  className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-ink/70 text-bone backdrop-blur hover:bg-ink"
                  aria-label="View full screen"
                >
                  <Expand width={17} height={17} />
                </button>
              )}
            </div>
          </div>

          {category.views.length > 1 && (
            <div className="mt-3 flex gap-2" role="tablist" aria-label={`${category.label} views`}>
              {category.views.map((v, i) => (
                <button
                  key={v.label}
                  type="button"
                  role="tab"
                  aria-selected={i === viewIndex}
                  onClick={() => {
                    setViewIndex(i);
                    trackEvent("explorer_view_changed", { project_type: typeId, view: v.label });
                  }}
                  className={`relative h-14 w-20 overflow-hidden rounded-xl ring-1 transition sm:h-16 sm:w-24 ${
                    i === viewIndex ? "ring-2 ring-bone" : "opacity-60 ring-white/10 hover:opacity-100"
                  }`}
                >
                  {v.kind === "photo" && <Image src={v.src} alt="" fill sizes="96px" className="object-cover" />}
                  <span className="sr-only">{v.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={typeId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="mt-6 flex flex-col lg:mt-0 lg:justify-center"
          >
            <h3 className="headline text-2xl sm:text-3xl">{category.headline}</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-mist">{category.blurb}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {category.facts.map((f) => (
                <li key={f} className="rounded-full border border-white/10 bg-slate px-3 py-1.5 text-xs font-semibold text-mist">
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-7 grid gap-3">
              <EstimateButton source="explorer" projectType={category.id} className="btn btn-primary w-full">
                Get a Free {category.label} Estimate <ArrowRight width={18} height={18} />
              </EstimateButton>
              <button type="button" onClick={() => focusGallery(category.id)} className="btn btn-ghost w-full">
                See more {category.label.toLowerCase()} projects
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {zoomOpen && (
        <Lightbox
          items={photoViews.map((v) => ({ src: v.src, alt: v.alt, caption: v.label }))}
          index={Math.max(0, photoViews.findIndex((v) => v === view))}
          onClose={() => setZoomOpen(false)}
        />
      )}
    </section>
  );
}
