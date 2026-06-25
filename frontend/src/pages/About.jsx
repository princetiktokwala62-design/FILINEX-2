import SEO from "@/components/SEO";
import AuroraBackground from "@/components/visuals/AuroraBackground";
import FinalCTA from "@/components/sections/FinalCTA";
import { motion } from "framer-motion";
import { Globe, Sparkles, Target, Users } from "lucide-react";

const VALUES = [
  { icon: Sparkles, title: "Craft over volume", desc: "We accept fewer engagements to ship deeper work." },
  { icon: Target, title: "Outcome over hours", desc: "Pricing aligned to your business outcome, not our timesheets." },
  { icon: Users, title: "Senior pod", desc: "No juniors hidden behind a manager. You work with the makers." },
  { icon: Globe, title: "Global by design", desc: "Distributed senior engineers across NY, LDN, DXB and Lisbon." },
];

export default function About() {
  return (
    <div data-testid="about-page">
      <SEO title="About — FILINEX" description="A premium technology studio building intelligent digital products for global businesses." canonical="/about" />
      <section className="relative pt-40 pb-16 overflow-hidden">
        <AuroraBackground />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <span className="mono-label">The Studio</span>
          <h1 className="mt-3 font-display font-medium tracking-tighter text-5xl sm:text-7xl text-platinum max-w-4xl">
            A studio for the
            <br />
            <span className="font-serif-italic text-electric">post-software</span> era.
          </h1>
          <p className="mt-7 max-w-2xl text-white/70 leading-relaxed text-lg">
            FILINEX was founded on a contrarian thesis: the great products of the next decade
            will be built by small, senior teams operating with the rigor of Stripe and the taste of Apple.
            We are that team.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="glass rounded-2xl p-6"
            >
              <v.icon className="h-5 w-5 text-electric" />
              <h3 className="mt-4 font-display text-lg font-medium">{v.title}</h3>
              <p className="mt-2 text-sm text-white/60 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-20">
        <div className="glass-strong rounded-3xl p-8 sm:p-14">
          <span className="mono-label">Manifesto</span>
          <p className="mt-4 font-display text-2xl sm:text-4xl font-medium tracking-tight leading-tight">
            We believe the most important product decisions are the ones the team is willing to{" "}
            <span className="font-serif-italic text-electric">disagree</span> about.{" "}
            We believe rigor is the foundation of speed. We believe taste is a discipline,{" "}
            not an opinion. And we believe that the best work is the work you{" "}
            <span className="font-serif-italic text-electric">cannot un-see.</span>
          </p>
        </div>
      </section>

      <FinalCTA />
    </div>
  );
}
