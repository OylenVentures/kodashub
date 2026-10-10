"use client";

import React, { useEffect, useState } from "react";
import { getUserDomain } from "@/api/domain";

export default function DomainsDashboard() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDomains = async () => {
       try {
          const res = await getUserDomain();
          if (res && res.success) {
            setDomains(res.result || []);
          }
       } catch (error) {
          console.error(error);
       } finally {
          setLoading(false);
       }
    };
    fetchDomains();
  }, []);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-2">My Domains</h2>
          <p className="text-brand-gray/80">Manage your mapped and purchased domains.</p>
        </div>
        <a href="/domains" className="px-5 py-2.5 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20 transition-all">
          Search New Domain
        </a>
      </div>

      <div className="bg-[#172347] border border-white/5 rounded-3xl p-8 min-h-[400px]">
        {loading ? (
           <div className="flex justify-center py-20">
             <div className="animate-spin h-10 w-10 border-4 border-brand-blue border-t-transparent rounded-full"></div>
           </div>
        ) : domains.length === 0 ? (
           <div className="text-center py-20">
             <div className="w-24 h-24 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
             </div>
             <h3 className="text-xl font-bold text-white mb-2">No Domains Found</h3>
             <p className="text-brand-gray/60 max-w-md mx-auto">
                You haven't added or purchased any domains yet. Head over to the domain search to find your perfect name.
             </p>
           </div>
        ) : (
           <div className="flex flex-col gap-4">
             {domains.map((domain: any, idx) => (
                <div key={idx} className="flex items-center justify-between p-6 bg-[#121D3B] border border-white/5 rounded-2xl hover:border-brand-blue/30 transition-colors">
                   <div>
                     <h4 className="text-xl font-bold text-white mb-1">{domain.name}</h4>
                     <p className="text-sm text-brand-teal">Status: Active</p>
                   </div>
                   <button className="px-4 py-2 border border-brand-gray/30 text-brand-gray/80 rounded-xl hover:text-white hover:border-white transition-colors">
                     Manage DNS
                   </button>
                </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
}
