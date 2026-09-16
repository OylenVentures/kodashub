"use client";

import React from "react";
import { useUserStore } from "@/store/user.store";

export default function DashboardOverview() {
  const currentUser = useUserStore((state) => state.currentUser);
  const loading = useUserStore((state) => state.loading);

  if (loading && !currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#172347] to-[#121D3B] border border-brand-blue/20 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-white mb-2">
              {/* @ts-ignore */}
              Welcome back, {currentUser?.firstName || "User"}! 👋
            </h2>
            <p className="text-brand-gray/80 text-lg max-w-xl">
              Here's what's happening with your domains and connected tools today.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-brand-blue/10 border border-brand-blue/30 text-brand-teal rounded-xl font-bold hover:bg-brand-blue/20 transition-all">
              Edit Profile
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-teal text-white rounded-xl font-bold hover:shadow-lg hover:shadow-brand-blue/20 transition-all">
              Quick Connect
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Active Domains", value: "0", subtext: "No domains mapped yet", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" },
          { title: "Storage Migrations", value: "0", subtext: "0 files synced this month", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
          { title: "Calculations Run", value: "0", subtext: "Tools usages", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" }
        ].map((stat, i) => (
          <div key={i} className="bg-[#172347] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 shadow-lg hover:border-brand-blue/20 transition-colors">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-brand-blue/10 text-brand-blue rounded-xl">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
              <h3 className="text-lg font-medium text-brand-gray/90">{stat.title}</h3>
              <p className="text-sm text-brand-gray/50 mt-2">{stat.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#172347] border border-white/5 rounded-3xl p-8">
           <h3 className="text-xl font-bold text-white mb-6">Recent Activity Log</h3>
           <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
              <p className="text-brand-gray/60">No recent activity found.</p>
           </div>
        </div>

        <div className="bg-[#172347] border border-white/5 rounded-3xl p-8">
           <h3 className="text-xl font-bold text-white mb-6">Tool Quick Links</h3>
           <div className="flex flex-col gap-4">
              <a href="/dashboard/tools/voltcalc" className="flex items-center p-4 bg-[#121D3B] rounded-xl border border-white/5 hover:border-brand-blue/30 transition-colors group">
                 <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue mr-4 group-hover:scale-110 transition-transform">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                   </svg>
                 </div>
                 <div className="flex-1">
                    <h4 className="text-white font-bold mb-1">Volt Calculator</h4>
                    <p className="text-sm text-brand-gray/60">Estimate electricity usage and tariff bands.</p>
                 </div>
                 <svg className="w-5 h-5 text-brand-gray/40 group-hover:text-brand-blue transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                 </svg>
              </a>
              <a href="/dashboard/tools/storage-sync" className="flex items-center p-4 bg-[#121D3B] rounded-xl border border-white/5 hover:border-brand-teal/30 transition-colors group">
                 <div className="w-12 h-12 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal mr-4 group-hover:scale-110 transition-transform">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                   </svg>
                 </div>
                 <div className="flex-1">
                    <h4 className="text-white font-bold mb-1">Storage Sync</h4>
                    <p className="text-sm text-brand-gray/60">Migrate Cloudinary & R2 directly to AWS S3.</p>
                 </div>
                 <svg className="w-5 h-5 text-brand-gray/40 group-hover:text-brand-teal transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                 </svg>
              </a>
           </div>
        </div>
      </div>
    </div>
  );
}
