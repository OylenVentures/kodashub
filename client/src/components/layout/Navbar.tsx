import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { LinkBtn } from "@/components/ui/Button";
import { Logo_Light } from "@/components/ui/Logo";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-m-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Logo_Light />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.path}
                className="text-sm font-medium text-slate-600 hover:text-blue transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* <LinkBtn
              label="Sign In"
              path="/login"
              styling="text-sm font-semibold text-navy hover:text-blue"
            /> */}
            <LinkBtn
              label="Get Technical Help"
              path="/services#request-form"
              styling="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue to-cyan rounded-lg shadow-sm hover:opacity-90 transition-opacity"
            />
          </div>

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
              className="block text-base font-medium text-slate-700 py-2"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-4 flex flex-col gap-2">
            {/* <LinkBtn
              label="Sign In"
              path="/login"
              styling="w-full text-center py-2 font-semibold text-navy border border-slate-200 rounded-lg"
            /> */}
            <LinkBtn
              label="Get Technical Help"
              path="/services#request-form"
              styling="w-full text-center py-2 font-semibold text-white bg-blue rounded-lg"
            />
          </div>
        </div>
      )}
    </header>
  );
};
