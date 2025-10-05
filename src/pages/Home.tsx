import Hero from '../components/Hero';
import Services from '../components/Services';
import Features from '../components/Features';
import FeaturedProducts from '../components/FeaturedProducts';
import Pricing from '../components/Pricing';

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <FeaturedProducts />
      <Features />
      <Pricing />
    </>
  );
}
