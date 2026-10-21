import { ArrowRight, Ticket } from "lucide-react";
import Link from "next/link";

export default function Welcome() {
  return (
    <div className="p-6 rounded-3xl bg-navy text-white shadow-xl relative overflow-hidden">
      <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="relative z-10 max-w-xl">
        <h2 className="text-2xl font-extrabold tracking-tight mb-2">
          Welcome back to KodasHub
        </h2>
        <p className="text-sm text-slate-100 leading-relaxed mb-6">
          Check active support tickets or open a new service request ticket.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/tickets"
            className="px-4 py-2.5 rounded-xl bg-white text-navy text-xs font-bold shadow-md hover:bg-slate-100 transition-all flex items-center gap-2"
          >
            <Ticket size={15} /> View Support Tickets
          </Link>
          <Link
            href="/dashboard/settings"
            className="px-4 py-2.5 rounded-xl bg-blue/30 border border-white/30 text-white text-xs font-bold backdrop-blur-md hover:bg-blue/50 transition-all flex items-center gap-2"
          >
            Account Settings <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
