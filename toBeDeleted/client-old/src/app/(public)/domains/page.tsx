"use client";

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DomainSearch from "@/components/ui/DomainSearch";
import { useAppStore } from "@/store/store";

export default function DomainsPage() {
  const { cartItems, removeFromCart, clearCart } = useAppStore();
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "processing" | "success">("idle");

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setCheckoutStatus("processing");
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCheckoutStatus("success");
    clearCart();

    // Reset after showing success briefly
    setTimeout(() => {
      setCheckoutStatus("idle");
    }, 4000);
  };

  return (
    <main className="flex min-h-screen flex-col bg-brand-navy">
      <Navbar />

      <section className="relative px-6 py-20 flex-1 overflow-hidden z-10">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 relative z-10">

          <div className="flex-1">
            <h1 className="text-5xl font-extrabold text-white mb-6">
              Claim Your Domain
            </h1>
            <p className="text-xl text-brand-gray/80 mb-12 max-w-2xl">
              Start building your online presence today. Search for available domains and secure them instantly with KodasHub.
            </p>

            <DomainSearch />
          </div>

          {/* Cart Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#172347] border border-white/10 rounded-2xl p-8 sticky top-32 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-between">
                Your Cart
                <span className="bg-brand-blue text-xs py-1 px-3 rounded-full">{cartItems.length} items</span>
              </h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-10 opacity-60">
                  <svg className="w-16 h-16 text-brand-gray/30 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-brand-gray/80">Your cart is empty.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-[#121D3B] rounded-xl border border-white/5 group">
                      <div>
                        <p className="font-bold text-white">{item.name}</p>
                        <p className="text-sm text-brand-teal">₦{item.price}/yr</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-brand-gray/40 hover:text-red-400 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-brand-gray/80 text-lg">Total Due</span>
                  <span className="text-3xl font-bold text-white">${total.toFixed(2)}</span>
                </div>

                {checkoutStatus === "success" ? (
                  <div className="w-full bg-green-500/20 border border-green-500 text-green-400 py-4 rounded-xl text-center font-bold">
                    Purchase Successful! 🎉
                  </div>
                ) : (
                  <button
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0 || checkoutStatus === "processing"}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${cartItems.length > 0
                      ? 'bg-gradient-to-r from-brand-blue to-brand-teal text-white hover:opacity-90 shadow-lg cursor-pointer'
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                      }`}
                  >
                    {checkoutStatus === "processing" ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : "Confirm Purchase"}
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
