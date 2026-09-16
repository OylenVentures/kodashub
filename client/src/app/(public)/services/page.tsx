"use client";
import { Navbar } from "@/components/layout/Navbar";
import { ServicesCatalog } from "@/app/(public)/services/components/ServicesCatalog";
import { SupportForm } from "@/app/(public)/services/components/SupportForm";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Clock, CheckCircle, Wrench } from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-bg font-sans antialiased text-slate-900">
      <Navbar />

      <main>
        {/* Services Page Header Banner */}
        <section className="bg-navy text-white py-16 lg:py-20 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700 text-cyan text-xs font-semibold mb-4">
                <Wrench size={14} /> KodasHub On-Demand Engineering
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                Support & Diagnostic Services
              </h1>
              <p className="mt-4 text-slate-300 text-lg leading-relaxed">
                Fast resolution for hosting failures, DNS breakdowns, SSL
                errors, and server misconfigurations. Get direct assistance from
                technical specialists.
              </p>

              {/* Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <Clock className="text-cyan" size={20} />
                  <span className="text-xs text-slate-300 font-medium">
                    Fast Ticket Response
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-cyan" size={20} />
                  <span className="text-xs text-slate-300 font-medium">
                    Encrypted Data Handling
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-cyan" size={20} />
                  <span className="text-xs text-slate-300 font-medium">
                    No Fix, No Charge Policy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Detailed Services Catalog */}
        <ServicesCatalog />

        {/* Section 2: Interactive Form Section */}
        <section className="py-16 bg-slate-100/60 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-navy">
                Get Instant Help Now
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Fill out the technical form below to open an immediate support
                request.
              </p>
            </div>

            <SupportForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
