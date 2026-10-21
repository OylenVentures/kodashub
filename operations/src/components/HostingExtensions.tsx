import { Layers, HardDrive, Cpu, CheckCircle } from "lucide-react";

export const HostingExtensions = () => {
  return (
    <section id="hosting" className="py-20 bg-bg border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Enterprise Infrastructure
          </span>
          <h2 className="text-3xl font-bold text-navy sm:text-4xl mt-3">
            Scaled Hosting & Provisioning
          </h2>
          <p className="mt-4 text-slate-600 text-lg">
            High-performance hosting infrastructure backed by our active
            technical resolution team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Domain Reseller */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="p-3 bg-blue-50 rounded-xl w-fit text-blue mb-6">
                <Layers size={28} />
              </div>
              <h3 className="text-2xl font-bold text-navy mb-2">
                Domain Reseller
              </h3>
              <p className="text-slate-600 text-sm mb-6">
                Bulk TLD registration, automated WHOIS management, and
                API-driven DNS management.
              </p>
              <ul className="space-y-3 text-sm text-slate-600 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" /> Free
                  Private Nameservers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" />{" "}
                  Automated Renewal Rules
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" /> Full
                  DNS Zone API
                </li>
              </ul>
            </div>
            <button className="w-full py-3 text-sm font-semibold text-navy bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
              Become a Reseller
            </button>
          </div>

          {/* Managed Shared Hosting */}
          <div className="bg-white p-8 rounded-2xl border-2 border-cyan shadow-lg relative flex flex-col justify-between">
            <span className="absolute -top-3 right-6 bg-linear-to-r from-blue to-cyan text-white text-xs font-bold px-3 py-1 rounded-full">
              Most Popular
            </span>
            <div>
              <div className="p-3 bg-cyan-50 rounded-xl w-fit text-cyan mb-6">
                <HardDrive size={28} />
              </div>
              <h3 className="text-2xl font-bold text-navy mb-2">
                Managed Web Hosting
              </h3>
              <p className="text-slate-600 text-sm mb-6">
                High-speed NVMe shared environments with integrated daily
                backups and instant tech support.
              </p>
              <ul className="space-y-3 text-sm text-slate-600 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" />{" "}
                  Unmetered NVMe Storage
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" /> Free
                  SSL Certificates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" /> Free
                  Site Migration
                </li>
              </ul>
            </div>
            <button className="w-full py-3 text-sm font-semibold text-white bg-linear-to-r from-blue to-cyan rounded-xl shadow-md hover:opacity-95 transition-opacity">
              Provision Shared Hosting
            </button>
          </div>

          {/* Managed Cloud VPS */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="p-3 bg-blue-50 rounded-xl w-fit text-blue mb-6">
                <Cpu size={28} />
              </div>
              <h3 className="text-2xl font-bold text-navy mb-2">
                High-Performance VPS
              </h3>
              <p className="text-slate-600 text-sm mb-6">
                Dedicated virtual resources with full root access, tailored OS
                templates, and cloud architecture support.
              </p>
              <ul className="space-y-3 text-sm text-slate-600 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" />{" "}
                  Dedicated vCPU & KVM Isolation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" />{" "}
                  AlmaLinux, Ubuntu, Debian OS
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" /> Managed
                  Security Updates
                </li>
              </ul>
            </div>
            <button className="w-full py-3 text-sm font-semibold text-navy bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
              Deploy VPS Instance
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
