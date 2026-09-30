"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { EstimateButton } from "./EstimateContext";
import { ArrowRight, Drag } from "./icons";

export function BeforeAfter() {
  const box = useRef<HTMLDivElement>(null);
  const range = useRef<HTMLInputElement>(null);
  const dragging = useRef(false);
  const interacted = useRef(false);

  const setPos = (pct: number) => {
    const v = Math.min(100, Math.max(0, pct));
    box.current?.style.setProperty("--pos", `${v}%`);
    if (range.current) range.current.value = String(Math.round(v));
  };

  const mark = () => {
    if (interacted.current) return;
    interacted.current = true;
    trackEvent("before_after_interaction");
  };

  const fromPointer = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setPos(((clientX - r.left) / r.width) * 100);
  };

  // A gentle "peek" the first time the slider scrolls into view, so people know it moves.
  useEffect(() => {
    const el = box.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const keys = [50, 28, 70, 50];
        const seg = 650;
        const t0 = performance.now();
        const tick = (t: number) => {
          if (interacted.current) return;
          const e = (t - t0) / seg;
          const i = Math.floor(e);
          if (i >= keys.length - 1) return setPos(50);
          const p = e - i;
          const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          setPos(keys[i] + (keys[i + 1] - keys[i]) * ease);
          raf = requestAnimationFrame(tick);
        };
        setTimeout(() => (raf = requestAnimationFrame(tick)), 300);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="before-after" aria-labelledby="ba-title" className="bg-coal py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8">
        <div className="lg:order-2">
          <p className="eyebrow">Before &amp; after</p>
          <h2 id="ba-title" className="headline mt-3 text-3xl sm:text-5xl">
            See the difference.
          </h2>
          <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-mist">
            Stained, cracked concrete to a showroom finish — typically in a single day. Drag the slider to compare.
          </p>
          <div className="mt-7 hidden lg:block">
            <EstimateButton source="before_after" projectType="garage" className="btn btn-primary">
              Transform My Garage <ArrowRight width={18} height={18} />
            </EstimateButton>
          </div>
        </div>

        <div
          ref={box}
          style={{ "--pos": "50%" } as React.CSSProperties}
          className="relative aspect-[3/4] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-3xl bg-slate ring-1 ring-white/10 sm:aspect-[4/3] lg:order-1"
          onPointerDown={(e) => {
            dragging.current = true;
            (e.target as Element).setPointerCapture?.(e.pointerId);
            fromPointer(e.clientX);
            mark();
          }}
          onPointerMove={(e) => dragging.current && fromPointer(e.clientX)}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
        >
          <Image
            src="/images/projects/before-garage.jpg"
            alt="Garage floor before coating: stained, cracked bare concrete"
            fill
            sizes="(min-width:1024px) 55vw, 100vw"
            className="pointer-events-none object-cover"
            draggable={false}
          />
          <div className="absolute inset-0" style={{ clipPath: "inset(0 0 0 var(--pos))" }}>
            <Image
              src="/images/projects/after-garage.jpg"
              alt="Same garage after Titan coating: glossy gray flake floor"
              fill
              sizes="(min-width:1024px) 55vw, 100vw"
              className="pointer-events-none object-cover"
              draggable={false}
            />
          </div>

          <span className="pointer-events-none absolute bottom-4 left-4 rounded-lg bg-ink/75 px-3 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur">
            Before
          </span>
          <span className="pointer-events-none absolute bottom-4 right-4 rounded-lg bg-bone px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-ink">
            After
          </span>

          <div className="pointer-events-none absolute inset-y-0 left-[var(--pos)] w-0.5 -translate-x-1/2 bg-bone shadow-[0_0_20px_rgba(0,0,0,.5)]">
            <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-bone text-ink shadow-2xl">
              <Drag width={22} height={22} />
            </span>
          </div>

          <label className="sr-only" htmlFor="ba-range">
            Compare before and after
          </label>
          <input
            ref={range}
            id="ba-range"
            type="range"
            min={0}
            max={100}
            defaultValue={50}
            onChange={(e) => {
              setPos(Number(e.target.value));
              mark();
            }}
            className="peer sr-only"
          />
          <span className="pointer-events-none absolute inset-0 rounded-3xl ring-2 ring-gold opacity-0 peer-focus-visible:opacity-100" />
        </div>

        <div className="lg:hidden">
          <EstimateButton source="before_after" projectType="garage" className="btn btn-primary w-full">
            Transform My Garage <ArrowRight width={18} height={18} />
          </EstimateButton>
        </div>
      </div>
    </section>
  );
}
