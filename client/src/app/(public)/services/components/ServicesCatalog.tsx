import {
  Globe,
  Lock,
  Server,
  RefreshCw,
  Mail,
  Cpu,
  Check,
  ArrowRight,
  Code2,
} from "lucide-react";

const detailedServices = [
  {
    id: "dns-domain",
    icon: Globe,
    title: "DNS & Domain Configuration",
    description:
      "Fix routing glitches, propagation delays, and domain configuration mismatches.",
    deliverables: [
      "A, CNAME, MX, TXT, and SRV Record setups",
      "Nameserver pointings and registrar transfers",
      "Cloudflare CDN & DNS proxy configuration",
      "Subdomain routing and redirection rules",
    ],
  },
  {
    id: "ssl-security",
    icon: Lock,
    title: "SSL Certificates & HTTPS Security",
    description:
      "Ensure unbroken TLS encryption, clear security warnings, and enforce HTTPS.",
    deliverables: [
      "Let's Encrypt, Sectigo, and Wildcard SSL setups",
      "Mixed content (HTTP/HTTPS) error resolution",
      "Automated cert-bot renewal bug fixes",
      "SSL Handshake failed (Error 525 / 526) fixes",
    ],
  },
  {
    id: "control-panels",
    icon: Server,
    title: "cPanel & DirectAdmin Support",
    description:
      "Complete administration and error resolution for standard Web Hosting Control Panels.",
    deliverables: [
      "PHP version upgrades and extensions (ionCube, GD, MySQLi)",
      "Database import/export & privilege fixes",
      "Cron job setup and task failure diagnostics",
      "Disk quota & inode utilization management",
    ],
  },
  {
    id: "wordpress-recovery",
    icon: RefreshCw,
    title: "WordPress Emergency Restoration",
    description:
      "Rapid disaster recovery for corrupted WordPress installations.",
    deliverables: [
      "Fix 500 Internal Server & WSOD (White Screen)",
      "Database Connection Error troubleshooting",
      "Plugin/Theme conflict debugging",
      "Malware cleanup & htaccess restoration",
    ],
  },
  {
    id: "email-deliverability",
    icon: Mail,
    title: "Email Deliverability & Authentication",
    description:
      "Stop your domain emails from ending up in spam folders or getting bounced.",
    deliverables: [
      "SPF record syntax & limit optimization",
      "DKIM key generation and DNS publishing",
      "DMARC policy enforcement (p=reject / p=quarantine)",
      "IP/Domain blacklist monitoring & removal",
    ],
  },
  {
    id: "web-development",
    icon: Code2,
    title: "Web Application Development",
    description:
      "Build fast, responsive, and scalable web applications tailored to your business needs.",
    deliverables: [
      "Responsive frontend and modern UI development",
      "Custom backend APIs and server-side functionality",
      "Database design, integration, and optimization",
      "Third-party API and payment gateway integrations",
    ],
  },
  {
    id: "vps-linux",
    icon: Cpu,
    title: "VPS & Linux Server Management",
    description:
      "Hands-on Linux server administration for AlmaLinux, Ubuntu, and Debian setups.",
    deliverables: [
      "Nginx / Apache web server configuration",
      "VirtualBox & Vagrant hypervisor debugging",
      "SSH access, firewall (UFW/firewalld) adjustments",
      "System resource & RAM memory leak analysis",
    ],
  },
];

export const ServicesCatalog = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-navy sm:text-4xl">
            Complete Technical Capabilities
          </h2>
          <p className="mt-4 text-slate-600 text-lg">
            Diagnosing and patching infrastructure bottlenecks with precision
            and minimum downtime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {detailedServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-bg rounded-2xl p-6 border border-slate-200/80 hover:border-blue/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue mb-5 shadow-sm">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-2">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-2.5 mb-6">
                    {service.deliverables.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-xs text-slate-700"
                      >
                        <Check
                          size={16}
                          className="text-emerald-500 shrink-0 mt-0.5"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#request-form"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue hover:text-navy transition-colors pt-4 border-t border-slate-200/60"
                >
                  Request Fix For This Issue <ArrowRight size={14} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
