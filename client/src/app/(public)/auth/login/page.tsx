"use client";

import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuthStore } from "@/store/auth.store";
import { Mail } from "lucide-react";
import { FormBtn, LinkBtn } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function SendPasscodePage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const response = await login(data.email);
    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success(response.message);
    reset();
    router.push(
      `/auth/verify-passcode?email=${encodeURIComponent(data.email)}`,
    );
  };

  return (
    <AuthLayout
      title="Sign In to KodasHub"
      subtitle="Enter your email to receive a secure login passcode"
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
          label="Send Passcode"
          disabled={isSubmitting}
          styling="cursor-pointer w-full py-3 px-4 rounded-xl text-white font-semibold text-sm bg-blue hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span>Don't have an account?</span>
          <LinkBtn
            path="/auth/register"
            label="Register now"
            styling="font-semibold text-blue hover:underline"
          />
        </div>
      </form>
    </AuthLayout>
  );
}
