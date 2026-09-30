"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { estimateSizes, estimateTimelines, projectCategories, type ProjectType } from "@/lib/content";
import { trackEvent } from "@/lib/analytics";
import { validateContact } from "@/lib/leads/validate";
import { site } from "@/lib/site";
import { useEstimate } from "./EstimateContext";
import { ArrowLeft, ArrowRight, Check, Clock, Close, Phone } from "./icons";
import { PhoneLink } from "./PhoneLink";
import { useScrollLock } from "./useScrollLock";

type Contact = { name: string; phone: string; email: string; zip: string };
const emptyContact: Contact = { name: "", phone: "", email: "", zip: "" };
const TOTAL = 4;
const LOCAL_KEY = "titan_estimate_requests";

const formatPhone = (v: string) => {
  const d = v.replace(/\D/g, "").replace(/^1/, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

function readUtm() {
  const p = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"]) {
    const v = p.get(k);
    if (v) utm[k] = v;
  }
  return utm;
}

export function EstimateWizard() {
  const { isOpen, prefill, closeEstimate } = useEstimate();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);
  const [contact, setContact] = useState<Contact>(emptyContact);
  const [errors, setErrors] = useState<Partial<Contact>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  useScrollLock(isOpen);

  // Fresh flow on every open; skip step 1 when we already know the project type.
  useEffect(() => {
    if (!isOpen) return;
    setProjectType(prefill?.projectType ?? null);
    setStep(prefill?.projectType ? 1 : 0);
    setDir(1);
    setSize(null);
    setTimeline(null);
    setErrors({});
    setStatus("idle");
  }, [isOpen, prefill]);

  const update = (field: keyof Contact, value: string) => {
    setContact((c) => ({ ...c, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const close = () => {
    if (status !== "done") trackEvent("estimate_abandoned", { step: step + 1 });
    closeEstimate();
  };

  useEffect(() => {
    if (!isOpen) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), input, a[href]");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prevFocus?.focus?.({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, step, status]);

  // Move focus into each new step for keyboard + screen reader users.
  useEffect(() => {
    if (!isOpen) return;
    const id = requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(id);
  }, [isOpen, step, status]);

  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    if (to > step) trackEvent("estimate_step_completed", { step: step + 1 });
    setStep(to);
  };

  const category = projectCategories.find((c) => c.id === projectType);
  const sizes = estimateSizes[projectType === "garage" ? "garage" : "default"];
  const sizeLabel = sizes.find((s) => s.id === size)?.label;
  const timelineLabel = estimateTimelines.find((t) => t.id === timeline)?.label;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validateContact(contact);
    setErrors(errs);
    if (Object.keys(errs).length) {
      dialogRef.current?.querySelector<HTMLInputElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setStatus("sending");
    const honeypot = (e.currentTarget.elements.namedItem("company") as HTMLInputElement | null)?.value;
    const payload = {
      projectType: category?.label ?? projectType,
      size: sizeLabel ?? "Not sure",
      timeline: timelineLabel,
      finish: prefill?.finish,
      ...contact,
      source: prefill?.source,
      utm: readUtm(),
      company: honeypot,
    };
    // Local copy so no lead is ever lost during the demo, even offline.
    try {
      const prev = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
      localStorage.setItem(LOCAL_KEY, JSON.stringify([...prev, { ...payload, at: new Date().toISOString() }]));
    } catch {}
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
      trackEvent("estimate_submitted", { project_type: projectType ?? "", size: size ?? "", timeline: timeline ?? "", finish: prefill?.finish });
    } catch {
      setStatus("error");
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} aria-hidden />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="estimate-title"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
            className="relative flex max-h-[94dvh] min-h-[78dvh] w-full flex-col overflow-hidden rounded-t-[1.75rem] border border-white/10 bg-coal shadow-2xl sm:max-h-[88vh] sm:min-h-0 sm:max-w-lg sm:rounded-[1.75rem]"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between gap-3 px-4 pt-3 sm:px-6 sm:pt-5">
              <div className="w-11">
                {status !== "done" && step > 0 && (
                  <button type="button" onClick={() => go(step - 1)} className="grid h-11 w-11 place-items-center rounded-full text-mist hover:bg-white/5 hover:text-bone" aria-label="Previous step">
                    <ArrowLeft />
                  </button>
                )}
              </div>
              <span className="mx-auto mt-0.5 h-1 w-10 rounded-full bg-white/15 sm:hidden" aria-hidden />
              <button type="button" onClick={close} className="grid h-11 w-11 place-items-center rounded-full text-mist hover:bg-white/5 hover:text-bone" aria-label="Close estimate form">
                <Close />
              </button>
            </div>

            {status !== "done" && (
              <div className="px-5 pt-1 sm:px-8">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="uppercase tracking-[0.16em] text-fog">Free estimate</span>
                  <span className="tabular-nums text-mist" aria-live="polite">
                    {step + 1} of {TOTAL}
                  </span>
                </div>
                <div className="mt-2.5 grid grid-cols-4 gap-1.5" aria-hidden>
                  {Array.from({ length: TOTAL }).map((_, i) => (
                    <span key={i} className="h-1 overflow-hidden rounded-full bg-white/10">
                      <motion.span className="block h-full bg-bone" initial={false} animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.35 }} />
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="relative flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6 sm:px-8 sm:pb-8">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={status === "done" ? "done" : step}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir * -28 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  {status === "done" ? (
                    <Success name={contact.name} onClose={closeEstimate} />
                  ) : step === 0 ? (
                    <>
                      <StepTitle>What do you want coated?</StepTitle>
                      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                        {projectCategories.map((c, i) => (
                          <button
                            key={c.id}
                            type="button"
                            data-autofocus={i === 0 || undefined}
                            aria-pressed={projectType === c.id}
                            onClick={() => {
                              setProjectType(c.id);
                              setSize(null);
                              go(1);
                            }}
                            className={`group relative overflow-hidden rounded-2xl text-left ring-1 transition ${projectType === c.id ? "ring-2 ring-bone" : "ring-white/10 hover:ring-white/40"}`}
                          >
                            <span className="relative block aspect-[4/3]">
                              <Image src={c.cover} alt="" fill sizes="160px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                              <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                              <span className="absolute bottom-2.5 left-3 font-display text-sm font-bold">{c.label}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : step === 1 ? (
                    <>
                      <StepTitle>
                        How big is your {category ? category.label.toLowerCase() : "project"}?
                      </StepTitle>
                      <p className="mt-2 text-sm text-fog">A rough idea is fine — we measure on site.</p>
                      <div className="mt-5 grid grid-cols-2 gap-2.5">
                        {sizes.map((s, i) => (
                          <Choice key={s.id} autoFocus={i === 0} selected={size === s.id} onClick={() => { setSize(s.id); go(2); }}>
                            <span className="block font-display text-lg font-bold">{s.label}</span>
                            <span className="mt-0.5 block text-xs text-fog">{s.hint}</span>
                          </Choice>
                        ))}
                      </div>
                    </>
                  ) : step === 2 ? (
                    <>
                      <StepTitle>When are you looking to get it done?</StepTitle>
                      <div className="mt-5 grid gap-2.5">
                        {estimateTimelines.map((t, i) => (
                          <Choice key={t.id} autoFocus={i === 0} selected={timeline === t.id} onClick={() => { setTimeline(t.id); go(3); }} row>
                            <span className="font-display text-base font-bold">{t.label}</span>
                            <ArrowRight width={18} height={18} className="text-fog" />
                          </Choice>
                        ))}
                      </div>
                    </>
                  ) : (
                    <form onSubmit={submit} noValidate>
                      <StepTitle>Where should we send your estimate?</StepTitle>
                      <ul className="mt-3 flex flex-wrap gap-1.5 text-xs font-semibold text-mist">
                        {[category?.label, sizeLabel && sizeLabel !== "Not sure" ? sizeLabel : null, prefill?.finish, timelineLabel].filter(Boolean).map((t) => (
                          <li key={t as string} className="rounded-full bg-white/[0.06] px-2.5 py-1">{t}</li>
                        ))}
                      </ul>
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <Field className="col-span-2" label="Name" name="name" autoComplete="name" value={contact.name} error={errors.name} onChange={(v) => update("name", v)} autoFocus />
                        <Field className="col-span-2" label="Phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={contact.phone} error={errors.phone} onChange={(v) => update("phone", formatPhone(v))} />
                        <Field className="col-span-2 sm:col-span-1" label="Email" name="email" type="email" inputMode="email" autoComplete="email" value={contact.email} error={errors.email} onChange={(v) => update("email", v.trim())} />
                        <Field className="col-span-2 sm:col-span-1" label="ZIP code" name="zip" inputMode="numeric" autoComplete="postal-code" value={contact.zip} error={errors.zip} onChange={(v) => update("zip", v.replace(/\D/g, "").slice(0, 5))} />
                      </div>
                      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                      {status === "error" && (
                        <p role="alert" className="mt-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-200">
                          Something went wrong sending your request. Please try again or call{" "}
                          <PhoneLink source="estimate_error" className="font-bold underline" />.
                        </p>
                      )}
                      <button type="submit" disabled={status === "sending"} className="btn btn-primary mt-6 w-full !text-base disabled:opacity-60">
                        {status === "sending" ? "Sending…" : "Request My Free Estimate"}
                      </button>
                      <p className="mt-3 text-center text-xs text-fog">Free · No obligation · We never share your info</p>
                    </form>
                  )}
                </motion.div>
              </AnimatePresence>

              {status !== "done" && step < 3 && (
                <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-fog">
                  <Clock width={14} height={14} /> Takes about 30 seconds · Prefer to talk?{" "}
                  <PhoneLink source="estimate_wizard" className="font-semibold text-mist underline-offset-2 hover:underline">
                    Call us
                  </PhoneLink>
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 id="estimate-title" className="headline text-[1.6rem] sm:text-3xl">
      {children}
    </h2>
  );
}

function Choice({ selected, onClick, children, row, autoFocus }: { selected: boolean; onClick: () => void; children: React.ReactNode; row?: boolean; autoFocus?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-autofocus={autoFocus || undefined}
      aria-pressed={selected}
      className={`rounded-2xl border p-4 text-left transition ${row ? "flex min-h-14 items-center justify-between" : "min-h-20"} ${
        selected ? "border-bone bg-white/[0.08]" : "border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.05]"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  className = "",
  autoFocus,
  ...rest
}: {
  label: string;
  name: keyof Contact;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  className?: string;
  autoFocus?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "name">) {
  const id = `est-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-mist">
        {label}
      </label>
      <input
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        data-autofocus={autoFocus || undefined}
        className={`h-13 w-full rounded-xl border bg-ink px-4 text-base text-bone outline-none transition placeholder:text-fog/60 focus:border-bone ${
          error ? "border-red-400/70" : "border-white/12"
        }`}
        {...rest}
      />
      {error && (
        <p id={`${id}-err`} className="mt-1 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

function Success({ name, onClose }: { name: string; onClose: () => void }) {
  const first = name.trim().split(/\s+/)[0];
  return (
    <div className="py-4 text-center" role="status">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-bone text-ink">
        <Check width={30} height={30} strokeWidth={2.6} />
      </span>
      <h2 id="estimate-title" data-autofocus tabIndex={-1} className="headline mt-6 text-3xl outline-none">
        You’re all set{first ? `, ${first}` : ""}.
      </h2>
      <p className="mx-auto mt-3 max-w-xs text-[0.95rem] leading-relaxed text-mist">
        The {site.shortName} team will reach out shortly to schedule your free on-site estimate.
      </p>
      <div className="mt-8 grid gap-3">
        <PhoneLink source="estimate_success" className="btn btn-primary w-full">
          <Phone width={18} height={18} /> Can’t wait? Call {site.phoneDisplay}
        </PhoneLink>
        <button type="button" onClick={onClose} className="btn btn-ghost w-full">
          Keep browsing
        </button>
      </div>
    </div>
  );
}
