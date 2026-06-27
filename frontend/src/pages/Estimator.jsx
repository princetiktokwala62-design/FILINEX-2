import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Sparkles, Zap, Clock, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "@/components/SEO";
import api from "@/lib/api";
import AuroraBackground from "@/components/visuals/AuroraBackground";

// Aggressive launch pricing — built to convert international clients on low intro rates.
export const PROJECT_TYPES = [
  { id: "landing", label: "Marketing / Landing Site", base: 499, icon: "Globe" },
  { id: "web", label: "Custom Web App", base: 1999, icon: "AppWindow" },
  { id: "saas", label: "SaaS Platform", base: 3499, icon: "Layers" },
  { id: "ai", label: "AI Product / Agent", base: 2999, icon: "Brain" },
  { id: "blockchain", label: "Blockchain / Web3", base: 4999, icon: "Boxes" },
  { id: "automation", label: "Business Automation", base: 999, icon: "Workflow" },
  { id: "enterprise", label: "Enterprise System", base: 7499, icon: "Building2" },
  { id: "mobile", label: "Mobile App", base: 2499, icon: "Smartphone" },
];

export const FEATURES = [
  { id: "auth", label: "User auth & accounts", cost: 299 },
  { id: "billing", label: "Subscriptions & billing (Stripe)", cost: 499 },
  { id: "admin", label: "Admin dashboard", cost: 399 },
  { id: "ai", label: "AI / LLM features", cost: 799 },
  { id: "realtime", label: "Real-time chat / collab", cost: 599 },
  { id: "mobile", label: "iOS + Android apps", cost: 1499 },
  { id: "i18n", label: "Multi-language", cost: 199 },
  { id: "analytics", label: "Analytics dashboard", cost: 299 },
  { id: "payments", label: "Crypto / multi-gateway payments", cost: 599 },
  { id: "kyc", label: "KYC / identity verification", cost: 499 },
  { id: "referral", label: "Referral / affiliate program", cost: 399 },
  { id: "marketplace", label: "Marketplace / multi-vendor", cost: 999 },
];

export const COMPLEXITIES = [
  { id: "mvp", label: "MVP / Validation", desc: "Get to market in weeks", mult: 0.7 },
  { id: "standard", label: "Standard production", desc: "Full polish, full scope", mult: 1 },
  { id: "complex", label: "Mission-critical", desc: "Compliance, audit, scale", mult: 1.5 },
];

export const TIMELINES = [
  { id: "rush", label: "Rush · 2-3 weeks", mult: 1.4 },
  { id: "fast", label: "Fast · 4-6 weeks", mult: 1.15 },
  { id: "normal", label: "Standard · 8-10 weeks", mult: 1 },
  { id: "relaxed", label: "Flexible · 12+ weeks", mult: 0.85 },
];

export function useEstimate(type, features, complexity, timeline, customBudget) {
  return useMemo(() => {
    const t = PROJECT_TYPES.find((p) => p.id === type) || PROJECT_TYPES[1];
    const f = features.reduce((sum, id) => sum + (FEATURES.find((x) => x.id === id)?.cost || 0), 0);
    const c = (COMPLEXITIES.find((x) => x.id === complexity) || COMPLEXITIES[1]).mult;
    const tl = (TIMELINES.find((x) => x.id === timeline) || TIMELINES[2]).mult;
    const base = (t.base + f) * c * tl;
    const low = Math.max(199, Math.round((base * 0.9) / 50) * 50);
    const high = Math.round((base * 1.25) / 50) * 50;
    return {
      low,
      high,
      weeks: timeline === "rush" ? "2-3" : timeline === "fast" ? "4-6" : timeline === "relaxed" ? "12+" : "8-10",
      budgetFit: customBudget ? (customBudget >= low ? (customBudget >= high ? "great" : "fair") : "tight") : null,
    };
  }, [type, features, complexity, timeline, customBudget]);
}

const STEPS = ["Project", "Features", "Scope", "Budget", "Details"];

