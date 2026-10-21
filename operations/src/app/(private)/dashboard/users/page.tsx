"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  Minus,
} from "lucide-react";
import { UserItem } from "@/utils/interface";
import NewUser from "./components/NewUser";
import UserDetails from "./components/UserDetails";
import Loader from "@/components/ui/Loader";
import { useUserAction, useUserStore } from "@/store/user.store";

export default function UsersPage() {
  const { users, total, isLoading, error } = useUserStore();
  const { listUsers } = useUserAction;
  const [currentPage, setCurrentPage] = useState(1);
  const [emailFilter, setEmailFilter] = useState("");
  const [emailQuery, setEmailQuery] = useState<string>();
  const itemsPerPage = 50;

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<UserItem | null>(null);

  const totalPages = Math.ceil(total / itemsPerPage) || 1;

  useEffect(() => {
    (async function () {
      await listUsers({
        page: currentPage,
        limit: itemsPerPage,
        email: emailQuery,
      });
    })();
  }, [currentPage, emailQuery, listUsers]);

  const handleEmailFilterSubmit = (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setCurrentPage(1);
    setEmailQuery(emailFilter.trim().toLowerCase() || undefined);
  };

  return (
    <DashboardLayout title="Users">
      <div className="space-y-6">
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
          <form
            onSubmit={handleEmailFilterSubmit}
            className="flex flex-col sm:flex-row gap-2"
          >
            <label htmlFor="email-filter" className="sr-only">
              Filter users by email
            </label>
            <input
              id="email-filter"
              type="email"
              value={emailFilter}
              onChange={(event) => setEmailFilter(event.target.value)}
              placeholder="Filter by email"
              className="min-w-0 rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-700 outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/10 sm:w-72"
            />
            <button
              type="submit"
              aria-label="Search users by email"
              className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-blue hover:text-white"
            >
              <Search size={16} />
            </button>
          </form>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="cursor-pointer py-2.5 px-4 rounded-xl text-white font-semibold text-xs bg-blue hover:opacity-80 shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={16} /> Create New User
          </button>
        </div>

        {/* User List Table / Cards */}
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
                    <th className="py-3.5 px-6">Name</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Phone</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-12 text-slate-400"
                      >
                        No users found matching your query.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="font-semibold text-navy py-4 px-6">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="py-4 px-4 text-slate-600 font-medium">
                          {user.email}
                        </td>
                        <td className="py-4 px-4 text-slate-600 font-medium">
                          {user.phone || "N/A"}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              user.status === "deleted"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : user.status === "suspended"
                                  ? "bg-blue-50 text-blue border border-blue/20"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {user.status === "active" ? (
                              <Check size={12} />
                            ) : (
                              <Minus size={12} />
                            )}
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setActiveUser(user)}
                            className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue hover:text-white font-semibold text-slate-700 transition-colors inline-flex items-center gap-1.5"
                          >
                            <Eye size={18} /> View Profile
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

        {/* Modal: Create New User */}
        {isCreateOpen && <NewUser setIsCreateOpen={setIsCreateOpen} />}

        {/* Modal: View & Update User Profile */}
        {activeUser && (
          <UserDetails activeUser={activeUser} setActiveUser={setActiveUser} />
        )}
      </div>
    </DashboardLayout>
  );
}
