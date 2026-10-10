import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0b1120] text-brand-gray/60 py-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
        <div className="flex flex-col gap-2 relative">
          <Link href="/" className="flex items-center gap-2 group justify-center md:justify-start">
            <Image src="/kh_dark_logo.png" className="w-[100px] md:w-[200px]" alt="Kodashub Logo" width={100} height={100} />
            {/* <svg
              width="32"
              height="32"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-80 group-hover:opacity-100 transition-opacity"
            >
              <path
                d="M20 12 L20 52 M20 32 L36 16 M20 32 L36 48 M36 16 L48 10 M36 48 L48 54 M30 22 L44 28 M30 42 L44 36"
                stroke="#2979F2"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="20" cy="12" r="4" fill="#13C8B8" />
              <circle cx="20" cy="52" r="4" fill="#13C8B8" />
              <circle cx="48" cy="10" r="4" fill="#13C8B8" />
            </svg>
            <span className="text-xl font-bold tracking-wide text-brand-gray opacity-80">
              Kodas<span className="text-brand-blue">Hub</span>
            </span> */}
          </Link>
          <p className="text-sm max-w-sm mt-2">
            Innovate. Deploy. Succeed. The ultimate digital solutions platform for developers and businesses.
          </p>
        </div>

        <div className="flex gap-8 text-sm font-medium">
          <Link href="#" className="hover:text-brand-teal transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-brand-teal transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-brand-teal transition-colors">Support Center</Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/5 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} KodasHub. All rights reserved.</p>
      </div>
    </footer>
  );
}
