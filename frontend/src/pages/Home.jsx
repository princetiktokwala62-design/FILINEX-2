import SEO from "@/components/SEO";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Process from "@/components/sections/Process";
import RequestProposalCTA from "@/components/sections/RequestProposalCTA";
import WhyFilinex from "@/components/sections/WhyFilinex";
import Testimonials from "@/components/sections/Testimonials";
import TechWall from "@/components/sections/TechWall";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <div data-testid="home-page">
      <SEO
        title="FILINEX — Intelligent Digital Products for Global Businesses"
        description="A premium technology studio building AI systems, SaaS platforms, blockchain & enterprise software. Launch pricing from $199. Proposal in 24h."
        canonical="/"
      />
      <Hero />
      <Services />
      <Projects />
      <RequestProposalCTA />
      <Process />
      <WhyFilinex />
      <Testimonials />
      <TechWall />
      <FinalCTA />
    </div>
  );
}
