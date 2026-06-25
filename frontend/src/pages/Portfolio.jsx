import { useState } from "react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { PROJECTS } from "@/data/projects";
import AuroraBackground from "@/components/visuals/AuroraBackground";
import { ArrowUpRight } from "lucide-react";

const CATS = ["All", "AI · Healthcare", "FinTech · SaaS", "Web3 · Blockchain", "Generative AI · SaaS", "Consumer · Web3"];

export default function Portfolio() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === active);

  return (
    <div data-testid="portfolio-page">
      <SEO
        title="Portfolio — FILINEX"
        description="Selected work from FILINEX: AI clinics, trading platforms, crypto ecosystems and more."
        canonical="/portfolio"
      />
      <section className="relative pt-40 pb-12 overflow-hidden">
        <AuroraBackground />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <span className="mono-label">Selected Work</span>
          <h1 className="mt-3 font-display font-medium tracking-tighter text-5xl sm:text-7xl text-platinum max-w-4xl">
            Flagship products,
            <br />
            <span className="font-serif-italic text-electric">end-to-end engineered.</span>
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 mt-4">
        <div className="flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              data-testid={`portfolio-filter-${c.replace(/\W/g, "")}`}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${
                active === c
                  ? "bg-white text-black border-white"
                  : "border-white/10 text-white/65 hover:border-white/25 hover:bg-white/[0.04]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 pb-20">
          {filtered.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.05 }}
              className="glass rounded-2xl overflow-hidden group spotlight"
              data-testid={`portfolio-card-${p.id}`}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
              </div>
              <div className="p-6 sm:p-8">
                <span className="mono-label" style={{ fontSize: "0.62rem" }}>
                  {p.category}
                </span>
                <h3 className="mt-3 font-display text-2xl font-medium">{p.title}</h3>
                <p className="mt-2 text-sm text-white/65 leading-relaxed">{p.description}</p>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {p.metrics.map((m) => (
                    <div key={m.label} className="glass rounded-xl px-3 py-2.5">
                      <div className="font-display text-base font-medium">{m.value}</div>
                      <div className="text-[10px] uppercase tracking-widest text-white/40">{m.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-full bg-white/[0.05] text-[11px] text-white/60 border border-white/10">
                      {t}
                    </span>
                  ))}
                </div>
                <button className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-electric hover:text-white transition-colors">
                  Read full case study <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
