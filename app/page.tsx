import Image from "next/image";
import Hero from "./components/Hero";
import Section1 from "./components/homepage1"
import Section2 from "./components/homeproducts"

export default function Home() {
  return (
    <main className="pb-50 md:pb-32 lg:pb-40">
      <Hero />
      <Section1 />
      <Section2 />
    </main>
  );
}


