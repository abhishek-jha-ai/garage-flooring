"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, animate } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ExplorerView, Hotspot } from "@/lib/content";
import { trackEvent } from "@/lib/analytics";
import { Close, Drag, Plus } from "./icons";

/**
 * Renders one explorer "view". Photos are drag-to-pan with hotspots today;
 * Matterport tours and 360° panoramas plug into the same slot via `view.kind`.
 */
export function ExplorerStage({ view, onInteract }: { view: ExplorerView; onInteract?: () => void }) {
  switch (view.kind) {
    case "matterport":
      return (
        <iframe
          title={view.label}
          src={`https://my.matterport.com/show/?m=${view.modelId}&play=1&qs=1`}
          className="absolute inset-0 h-full w-full"
          allow="fullscreen; xr-spatial-tracking"
        />
      );
    case "pano360":
      // Swap for a WebGL panorama viewer (e.g. Photo Sphere Viewer) when real 360° captures exist.
      return <PanPhoto src={view.src} alt={view.label} aspect={2} onInteract={onInteract} />;
    case "photo":
      return <PanPhoto src={view.src} alt={view.alt} hotspots={view.hotspots} onInteract={onInteract} />;
  }
}

const PHOTO_ASPECT = 1672 / 941;

function PanPhoto({
  src,
  alt,
  hotspots = [],
  aspect = PHOTO_ASPECT,
  onInteract,
}: {
  src: string;
  alt: string;
  hotspots?: Hotspot[];
  aspect?: number;
  onInteract?: () => void;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0, cw: 0, ch: 0 });
  const [natural, setNatural] = useState(aspect);
  const [active, setActive] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const layout = useCallback(() => {
    const el = frame.current;
    if (!el) return;
    const cw = el.clientWidth;
    const ch = el.clientHeight;
    // Cover the frame, then add a little extra room so there is always something to explore.
    const zoom = cw > 768 ? 1.14 : 1.04;
    let w = Math.max(cw, ch * natural);
    let h = w / natural;
    if (h < ch) {
      h = ch;
      w = h * natural;
    }
    w *= zoom;
    h *= zoom;
    setSize({ w, h, cw, ch });
    x.set((cw - w) / 2);
    y.set((ch - h) / 2);
  }, [natural, x, y]);

  useLayoutEffect(() => {
    layout();
    const ro = new ResizeObserver(layout);
    if (frame.current) ro.observe(frame.current);
    return () => ro.disconnect();
  }, [layout]);

  useEffect(() => setActive(null), [src]);

  const markTouched = () => {
    if (!touched) {
      setTouched(true);
      onInteract?.();
    }
  };

  const nudge = (dx: number) => {
    const min = size.cw - size.w;
    const target = Math.min(0, Math.max(min, x.get() + dx));
    animate(x, target, { type: "spring", stiffness: 300, damping: 35 });
    markTouched();
  };

  const canPanX = size.w - size.cw > 2;

  return (
    <div
      ref={frame}
      className="absolute inset-0 touch-pan-y overflow-hidden"
      tabIndex={0}
      role="group"
      aria-label={`${alt}. Drag or use arrow keys to look around.`}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") nudge(80);
        if (e.key === "ArrowRight") nudge(-80);
      }}
    >
      <motion.div
        drag
        dragConstraints={frame}
        dragElastic={0.08}
        dragMomentum
        onDragStart={() => {
          markTouched();
          setActive(null);
        }}
        style={{ x, y, width: size.w || "100%", height: size.h || "100%" }}
        className="absolute left-0 top-0 cursor-grab active:cursor-grabbing"
      >
        <Image
          src={src}
          alt={alt}
          fill
          draggable={false}
          sizes="(min-width: 1024px) 70vw, 180vw"
          className="pointer-events-none select-none object-cover"
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth) setNatural(img.naturalWidth / img.naturalHeight);
          }}
        />
        {hotspots.map((h, i) => (
          <button
            key={h.title}
            type="button"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            className="group absolute -translate-x-1/2 -translate-y-1/2 p-2"
            aria-label={`About: ${h.title}`}
            aria-expanded={active === i}
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={() => {
              setActive(active === i ? null : i);
              markTouched();
              trackEvent("hotspot_opened", { title: h.title });
            }}
          >
            <span className="absolute inset-2 animate-[pulse-ring_2.2s_ease-out_infinite] rounded-full bg-white/60" />
            <span
              className={`relative grid h-8 w-8 place-items-center rounded-full border border-white/70 shadow-lg backdrop-blur transition-colors ${
                active === i ? "bg-bone text-ink" : "bg-ink/60 text-bone group-hover:bg-ink/80"
              }`}
            >
              <Plus width={16} height={16} className={`transition-transform ${active === i ? "rotate-45" : ""}`} />
            </span>
          </button>
        ))}
      </motion.div>

      <AnimatePresence>
        {active !== null && hotspots[active] && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-3 bottom-3 z-10 rounded-2xl border border-white/10 bg-ink/85 p-4 pr-12 shadow-2xl backdrop-blur-xl sm:left-auto sm:right-4 sm:bottom-4 sm:w-80"
            role="status"
          >
            <p className="font-display text-base font-bold">{hotspots[active].title}</p>
            <p className="mt-1 text-sm leading-relaxed text-mist">{hotspots[active].body}</p>
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full text-fog hover:text-bone"
              aria-label="Close detail"
            >
              <Close width={18} height={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!touched && canPanX && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-ink/70 px-4 py-2 text-xs font-semibold text-bone backdrop-blur"
          >
            <Drag width={16} height={16} className="animate-[nudge_1.6s_ease-in-out_infinite]" />
            Drag to look around · Tap <Plus width={12} height={12} /> for details
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
