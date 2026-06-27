import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { PROJECTS } from "@/data/projects";

function ProjectCard({ project, idx }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useTransform(my, [-0.5, 0.5], ["4deg", "-4deg"]);
  const ry = useTransform(mx, [-0.5, 0.5], ["-4deg", "4deg"]);
  const sx = useSpring(rx, { stiffness: 180, damping: 22 });
  const sy = useSpring(ry, { stiffness: 180, damping: 22 });

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

  const isWide = idx === 0 || idx === 3 || idx === 4;

  return (
    <motion.article
      ref={ref}
      data-testid={`project-card-${project.id}`}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={{ rotateX: sx, rotateY: sy, transformPerspective: 1200 }}
      className={`group spotlight glass rounded-2xl overflow-hidden relative flex flex-col ${
        isWide ? "lg:col-span-2" : "lg:col-span-1"
      }`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Image — clean, no text overlay */}
      <div className="relative aspect-[16/10] overflow-hidden bg-graphite">
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
          loading="lazy"
        />
        {/* Light scrim only at top to make category tag readable */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-obsidian/80 to-transparent pointer-events-none" />
        <div className={`absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl ${project.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

        <span className="absolute top-4 left-4 mono-label glass px-2.5 py-1 rounded-full backdrop-blur-md" style={{ fontSize: "0.6rem" }}>
          {project.category}
        </span>
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noreferrer"
            data-testid={`project-live-${project.id}`}
            className="absolute top-4 right-4 inline-flex items-center gap-1 mono-label glass px-2.5 py-1 rounded-full hover:bg-white/15 transition-colors"
            style={{ fontSize: "0.6rem" }}
          >
            <ExternalLink className="h-2.5 w-2.5" /> Live
          </a>
        )}
      </div>

      {/* Content — separate clean area below image */}
      <div className="relative p-6 sm:p-7 flex flex-col flex-1">
        <h3 className="font-display text-xl sm:text-2xl font-medium tracking-tight">
          {project.title}
        </h3>
        <p className="mt-2.5 text-sm text-white/65 leading-relaxed">
          {project.summary}
        </p>

        <motion.div
          initial={false}
          animate={{ height: hovered ? "auto" : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="mt-5 grid grid-cols-3 gap-2.5">
            {project.metrics.map((m) => (
              <div key={m.label} className="glass rounded-xl px-3 py-2.5">
                <div className="font-display text-base font-medium text-aurora">{m.value}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 mt-0.5">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          {project.tech.slice(0, 5).map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-full bg-white/[0.05] text-[11px] text-white/60 border border-white/10">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-white/45 font-mono uppercase tracking-wider">
            Case · {String(idx + 1).padStart(2, "0")}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-electric group-hover:gap-2.5 transition-all">
            Read case study <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
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
