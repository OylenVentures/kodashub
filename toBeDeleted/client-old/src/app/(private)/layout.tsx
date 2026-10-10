"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useUserStore, useUserAction } from "@/store/user.store";
import { Toaster } from "react-hot-toast";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useUserStore((state) => state.token);
  const loading = useUserStore((state) => state.loading);
  const currentUser = useUserStore((state) => state.currentUser);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Auth guard
    if (!token && !sessionStorage.getItem("token")) {
      router.push("/account");
    } else {
      // Load user profile if we don't have it
      if (!currentUser || (Array.isArray(currentUser) && currentUser.length === 0)) {
        useUserAction.getUserProfile();
      }
    }
  }, [token, router, currentUser]);

  if (!isMounted) return null;

  const handleLogout = () => {
    useUserAction.logout();
    sessionStorage.removeItem("token");
    router.push("/account");
  };

  const navLinks = [
    { name: "Dashboard Overview", href: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "My Domains", href: "/dashboard/domains", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" },
    { name: "Volt Calculator", href: "/tools/voltcalc", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { name: "Storage Sync", href: "/tools/storage-sync", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
  ];

  return (
    <div className="flex h-screen bg-[#0F172A] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-[#172347] border-r border-white/5 flex flex-col transition-all">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-blue to-brand-teal rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-all">
              <span className="text-white font-bold text-xl leading-none">K</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-widest">KODAS<span className="text-brand-gray/60 font-light">HUB</span></span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          <p className="text-xs font-bold text-brand-gray/40 uppercase tracking-wider mb-4 px-2">Menu</p>
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? "bg-brand-blue/10 text-brand-teal font-bold border border-brand-blue/20" : "text-brand-gray/70 hover:bg-white/5 hover:text-white"}`}
                >
                  <svg className={`w-5 h-5 ${isActive ? "text-brand-blue" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                  </svg>
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-brand-blue/20 border border-brand-blue/50 flex items-center justify-center text-brand-blue font-bold">
              {/* @ts-ignore */}
              {currentUser?.firstName?.[0] || "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              {/* @ts-ignore */}
              <p className="text-sm font-bold text-white truncate">{currentUser?.firstName || "User"}</p>
              {/* @ts-ignore */}
              <p className="text-xs text-brand-gray/60 truncate">{currentUser?.email || "user@example.com"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none"></div>

        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#0F172A]/80 backdrop-blur-md z-10">
          <h1 className="text-xl font-bold text-white tracking-wide">
            {navLinks.find(l => l.href === pathname)?.name || "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-brand-gray/60 hover:text-white transition-colors">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-blue rounded-full"></span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar z-10">
          {children}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
      </main>
    </div>
  );
}
