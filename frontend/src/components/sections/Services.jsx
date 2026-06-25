import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { SERVICES } from "@/data/services";
import Spotlight from "@/components/visuals/Spotlight";

export default function Services() {
  return (
    <section
      id="services"
      data-testid="services-section"
      className="relative py-32 mx-auto max-w-7xl px-5 sm:px-8"
    >
      <div className="flex items-end justify-between gap-8 flex-wrap">
        <div className="max-w-2xl">
          <span className="mono-label">What we do · 06</span>
          <h2 className="mt-3 font-display font-medium tracking-tighter text-4xl sm:text-5xl text-platinum">
            Six disciplines.
            <br />
            <span className="font-serif-italic text-electric">One studio.</span>
          </h2>
        </div>
        <p className="max-w-md text-white/60 leading-relaxed">
          We work across the boundary of intelligence and design — building systems
          that previously required entire engineering organizations.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SERVICES.map((s, i) => {
          const Icon = Icons[s.icon] || Icons.Sparkles;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              data-testid={`service-card-${s.id}`}
            >
              <Spotlight
                as="article"
                className="glass relative rounded-2xl p-7 h-full overflow-hidden group hover:-translate-y-1 transition-transform duration-500"
              >
                <div
                  className={`absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                  style={{ background: s.gradient }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl glass">
                      <Icon className="h-5 w-5 text-white/90" />
                    </span>
                    <span className="mono-label" style={{ fontSize: "0.62rem" }}>
                      0{i + 1}
                    </span>
                  </div>

                  <h3 className="mt-7 font-display text-2xl font-medium tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/50">{s.tagline}</p>

                  <div className="mt-5 h-px bg-white/10" />

                  <p className="mt-5 text-sm text-white/65 leading-relaxed">
                    {s.description}
                  </p>

                  <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-2">
                    {s.capabilities.map((c) => (
                      <li
                        key={c}
                        className="text-xs text-white/50 flex items-center gap-1.5"
                      >
                        <span className="h-1 w-1 rounded-full bg-white/30" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </Spotlight>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
