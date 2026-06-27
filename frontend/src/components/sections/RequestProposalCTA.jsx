import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Clock, Shield } from "lucide-react";
import { PROJECT_TYPES } from "@/pages/Estimator";
import AuroraBackground from "@/components/visuals/AuroraBackground";

const PERKS = [
  { icon: Zap, label: "Launch pricing from $199" },
  { icon: Clock, label: "Proposal in 24 hours" },
  { icon: Shield, label: "Source code & IP transfer" },
];

export default function RequestProposalCTA() {
  return (
    <section
      id="request-proposal"
      data-testid="request-proposal-cta"
      className="relative py-32 overflow-hidden"
    >
      <AuroraBackground />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5">
              <Sparkles className="h-3 w-3 text-electric" />
              <span className="mono-label" style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.75)" }}>
                Launch pricing · Limited slots
              </span>
            </div>
            <h2 className="mt-5 font-display font-medium tracking-tighter text-4xl sm:text-5xl lg:text-6xl text-platinum leading-[0.95]">
              Get a real proposal.
              <br />
              <span className="font-serif-italic text-electric">In 90 seconds.</span>
            </h2>
            <p className="mt-6 text-white/65 max-w-md leading-relaxed">
              Pick your project, choose features, set your budget — we'll send a tailored proposal within 24 hours.
              No deck. No fluff. Real pricing from $199.
            </p>

            <ul className="mt-7 space-y-3">
              {PERKS.map((p) => (
                <li key={p.label} className="flex items-center gap-3 text-sm text-white/80">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg glass">
                    <p.icon className="h-3.5 w-3.5 text-electric" />
                  </span>
                  {p.label}
                </li>
              ))}
            </ul>

            <Link
              to="/estimator"
              data-testid="home-proposal-cta"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3.5 text-sm font-medium hover:bg-platinum transition-colors glow-shadow btn-magnet"
            >
              Start Proposal Builder <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right visual: project type cards */}
          <div className="lg:col-span-7">
            <div className="glass-strong rounded-3xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-electric/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-violetx/15 blur-3xl pointer-events-none" />

              <div className="relative flex items-center justify-between mb-5">
                <span className="mono-label">Start from</span>
                <span className="text-xs text-emeraldx font-mono flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emeraldx animate-pulse" /> 4 slots open
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 relative">
                {PROJECT_TYPES.slice(0, 8).map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.04 }}
                  >
                    <Link
                      to="/estimator"
                      data-testid={`home-proposal-type-${p.id}`}
                      className="block glass rounded-xl p-3.5 hover:bg-white/[0.06] hover:border-white/25 transition-all group"
                    >
                      <p className="text-[11px] text-white/55 uppercase tracking-wider">From</p>
                      <p className="mt-0.5 font-display text-lg font-medium text-aurora">
                        ${p.base.toLocaleString()}
                      </p>
                      <p className="mt-2 text-xs text-white/75 leading-snug group-hover:text-white transition-colors">
                        {p.label}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="relative mt-6 pt-5 border-t border-white/10 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex -space-x-2">
                  {["1494790108377-be9c29b29330", "1507003211169-0a1dd7228f2d", "1500648767791-00dcc994a43e", "1531427186611-ecfd6d936c79"].map((u) => (
                    <img key={u} src={`https://images.unsplash.com/photo-${u}?w=80&q=85`} alt="" className="h-7 w-7 rounded-full border-2 border-obsidian object-cover" />
                  ))}
                </div>
                <p className="text-xs text-white/55">
                  <span className="text-white font-medium">187+</span> founders trusted us this year
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
