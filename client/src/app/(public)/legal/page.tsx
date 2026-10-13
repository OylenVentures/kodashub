"use client";

import { ShieldCheck } from "lucide-react";
import { LegalContent } from "./components/LegalContent";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-bg font-sans antialiased text-slate-900">
      <Navbar />

      <main>
        {/* Legal Page Hero Header */}
        <section className="bg-navy text-white py-16 lg:py-20 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700 text-cyan text-xs font-semibold mb-4">
                <ShieldCheck size={14} /> Trust & Transparency
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                Legal & Compliance
              </h1>
              <p className="mt-4 text-slate-300 text-lg leading-relaxed">
                Review our terms of service, privacy safeguards, and refund
                guarantees for technical support, development services, and
                infrastructure.
              </p>
            </div>
          </div>
        </section>

        {/* Legal Tabs & Document Content */}
        <LegalContent />
      </main>

      <Footer />
    </div>
  );
}
