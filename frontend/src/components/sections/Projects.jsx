import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/data/projects";

function ProjectCard({ project, idx }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useTransform(my, [-0.5, 0.5], ["6deg", "-6deg"]);
  const ry = useTransform(mx, [-0.5, 0.5], ["-6deg", "6deg"]);
  const sx = useSpring(rx, { stiffness: 180, damping: 18 });
  const sy = useSpring(ry, { stiffness: 180, damping: 18 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    mx.set(x);
    my.set(y);
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  };

  const isWide = idx === 0 || idx === 3;

  return (
    <motion.article
      ref={ref}
      data-testid={`project-card-${project.id}`}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={{ rotateX: sx, rotateY: sy, transformPerspective: 1200 }}
      className={`group spotlight glass rounded-2xl overflow-hidden relative ${
        isWide ? "lg:col-span-2" : "lg:col-span-1"
      }`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${project.accent}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />

        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
          <span className="mono-label" style={{ fontSize: "0.65rem" }}>
            {project.category}
          </span>
          <h3 className="mt-2 font-display text-2xl sm:text-3xl font-medium tracking-tight">
            {project.title}
          </h3>
          <p className="mt-2 max-w-xl text-sm text-white/65 leading-relaxed">
            {project.summary}
          </p>

          <motion.div
            initial={false}
            animate={{ height: hovered ? "auto" : 0, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-5 grid grid-cols-3 gap-3">
              {project.metrics.map((m) => (
                <div key={m.label} className="glass rounded-xl px-3 py-2.5">
                  <div className="font-display text-lg font-medium">{m.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-full bg-white/[0.06] text-[11px] text-white/65 border border-white/10">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="mt-5 inline-flex items-center gap-2 text-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
            Read case study <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section
      id="portfolio"
      data-testid="projects-section"
      className="relative py-32 mx-auto max-w-7xl px-5 sm:px-8"
    >
      <div className="flex items-end justify-between gap-8 flex-wrap">
        <div className="max-w-2xl">
          <span className="mono-label">Selected work · 05</span>
          <h2 className="mt-3 font-display font-medium tracking-tighter text-4xl sm:text-5xl text-platinum">
            Built to be{" "}
            <span className="font-serif-italic text-electric">remembered.</span>
          </h2>
        </div>
        <p className="max-w-md text-white/60">
          Each engagement is a flagship — we ship fewer projects, with deeper craft.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} idx={i} />
        ))}
      </div>
    </section>
  );
}
