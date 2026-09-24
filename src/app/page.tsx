import { About } from "@/components/gui/About";
import { Contact } from "@/components/gui/Contact";
import { Education } from "@/components/gui/Education";
import { Experience } from "@/components/gui/Experience";
import { Footer } from "@/components/gui/Footer";
import { Hero } from "@/components/gui/Hero";
import { Projects } from "@/components/gui/Projects";
import { SiteHeader } from "@/components/gui/SiteHeader";
import { Skills } from "@/components/gui/Skills";
import { PortfolioShell } from "@/components/terminal/PortfolioShell";

export default function HomePage() {
  return (
    <PortfolioShell>
      <SiteHeader />
      <main id="main-content">
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <About />
        <Education />
        <Contact />
      </main>
      <Footer />
    </PortfolioShell>
  );
}
