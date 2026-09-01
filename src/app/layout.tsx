import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { RoleProvider } from "@/context/RoleContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "N5Deal — B2B Fintech M&A Platform",
  description: "B2B Fintech M&A dashboard prototype for buyers, sellers, and platform managers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased`}>
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500 font-sans">Loading N5Deal...</div>}>
          <RoleProvider>{children}</RoleProvider>
        </Suspense>
      </body>
    </html>
  );
}