export default function Estimator() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState("web");
  const [features, setFeatures] = useState(["auth", "admin"]);
  const [complexity, setComplexity] = useState("standard");
  const [timeline, setTimeline] = useState("normal");
  const [customBudget, setCustomBudget] = useState(2000);
  const [requirements, setRequirements] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", company: "", country: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const estimate = useEstimate(type, features, complexity, timeline, customBudget);
  const toggleFeature = (id) => setFeatures((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const canNext = () => {
    if (step === 0) return !!type;
    if (step === 3) return customBudget >= 199;
    if (step === 4) return contact.email && contact.name;
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      await api.post("/leads", {
        name: contact.name,
        email: contact.email,
        company: contact.company,
        country: contact.country,
        project_type: PROJECT_TYPES.find((p) => p.id === type)?.label,
        budget: `$${customBudget.toLocaleString()} (target) · est $${estimate.low.toLocaleString()}–$${estimate.high.toLocaleString()}`,
        message: `Requirements:\n${requirements || "(none)"}\n\nFeatures: ${features.join(", ")}\nComplexity: ${complexity}\nTimeline: ${timeline}`,
        source: "proposal",
        estimator_data: { type, features, complexity, timeline, customBudget, estimate },
      });
      toast.success("Proposal request sent. A senior partner replies in <24h.");
      setDone(true);
      if (window.posthog) window.posthog.capture("proposal_submitted", { type, budget: customBudget });
    } catch {
      toast.error("Could not send. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div data-testid="estimator-page">
      <SEO title="Request a Proposal — FILINEX" description="Get an instant, transparent price range for your project. Launch pricing from $199." canonical="/estimator" />

      <section className="relative pt-40 pb-12 overflow-hidden">
        <AuroraBackground />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5">
            <Sparkles className="h-3 w-3 text-electric" />
            <span className="mono-label" style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.7)" }}>
              Launch pricing · From $199
            </span>
          </div>
          <h1 className="mt-4 font-display font-medium tracking-tighter text-5xl sm:text-7xl text-platinum max-w-4xl">
            Request a proposal
            <br />
            <span className="font-serif-italic text-electric">in 90 seconds.</span>
          </h1>
          <p className="mt-6 max-w-xl text-white/65 text-lg">
            Pick your project type, choose features, set your budget — we'll send a tailored proposal within 24 hours.
            No deck. No fluff. Just a clear path forward.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-24 grid lg:grid-cols-12 gap-6">
        {/* Wizard */}
        <div className="lg:col-span-8 space-y-6">
          {/* Progress */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-medium transition-all ${
                      i < step
                        ? "bg-emeraldx/20 text-emeraldx border border-emeraldx/30"
                        : i === step
                        ? "bg-white text-black"
                        : "bg-white/5 text-white/40 border border-white/10"
                    }`}
                  >
                    {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span className={`text-xs font-medium ${i === step ? "text-white" : "text-white/50"}`}>{s}</span>
                  {i < STEPS.length - 1 && <span className="h-px w-6 sm:w-10 bg-white/10" />}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-strong rounded-3xl p-6 sm:p-9 relative overflow-hidden min-h-[460px]">
            <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-electric/10 blur-3xl pointer-events-none" />
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {step === 0 && <StepType type={type} setType={setType} />}
                {step === 1 && <StepFeatures features={features} toggleFeature={toggleFeature} />}
                {step === 2 && <StepScope complexity={complexity} setComplexity={setComplexity} timeline={timeline} setTimeline={setTimeline} />}
                {step === 3 && <StepBudget budget={customBudget} setBudget={setCustomBudget} estimate={estimate} />}
                {step === 4 && <StepDetails contact={contact} setContact={setContact} requirements={requirements} setRequirements={setRequirements} done={done} />}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              data-testid="estimator-back"
              onClick={back}
              disabled={step === 0}
              className="inline-flex items-center gap-1 rounded-full glass px-4 py-2.5 text-sm text-white/75 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                data-testid="estimator-next"
                onClick={next}
                disabled={!canNext()}
                className="inline-flex items-center gap-1 rounded-full bg-white text-black px-5 py-2.5 text-sm font-medium hover:bg-platinum disabled:opacity-40 glow-shadow"
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                data-testid="estimator-submit"
                onClick={submit}
                disabled={submitting || done || !canNext()}
                className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-platinum disabled:opacity-60 glow-shadow"
              >
                {done ? "Sent ✓" : submitting ? "Sending…" : "Send Proposal Request"}
                {!done && !submitting && <ArrowRight className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Sticky estimate card */}
        <aside className="lg:col-span-4 order-first lg:order-last">
          <div className="lg:sticky lg:top-28 glass-strong rounded-3xl p-7 overflow-hidden relative">
            <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-electric/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-violetx/20 blur-3xl pointer-events-none" />

            <span className="mono-label">Live estimate</span>
            <p className="mt-3 font-display text-3xl sm:text-4xl font-medium tracking-tight text-aurora">
              ${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}
            </p>
            <div className="mt-3 flex items-center gap-4 text-xs text-white/55">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> {estimate.weeks} weeks
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-electric" /> Launch pricing
              </span>
            </div>

            {customBudget && step >= 3 && (
              <div className={`mt-5 p-3 rounded-xl text-xs ${
                estimate.budgetFit === "great"
                  ? "bg-emeraldx/10 border border-emeraldx/30 text-emeraldx"
                  : estimate.budgetFit === "fair"
                  ? "bg-amber-500/10 border border-amber-500/30 text-amber-300"
                  : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
              }`}>
                <span className="font-mono uppercase tracking-wider text-[10px]">Your budget: ${customBudget.toLocaleString()}</span>
                <p className="mt-1">
                  {estimate.budgetFit === "great"
                    ? "Excellent fit — we can deliver beautifully within budget."
                    : estimate.budgetFit === "fair"
                    ? "Workable — we'll right-size the scope to fit."
                    : "A bit tight — let's discuss MVP scoping to start lean."}
                </p>
              </div>
            )}

            <div className="mt-6 space-y-2 text-xs text-white/55">
              <Row label="Project type" value={PROJECT_TYPES.find((p) => p.id === type)?.label} />
              <Row label="Features" value={`${features.length} selected`} />
              <Row label="Complexity" value={COMPLEXITIES.find((c) => c.id === complexity)?.label} />
              <Row label="Timeline" value={TIMELINES.find((t) => t.id === timeline)?.label.split("·")[1]?.trim()} />
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 space-y-2 text-xs text-white/55">
              <p className="inline-flex items-center gap-1.5"><Check className="h-3 w-3 text-emeraldx" /> Senior pod, no juniors</p>
              <p className="inline-flex items-center gap-1.5"><Check className="h-3 w-3 text-emeraldx" /> Weekly demos, no surprises</p>
              <p className="inline-flex items-center gap-1.5"><Check className="h-3 w-3 text-emeraldx" /> Source code & full IP transfer</p>
              <p className="inline-flex items-center gap-1.5"><Check className="h-3 w-3 text-emeraldx" /> 30-day post-launch support</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/40">{label}</span>
      <span className="text-white/80 font-medium text-right">{value}</span>
    </div>
  );
}

function StepType({ type, setType }) {
  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight">What are we building?</h2>
      <p className="mt-2 text-sm text-white/55">Pick the closest match. We'll refine later.</p>
      <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {PROJECT_TYPES.map((p) => (
          <button
            key={p.id}
            data-testid={`proposal-type-${p.id}`}
            onClick={() => setType(p.id)}
            className={`text-left rounded-2xl p-4 border transition-all ${
              type === p.id
                ? "border-white/40 bg-white/[0.06]"
                : "border-white/10 hover:border-white/25 hover:bg-white/[0.03]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{p.label}</span>
              <span className="text-xs text-electric font-mono">From ${p.base.toLocaleString()}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepFeatures({ features, toggleFeature }) {
  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight">Which features do you need?</h2>
      <p className="mt-2 text-sm text-white/55">Pick everything that matters. Skip what doesn't.</p>
      <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {FEATURES.map((f) => {
          const active = features.includes(f.id);
          return (
            <button
              key={f.id}
              data-testid={`proposal-feat-${f.id}`}
              onClick={() => toggleFeature(f.id)}
              className={`flex items-center justify-between rounded-2xl p-3.5 border transition-all ${
                active ? "border-electric/50 bg-electric/5" : "border-white/10 hover:border-white/25"
              }`}
            >
              <span className="flex items-center gap-3 text-sm">
                <span className={`inline-flex h-5 w-5 items-center justify-center rounded-md border ${
                  active ? "bg-electric border-electric" : "border-white/20"
                }`}>
                  {active && <Check className="h-3 w-3 text-white" />}
                </span>
                {f.label}
              </span>
              <span className="text-xs text-white/40 font-mono">+${f.cost}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepScope({ complexity, setComplexity, timeline, setTimeline }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight">Complexity</h2>
        <p className="mt-2 text-sm text-white/55">How polished does it need to be?</p>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {COMPLEXITIES.map((c) => (
            <button
              key={c.id}
              data-testid={`proposal-complex-${c.id}`}
              onClick={() => setComplexity(c.id)}
              className={`text-left rounded-2xl p-4 border transition-all ${
                complexity === c.id ? "border-white/40 bg-white/[0.06]" : "border-white/10 hover:border-white/25"
              }`}
            >
              <div className="text-sm font-medium">{c.label}</div>
              <div className="mt-1 text-xs text-white/50">{c.desc}</div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight">Timeline</h2>
        <p className="mt-2 text-sm text-white/55">Faster = small surcharge. Flexible = small discount.</p>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {TIMELINES.map((t) => (
            <button
              key={t.id}
              data-testid={`proposal-time-${t.id}`}
              onClick={() => setTimeline(t.id)}
              className={`text-left rounded-2xl p-4 border transition-all ${
                timeline === t.id ? "border-white/40 bg-white/[0.06]" : "border-white/10 hover:border-white/25"
              }`}
            >
              <div className="text-sm font-medium">{t.label}</div>
              <div className="mt-1 text-xs text-white/40 font-mono">
                {t.mult > 1 ? `+${Math.round((t.mult - 1) * 100)}%` : t.mult < 1 ? `−${Math.round((1 - t.mult) * 100)}%` : "base"}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepBudget({ budget, setBudget, estimate }) {
  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight">Your budget</h2>
      <p className="mt-2 text-sm text-white/55">Be honest — we'll right-size scope to fit. Launch pricing starts at $199.</p>

      <div className="mt-8 glass rounded-2xl p-6">
        <div className="flex items-baseline justify-between">
          <span className="mono-label">Target budget</span>
          <span className="font-display text-4xl sm:text-5xl font-medium text-aurora">${budget.toLocaleString()}</span>
        </div>
        <input
          data-testid="proposal-budget-slider"
          type="range"
          min={199}
          max={50000}
          step={100}
          value={budget}
          onChange={(e) => setBudget(parseInt(e.target.value, 10))}
          className="mt-6 w-full accent-electric"
        />
        <div className="mt-2 flex justify-between text-[10px] font-mono text-white/40">
          <span>$199</span><span>$10k</span><span>$25k</span><span>$50k+</span>
        </div>
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[499, 1499, 4999, 14999].map((p) => (
            <button
              key={p}
              data-testid={`proposal-budget-preset-${p}`}
              onClick={() => setBudget(p)}
              className={`text-xs rounded-full px-3 py-2 border transition-all ${
                budget === p ? "bg-white text-black border-white" : "border-white/10 text-white/65 hover:border-white/30"
              }`}
            >
              ${p.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 p-4 rounded-2xl glass text-sm">
        <div className="flex items-center gap-2 mono-label">
          <DollarSign className="h-3 w-3" /> Our estimate for this scope
        </div>
        <p className="mt-2 font-display text-xl font-medium">
          ${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}{" "}
          <span className="text-sm text-white/45 font-sans">over {estimate.weeks} weeks</span>
        </p>
        <p className="mt-2 text-xs text-white/55">
          {budget >= estimate.high
            ? "Your budget exceeds our estimate — we'll deliver extra polish and faster turnaround."
            : budget >= estimate.low
            ? "Comfortably within budget — let's get started."
            : "A bit below estimate — we'll propose an MVP-first plan to get you launched."}
        </p>
      </div>
    </div>
  );
}

function StepDetails({ contact, setContact, requirements, setRequirements, done }) {
  if (done) {
    return (
      <div className="text-center py-10">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emeraldx/20 border border-emeraldx/40">
          <Check className="h-6 w-6 text-emeraldx" />
        </div>
        <h2 className="mt-5 font-display text-3xl font-medium">Proposal request sent.</h2>
        <p className="mt-3 text-white/60 max-w-md mx-auto">
          A senior partner has been paged. You'll receive a detailed proposal in your inbox within 24 hours.
        </p>
      </div>
    );
  }
  const set = (k, v) => setContact((c) => ({ ...c, [k]: v }));
  return (
    <div>
      <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight">Where do we send the proposal?</h2>
      <p className="mt-2 text-sm text-white/55">Two minutes. Then we get to work.</p>
      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        <Input testid="proposal-name" label="Name *" value={contact.name} onChange={(v) => set("name", v)} />
        <Input testid="proposal-email" label="Email *" type="email" value={contact.email} onChange={(v) => set("email", v)} />
        <Input testid="proposal-company" label="Company" value={contact.company} onChange={(v) => set("company", v)} />
        <Input testid="proposal-country" label="Country" value={contact.country} onChange={(v) => set("country", v)} />
      </div>
      <div className="mt-4">
        <label className="mono-label">Your specific requirements</label>
        <textarea
          data-testid="proposal-requirements"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          rows={5}
          placeholder="Tell us anything we should know: design references, must-have integrations, audience, success metrics…"
          className="mt-2 w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 placeholder:text-white/30 bg-transparent resize-none"
        />
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", testid }) {
  return (
    <div>
      <label className="mono-label">{label}</label>
      <input
        data-testid={testid}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 placeholder:text-white/30 bg-transparent"
      />
    </div>
  );
}
