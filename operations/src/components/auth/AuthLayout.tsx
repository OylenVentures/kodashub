import Link from "next/link";
import { ShieldCheck, Terminal } from "lucide-react";
import { Logo_Light } from "../ui/Logo";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-bg relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans overflow-hidden">
      {/* Ambient Tech Glow Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-125 pointer-events-none overflow-hidden z-0 opacity-40">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-150 h-87.5 bg-linear-to-tr from-brand-blue/20 via-brand-cyan/25 to-emerald-400/10 blur-[120px] rounded-full" />
      </div>

      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      {/* Header Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-6 group"
        >
          <div className="transition-transform duration-300 group-hover:scale-105">
            <Logo_Light />
          </div>
        </Link>

        {/* Tech Gateway Badge */}
        <div className="flex justify-center mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-blue/5 border border-brand-blue/15 text-brand-blue text-xs font-semibold tracking-wide shadow-sm">
            <Terminal size={12} className="text-brand-cyan" />
            <span>KodasHub Secure Gateway</span>
          </div>
        </div>

        <h2 className="text-center text-3xl font-extrabold tracking-tight text-navy">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Form Card Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="bg-white/90 backdrop-blur-xl py-8 px-6 shadow-2xl shadow-slate-900/5 border border-slate-200/80 rounded-3xl sm:px-10 transition-all">
          {children}
        </div>

        {/* Footer Security Badge */}
        <div className="mt-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>256-Bit Encrypted Secure Authentication</span>
        </div>
      </div>
    </div>
  );
};
