import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { LinkBtn } from "@/components/ui/Button";
import { Logo_Light } from "@/components/ui/Logo";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Logo_Light />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.path}
                className={`text-sm font-medium ${pathname === link.path ? "text-blue" : "text-slate-600"} hover:text-blue transition-colors`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <LinkBtn
            label="Sign In"
            path="/auth/login"
            styling="hidden md:block text-sm font-semibold text-navy px-6 py-3.5 rounded-xl border border-slate-200 hover:text-blue hover:bg-blue hover:text-white transition-colors"
          />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="cursor-pointer md:hidden p-2 text-slate-600 hover:text-navy"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.path}
              className={`block text-base font-medium ${pathname === link.path ? "text-blue" : "text-slate-700"} py-2`}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex item-center py-4 border border-slate-200 rounded-lg text-navy hover:bg-blue hover:text-white transition-colors">
            <LinkBtn
              label="Sign In"
              path="/auth/login"
              styling="w-full text-center font-semibold"
            />
          </div>
        </div>
      )}
    </header>
  );
};
