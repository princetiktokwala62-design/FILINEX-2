import SEO from "@/components/SEO";
import { PROJECTS } from "@/data/projects";
import { motion } from "framer-motion";
import AuroraBackground from "@/components/visuals/AuroraBackground";
import { ArrowRight } from "lucide-react";

export default function CaseStudies() {
  return (
    <div data-testid="case-studies-page">
      <SEO title="Case Studies — FILINEX" description="In-depth case studies of FILINEX engagements." canonical="/case-studies" />
      <section className="relative pt-40 pb-16 overflow-hidden">
        <AuroraBackground />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <span className="mono-label">Case Studies</span>
          <h1 className="mt-3 font-display font-medium tracking-tighter text-5xl sm:text-7xl text-platinum max-w-4xl">
            How we ship,
            <br />
            <span className="font-serif-italic text-electric">in detail.</span>
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 pb-24 space-y-10">
        {PROJECTS.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass rounded-3xl overflow-hidden grid lg:grid-cols-2"
            data-testid={`case-study-${p.id}`}
          >
            <div className={`relative aspect-[4/3] lg:aspect-auto ${i % 2 === 1 ? "lg:order-2" : ""}`}>
              <img src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-obsidian/80 via-obsidian/30 to-transparent lg:bg-gradient-to-l" />
            </div>
            <div className="p-8 sm:p-12 flex flex-col justify-center">
              <span className="mono-label" style={{ fontSize: "0.62rem" }}>
                {p.category} · {`Case ${String(i + 1).padStart(2, "0")}`}
              </span>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-medium tracking-tight">{p.title}</h2>
              <p className="mt-4 text-white/65 leading-relaxed">{p.description}</p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {p.metrics.map((m) => (
                  <div key={m.label} className="glass rounded-xl px-3 py-2.5">
                    <div className="font-display text-lg font-medium">{m.value}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40">{m.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full bg-white/[0.05] text-[11px] text-white/60 border border-white/10">
                    {t}
                  </span>
                ))}
              </div>
              <button className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-medium text-electric hover:text-white transition-colors">
                Read full breakdown <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
