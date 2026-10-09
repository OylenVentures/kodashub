"use client";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuthStore } from "@/store/auth.store";
import { Mail } from "lucide-react";
import { FormBtn, LinkBtn } from "@/components/ui/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function ResendVerificationPage() {
  const { resendVerification } = useAuthStore();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const response = await resendVerification(data.email);
    if (response.error) {
      toast.error(response.error);
      return;
    }
    toast.success(response.message);
    reset();
  };

  return (
    <AuthLayout
      title="Resend Verification"
      subtitle="Get a fresh activation link sent to your inbox"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Email Address *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Mail size={16} />
            </span>
            <input
              id="email"
              type="email"
              {...register("email")}
              placeholder="you@domain.com"
              className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue transition-all"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <FormBtn
          label="Send Verification Link"
          disabled={isSubmitting}
          styling="cursor-pointer w-full py-3 px-4 rounded-xl text-white font-semibold text-sm bg-blue hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <p className="text-center text-xs text-slate-600 pt-2">
          Already verified?{" "}
          <LinkBtn
            path="/auth/login"
            label="Sign in"
            styling="font-semibold text-blue hover:underline"
          />
        </p>
      </form>
    </AuthLayout>
  );
}
