import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Studio from "@/components/Studio";
import Pricing from "@/components/Pricing";
import InstagramFeed from "@/components/InstagramFeed";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Studio />
        <Pricing />
        <InstagramFeed />
      </main>
      <Footer />
    </>
  );
}
