"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useTicketAction, useTicketStore } from "@/store/ticket.store";
import { TicketItem } from "@/utils/interface";
import NewTicket from "./components/NewTicket";
import TicketDetails from "./components/TicketDetails";
import Loader from "@/components/ui/Loader";

export default function TicketsPage() {
  const { tickets, total, isLoading, error } = useTicketStore();
  const { listTickets } = useTicketAction;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<TicketItem | null>(null);

  const totalPages = Math.ceil(total / itemsPerPage) || 1;

  useEffect(() => {
    (async function () {
      await listTickets({
        page: currentPage,
        limit: itemsPerPage,
      });
    })();
  }, [currentPage, listTickets]);

  return (
    <DashboardLayout title="Support Tickets">
      <div className="space-y-6">
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="cursor-pointer py-2.5 px-4 rounded-xl text-white font-semibold text-xs bg-blue hover:opacity-80 shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={16} /> Create New Ticket
          </button>
        </div>

        {/* Ticket List Table / Cards */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {isLoading ? (
            <Loader />
          ) : error ? (
            <p className="text-sm text-center text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Subject</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {tickets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-12 text-slate-400"
                      >
                        No tickets found matching your query.
                      </td>
                    </tr>
                  ) : (
                    tickets.map((ticket) => (
                      <tr
                        key={ticket.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="font-semibold text-navy py-4 px-6">
                          {ticket.subject}
                        </td>
                        <td className="py-4 px-4 text-slate-600 font-medium">
                          {ticket.department}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              ticket.priority === "urgent" ||
                              ticket.priority === "high"
                                ? "bg-red-50 text-red-600 border border-red-200"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              ticket.status === "open"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : ticket.status === "in_progress"
                                  ? "bg-blue-50 text-blue border border-blue/20"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {ticket.status === "answered" ? (
                              <CheckCircle2 size={12} />
                            ) : (
                              <Clock size={12} />
                            )}
                            {ticket.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setActiveTicket(ticket)}
                            className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue hover:text-white font-semibold text-slate-700 transition-colors inline-flex items-center gap-1.5"
                          >
                            <MessageSquare size={13} /> View Thread
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="cursor-pointer p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-100 transition-colors disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="cursor-pointer p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-40 hover:bg-slate-100 transition-colors disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Modal: Open New Ticket */}
        {isCreateOpen && <NewTicket setIsCreateOpen={setIsCreateOpen} />}

        {/* Modal: View & Reply Ticket Thread */}
        {activeTicket && (
          <TicketDetails
            activeTicket={activeTicket}
            setActiveTicket={setActiveTicket}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
