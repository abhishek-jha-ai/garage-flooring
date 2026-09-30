export type Lead = {
  projectType: string;
  size: string;
  timeline: string;
  name: string;
  phone: string;
  email: string;
  zip: string;
  finish?: string;
  source?: string;
  utm?: Record<string, string>;
  submittedAt: string;
};

/** A destination for a lead: CRM, SMS, email, spreadsheet… */
export type LeadAdapter = {
  name: string;
  enabled: () => boolean;
  send: (lead: Lead) => Promise<void>;
};

export type ValidationResult = { ok: true; lead: Lead } | { ok: false; errors: Record<string, string> };
