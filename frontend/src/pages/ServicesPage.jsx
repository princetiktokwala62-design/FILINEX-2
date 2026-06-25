import SEO from "@/components/SEO";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import FinalCTA from "@/components/sections/FinalCTA";
import AuroraBackground from "@/components/visuals/AuroraBackground";

export default function ServicesPage() {
  return (
    <div data-testid="services-page">
      <SEO
        title="Services — FILINEX"
        description="AI, SaaS, Web, Blockchain, Automation and Enterprise — six disciplines, one studio."
        canonical="/services"
      />
      <section className="relative pt-40 pb-20 overflow-hidden">
        <AuroraBackground />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <span className="mono-label">Capabilities</span>
          <h1 className="mt-3 font-display font-medium tracking-tighter text-5xl sm:text-7xl text-platinum max-w-4xl">
            Six disciplines. <span className="font-serif-italic text-electric">One signature.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-white/65">
            From a single AI agent to a complete enterprise rebuild — FILINEX is structured
            to operate as the senior engineering and design partner you would build in-house, if you had ten years.
          </p>
        </div>
      </section>
      <Services />
      <Process />
      <FinalCTA />
    </div>
  );
}
