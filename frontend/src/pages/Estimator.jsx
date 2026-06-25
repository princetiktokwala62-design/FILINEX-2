import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Check } from "lucide-react";
import SEO from "@/components/SEO";
import api from "@/lib/api";
import AuroraBackground from "@/components/visuals/AuroraBackground";

const PROJECT_TYPES = [
  { id: "saas", label: "SaaS Platform", base: 60000 },
  { id: "ai", label: "AI Product", base: 80000 },
  { id: "web", label: "Custom Web App", base: 45000 },
  { id: "web3", label: "Blockchain / Web3", base: 90000 },
  { id: "automation", label: "Business Automation", base: 35000 },
  { id: "enterprise", label: "Enterprise System", base: 150000 },
];

const FEATURES = [
  { id: "auth", label: "Authentication & RBAC", cost: 8000 },
  { id: "billing", label: "Subscriptions & billing", cost: 12000 },
  { id: "admin", label: "Admin dashboard", cost: 10000 },
  { id: "ai", label: "AI/LLM features", cost: 25000 },
  { id: "realtime", label: "Real-time collab", cost: 18000 },
  { id: "mobile", label: "Mobile (iOS/Android)", cost: 40000 },
  { id: "i18n", label: "Multi-language", cost: 6000 },
  { id: "analytics", label: "Analytics & data viz", cost: 12000 },
];

const COMPLEXITIES = [
  { id: "mvp", label: "MVP / Validation", mult: 0.7 },
  { id: "standard", label: "Standard production", mult: 1 },
  { id: "complex", label: "Complex / mission-critical", mult: 1.5 },
];

const TIMELINES = [
  { id: "fast", label: "ASAP (6 weeks)", mult: 1.25 },
  { id: "normal", label: "Standard (10–14 weeks)", mult: 1 },
  { id: "relaxed", label: "Flexible (4+ months)", mult: 0.9 },
];

export default function Estimator() {
  const [type, setType] = useState(PROJECT_TYPES[0].id);
  const [features, setFeatures] = useState([]);
  const [complexity, setComplexity] = useState("standard");
  const [timeline, setTimeline] = useState("normal");
  const [contact, setContact] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  const estimate = useMemo(() => {
    const t = PROJECT_TYPES.find((p) => p.id === type);
    const f = features.reduce((sum, id) => sum + (FEATURES.find((x) => x.id === id)?.cost || 0), 0);
    const c = COMPLEXITIES.find((x) => x.id === complexity).mult;
    const tl = TIMELINES.find((x) => x.id === timeline).mult;
    const base = (t.base + f) * c * tl;
    return {
      low: Math.round((base * 0.85) / 1000) * 1000,
      high: Math.round((base * 1.25) / 1000) * 1000,
      weeks: timeline === "fast" ? "6" : timeline === "relaxed" ? "16+" : "10–14",
    };
  }, [type, features, complexity, timeline]);

  const toggleFeature = (id) => setFeatures((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const submit = async (e) => {
    e.preventDefault();
    if (!contact.email) {
      toast.error("Email is required to send your estimate.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/leads", {
        name: contact.name || "Estimator submission",
        email: contact.email,
        project_type: PROJECT_TYPES.find((p) => p.id === type)?.label,
        budget: `$${estimate.low.toLocaleString()} – $${estimate.high.toLocaleString()}`,
        message: `Estimator submission. Complexity: ${complexity}, Timeline: ${timeline}. Features: ${features.join(", ")}`,
        source: "estimator",
        estimator_data: { type, features, complexity, timeline, estimate },
      });
      toast.success("Estimate sent. A founder will reach out shortly.");
      setContact({ name: "", email: "" });
    } catch {
      toast.error("Could not send. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="estimator-page">
      <SEO title="Project Estimator — FILINEX" description="Instantly estimate your project cost and timeline." canonical="/estimator" />
      <section className="relative pt-40 pb-12 overflow-hidden">
        <AuroraBackground />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <span className="mono-label">Estimator</span>
          <h1 className="mt-3 font-display font-medium tracking-tighter text-5xl sm:text-7xl text-platinum max-w-4xl">
            Instant project
            <br />
            <span className="font-serif-italic text-electric">price range.</span>
          </h1>
          <p className="mt-6 max-w-xl text-white/65 text-lg">
            Calibrated against our last 100 engagements. Final scoping always happens with humans.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-24 grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Group title="01 · Project type">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROJECT_TYPES.map((p) => (
                <Chip key={p.id} active={type === p.id} onClick={() => setType(p.id)} testid={`estimator-type-${p.id}`}>
                  {p.label}
                </Chip>
              ))}
            </div>
          </Group>

          <Group title="02 · Features required">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FEATURES.map((f) => (
                <Chip key={f.id} active={features.includes(f.id)} onClick={() => toggleFeature(f.id)} testid={`estimator-feat-${f.id}`}>
                  <Check className={`h-3 w-3 mr-1 transition-opacity ${features.includes(f.id) ? "opacity-100" : "opacity-0"}`} />
                  {f.label}
                </Chip>
              ))}
            </div>
          </Group>

          <Group title="03 · Complexity">
            <div className="grid sm:grid-cols-3 gap-2">
              {COMPLEXITIES.map((c) => (
                <Chip key={c.id} active={complexity === c.id} onClick={() => setComplexity(c.id)} testid={`estimator-complex-${c.id}`}>
                  {c.label}
                </Chip>
              ))}
            </div>
          </Group>

          <Group title="04 · Timeline">
            <div className="grid sm:grid-cols-3 gap-2">
              {TIMELINES.map((t) => (
                <Chip key={t.id} active={timeline === t.id} onClick={() => setTimeline(t.id)} testid={`estimator-time-${t.id}`}>
                  {t.label}
                </Chip>
              ))}
            </div>
          </Group>
        </div>

        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28 glass-strong rounded-3xl p-7 overflow-hidden relative">
            <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-electric/20 blur-3xl pointer-events-none" />
            <span className="mono-label">Estimated investment</span>
            <p className="mt-3 font-display text-3xl sm:text-4xl font-medium tracking-tight text-aurora">
              ${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-white/55">Estimated timeline · <span className="text-white">{estimate.weeks} weeks</span></p>

            <form onSubmit={submit} className="mt-7 space-y-3">
              <input
                data-testid="estimator-name"
                value={contact.name}
                onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                placeholder="Your name"
                className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent placeholder:text-white/30 outline-none focus:border-white/30"
              />
              <input
                data-testid="estimator-email"
                type="email"
                required
                value={contact.email}
                onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                placeholder="you@company.com"
                className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent placeholder:text-white/30 outline-none focus:border-white/30"
              />
              <button
                data-testid="estimator-submit"
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-5 py-3 text-sm font-medium hover:bg-platinum transition-colors disabled:opacity-60 glow-shadow"
              >
                {submitting ? "Sending…" : "Send my estimate"}
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-xs text-white/40 text-center">No spam. Senior partner replies in 24h.</p>
            </form>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Group({ title, children }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="mono-label">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children, testid }) {
  return (
    <button
      data-testid={testid}
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm border transition-all ${
        active
          ? "border-white/40 bg-white/10 text-white"
          : "border-white/10 text-white/65 hover:border-white/25 hover:bg-white/[0.04]"
      }`}
    >
      {children}
    </button>
  );
}
