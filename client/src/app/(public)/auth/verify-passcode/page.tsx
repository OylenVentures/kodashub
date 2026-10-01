"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuthStore } from "@/store/auth.store";
import { KeyRound, Mail, RotateCcw } from "lucide-react";
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
  password: yup
    .string()
    .required("Passcode is required")
    .length(6, "Passcode must be 6 digits"),
});

type FormData = yup.InferType<typeof schema>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const { login, sendPasscode, userEmail, setUserEmail, error } =
    useAuthStore();
  const [email, setEmail] = useState(emailParam || userEmail);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: emailParam || userEmail,
    },
  });

  useEffect(() => {
    if (emailParam || userEmail) {
      setEmail(emailParam || userEmail);
      setUserEmail(emailParam || userEmail);
    }
  }, [emailParam, userEmail, setUserEmail]);

  const onSubmit = async (data: FormData) => {
    const response = await login(data.email, data.password);
    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success(response.message);
    reset();
    router.push("/dashboard");
  };

  const handleResendPasscode = async () => {
    if (!email) {
      toast.error("Email is required to resend passcode.");
      return;
    }

    const response = await sendPasscode(email);
    toast.success(response.message);
  };

  return (
    <AuthLayout
      title="Enter Passcode"
      subtitle={`We sent a secure sign-in passcode to ${userEmail || "your email"}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Mail size={16} />
            </span>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
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
            htmlFor="password"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            6-Digit Passcode *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <KeyRound size={16} />
            </span>
            <input
              id="password"
              type="text"
              {...register("password")}
              placeholder="123456"
              className="w-full pl-9 pr-3.5 py-2.5 text-base font-mono tracking-widest rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue transition-all"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <FormBtn
          label="Login to Dashboard"
          disabled={isSubmitting}
          styling="cursor-pointer w-full py-3 px-4 rounded-xl text-white font-semibold text-sm bg-blue hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <div className="pt-3 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleResendPasscode}
            className="cursor-pointer text-slate-600 hover:text-blue inline-flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={12} /> Resend Passcode
          </button>

          <LinkBtn
            path="/auth/login"
            label="Use different email"
            styling="font-semibold text-blue hover:underline"
          />
        </div>
      </form>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
