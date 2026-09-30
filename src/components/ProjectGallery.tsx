"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { gallery, projectCategories, type ProjectType } from "@/lib/content";
import { trackEvent } from "@/lib/analytics";
import { Expand } from "./icons";
import { Lightbox } from "./Lightbox";

type Filter = "all" | ProjectType;
const FILTER_EVENT = "titan:gallery-filter";

/** Scrolls to the gallery with a filter applied (used by the explorer). */
export function focusGallery(type: ProjectType) {
  window.dispatchEvent(new CustomEvent<ProjectType>(FILTER_EVENT, { detail: type }));
  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  ...projectCategories.map((c) => ({ id: c.id as Filter, label: c.plural })),
];

export function ProjectGallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const onFilter = (e: Event) => setFilter((e as CustomEvent<ProjectType>).detail);
    window.addEventListener(FILTER_EVENT, onFilter);
    return () => window.removeEventListener(FILTER_EVENT, onFilter);
  }, []);

  const items = useMemo(() => (filter === "all" ? gallery : gallery.filter((g) => g.type === filter)), [filter]);
  const counts = useMemo(() => {
    const m: Record<string, number> = { all: gallery.length };
    for (const g of gallery) m[g.type] = (m[g.type] ?? 0) + 1;
    return m;
  }, []);

  return (
    <section id="projects" aria-labelledby="projects-title" className="bg-ink py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Recent work</p>
            <h2 id="projects-title" className="headline mt-3 text-3xl sm:text-5xl">
              Real projects. Real results.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-fog">Tap any project to see it full screen.</p>
        </div>
      </div>

      <div className="no-scrollbar mt-7 overflow-x-auto">
        <div role="tablist" aria-label="Filter projects" className="mx-auto flex w-max gap-2 px-4 sm:px-6 lg:w-auto lg:max-w-7xl lg:px-8">
          {filters.map((f) => {
            const on = f.id === filter;
            const n = counts[f.id] ?? 0;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={on}
                disabled={n === 0}
                onClick={() => {
                  setFilter(f.id);
                  trackEvent("gallery_filtered", { filter: f.id });
                }}
                className={`h-10 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors disabled:opacity-40 ${
                  on ? "bg-bone text-ink" : "border border-white/12 text-mist hover:border-white/30 hover:text-bone"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <motion.ul layout className="mx-auto mt-6 grid max-w-7xl grid-cols-2 gap-2 px-4 sm:gap-3 sm:px-6 lg:grid-cols-3 lg:gap-4 lg:px-8">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.map((g, i) => (
            <motion.li
              key={g.src}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={i === 0 && filter === "all" ? "col-span-2 lg:col-span-2 lg:row-span-2" : ""}
            >
              <button
                type="button"
                onClick={() => {
                  setOpen(i);
                  trackEvent("gallery_opened", { src: g.src, type: g.type });
                }}
                className="group relative block h-full w-full overflow-hidden rounded-2xl bg-slate"
                aria-label={`Open photo: ${g.caption}`}
              >
                <span className={`relative block ${i === 0 && filter === "all" ? "aspect-[16/10] lg:aspect-auto lg:h-full" : "aspect-square sm:aspect-[4/3]"}`}>
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes={i === 0 && filter === "all" ? "(min-width:1024px) 66vw, 100vw" : "(min-width:1024px) 33vw, 50vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-90" />
                  <span className="absolute bottom-2.5 left-3 right-10 text-left text-xs font-semibold sm:bottom-3 sm:text-sm">{g.caption}</span>
                  <span className="absolute bottom-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-ink/60 opacity-80 backdrop-blur transition group-hover:opacity-100">
                    <Expand width={13} height={13} />
                  </span>
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {open !== null && (
        <Lightbox items={items.map((g) => ({ src: g.src, alt: g.alt, caption: g.caption }))} index={open} onClose={() => setOpen(null)} />
      )}
    </section>
  );
}
