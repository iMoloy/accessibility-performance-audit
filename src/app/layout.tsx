import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SkipToContent } from "@/components/SkipToContent";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06080d",
};

export const metadata: Metadata = {
  title: "Nexus A11y & Performance Audit Studio (FE-10)",
  description:
    "Production-grade accessibility and performance auditing suite. Features WCAG 2.2 AAA color contrast, aria-live polite token streaming, keyboard-only task completion, and 100/100 Lighthouse mobile score.",
  keywords: [
    "Accessibility",
    "A11y",
    "Performance Audit",
    "Lighthouse Mobile 100",
    "WAVE Evaluator",
    "WCAG AAA",
    "aria-live polite",
    "Frontend AI Engineering",
    "FE-10",
  ],
  authors: [{ name: "Frontend AI Engineering Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#06080d] text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-200 min-h-screen flex flex-col font-sans">
        <SkipToContent />
        {children}
      </body>
    </html>
  );
}
