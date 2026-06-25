import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "@/data/projects";

export default function Testimonials() {
  // duplicate for infinite marquee
  const items = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section
      data-testid="testimonials-section"
      className="relative py-32 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <span className="mono-label">Voices</span>
          <h2 className="mt-3 font-display font-medium tracking-tighter text-4xl sm:text-5xl text-platinum">
            Trusted by founders &{" "}
            <span className="font-serif-italic text-electric">Fortune 500 teams.</span>
          </h2>
        </div>
      </div>

      <div className="mt-14 relative marquee-mask">
        <div className="flex gap-5 animate-scroll" style={{ width: "max-content" }}>
          {items.map((t, i) => (
            <motion.figure
              key={`${t.name}-${i}`}
              className="glass rounded-2xl p-7 w-[360px] sm:w-[440px] shrink-0 spotlight"
              data-testid={`testimonial-${i}`}
            >
              <Quote className="h-5 w-5 text-electric/60" />
              <blockquote className="mt-4 text-white/85 leading-relaxed">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-11 w-11 rounded-full object-cover grayscale hover:grayscale-0 transition-all"
                  loading="lazy"
                />
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-white/45">{t.role}</div>
                </div>
                <div className="ml-auto flex items-center gap-0.5">
                  {[...Array(5)].map((_, k) => (
                    <Star key={k} className="h-3 w-3 fill-electric text-electric" />
                  ))}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
