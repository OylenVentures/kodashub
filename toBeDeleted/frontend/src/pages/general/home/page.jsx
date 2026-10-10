import Features from "./components/Features";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";

export default function HomePage() {
  return (
    <article>
      <Hero />
      <Features />
      <Services />
      <Testimonials />
    </article>
  );
}
