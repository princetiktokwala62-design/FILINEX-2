import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { COMPARISON } from "@/data/services";

export default function WhyFilinex() {
  return (
    <section
      data-testid="why-filinex-section"
      className="relative py-32 mx-auto max-w-7xl px-5 sm:px-8"
    >
      <div className="text-center max-w-3xl mx-auto">
        <span className="mono-label">Why FILINEX</span>
        <h2 className="mt-3 font-display font-medium tracking-tighter text-4xl sm:text-5xl text-platinum">
          A different kind of <span className="font-serif-italic text-electric">studio.</span>
        </h2>
        <p className="mt-5 text-white/60">
          Traditional agencies are built for hours. FILINEX is built for outcomes.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-2xl p-8 relative overflow-hidden"
          data-testid="comparison-traditional"
        >
          <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-white/[0.02] blur-3xl" />
          <span className="mono-label" style={{ color: "rgba(255,255,255,0.35)" }}>
            Traditional Agency
          </span>
          <h3 className="mt-3 font-display text-2xl sm:text-3xl font-medium text-white/50">
            The old way
          </h3>
          <ul className="mt-7 space-y-4">
            {COMPARISON.traditional.map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm text-white/45">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/15">
                  <X className="h-3 w-3 text-white/45" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass-strong rounded-2xl p-8 relative overflow-hidden border border-electric/30"
          data-testid="comparison-filinex"
        >
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-electric/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-violetx/20 blur-3xl" />
          <span className="mono-label" style={{ color: "rgba(126,164,255,0.85)" }}>
            FILINEX
          </span>
          <h3 className="mt-3 font-display text-2xl sm:text-3xl font-medium text-aurora">
            The new standard
          </h3>
          <ul className="mt-7 space-y-4">
            {COMPARISON.filinex.map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm text-white/85">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-electric to-royal">
                  <Check className="h-3 w-3 text-white" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
