"use client";

import React, { useState } from "react";
import { useToolStore, useToolAction } from "@/store/tool.store";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import toast from "react-hot-toast";

export default function VoltCalcPage() {
  const [previousReading, setPreviousReading] = useState("");
  const [currentReading, setCurrentReading] = useState("");
  const [tariffBand, setTariffBand] = useState("Band A");

  const voltCalcResult = useToolStore((state) => state.voltCalc);
  const loading = useToolStore((state) => state.loading);
  const error = useToolStore((state) => state.error);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      useToolAction.voltCalc({
        previousReading: Number(previousReading),
        currentReading: Number(currentReading),
        tariffBand
      });
    } catch (error: any) {
      toast.error(error?.message)
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-brand-navy">
      <Navbar />

      <section className="relative px-6 py-20 flex-1 overflow-hidden z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto flex flex-col gap-8 relative z-10">
          <div>
            <h2 className="text-4xl font-extrabold text-white mb-2">Volt Calculator</h2>
            <p className="text-xl text-brand-gray/80">Calculate your estimated electricity consumption and expected billing costs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#172347] border border-white/5 rounded-3xl p-8 shadow-xl">
              <form onSubmit={handleCalculate} className="flex flex-col gap-5">
                <div>
                  <label className="text-sm text-brand-gray/80 font-medium mb-1.5 block">Previous Meter Reading (kWh)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={previousReading}
                    onChange={(e) => setPreviousReading(e.target.value)}
                    className="w-full bg-[#121D3B] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    placeholder="e.g. 1000.5"
                  />
                </div>

                <div>
                  <label className="text-sm text-brand-gray/80 font-medium mb-1.5 block">Current Meter Reading (kWh)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={currentReading}
                    onChange={(e) => setCurrentReading(e.target.value)}
                    className="w-full bg-[#121D3B] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    placeholder="e.g. 1100.5"
                  />
                </div>

                <div>
                  <label className="text-sm text-brand-gray/80 font-medium mb-1.5 block">Tariff Band</label>
                  <select
                    value={tariffBand}
                    onChange={(e) => setTariffBand(e.target.value)}
                    className="w-full bg-[#121D3B] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  >
                    <option value="Band A">Band A (20+ Hours)</option>
                    <option value="Band B">Band B (16-20 Hours)</option>
                    <option value="Band C">Band C (12-16 Hours)</option>
                    <option value="Band D">Band D (8-12 Hours)</option>
                    <option value="Band E">Band E (4-8 Hours)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full py-4 bg-brand-blue text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20"
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
                  ) : "Calculate Usage"}
                </button>
              </form>

              {error && <p className="mt-4 text-red-400 text-sm text-center">{error}</p>}
            </div>

            <div className="bg-[#172347] border border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl"></div>

              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Calculation Details</h3>

              {Object.keys(voltCalcResult || {}).length > 0 ? (
                <div className="flex flex-col gap-6 relative z-10">
                  <div>
                    <p className="text-brand-gray/60 text-sm mb-1">Total Consumption</p>
                    {/** @ts-ignore */}
                    <p className="text-4xl font-extrabold text-white">{voltCalcResult.consumption?.toFixed(2)} <span className="text-base text-brand-teal font-normal">kWh</span></p>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <p className="text-brand-gray/60 text-sm mb-1">Estimated Cost / Usage</p>
                    {/** @ts-ignore */}
                    <p className="text-5xl font-extrabold text-brand-teal">₦ {voltCalcResult.cost?.toLocaleString()}</p>
                    {/** @ts-ignore */}
                    <p className="text-xs text-brand-gray/40 mt-2">Rate: ₦{voltCalcResult.band?.rate} / kWh</p>
                    {/** @ts-ignore */}
                    <p className="text-xs text-brand-gray/40 mt-2">{voltCalcResult.band?.name}: {voltCalcResult.band?.hours}</p>
                    {/** @ts-ignore */}
                    <p className="text-xs text-brand-gray/40 mt-2">Description: {voltCalcResult.band?.description}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 relative z-10">
                  <svg className="w-16 h-16 text-brand-gray/20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-brand-gray/60">Enter your readings to see estimated calculations.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
