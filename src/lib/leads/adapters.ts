import type { LeadAdapter } from "./types";

/**
 * Lead destinations. Each adapter is independent — add GoHighLevel, HubSpot,
 * Twilio SMS, Resend email, etc. by appending to this list.
 */

const consoleAdapter: LeadAdapter = {
  name: "console",
  enabled: () => true,
  async send(lead) {
    console.log("[lead]", JSON.stringify(lead));
  },
};

/** Generic JSON webhook — works with Zapier, Make, n8n, GoHighLevel inbound webhooks. */
const webhookAdapter: LeadAdapter = {
  name: "webhook",
  enabled: () => Boolean(process.env.LEAD_WEBHOOK_URL),
  async send(lead) {
    const res = await fetch(process.env.LEAD_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
  },
};

export const leadAdapters: LeadAdapter[] = [consoleAdapter, webhookAdapter];
