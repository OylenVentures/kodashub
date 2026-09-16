"use client";

import { Navbar } from "@/components/layout/Navbar";
import { ContactSection } from "@/app/(public)/contact/components/ContactSection";
import { ContactFAQ } from "@/app/(public)/contact/components/ContactFAQ";
import { Footer } from "@/components/layout/Footer";
import { MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-brand-bg font-sans antialiased text-slate-900">
      <Navbar />

      <main>
        {/* Contact Page Hero Banner */}
        <section className="bg-navy text-white py-16 lg:py-20 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700 text-brand-cyan text-xs font-semibold mb-4">
                <MessageSquare size={14} /> 24/7 Operations & Support
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                Contact KodasHub
              </h1>
              <p className="mt-4 text-slate-300 text-lg leading-relaxed">
                Connect with our team for hosting inquiries, technical support,
                domain registration, or hosting questions.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form and Details Section */}
        <ContactSection />

        {/* Contact FAQ Section */}
        <ContactFAQ />
      </main>

      <Footer />
    </div>
  );
}
