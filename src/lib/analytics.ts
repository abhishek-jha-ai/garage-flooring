/**
 * Vendor-neutral analytics. Components only ever call `trackEvent`.
 * Add or remove providers here (GA4, Meta Pixel, PostHog, GoHighLevel, …).
 */

export type AnalyticsEvent =
  | "estimate_started"
  | "estimate_step_completed"
  | "estimate_submitted"
  | "estimate_abandoned"
  | "project_type_selected"
  | "explorer_view_changed"
  | "hotspot_opened"
  | "finish_selected"
  | "before_after_interaction"
  | "gallery_filtered"
  | "gallery_opened"
  | "phone_clicked"
  | "reviews_clicked";

type Props = Record<string, string | number | boolean | undefined>;
type Provider = (event: AnalyticsEvent, props: Props) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const metaStandardEvents: Partial<Record<AnalyticsEvent, string>> = {
  estimate_submitted: "Lead",
  phone_clicked: "Contact",
};

const providers: Provider[] = [
  // Google Tag Manager / GA4
  (event, props) => {
    window.dataLayer?.push({ event, ...props });
    window.gtag?.("event", event, props);
  },
  // Meta Pixel — only map conversion events so ad optimization stays clean
  (event, props) => {
    const std = metaStandardEvents[event];
    if (std) window.fbq?.("track", std, props);
    else window.fbq?.("trackCustom", event, props);
  },
  // Dev console
  (event, props) => {
    if (process.env.NODE_ENV !== "production") console.info("[analytics]", event, props);
  },
];

export function trackEvent(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  for (const p of providers) {
    try {
      p(event, props);
    } catch {
      /* never let analytics break the page */
    }
  }
}
