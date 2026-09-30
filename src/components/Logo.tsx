/** Spartan helmet mark + wordmark. Swap `Helmet` for Titan's vector logo when available. */
export function Helmet({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="currentColor">
      {/* crest */}
      <path d="M8 22C10 9 24 2 38 3.5 50 4.8 58 12 60 22l-6 1c-2-7-8-12-17-12.5-10-.5-18 4-22 11.5z" />
      {/* helmet with eye slot and mouth opening */}
      <path
        fillRule="evenodd"
        d="M12 30c0-9.5 9-16.5 21-16.5S55 21 55 33v12.5c0 3.5-2.5 6-6 6h-2.5c-1.6 0-2.3 1.6-1.6 3L47 58H31.5c-3.5 0-6-2.5-6.5-5.5L24 47h-8.5c-2 0-3.5-1.5-3.5-3.5zM12 30.5h17.5c2.8 0 2.8 5 0 5H12zM12 39.5h7V47h-7z"
      />
      {/* cheek guard line */}
      <path d="M42 18.5c-3 8-3.2 18-.4 28" stroke="#0a0a0b" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2 whitespace-nowrap">
      <Helmet className="h-9 w-9 shrink-0 text-bone" />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[0.98rem] font-bold tracking-[0.04em] sm:text-[1.05rem] text-bone">TITAN GARAGE</span>
        {!compact && <span className="mt-1 text-[0.58rem] font-semibold tracking-[0.42em] text-fog">FLOORING</span>}
      </span>
    </span>
  );
}
