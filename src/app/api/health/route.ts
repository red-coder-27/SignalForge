import { NextResponse } from "next/server";

export async function GET() {
  const hasSerpApiKey = Boolean(process.env.SERPAPI_KEY && process.env.SERPAPI_KEY.trim().length > 5);

  return NextResponse.json({
    status: "ok",
    service: "SignalForge API",
    version: "1.0.0",
    hasSerpApiKey,
    enginesConfigured: ["google", "google_scholar", "google_jobs"],
    defaultMode: hasSerpApiKey ? "LIVE" : "DEMO_FIXTURE",
    disclaimer: "SignalForge deterministic technology opportunity radar. No secrets are exposed."
  });
}
