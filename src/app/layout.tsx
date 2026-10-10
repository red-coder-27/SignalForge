import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SignalForge — Technology Opportunity Radar | SerpApi India Hackathon 2026",
  description: "Find the signal. Verify the evidence. Decide what to build next. Multi-source live search radar powered by SerpApi (Google Search, Scholar, Jobs).",
  keywords: ["SerpApi", "Technology Radar", "Developer Tools", "AI Agents", "Google Scholar", "Google Jobs", "Live Search"],
  authors: [{ name: "SignalForge Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090d16",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
