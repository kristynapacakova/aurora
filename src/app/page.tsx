import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Studio from "@/components/Studio";
import AboutTeaser from "@/components/AboutTeaser";
import Recenze from "@/components/Recenze";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import InstagramFeed from "@/components/InstagramFeed";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Studio />
        <AboutTeaser />
        <Recenze />
        <Pricing />
        <Faq />
        <InstagramFeed />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
