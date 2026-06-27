import { Link } from "react-router-dom";
import { ArrowRight, Calendar, FileText } from "lucide-react";
import AuroraBackground from "@/components/visuals/AuroraBackground";
import ParticleField from "@/components/visuals/ParticleField";
import MagneticButton from "@/components/visuals/MagneticButton";

export default function FinalCTA() {
  return (
    <section
      data-testid="final-cta"
      className="relative py-32 overflow-hidden"
    >
      <AuroraBackground intensity={1.3} />
      <ParticleField density={40} />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
          <span className="mono-label" style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.7)" }}>
            Limited Q1 capacity · 4 slots remaining
          </span>
        </div>

        <h2 className="mt-6 font-display font-medium tracking-tighter text-4xl sm:text-6xl lg:text-7xl leading-[0.95]">
          <span className="text-platinum">Let's build something </span>
          <span className="font-serif-italic text-aurora">extraordinary</span>
          <span className="text-platinum"> together.</span>
        </h2>

        <p className="mt-7 max-w-xl mx-auto text-white/65 leading-relaxed">
          A 30-minute discovery call. No deck. We listen, sketch, and tell you honestly whether we can help.
        </p>

        <div className="mt-10 flex flex-wrap justify-center items-center gap-3">
          <Link to="/estimator">
            <MagneticButton
              data-testid="cta-book-discovery"
              className="btn-magnet inline-flex items-center gap-2 rounded-full bg-white text-black px-7 py-3.5 text-sm font-medium hover:bg-platinum transition-colors glow-shadow"
            >
              <FileText className="h-4 w-4" /> Request Proposal
            </MagneticButton>
          </Link>
          <Link
            to="/contact"
            data-testid="cta-free-consultation"
            className="inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 text-sm font-medium hover:border-white/25 transition-all"
          >
            Get Free Consultation <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="https://wa.me/923004269096?text=Hi%20FILINEX%20%E2%80%94%20I%27d%20like%20to%20chat%20about%20a%20project."
            target="_blank"
            rel="noreferrer"
            data-testid="cta-whatsapp"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            <Calendar className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </div>

        <div className="mt-14 flex items-center justify-center gap-6 text-xs text-white/40 font-mono">
          <span>Avg. response · 2h 14m</span>
          <span className="h-3 w-px bg-white/20" />
          <span>NDA on request</span>
          <span className="h-3 w-px bg-white/20" />
          <span>NY · LDN · DXB</span>
        </div>
      </div>
    </section>
  );
}
