"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuthStore } from "@/store/auth.store";
import {
  User,
  Mail,
  ShieldAlert,
  LogOut,
  Loader2,
  PhoneCall,
} from "lucide-react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormBtn } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useUserAction, useUserStore } from "@/store/user.store";
import Loader from "@/components/ui/Loader";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .lowercase()
    .required("Email is required"),
  lastName: yup.string().required("Last name is required"),
  phone: yup.string().required("Phone is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function SettingsPage() {
  const router = useRouter();
  const { logout, logoutAll, isLoading } = useAuthStore();
  const { isLoading: isUserLoading, error } = useUserStore();
  const { getUserProfile, updateUserProfile } = useUserAction;
  const {
    register,
    handleSubmit,
    setValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleUpdateProfile = async (data: FormData) => {
    const response = await updateUserProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    });
    if (response.error) {
      toast.error(response.error);
      return;
    }
    toast.success("Profile updated successfully!");
  };

  const handleLogoutAllDevices = async () => {
    if (
      !confirm(
        "Are you sure you want to log out of all active devices and browser sessions?",
      )
    )
      return;
    try {
      logoutAll();
      logout();
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(
        err.message || "Failed to log out of all devices. Please try again.",
      );
    }
  };

  useEffect(() => {
    (async function () {
      const response = await getUserProfile();
      if (response.error) {
        toast.error(response.error);
        return;
      }
      const user = response?.user as unknown as Partial<FormData> | undefined;
      setValues({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
      });
    })();
  }, [getUserProfile, setValues]);

  return (
    <DashboardLayout title="Account Settings">
      <div className="max-w-3xl space-y-6">
        {/* Profile Update Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/85 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-blue/10 text-blue flex items-center justify-center font-bold">
              <User size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-navy">
                Personal & Professional Profile
              </h3>
              <p className="text-xs text-slate-500">
                Update your account identity.
              </p>
            </div>
          </div>

          {isUserLoading ? (
            <Loader />
          ) : error ? (
            <p className="text-xs text-red-500">{error}</p>
          ) : (
            <form
              onSubmit={handleSubmit(handleUpdateProfile)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <User size={16} />
                    </span>
                    <input
                      id="firstName"
                      type="text"
                      {...register("firstName")}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue"
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <User size={16} />
                    </span>
                    <input
                      id="lastName"
                      type="text"
                      {...register("lastName")}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue"
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <Mail size={16} />
                    </span>
                    <input
                      id="email"
                      type="email"
                      readOnly
                      {...register("email")}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-600 focus:outline-none"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-semibold text-slate-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <PhoneCall size={16} />
                    </span>
                    <input
                      id="phone"
                      type="text"
                      {...register("phone")}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <FormBtn
                  label="Save Changes"
                  disabled={isSubmitting}
                  styling="cursor-pointer py-2.5 px-6 rounded-xl text-white font-semibold text-xs bg-blue hover:bg-blue/90 shadow-md flex items-center gap-2 transition-all"
                />
              </div>
            </form>
          )}
        </div>

        {/* Global Security & Session Management Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-red-200/60 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-navy">
                Global Session Security
              </h3>
              <p className="text-xs text-slate-500">
                Revoke active tokens and terminate sessions across all browser
                instances.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-red-50/50 border border-red-100">
            <div>
              <h4 className="text-xs font-bold text-red-900 mb-0.5">
                Log Out of All Devices
              </h4>
              <p className="text-[11px] text-red-700 leading-relaxed max-w-md">
                This will logout all connected machines and browsers including
                your current session.
              </p>
            </div>
            <button
              onClick={handleLogoutAllDevices}
              className="cursor-pointer py-2.5 px-4 rounded-xl text-white font-semibold text-xs bg-red-600 hover:bg-red-700 shadow-md flex items-center gap-2 transition-all shrink-0"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={15} />
              ) : (
                <LogOut size={15} />
              )}{" "}
              Terminate All Sessions
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
