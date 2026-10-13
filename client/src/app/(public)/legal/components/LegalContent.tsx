"use client";

import { useState } from "react";
import {
  FileText,
  ShieldCheck,
  RefreshCcw,
  CheckCircle2,
  Lock,
} from "lucide-react";

type LegalTab = "terms" | "privacy" | "refund";

export const LegalContent = () => {
  const [activeTab, setActiveTab] = useState<LegalTab>("terms");

  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Policy Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-bg rounded-2xl border border-slate-200/80 mb-12 max-w-2xl mx-auto">
          <button
            onClick={() => setActiveTab("terms")}
            className={`cursor-pointer flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "terms"
                ? "bg-blue text-white shadow-md shadow-blue/20"
                : "text-slate-600 hover:text-navy hover:bg-slate-100"
            }`}
          >
            <FileText size={16} /> Terms & Conditions
          </button>

          <button
            onClick={() => setActiveTab("privacy")}
            className={`cursor-pointer flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "privacy"
                ? "bg-blue text-white shadow-md shadow-blue/20"
                : "text-slate-600 hover:text-navy hover:bg-slate-100"
            }`}
          >
            <ShieldCheck size={16} /> Privacy Policy
          </button>

          <button
            onClick={() => setActiveTab("refund")}
            className={`cursor-pointer flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "refund"
                ? "bg-blue text-white shadow-md shadow-blue/20"
                : "text-slate-600 hover:text-navy hover:bg-slate-100"
            }`}
          >
            <RefreshCcw size={16} /> Refund Policy
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm text-slate-700 space-y-8 leading-relaxed text-sm">
          {/* ================= TERMS & CONDITIONS ================= */}
          {activeTab === "terms" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-extrabold text-navy">
                  Terms and Conditions
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Last Updated: October 2026
                </p>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-navy">
                  1. Acceptance of Terms
                </h3>
                <p>
                  By accessing or using the KodasHub platform, website,
                  infrastructure, or emergency technical support services, you
                  agree to be bound by these Terms and Conditions. If you do not
                  agree, please discontinue service usage immediately.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-navy">
                  2. Technical Intervention & Access Credentials
                </h3>
                <p>
                  For on-demand technical support (such as cPanel repair, DNS
                  propagation fixes, SSL installation, and WordPress disaster
                  recovery), you may be required to grant temporary server or
                  control panel access. You are responsible for ensuring that
                  credentials provided are shared strictly through our encrypted
                  support portal. KodasHub engineers will access systems solely
                  for diagnosing and resolving requested issues.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-navy">
                  3. Account Passcodes & Authentication
                </h3>
                <p>
                  KodasHub utilizes passwordless email authentication. Access
                  tokens generated upon login are valid for 30 minutes, while
                  session state is maintained via a 7-day secure HttpOnly
                  refresh token. Users are responsible for safeguarding access
                  to their registered email accounts.
                </p>
              </section>

              {/* <section className="space-y-3">
                <h3 className="text-base font-bold text-navy">
                  4. Acceptable Use Policy (AUP)
                </h3>
                <p>
                  Managed shared hosting, domain reseller accounts, and Cloud
                  VPS instances hosted with KodasHub must not be utilized for
                  illegal activities, malware dissemination, unauthorized port
                  scanning, or sending unsolicited bulk email (spam). Violation
                  of our AUP will result in immediate suspension without prior
                  notice.
                </p>
              </section> */}

              {/* <section className="space-y-3">
                <h3 className="text-base font-bold text-navy">
                  5. Service Level Agreement (SLA) & Limitation of Liability
                </h3>
                <p>
                  While KodasHub strives for 99.9% network uptime across
                  regional node clusters, KodasHub shall not be liable for
                  indirect damages, third-party plugin/theme incompatibilities,
                  or data loss caused by unauthorized client-side modifications.
                  Regular off-site backups are strongly recommended.
                </p>
              </section> */}
            </div>
          )}

          {/* ================= PRIVACY POLICY ================= */}
          {activeTab === "privacy" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-extrabold text-navy">
                  Privacy Policy
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Last Updated: October 2026
                </p>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-navy">
                  1. Information We Collect
                </h3>
                <p>
                  We collect personal details necessary to provision
                  infrastructure and render technical services, including:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  <li>
                    <strong>Account Identity:</strong> Full Name, Email Address,
                    and Phone number.
                  </li>
                  <li>
                    <strong>Diagnostic Data:</strong> Server error logs,
                    screenshots, DNS zone records, and cPanel configuration
                    details provided via support tickets.
                  </li>
                  <li>
                    <strong>Session Identifiers:</strong> Secure 7-day HttpOnly
                    refresh cookies used exclusively for session management and
                    anti-fraud checks.
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-navy">
                  2. How We Use Your Data
                </h3>
                <p>Your information is utilized strictly to:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  <li>
                    Diagnose and patch server, domain, email deliverability, and
                    SSL issues.
                  </li>
                  {/* <li>
                    Provision shared hosting, domain registrations, and cloud
                    VPS instances.
                  </li> */}
                  <li>
                    Issue security notifications, ticket responses, and account
                    passcodes.
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-navy">
                  3. Data Security & Credentials Handling
                </h3>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
                  <Lock size={20} className="text-blue shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    All data transmitted to KodasHub is protected by 256-Bit
                    SSL/TLS encryption. Temporary server credentials provided
                    during emergency troubleshooting are automatically purged
                    from our encrypted logging systems once ticket resolution is
                    confirmed.
                  </p>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-navy">
                  4. Third-Party Sharing
                </h3>
                <p>
                  We do not sell, rent, or lease client data to advertisers.
                  {/* Domain registration information may be transmitted to
                  authorized domain registries (such as ICANN accredited
                  registrars) solely for WHOIS compliance and domain allocation. */}
                </p>
              </section>
            </div>
          )}

          {/* ================= REFUND POLICY ================= */}
          {activeTab === "refund" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-2xl font-extrabold text-navy">
                  Refund & Guarantee Policy
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Last Updated: October 2026
                </p>
              </div>

              {/* No Fix No Charge Guarantee Callout */}
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-900">
                <CheckCircle2
                  size={22}
                  className="text-emerald-600 shrink-0 mt-0.5"
                />
                <div>
                  <h4 className="text-sm font-bold">
                    Our "No Fix, No Charge" Guarantee
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    If our engineering team is unable to resolve your declared
                    technical issue (such as an SSL installation error, DNS
                    propagation failure, or WordPress recovery task), you will
                    receive a 100% full refund on that intervention.
                  </p>
                </div>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-navy">
                  1. One-Time Support Interventions
                </h3>
                <p>
                  For non-subscription troubleshooting services, refunds are
                  granted if our engineers fail to resolve the issue as
                  originally described in your support ticket. If a resolution
                  is successfully deployed and verified, fees for rendered
                  engineer labor are non-refundable.
                </p>
              </section>

              {/* <section className="space-y-3">
                <h3 className="text-base font-bold text-navy">
                  2. Managed Web Hosting & VPS Subscriptions
                </h3>
                <p>
                  Shared hosting and VPS plans are backed by a{" "}
                  <strong>14-day money-back guarantee</strong>. If you are
                  unsatisfied with server performance within the first 14 days
                  of activation, you may request a complete refund of your
                  hosting subscription fees.
                </p>
              </section> */}

              {/* <section className="space-y-3">
                <h3 className="text-base font-bold text-navy">
                  3. Non-Refundable Items
                </h3>
                <p>
                  Due to registry operational costs, the following items are
                  strictly non-refundable:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  <li>
                    Domain Name Registrations, Transfers, and TLD Renewals.
                  </li>
                  <li>
                    Third-party commercial SSL Certificates once issued by the
                    Certificate Authority.
                  </li>
                  <li>
                    Services suspended due to violations of our Acceptable Use
                    Policy.
                  </li>
                </ul>
              </section> */}

              <section className="space-y-3">
                <h3 className="text-base font-bold text-navy">
                  2. Requesting a Refund
                </h3>
                <p>
                  To request a refund, please open a ticket from your dashboard
                  or email{" "}
                  <a
                    href="mailto:support@kh.oylengroup.com"
                    className="text-blue font-bold hover:underline"
                  >
                    support@kh.oylengroup.com
                  </a>{" "}
                  with your ticket reference number. Approved refunds are
                  processed back to the original payment method within 3 to 5
                  business days.
                </p>
              </section>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
