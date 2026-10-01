"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuthStore } from "@/store/auth.store";
import { Mail, CheckCircle2 } from "lucide-react";
import { FormBtn, LinkBtn } from "@/components/ui/Button";

export default function ResendVerificationPage() {
  const { resendVerification, isLoading, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resendVerification(email);
      setSent(true);
    } catch (err) {}
  };

  return (
    <AuthLayout
      title="Resend Verification"
      subtitle="Get a fresh activation link sent to your inbox"
    >
      {sent ? (
        <div className="text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={30} />
          </div>
          <p className="text-xs text-slate-600">
            If an account exists for{" "}
            <span className="font-bold text-navy">{email}</span>, a new
            verification link has been dispatched.
          </p>
          <LinkBtn
            path="/auth/login"
            label="Go to Sign In"
            styling="block w-full py-2.5 px-4 text-xs font-semibold text-navy bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue transition-all"
              />
            </div>
          </div>

          <FormBtn
            label="Send Verification Link"
            disabled={isLoading}
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
      )}
    </AuthLayout>
  );
}
