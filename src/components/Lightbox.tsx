"use client";

import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Close } from "./icons";
import { useScrollLock } from "./useScrollLock";

export type LightboxItem = { src: string; alt: string; caption?: string };

export function Lightbox({ items, index: start, onClose }: { items: LightboxItem[]; index: number; onClose: () => void }) {
  const [[index, dir], setState] = useState<[number, number]>([start, 0]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  useScrollLock(true);

  const go = useCallback(
    (d: number) => setState(([i]) => [(i + d + items.length) % items.length, d]),
    [items.length],
  );

  useEffect(() => {
    setMounted(true);
    const prevFocus = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      window.removeEventListener("keydown", onKey);
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, [go, onClose]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
    else if (info.offset.y > 120) onClose();
  };

  if (!mounted) return null;
  const item = items[index];
  const multi = items.length > 1;

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Project photo viewer"
      className="fixed inset-0 z-[70] flex flex-col bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))]">
        <span className="text-sm font-medium tabular-nums text-mist">
          {multi ? `${index + 1} / ${items.length}` : ""}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-bone hover:bg-white/20"
          aria-label="Close viewer"
        >
          <Close />
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: d > 0 ? "100%" : d < 0 ? "-100%" : 0, opacity: d === 0 ? 0 : 1 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 1 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            drag
            dragSnapToOrigin
            dragElastic={0.6}
            onDragEnd={onDragEnd}
            className="absolute inset-0 touch-none px-2 sm:px-16"
          >
            <Image src={item.src} alt={item.alt} fill sizes="100vw" className="pointer-events-none select-none object-contain" draggable={false} />
          </motion.div>
        </AnimatePresence>

        {multi && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-bone hover:bg-white/20 sm:grid"
              aria-label="Previous photo"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-bone hover:bg-white/20 sm:grid"
              aria-label="Next photo"
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>

      <div className="px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 text-center">
        {item.caption && <p className="font-display text-base font-bold">{item.caption}</p>}
        {multi && <p className="mt-1 text-xs text-fog sm:hidden">Swipe to browse · Swipe down to close</p>}
      </div>
    </motion.div>,
    document.body,
  );
}
