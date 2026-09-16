import {
  Globe,
  ShieldCheck,
  Mail,
  Server,
  Wrench,
  RefreshCw,
  Code2,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "DNS & Domain Configuration",
    description:
      "Fix propagation errors, nameserver updates, MX records, and custom CNAME routing.",
  },
  {
    icon: ShieldCheck,
    title: "SSL & HTTPS Security",
    description:
      "Resolve SSL handshakes, mixed content errors, auto-renewals, and wildcard certificates.",
  },
  {
    icon: Server,
    title: "cPanel & DirectAdmin Support",
    description:
      "Control panel migration, PHP version issues, database management, and permission repairs.",
  },
  {
    icon: RefreshCw,
    title: "WordPress Emergency Recovery",
    description:
      "Fix 500 Internal Errors, White Screen of Death (WSOD), database connection errors, and malware cleanup.",
  },
  {
    icon: Mail,
    title: "Email Delivery & SPF/DKIM",
    description:
      "Solve email bouncebacks, blacklist issues, and set up DKIM, SPF, and DMARC security records.",
  },
  {
    icon: Code2,
    title: "Web App Development",
    description:
      "Build fast, responsive, and scalable web applications with modern frameworks, APIs, databases, and custom integrations.",
  },
  {
    icon: Wrench,
    title: "Hosting & Server Troubleshooting",
    description:
      "Diagnose resource limits, memory allocation errors, Nginx/Apache configurations, and cloud deployment bugs.",
  },
];

export const ServicesGrid = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-navy sm:text-4xl">
            Specialized Troubleshooting Services
          </h2>
          <p className="mt-4 text-slate-600 text-lg">
            Direct technical intervention for critical website and server
            failures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="p-8 rounded-2xl bg-bg border border-slate-200/80 hover:border-cyan hover:shadow-xl hover:shadow-cyan-500/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue group-hover:bg-blue group-hover:text-white transition-colors mb-6">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
