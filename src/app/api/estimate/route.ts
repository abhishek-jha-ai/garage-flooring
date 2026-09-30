import { NextResponse } from "next/server";
import { leadAdapters } from "@/lib/leads/adapters";
import { validateLead } from "@/lib/leads/validate";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields, people don't.
  if (body && typeof body === "object" && (body as Record<string, unknown>).company) {
    return NextResponse.json({ ok: true });
  }

  const result = validateLead(body);
  if (!result.ok) return NextResponse.json({ ok: false, errors: result.errors }, { status: 422 });

  const active = leadAdapters.filter((a) => a.enabled());
  const outcomes = await Promise.allSettled(active.map((a) => a.send(result.lead)));
  outcomes.forEach((o, i) => {
    if (o.status === "rejected") console.error(`[lead] adapter "${active[i].name}" failed`, o.reason);
  });

  return NextResponse.json({ ok: true });
}
