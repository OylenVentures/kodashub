"use client";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/Hero";
import { ServicesGrid } from "@/components/ServicesGrid";
// import { HostingExtensions } from "@/components/HostingExtensions";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg font-sans antialiased text-slate-900 selection:bg-cyan selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <ServicesGrid />
        {/* <HostingExtensions /> */}
      </main>
      <Footer />
    </div>
  );
}
