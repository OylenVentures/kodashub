"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuthStore } from "@/store/auth.store";
import { User, Mail, Building, CheckCircle2 } from "lucide-react";
import { FormBtn, LinkBtn } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .max(100, "First name must be less than 100 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .max(100, "Last name must be less than 100 characters"),
  email: yup
    .string()
    .email("Invalid email address format")
    .required("Email address is required"),
  phone: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

export default function RegisterPage() {
  const { signup } = useAuthStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: FormData) => {
    const response = await signup(data);
    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success(response.message);
    setEmail(data.email);
    reset();
    setSuccess(true);
  };

  if (success) {
    return (
      <AuthLayout title="Verify Your Email" subtitle="Registration successful!">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={30} />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            We have sent a verification link to{" "}
            <span className="font-bold text-navy">{email}</span>. Please click
            the link in your inbox to activate your account.
          </p>
          <div className="pt-4 flex flex-col gap-2">
            <Link
              href="/auth/resend-verification"
              className="text-xs font-semibold text-blue hover:underline"
            >
              Didn't receive the email? Resend verification
            </Link>
            <LinkBtn
              path="/auth/login"
              label="Proceed to Login"
              styling="w-full py-2.5 px-4 text-xs font-semibold text-navy bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
            />
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Join KodasHub for hosting, domains & instant support"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            First Name *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <User size={16} />
            </span>
            <input
              id="firstName"
              type="text"
              {...register("firstName")}
              placeholder="John"
              className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue transition-all"
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
            Last Name *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <User size={16} />
            </span>
            <input
              id="lastName"
              type="text"
              {...register("lastName")}
              placeholder="Doe"
              className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue transition-all"
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

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

        <div>
          <label
            htmlFor="phone"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Phone
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Building size={16} />
            </span>
            <input
              id="phone"
              type="text"
              {...register("phone")}
              placeholder="08012345678"
              className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue transition-all"
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <FormBtn
          label="Continue & Verify"
          styling="w-full py-3 px-4 rounded-xl text-white font-semibold text-sm bg-blue hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        />

        <p className="flex justify-between text-xs">
          <Link
            href="/auth/resend-verification"
            className="font-semibold text-navy hover:underline"
          >
            Resend verification
          </Link>
          <Link
            href="/auth/login"
            className="font-semibold text-blue hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
