"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuthStore } from "@/store/auth.store";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { LinkBtn } from "@/components/ui/Button";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail } = useAuthStore();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    (async function () {
      if (!token) {
        setStatus("error");
        setErrorMessage("No verification token provided in the URL.");
        return;
      }

      const response = await verifyEmail(token);
      if (response.error) {
        setStatus("error");
        setErrorMessage(response.error);
      } else {
        setStatus("success");
      }
    })();
  }, [token, verifyEmail]);

  return (
    <AuthLayout
      title="Email Verification"
      subtitle="Activating your KodasHub account"
    >
      <div className="text-center py-4 space-y-4">
        {status === "loading" && (
          <div className="space-y-3">
            <Loader2 className="animate-spin text-blue mx-auto" size={36} />
            <p className="text-sm text-slate-600">
              Verifying your token securely...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-navy">
              Email Verified Successfully!
            </h3>
            <p className="text-xs text-slate-600">
              Your account is fully activated. You can now request your login
              passcode.
            </p>
            <LinkBtn
              path="/auth/login"
              label="Proceed to Sign In"
              styling="block w-full py-3 px-4 text-xs font-semibold text-white bg-blue rounded-xl text-center shadow-md hover:bg-blue/90 transition-all"
            />
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <XCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-navy">Verification Failed</h3>
            <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
              {errorMessage}
            </p>
            <LinkBtn
              label="Request New Verification Link"
              path="/auth/resend-verification"
              styling="block w-full py-3 px-4 text-xs font-semibold text-navy bg-slate-100 hover:bg-slate-200 rounded-xl text-center transition-colors"
            />
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
