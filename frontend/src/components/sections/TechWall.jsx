import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { TECHNOLOGIES } from "@/data/projects";

export default function TechWall() {
  return (
    <section
      data-testid="tech-wall-section"
      className="relative py-32 mx-auto max-w-7xl px-5 sm:px-8"
    >
      <div className="text-center max-w-2xl mx-auto">
        <span className="mono-label">The Stack</span>
        <h2 className="mt-3 font-display font-medium tracking-tighter text-4xl sm:text-5xl text-platinum">
          Tools chosen, not <span className="font-serif-italic text-electric">defaulted.</span>
        </h2>
        <p className="mt-5 text-white/60">
          We pick technologies for fit, not fashion. Below is a sample of what we ship in production today.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {TECHNOLOGIES.map((t, i) => {
          const Icon = Icons[t.icon] || Icons.Code;
          return (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              data-testid={`tech-${t.name.toLowerCase().replace(/\W/g, "-")}`}
              className="tech-tile rounded-2xl px-5 py-6 flex flex-col items-center justify-center text-center cursor-default"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl glass">
                <Icon className="h-5 w-5 text-white/85" />
              </span>
              <p className="mt-3 text-sm font-medium">{t.name}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
