"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);

  return (
    <nav className="w-full flex items-center justify-between px-8 py-6 bg-[#0B132B] shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/kh_dark_logo.png"
            className="w-[100px] md:w-[200px]"
            alt="Kodashub Logo"
            width={100}
            height={100}
          />
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8 text-brand-gray font-medium">
        <Link
          href="/domains"
          className="hover:text-brand-teal transition-colors"
        >
          Domains
        </Link>
        <div className="relative group">
          <button className="flex items-center gap-1 hover:text-brand-teal transition-colors group-hover:text-brand-teal">
            Tools
            <svg
              className="w-4 h-4 transition-transform group-hover:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div className="absolute top-full left-0 mt-2 w-48 bg-brand-navy border border-white/10 rounded-xl shadow-xl shadow-brand-blue/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden z-50">
            <Link
              href="/tools/voltcalc"
              className="px-4 py-3 hover:bg-white/5 hover:text-brand-teal transition-colors flex items-center gap-2"
            >
              Volt Calculator
            </Link>
            <Link
              href="/tools/storage-sync"
              className="px-4 py-3 hover:bg-white/5 hover:text-brand-teal transition-colors flex items-center gap-2"
            >
              Storage Sync
            </Link>
          </div>
        </div>
        <Link href="/" className="hover:text-brand-teal transition-colors">
          DevOps Service
        </Link>
      </div>

      <div className="hidden md:flex gap-4">
        <Link
          href="/account"
          className="px-5 py-2 rounded-md font-semibold text-brand-navy bg-brand-teal hover:bg-opacity-90 transition-all shadow-[0_0_15px_rgba(19,200,184,0.3)] hover:shadow-[0_0_20px_rgba(19,200,184,0.6)]"
        >
          Get Started
        </Link>
      </div>

      {/* Mobile Hamburger Button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-brand-gray hover:text-white transition-colors focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-brand-navy border-t border-white/10 shadow-2xl flex flex-col items-center py-8 gap-6 md:hidden z-40">
          <Link
            href="/domains"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl font-medium text-brand-gray hover:text-brand-teal transition-colors"
          >
            Domains
          </Link>
          <div className="flex flex-col items-center w-full relative">
            <button
              onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
              className="text-xl font-medium text-brand-gray hover:text-brand-teal transition-colors flex items-center gap-2 focus:outline-none"
            >
              Tools
              <svg
                className={`w-5 h-5 transition-transform ${isMobileToolsOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {/* Sub-menu Dropdown */}
            <div
              className={`flex flex-col items-center gap-4 mt-4 overflow-hidden transition-all duration-300 ease-in-out ${isMobileToolsOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <Link
                href="/tools/voltcalc"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-brand-gray hover:text-white transition-colors"
              >
                Volt Calculator
              </Link>
              <Link
                href="/tools/storage-sync"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-brand-gray hover:text-white transition-colors"
              >
                Storage Sync
              </Link>
            </div>
          </div>
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xl font-medium text-brand-gray hover:text-brand-teal transition-colors"
          >
            DevOps Service
          </Link>
          <Link
            href="/account"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 px-8 py-3 rounded-md font-bold text-brand-navy bg-brand-teal w-[80%] max-w-sm text-center shadow-[0_0_15px_rgba(19,200,184,0.3)]"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
