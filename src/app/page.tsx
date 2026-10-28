import { preload } from "react-dom";
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

// Recenze se načítají z databáze, takže se stránka musí občas přegenerovat —
// jinak by zůstala taková, jaká byla při nasazení, a nová recenze by se nikdy
// neukázala.
export const revalidate = 60;

export default function Home() {
  // Poster hera. Bez přednačtení ho prohlížeč objeví až ve chvíli, kdy
  // vykreslí <video> — do té doby je horní polovina stránky prázdná. Takhle
  // se stahuje souběžně s HTML a hero se ukáže dřív, než doteče video.
  //
  // Pozn.: v hlavičce se odkaz objeví dvakrát — jednou vytažený nahoru,
  // jednou v pořadí dokumentu. Není to chybou zápisu, se značkou <link>
  // v JSX to dělá totéž a nezmizí to ani po smazání .next. Prohlížeč
  // stahuje podle adresy, takže soubor jde po síti jen jednou.
  preload("/hero-poster.webp", {
    as: "image",
    type: "image/webp",
    fetchPriority: "high",
  });

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
