import GlobalStyles from "../components/layout/GlobalStyles";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/hero/Hero";
import Marquee from "../components/sections/Marquee";
import Collections from "../components/sections/Collections";
import StitchDivider from "../components/sections/StitchDivider";
import Products from "../components/sections/Products";
import Story from "../components/sections/Story";
import Testimonials from "../components/sections/Testimonials";
import Newsletter from "../components/sections/Newsletter";
import Footer from "../components/layout/Footer";
import FloatingChat from "../components/common/FloatingChat";

export default function LandingPage() {
  return (
    <div className="kashida-root w-full">
      <GlobalStyles />
      <Navbar />
      <Hero />
      <Marquee />
      <Collections />
      <StitchDivider />
      <Products />
      <Story />
      <Testimonials />
      <Newsletter />
      <Footer />
      <FloatingChat />
    </div>
  );
}