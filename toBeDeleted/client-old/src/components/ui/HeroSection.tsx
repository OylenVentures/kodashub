import React from "react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse duration-1000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-teal rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse duration-[3000ms]"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-gray via-brand-teal to-brand-blue mb-6 tracking-tight">
          Your Digital Solutions Hub
        </h1>
        <p className="text-xl md:text-2xl text-brand-gray/80 max-w-3xl mb-10 leading-relaxed">
          Code. Host. Scale. Everything you need to innovate, deploy, and succeed in one integrated platform.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
          <button className="px-8 py-4 rounded-xl font-bold text-lg bg-brand-blue text-white hover:bg-opacity-90 transition-all hover:scale-105 shadow-[0_0_20px_rgba(41,121,242,0.4)]">
            Explore Services
          </button>
          <button className="px-8 py-4 rounded-xl font-bold text-lg border-2 border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-brand-navy transition-all hover:scale-105 shadow-[0_0_15px_rgba(19,200,184,0.1)]">
            Contact Sales
          </button>
        </div>
      </div>
      
      {/* Visual Tech Pattern Overlay */}
      <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdib3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjMiIGN5PSIzIiByPSIzIiBmaWxsPSIjMjU0NjdmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>
    </section>
  );
}
