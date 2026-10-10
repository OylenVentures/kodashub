"use client";

import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PlusCircle } from "lucide-react";
import Welcome from "./components/Welcome";
import MetricCards from "./components/MetricCards";

export default function DashboardOverviewPage() {
  return (
    <DashboardLayout title="Overview">
      <div className="space-y-6">
        <Welcome />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetricCards />

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-navy mb-2">
                Need Direct Engineering Help?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Our DevOps and system architects are available for custom server
                configuration, Docker troubleshooting, and API scaling.
              </p>
            </div>
            <Link
              href="/dashboard/tickets"
              className="w-full py-3 px-4 rounded-xl text-white font-semibold text-xs bg-blue hover:opacity-80 shadow-md flex items-center justify-center gap-2 transition-all text-center"
            >
              <PlusCircle size={16} /> View Priority Tickets
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
