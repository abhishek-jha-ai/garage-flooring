"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ProjectType } from "@/lib/content";
import { trackEvent } from "@/lib/analytics";

export type EstimatePrefill = { projectType?: ProjectType; finish?: string; source: string };

type Ctx = {
  isOpen: boolean;
  prefill: EstimatePrefill | null;
  openEstimate: (prefill: EstimatePrefill) => void;
  closeEstimate: () => void;
};

const EstimateCtx = createContext<Ctx | null>(null);
export const ESTIMATE_HASH = "estimate";

export function EstimateProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<EstimatePrefill | null>(null);

  const openEstimate = useCallback((p: EstimatePrefill) => {
    setPrefill(p);
    setOpen(true);
    trackEvent("estimate_started", { source: p.source, project_type: p.projectType, finish: p.finish });
  }, []);
  const closeEstimate = useCallback(() => setOpen(false), []);

  // Taps that land before hydration fall back to the #estimate link; pick them up here.
  // Also makes `yoursite.com/#estimate` a deep link for ads.
  useEffect(() => {
    const check = () => {
      if (window.location.hash !== `#${ESTIMATE_HASH}`) return;
      history.replaceState(null, "", window.location.pathname + window.location.search);
      openEstimate({ source: "link" });
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [openEstimate]);

  const value = useMemo(() => ({ isOpen, prefill, openEstimate, closeEstimate }), [isOpen, prefill, openEstimate, closeEstimate]);
  return <EstimateCtx.Provider value={value}>{children}</EstimateCtx.Provider>;
}

export function useEstimate() {
  const ctx = useContext(EstimateCtx);
  if (!ctx) throw new Error("useEstimate must be used inside <EstimateProvider>");
  return ctx;
}

/** Drop-in button that opens the estimate flow. */
export function EstimateButton({
  source,
  projectType,
  finish,
  className = "btn btn-primary",
  children,
}: EstimatePrefill & { className?: string; children: React.ReactNode }) {
  const { openEstimate } = useEstimate();
  return (
    <a
      href={`#${ESTIMATE_HASH}`}
      role="button"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        openEstimate({ source, projectType, finish });
      }}
    >
      {children}
    </a>
  );
}
