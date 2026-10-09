import { useTicketAction, useTicketStore } from "@/store/ticket.store";
import { Ticket } from "lucide-react";
import { useEffect } from "react";

export default function MetricCards() {
  const { tickets } = useTicketStore();
  const { listTickets } = useTicketAction;

  useEffect(() => {
    (async function () {
      await listTickets({
        page: 1,
        limit: 50,
        status: "open",
      });
    })();
  }, [listTickets]);

  return (
    <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 mb-1">
            Support Tickets
          </p>
          <h3 className="text-2xl font-extrabold text-navy">
            {tickets.length} Open
          </h3>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">
            Response in ~15m
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <Ticket size={22} />
        </div>
      </div>

      {/* <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 mb-1">
            Active Servers
          </p>
          <h3 className="text-2xl font-extrabold text-navy">3 Nodes</h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            100% Uptime
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-blue/10 text-blue flex items-center justify-center">
          <Server size={22} />
        </div>
      </div> */}

      {/* <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 mb-1">
            Managed Domains
          </p>
          <h3 className="text-2xl font-extrabold text-navy">2 Active</h3>
          <p className="text-[11px] text-cyan font-semibold mt-1">
            SSL Validated
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan flex items-center justify-center">
          <Globe size={22} />
        </div>
      </div> */}

      {/* <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 mb-1">
            CPU Load Avg
          </p>
          <h3 className="text-2xl font-extrabold text-navy">14.2%</h3>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Optimal Range
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Cpu size={22} />
        </div>
      </div> */}
    </div>
  );
}
