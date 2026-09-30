"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
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

export function EstimateProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [prefill, setPrefill] = useState<EstimatePrefill | null>(null);

  const openEstimate = useCallback((p: EstimatePrefill) => {
    setPrefill(p);
    setOpen(true);
    trackEvent("estimate_started", { source: p.source, project_type: p.projectType, finish: p.finish });
  }, []);
  const closeEstimate = useCallback(() => setOpen(false), []);

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
    <button type="button" className={className} onClick={() => openEstimate({ source, projectType, finish })}>
      {children}
    </button>
  );
}
