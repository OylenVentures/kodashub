import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative bg-bg pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-blue text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              24/7 On-Demand Infrastructure & Web Support
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy tracking-tight leading-tight">
              Instant Help for <br />
              <span className="bg-linear-to-r from-blue to-cyan bg-clip-text text-transparent">
                Server, Hosting & DNS
              </span>{" "}
              Errors
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl">
              From broken SSL certificates and DNS propagation delays to
              WordPress database restoration and cPanel troubleshooting. We
              resolve complex hosting issues fast.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-linear-to-r from-blue to-cyan rounded-xl shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:scale-[1.01] transition-all"
              >
                Resolve An Issue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              {/* <Link
                href="/hosting"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold text-navy bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Explore Hosting Plans
              </Link> */}
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200/80">
              <div>
                <p className="text-2xl font-bold text-navy">15 Mins</p>
                <p className="text-xs text-slate-500">Avg. Response Time</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">99.9%</p>
                <p className="text-xs text-slate-500">Resolution Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-navy">24/7</p>
                <p className="text-xs text-slate-500">Live Diagnostics</p>
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Preview Card */}
          <div className="lg:col-span-5">
            <div className="bg-navy font-(--font-jetbrains-mono) rounded-2xl p-6 shadow-2xl border border-slate-800 font-mono text-xs text-slate-300">
              {/* Fake Terminal Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-slate-500 font-sans text-xs">
                  kodashub-diag-cli v1.0.4
                </span>
              </div>

              {/* Terminal Logs Mock */}
              <div className="space-y-3 font-mono">
                <p className="text-slate-400">
                  $ kodashub analyze domain.com --ssl --dns
                </p>
                <p className="text-amber-400">
                  [WARN] SSL Certificate expired 2h ago
                </p>
                <p className="text-amber-400">
                  [WARN] A-Record mismatch on nameserver ns2.hosting.com
                </p>
                <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-1">
                  <p className="text-emerald-400 font-semibold">
                    [OK] Auto-Fixing Active
                  </p>
                  <p className="text-slate-400">
                    → Provisioning Let's Encrypt TLS Wildcard...
                  </p>
                  <p className="text-slate-400">
                    → Syncing DNS Zone Records...
                  </p>
                </div>
                <p className="text-cyan">
                  [SUCCESS] Web service restored in 1.24s
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
