import { FormBtn } from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { useUserAction, useUserStore } from "@/store/user.store";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  X,
  Trash2,
  ShieldCheck,
  Mail,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  role: yup.string().required("Role selection is required"),
  status: yup.string().required("Status selection is required"),
});

type FormData = yup.InferType<typeof schema>;

interface UserDetailsProps {
  activeUser: any;
  setActiveUser: React.Dispatch<React.SetStateAction<any>>;
}

const formatDate = (dateString: string | Date) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function UserDetails({
  activeUser,
  setActiveUser,
}: UserDetailsProps) {
  const { isLoading } = useUserStore();
  const { updateUserDetails, getUserDetails, deleteUser } = useUserAction;
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const {
    register,
    setValues,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // Handle User Update
  const handleUpdate = async (data: FormData) => {
    if (!activeUser) return;

    const response = await updateUserDetails(activeUser.id, data);
    if (response?.error) {
      toast.error(response.error);
      return;
    }

    toast.success("User updated successfully!");
    reset();
    setActiveUser(null);
  };

  // Handle User Deletion
  const handleDeleteUser = async () => {
    if (!activeUser) return;
    setIsDeleting(true);

    try {
      const response = await deleteUser(activeUser.id);
      if (response?.error) {
        toast.error(response.error);
        setIsDeleting(false);
        return;
      }

      toast.success(response?.message || "User account deleted permanently.");
      setActiveUser(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user account.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Fetch Full User Details on Component Mount / activeUser change
  useEffect(() => {
    let isMounted = true;
    (async function () {
      if (!activeUser?.id) return;
      const response = await getUserDetails(activeUser.id);

      if (!isMounted) return;

      if (response?.error) {
        toast.error(response.error);
      } else if (response?.user) {
        const user = response.user as Partial<FormData> | undefined;

        setValues({
          email: user?.email || "",
          role: user?.role || "",
          status: user?.status || "",
        });
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [activeUser, getUserDetails, setValues]);

  if (!activeUser) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-blue font-bold tracking-wider uppercase">
              User ID: {activeUser.id || activeUser._id}
            </span>
            <h3 className="text-base font-extrabold text-navy">
              {activeUser.firstName} {activeUser.lastName} -{" "}
              {activeUser.phone || "N/A"}
            </h3>
          </div>
          <button
            onClick={() => setActiveUser(null)}
            className="cursor-pointer p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <Loader />
            </div>
          ) : (
            <form
              id="user-role-form"
              onSubmit={handleSubmit(handleUpdate)}
              className="space-y-4"
            >
              {/* User Metadata / Immutable Read-Only Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div className="sm:col-span-2 flex items-center justify-between pt-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> Registered:{" "}
                    {formatDate(activeUser.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> Last Updated:{" "}
                    {formatDate(activeUser.updatedAt)}
                  </span>
                </div>

                <div className="sm:col-span-2 flex items-center justify-between pt-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> Last Login:{" "}
                    {formatDate(activeUser.lastLoginAt)}
                  </span>
                  <span
                    className={`font-mono ${activeUser.isEmailVerified ? "text-emerald-600" : "text-red-600"} bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold`}
                  >
                    {activeUser.isEmailVerified
                      ? "Email Verified"
                      : "Email Not Verified"}
                  </span>
                </div>
              </div>

              {/* Editable Field */}
              <div>
                <label
                  htmlFor="email"
                  className="text-xs font-bold text-navy mb-1.5 flex items-center gap-1.5"
                >
                  <Mail size={14} className="text-blue" /> Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-blue"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="text-xs font-bold text-navy mb-1.5 flex items-center gap-1.5"
                >
                  <ShieldCheck size={16} className="text-blue" /> System Access
                  Role *
                </label>
                <select
                  id="role"
                  {...register("role")}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-blue"
                >
                  <option value="">[Select a role]</option>
                  <option value="client">Client</option>
                  <option value="support_agent">Support Agent</option>
                  <option value="developer">Web Developer</option>
                  <option value="devops_engineer">DevOps Engineer</option>
                  <option value="admin">Administrator (Full Control)</option>
                </select>
                {errors.role && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="text-xs font-bold text-navy mb-1.5 flex items-center gap-1.5"
                >
                  <ShieldCheck size={16} className="text-blue" /> System Access
                  Status *
                </label>
                <select
                  id="status"
                  {...register("status")}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-navy focus:outline-none focus:ring-2 focus:ring-blue"
                >
                  <option value="">[Select a status]</option>
                  <option value="active">ACTIVE</option>
                  <option value="suspended">SUSPENDED</option>
                  <option value="deleted">DELETED</option>
                </select>
                {errors.status && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => setActiveUser(null)}
                  className="cursor-pointer px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
                >
                  Cancel
                </button>

                <FormBtn
                  label="Save Changes"
                  disabled={isSubmitting}
                  styling="cursor-pointer px-5 py-2.5 rounded-xl bg-blue text-white text-xs font-semibold shadow-md hover:bg-blue/90 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </form>
          )}

          {/* Danger Zone: Account Deletion Block */}
          <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200/80 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle
                size={18}
                className="text-red-600 shrink-0 mt-0.5"
              />
              <div>
                <h4 className="text-xs font-bold text-red-900">
                  Delete User Account
                </h4>
                <p className="text-[11px] text-red-700 leading-relaxed mt-0.5">
                  Permanently delete this user, associated support tickets, and
                  access permissions. This action cannot be undone.
                </p>
              </div>
            </div>

            {showConfirmDelete ? (
              <div className="flex items-center gap-2 pt-2 border-t border-red-200/60">
                <button
                  type="button"
                  onClick={handleDeleteUser}
                  disabled={isDeleting}
                  className="cursor-pointer flex-1 py-2 px-3 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors text-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Confirm & Delete Account"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  className="cursor-pointer py-2 px-3 text-xs font-semibold text-slate-600 hover:bg-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-white border border-red-200 hover:bg-red-600 hover:text-white rounded-xl transition-colors shadow-sm"
              >
                <Trash2 size={14} /> Delete Account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
