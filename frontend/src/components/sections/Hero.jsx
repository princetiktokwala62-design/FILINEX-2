import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Play } from "lucide-react";
import { motion } from "framer-motion";
import ParticleField from "@/components/visuals/ParticleField";
import AuroraBackground from "@/components/visuals/AuroraBackground";
import MagneticButton from "@/components/visuals/MagneticButton";
import AnimatedCounter from "@/components/visuals/AnimatedCounter";

const STATS = [
  { value: 187, suffix: "+", label: "Projects Delivered" },
  { value: 34, suffix: "", label: "Countries Served" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 42, suffix: "+", label: "Technologies Mastered" },
];

export default function Hero() {
  return (
    <section
      data-testid="hero-section"
      className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden"
    >
      {/* Background video */}
      <video
        data-testid="hero-video"
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1567095751004-aa51a2690368?w=1600&q=80"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      >
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-connections-loop-27357-large.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/85 to-obsidian" />

      <AuroraBackground intensity={1.1} />
      <ParticleField density={60} />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5">
            <span className="relative inline-block h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-emeraldx animate-ping" />
              <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-emeraldx" />
            </span>
            <span className="mono-label" style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.65)" }}>
              Now accepting Q1 engagements
            </span>
          </div>

          <h1
            data-testid="hero-headline"
            className="mt-6 font-display font-medium tracking-tighter text-[2.6rem] sm:text-[4.2rem] lg:text-[5.6rem] leading-[0.95]"
          >
            <span className="text-platinum">Building </span>
            <span className="font-serif-italic text-electric">intelligent</span>
            <span className="text-platinum"> digital </span>
            <br className="hidden sm:block" />
            <span className="text-platinum">products for </span>
            <span className="text-aurora">global businesses</span>
          </h1>

          <p
            data-testid="hero-subheadline"
            className="mt-7 max-w-2xl text-base sm:text-lg text-white/65 leading-relaxed"
          >
            We design AI systems, SaaS platforms, enterprise applications and digital experiences
            that accelerate business growth — engineered with the rigor of Stripe and the taste of Apple.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <MagneticButton
              data-testid="hero-cta-start"
              onClick={() => (window.location.href = "/contact")}
              className="btn-magnet inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3.5 text-sm font-medium hover:bg-platinum transition-colors glow-shadow"
            >
              Start a Project <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <Link
              to="/portfolio"
              data-testid="hero-cta-work"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-medium hover:border-white/25 hover:bg-white/[0.06] transition-all"
            >
              <Play className="h-3.5 w-3.5" /> View Our Work
            </Link>
            <Link
              to="/contact"
              data-testid="hero-cta-discovery"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              <Calendar className="h-4 w-4" /> Book Discovery Call
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden glass">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
              className="bg-obsidian/60 px-6 py-8"
              data-testid={`hero-stat-${i}`}
            >
              <div className="font-display text-3xl sm:text-5xl font-medium tracking-tight text-platinum">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-2 mono-label" style={{ fontSize: "0.65rem" }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* scroll indicator */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center">
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 flex items-center gap-2">
          <span className="h-px w-8 bg-white/30" /> Scroll to explore
        </div>
      </div>
    </section>
  );
}
