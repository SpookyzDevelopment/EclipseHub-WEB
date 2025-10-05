import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import StatusPulse from '../components/StatusPulse';
import Services from '../components/Services';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import CTA from '../components/CTA';
import Testimonials from '../components/Testimonials';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <StatusPulse />
      <Services />
      <Features />
      <Pricing />
      <Testimonials />
      <CTA />
    </>
  );
}
