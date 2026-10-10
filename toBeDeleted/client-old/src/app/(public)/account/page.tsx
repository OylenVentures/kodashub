"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useUserStore, useUserAction } from "@/store/user.store";

export default function AccountPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const loading = useUserStore((state) => state.loading);
  const error = useUserStore((state) => state.error);
  const message = useUserStore((state) => state.message);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await useUserAction.loginUser({ email, password });
      // If we have a token or message success, redirect
      if (useUserStore.getState().token) {
         router.push("/dashboard");
      }
    } else {
      await useUserAction.registerUser({ email, password, firstName, lastName });
      // Upon successful registration, auto switch to login or redirect
      if (!useUserStore.getState().error) {
         setIsLogin(true);
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-brand-navy">
      <Navbar />

      <section className="relative px-6 py-20 flex-1 flex items-center justify-center overflow-hidden z-10 w-full">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue rounded-full mix-blend-screen filter blur-[200px] opacity-20 pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-md bg-[#172347] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-brand-gray/80">
              {isLogin ? "Sign in to manage your domains and tools." : "Join KodasHub to start building your online presence."}
            </p>
          </div>

          {(error || message) && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${error ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-green-500/10 border-green-500/20 text-green-400"}`}>
              {error || message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {!isLogin && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm text-brand-gray/80 font-medium mb-1.5 block">First Name</label>
                  <input 
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-[#121D3B] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-brand-gray/40 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    placeholder="John"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-brand-gray/80 font-medium mb-1.5 block">Last Name</label>
                  <input 
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-[#121D3B] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-brand-gray/40 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    placeholder="Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm text-brand-gray/80 font-medium mb-1.5 block">Email Address</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121D3B] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-brand-gray/40 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                 <label className="text-sm text-brand-gray/80 font-medium block">Password</label>
                 {isLogin && <a href="#" className="text-xs text-brand-teal hover:underline">Forgot password?</a>}
              </div>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#121D3B] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-brand-gray/40 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="mt-4 w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-brand-blue to-brand-teal text-white hover:opacity-90 shadow-lg shadow-brand-blue/20"
            >
              {loading ? (
                 <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
              ) : (isLogin ? "Sign In" : "Create Account")}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-brand-gray/80 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-brand-teal font-bold hover:underline"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
