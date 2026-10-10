import { Logo_Dark } from "@/components/ui/Logo";
import Link from "next/link";
import { FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";

const support = [
  { label: "DNS & Domain Configuration", path: "#" },
  { label: "SSL Installation & Fixes", path: "#" },
  { label: "cPanel / DirectAdmin Assistance", path: "#" },
  { label: "WordPress Restoration and more...", path: "#" },
];

const legal = [
  { label: "Terms & Conditions", path: "/legal/#terms" },
  { label: "Privacy Policy", path: "/legal/#privacy" },
  { label: "Refund Policy", path: "/legal/#refund" },
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
    path: "https://linkedin.com/company/oylengroup",
  },
];

export const Footer = () => {
  return (
    <footer className="bg-navy text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div className="space-y-4 col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Logo_Dark />
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              Technical resolution platform for website errors, domain issues,
              and hosting infrastructure.
            </p>
            <p className="text-xs leading-relaxed text-slate-400">
              <span className="text-cyan font-semibold">KodasHub</span> is
              operated by{" "}
              <span className="text-cyan font-semibold">Oylen Ventures</span> |
              RC No. 9775081.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Support Services
            </h4>
            <ul className="space-y-2 text-xs">
              {support.map((item, index) => (
                <li key={index}>
                  <p>{item.label}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">
              Legal & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              {legal.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.path}
                    className="hover:text-cyan transition-colors"
                  >
                    {item.label}
                  </Link>
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
