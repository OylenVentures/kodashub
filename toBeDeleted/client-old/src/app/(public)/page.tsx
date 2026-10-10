import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/ui/HeroSection";
import ServiceCards from "@/components/ui/ServiceCards";
import ContactForm from "@/components/ui/ContactForm";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-brand-navy">
      <Navbar />
      <HeroSection />
      <ServiceCards />
      <ContactForm />
      <Footer />
    </main>
  );
}
