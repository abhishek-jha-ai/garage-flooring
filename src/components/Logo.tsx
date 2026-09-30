/** Spartan helmet mark + wordmark. Swap `Helmet` for Titan's vector logo when available. */
export function Helmet({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="currentColor">
      {/* crest */}
      <path d="M13 25C12 12 26 3.5 42 5c10 1 17 8 18 18l-6.5 1.2C52 16 45 11.5 35 11.5c-10 0-17 5.5-17.5 13.2z" />
      <path d="M22 11l3 5M28 8l2 5.5M35 7l1 5.5M42 7.5l-.2 5.6M49 10l-1.8 5.2M55 15l-3 4.6" stroke="#0a0a0b" strokeWidth="1.6" />
      {/* helmet */}
      <path
        fillRule="evenodd"
        d="M17 28c0-8 7.5-13.5 17.5-13.5C47 14.5 55 23 55 35v16c0 4-3 7-7 7h-9.5c-1.7 0-2.5-1.2-2.5-3v-9.5h-6.5V57H21.5c-2.2 0-3.3-1.6-2.8-3.6L21 42.5l-4-5.5zM21 30.5h14.5c2.4 0 2.4 5 0 5H24z"
      />
      {/* cheek line */}
      <path d="M44 20c-3 7-3.5 15-1 24" stroke="#0a0a0b" strokeWidth="1.8" fill="none" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <Helmet className="h-9 w-9 shrink-0 text-bone" />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.05rem] font-bold tracking-[0.04em] text-bone">TITAN GARAGE</span>
        {!compact && <span className="mt-1 text-[0.58rem] font-semibold tracking-[0.42em] text-fog">FLOORING</span>}
      </span>
    </span>
  );
}
