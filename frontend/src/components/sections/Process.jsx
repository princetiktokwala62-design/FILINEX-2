import { motion } from "framer-motion";
import { PROCESS_STEPS } from "@/data/services";

export default function Process() {
  return (
    <section
      data-testid="process-section"
      className="relative py-32 mx-auto max-w-7xl px-5 sm:px-8"
    >
      <div className="max-w-3xl">
        <span className="mono-label">The Process</span>
        <h2 className="mt-3 font-display font-medium tracking-tighter text-4xl sm:text-5xl text-platinum">
          A repeatable path from
          <br />
          <span className="font-serif-italic text-electric">idea to scale.</span>
        </h2>
        <p className="mt-5 text-white/60 max-w-lg">
          Six weeks of structured velocity. Senior pod, daily demos, no surprises.
        </p>
      </div>

      <div className="relative mt-16">
        {/* vertical glow line */}
        <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-electric/40 via-royal/30 to-violetx/40" />
        <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px blur-md bg-gradient-to-b from-electric/30 via-royal/20 to-violetx/30" />

        <div className="space-y-12">
          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="relative pl-16 sm:pl-24"
              data-testid={`process-step-${step.num}`}
            >
              {/* node */}
              <div className="absolute left-4 sm:left-8 top-1.5 -translate-x-1/2">
                <span className="relative inline-flex h-3 w-3">
                  <span className="absolute inset-0 rounded-full bg-electric/60 blur-sm animate-pulse" />
                  <span className="relative inline-block h-3 w-3 rounded-full bg-gradient-to-br from-electric to-royal" />
                </span>
              </div>

              <div className="glass rounded-2xl p-6 sm:p-8 max-w-3xl spotlight">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[0.25em] text-white/40">
                    STEP / {step.num}
                  </span>
                  <span className="font-display text-3xl font-medium text-white/15">
                    {step.num}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl font-medium tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-white/65 leading-relaxed text-sm sm:text-base">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
