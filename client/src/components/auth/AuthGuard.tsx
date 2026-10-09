"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Only run once on mount — prevents re-triggering when store state changes
    if (hasChecked.current) return;
    hasChecked.current = true;

    const verifyAuth = async () => {
      const { accessToken, refreshToken } = useAuthStore.getState();

      // If we already have a valid access token in memory, skip the refresh
      if (accessToken) {
        setIsChecking(false);
        return;
      }

      // No access token in memory (e.g. page reload) — attempt refresh
      try {
        const result = await refreshToken();

        if (result.error || !result.accessToken) {
          // Refresh failed or httpOnly cookie is expired — redirect to login
          useAuthStore.getState().setAccessToken(null);
          router.replace("/auth/login");
          return;
        }

        // Refresh succeeded, token is now stored in the auth store
        setIsChecking(false);
      } catch {
        // Network error or unexpected failure — redirect to login
        useAuthStore.getState().setAccessToken(null);
        router.replace("/auth/login");
      }
    };

    verifyAuth();
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            className="animate-spin text-blue-600"
            size={32}
            strokeWidth={2.5}
          />
          <p className="text-sm font-semibold text-slate-500 tracking-wide">
            Verifying your session...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
