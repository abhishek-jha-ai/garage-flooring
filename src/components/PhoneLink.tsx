"use client";

import { trackEvent } from "@/lib/analytics";
import { site } from "@/lib/site";

export function PhoneLink({
  source,
  className,
  children,
}: {
  source: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <a href={site.phoneHref} className={className} onClick={() => trackEvent("phone_clicked", { source })}>
      {children ?? site.phoneDisplay}
    </a>
  );
}
