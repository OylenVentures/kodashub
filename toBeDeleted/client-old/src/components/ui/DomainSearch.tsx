"use client";

import React, { useState } from "react";
import { useAppStore } from "@/store/store";
import { useDomainAction, useDomainStore } from "@/store/domain.store";
import toast from "react-hot-toast";

export default function DomainSearch() {
  const [query, setQuery] = useState("");
  const { domain: domainResult, loading, message, error } = useDomainStore(state => state)
  const { searchDomain } = useDomainAction
  const addToCart = useAppStore(state => state.addToCart);

  const handleSearchDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    const searchString = query.toLowerCase().replace(/\\s+/g, "");
    const finalQuery = searchString.includes(".") ? searchString : `${searchString}.com`;

    try {
      searchDomain({ name: finalQuery })
      toast.success(message)
    } catch (err) {
      toast.error("An error occurred while verifying the domain. Please try again.");
    }
  };

  const handleAdd = () => {
    if (domainResult && domainResult?.price) {
      addToCart({
        id: domainResult?.domain,
        name: domainResult?.domain,
        price: domainResult?.total
      });
      // Optionally reset the search here visually to indicate success
      setQuery("");
      toast.success(`${domainResult?.domain} added to cart!`);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSearchDomain} className="relative flex items-center shadow-2xl rounded-full overflow-hidden bg-[#172347] border border-white/10 group focus-within:border-brand-blue transition-colors">
        <div className="absolute left-6 text-brand-gray/50 group-focus-within:text-brand-blue transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find your perfect domain name..."
          className="w-full bg-transparent text-xl py-6 pl-16 pr-40 text-brand-gray placeholder-brand-gray/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !query}
          className="absolute right-2 px-8 py-4 bg-brand-blue hover:bg-opacity-90 disabled:opacity-50 text-white font-bold rounded-full transition-all"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : "Search"}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center">
          {error}
        </div>
      )}

      {domainResult?.domain && (
        <div className={`mt-8 p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between shadow-xl transition-all ${domainResult ? 'bg-[#121D3B] border-brand-teal/30' : 'bg-[#121D3B] border-red-500/20'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${domainResult?.domain ? 'bg-brand-teal/10 text-brand-teal' : 'bg-red-500/10 text-red-500'}`}>
              {domainResult?.domain ? (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{domainResult?.domain}</p>
              <p className={domainResult ? "text-brand-teal/80" : "text-red-400/80"}>
                {message}
              </p>
            </div>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-6">
            {domainResult && (
              <span className="text-3xl font-extrabold text-white">₦{domainResult?.price}/yr</span>
            )}
            <button
              className={`px-8 py-3 rounded-xl font-bold text-lg transition-all ${domainResult
                ? 'bg-brand-teal text-brand-navy shadow-[0_0_15px_rgba(19,200,184,0.3)] hover:scale-105'
                : 'bg-brand-gray/10 text-brand-gray/50 cursor-not-allowed'
                }`}
              disabled={!domainResult}
              onClick={handleAdd}
            >
              {domainResult ? "Add to Cart" : "Unavailable"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
