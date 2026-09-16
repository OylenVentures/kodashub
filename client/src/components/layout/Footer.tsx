import { Logo_Dark } from "@/components/ui/Logo";
import Link from "next/link";
import { FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";

const support = [
  { label: "DNS & Domain Configuration", path: "#" },
  { label: "SSL Installation & Fixes", path: "#" },
  { label: "cPanel / DirectAdmin Assistance", path: "#" },
  { label: "WordPress Restoration and more...", path: "#" },
];

const infrastructure = [
  { label: "Domain Registration", path: "#" },
  { label: "Shared Web Hosting", path: "#" },
  { label: "Cloud VPS Hosting", path: "#" },
];

const socialLinks = [
  {
    icon: <FaTwitter className="w-6 h-6 hover:text-cyan transition-colors" />,
    path: "https://x.com/kodashub",
  },
  {
    icon: <FaFacebook className="w-6 h-6 hover:text-cyan transition-colors" />,
    path: "https://www.facebook.com/profile.php?id=61567162132703",
  },
  {
    icon: <FaLinkedin className="w-6 h-6 hover:text-cyan transition-colors" />,
    path: "#",
  },
];

export const Footer = () => {
  return (
    <footer className="bg-navy text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo_Dark />
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              Technical resolution platform for website errors, domain issues,
              and hosting infrastructure.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Support Services
            </h4>
            <ul className="space-y-2 text-xs">
              {support.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.path}
                    className="hover:text-cyan transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Infrastructure
            </h4>
            <ul className="space-y-2 text-xs">
              {infrastructure.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.path}
                    className="hover:text-cyan transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              System Status
            </h4>
            <div className="flex items-center gap-2 text-xs text-emerald-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Support Queues Operational
            </div>
            <p className="text-xs text-slate-500">
              Average response time for urgent request is currently within 15
              minutes.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs text-center text-slate-500 flex flex-col-reverse md:flex-row justify-evenly items-center gap-4">
          <p>© {new Date().getFullYear()} KodasHub. All rights reserved.</p>
          <div className="flex gap-3">
            {socialLinks.map((link, index) => (
              <Link
                key={index}
                href={link.path}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan transition-colors"
              >
                {link.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
