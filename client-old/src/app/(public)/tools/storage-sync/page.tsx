"use client";

import React, { useState } from "react";
import { useToolStore, useToolAction } from "@/store/tool.store";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function StorageSyncPage() {
  const [fileType, setFileType] = useState("image");
  const [syncType, setSyncType] = useState<"cloudinary" | "cloudflare">("cloudinary");

  // Source credentials
  const [prevStorageName, setPrevStorageName] = useState("");
  const [prevApiKey, setPrevApiKey] = useState("");
  const [prevSecretKey, setPrevSecretKey] = useState("");
  const [prevAccountId, setPrevAccountId] = useState(""); // For Cloudflare R2
  
  // Destination credentials
  const [newStorageName, setNewStorageName] = useState("");
  const [newApiKey, setNewApiKey] = useState("");
  const [newSecretKey, setNewSecretKey] = useState("");
  const [newRegion, setNewRegion] = useState("us-east-1");

  const syncResult = useToolStore((state) => state.storageSync);
  const loading = useToolStore((state) => state.loading);
  const error = useToolStore((state) => state.error);
  const message = useToolStore((state) => state.message);

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    await useToolAction.storageSync({
      fileType,
      prevStorageName,
      prevApiKey,
      prevSecretKey,
      prevAccountId: syncType === "cloudflare" ? prevAccountId : undefined,
      newStorageName,
      newApiKey,
      newSecretKey,
      newRegion,
    });
  };

  return (
    <main className="flex min-h-screen flex-col bg-brand-navy">
      <Navbar />

      <section className="relative px-6 py-20 flex-1 overflow-hidden z-10 w-full">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto flex flex-col gap-8 relative z-10">
          <div>
            <h2 className="text-4xl font-extrabold text-white mb-2">Storage Sync</h2>
            <p className="text-xl text-brand-gray/80">Seamlessly migrate your files from Cloudinary or Cloudflare R2 to standard AWS S3 buckets.</p>
          </div>

          <div className="flex bg-[#172347] border border-white/5 rounded-xl p-1 gap-2 w-max">
            <button 
              onClick={() => setSyncType("cloudinary")}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${syncType === "cloudinary" ? "bg-brand-blue text-white shadow-lg" : "text-brand-gray/60 hover:text-white"}`}
            >
              From Cloudinary
            </button>
            <button 
              onClick={() => setSyncType("cloudflare")}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${syncType === "cloudflare" ? "bg-brand-teal text-white shadow-lg" : "text-brand-gray/60 hover:text-white"}`}
            >
              From Cloudflare R2
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="col-span-2 bg-[#172347] border border-white/5 rounded-3xl p-8 shadow-xl">
              <form onSubmit={handleSync} className="flex flex-col gap-8">
                {/* Source Details */}
                <div>
                   <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                     <span className="w-6 h-6 rounded-full bg-brand-blue/20 text-brand-blue flex items-center justify-center text-xs">1</span>
                     Source Configuration
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-brand-gray/80 font-medium mb-1.5 block">
                           {syncType === "cloudinary" ? "Cloud Name" : "R2 Bucket Name"}
                        </label>
                        <input 
                          type="text" required
                          value={prevStorageName} onChange={(e) => setPrevStorageName(e.target.value)}
                          className="w-full bg-[#121D3B] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                      </div>
                      {syncType === "cloudflare" && (
                        <div>
                          <label className="text-sm text-brand-gray/80 font-medium mb-1.5 block">Cloudflare Account ID</label>
                          <input 
                            type="text" required
                            value={prevAccountId} onChange={(e) => setPrevAccountId(e.target.value)}
                            className="w-full bg-[#121D3B] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                          />
                        </div>
                      )}
                      <div>
                        <label className="text-sm text-brand-gray/80 font-medium mb-1.5 block">Access Key / API Key</label>
                        <input 
                          type="text" required
                          value={prevApiKey} onChange={(e) => setPrevApiKey(e.target.value)}
                          className="w-full bg-[#121D3B] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-brand-gray/80 font-medium mb-1.5 block">Secret Key</label>
                        <input 
                          type="password" required
                          value={prevSecretKey} onChange={(e) => setPrevSecretKey(e.target.value)}
                          className="w-full bg-[#121D3B] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                      </div>
                   </div>
                </div>

                {/* Destination Details */}
                <div className="pt-8 border-t border-white/5">
                   <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                     <span className="w-6 h-6 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center text-xs">2</span>
                     AWS S3 Destination
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-brand-gray/80 font-medium mb-1.5 block">S3 Bucket Name</label>
                        <input 
                          type="text" required
                          value={newStorageName} onChange={(e) => setNewStorageName(e.target.value)}
                          className="w-full bg-[#121D3B] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-teal"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-brand-gray/80 font-medium mb-1.5 block">S3 Region</label>
                        <input 
                          type="text"
                          value={newRegion} onChange={(e) => setNewRegion(e.target.value)}
                          placeholder="us-east-1"
                          className="w-full bg-[#121D3B] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-teal"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-brand-gray/80 font-medium mb-1.5 block">AWS Access Key</label>
                        <input 
                          type="text" required
                          value={newApiKey} onChange={(e) => setNewApiKey(e.target.value)}
                          className="w-full bg-[#121D3B] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-teal"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-brand-gray/80 font-medium mb-1.5 block">AWS Secret Key</label>
                        <input 
                          type="password" required
                          value={newSecretKey} onChange={(e) => setNewSecretKey(e.target.value)}
                          className="w-full bg-[#121D3B] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-teal"
                        />
                      </div>
                   </div>
                </div>

                {/* Sync Settings */}
                <div className="pt-8 border-t border-white/5">
                   <div className="flex items-center justify-between">
                      <div>
                         <label className="text-sm text-brand-gray/80 font-medium mb-1.5 block">File Type to Sync</label>
                         <select 
                           value={fileType} onChange={(e) => setFileType(e.target.value)}
                           className="bg-[#121D3B] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                         >
                           <option value="image">Images</option>
                           <option value="video">Videos</option>
                           <option value="raw">Raw Files</option>
                           <option value="auto">All Files</option>
                         </select>
                      </div>
                      <button 
                        type="submit" disabled={loading}
                        className="px-8 py-4 bg-gradient-to-r from-brand-blue to-brand-teal text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-lg shadow-brand-blue/20"
                      >
                        {loading ? (
                           <>
                             <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                             </svg>
                             Syncing...
                           </>
                        ) : "Start Migration"}
                      </button>
                   </div>
                </div>
              </form>
            </div>

            <div className="bg-[#172347] border border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center justify-center text-center">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-brand-blue/5 to-transparent pointer-events-none"></div>
              
              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider relative z-10">Migration Status</h3>
              
              <div className="relative z-10 w-full">
                 {loading ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-[#121D3B] rounded w-3/4 mx-auto"></div>
                      <div className="h-4 bg-[#121D3B] rounded w-1/2 mx-auto"></div>
                      <div className="h-4 bg-[#121D3B] rounded w-5/6 mx-auto"></div>
                      <p className="text-brand-blue font-bold mt-6 text-sm">Processing files, this may take a while...</p>
                    </div>
                 ) : error ? (
                    <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 font-medium">
                      <p>Migration Failed</p>
                      <p className="text-xs mt-2 opacity-80">{error}</p>
                    </div>
                 ) : message ? (
                    <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 font-medium">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                         </svg>
                      </div>
                      <p>Migration Complete!</p>
                      <p className="text-xs mt-2 opacity-80">{message}</p>
                    </div>
                 ) : (
                    <div className="py-10">
                      <svg className="w-16 h-16 text-brand-gray/20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      <p className="text-brand-gray/60">Fill out the configuration to start syncing securely.</p>
                    </div>
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
