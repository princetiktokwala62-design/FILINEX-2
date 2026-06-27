import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, ArrowRight, Check, ChevronLeft } from "lucide-react";
import { waLink, buildLeadMessage } from "@/lib/whatsapp";
import api from "@/lib/api";

const PROJECT_OPTIONS = [
  "Landing / Marketing Site",
  "Custom Web Application",
  "SaaS Platform",
  "Mobile App (iOS/Android)",
  "AI / LLM Product",
  "Blockchain / Web3",
  "E-commerce Store",
  "Enterprise / Internal Tool",
  "Not sure yet — need consultation",
];

const GOAL_OPTIONS = [
  "Launch a new product / MVP",
  "Redesign an existing product",
  "Add features to a live product",
  "Replace an existing vendor",
  "Audit / advise on architecture",
];

const TIMELINE_OPTIONS = [
  "ASAP — 2-4 weeks",
  "Fast — 1-2 months",
  "Standard — 2-3 months",
  "Flexible — 3+ months",
  "Just exploring, no rush",
];

const BUDGET_OPTIONS = [
  "Under $1,000",
  "$1,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000+",
  "Need help defining budget",
];

const STEPS = [
  { key: "welcome", title: "Hey 👋 Welcome to FILINEX", subtitle: "We'll ask a few quick questions, then connect you with our team on WhatsApp.", type: "welcome" },
  { key: "name", title: "What's your name?", type: "input", placeholder: "Your full name", field: "name" },
  { key: "project_type", title: "What are you looking to build?", type: "mcq", options: PROJECT_OPTIONS, field: "project_type" },
  { key: "goal", title: "What's your primary goal?", type: "mcq", options: GOAL_OPTIONS, field: "goal" },
  { key: "timeline", title: "How soon do you need it?", type: "mcq", options: TIMELINE_OPTIONS, field: "timeline" },
  { key: "budget", title: "What budget range are you working with?", subtitle: "Honest answers help us right-size the proposal.", type: "mcq", options: BUDGET_OPTIONS, field: "budget" },
  { key: "details", title: "Anything specific we should know?", subtitle: "Optional — describe your idea in a sentence or two.", type: "textarea", field: "details" },
  { key: "ready", title: "All set ✨", subtitle: "We've prepared a summary. Tap below to open WhatsApp and send it to our team — we usually reply within minutes.", type: "send" },
];

export default function WhatsAppWizard({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [sending, setSending] = useState(false);

  const current = STEPS[step];
  const reset = () => { setStep(0); setData({}); };
  const close = () => { onClose?.(); setTimeout(reset, 400); };

  const pick = (val) => {
    setData((d) => ({ ...d, [current.field]: val }));
    setTimeout(() => setStep((s) => Math.min(STEPS.length - 1, s + 1)), 150);
  };

  const submit = async () => {
    setSending(true);
    try {
      // Save lead to DB + trigger optional server-side WhatsApp notification
      await api.post("/leads", {
        name: data.name || "WhatsApp inquiry",
        email: data.email || `wa-${Date.now()}@filinex.lead`,
        project_type: data.project_type,
        budget: data.budget,
        message: `Goal: ${data.goal || "—"}\nTimeline: ${data.timeline || "—"}\nDetails: ${data.details || "(none)"}`,
        source: "whatsapp_chat",
      });
    } catch { /* still proceed to wa.me even if DB call fails */ }
    setSending(false);

    const wa = waLink(buildLeadMessage({
      name: data.name,
      project_type: data.project_type,
      budget: data.budget,
      timeline: data.timeline,
      source: "WhatsApp Live Chat",
      message: `Goal: ${data.goal || "—"}\n${data.details ? `\n${data.details}` : ""}`,
    }) + "\n\n_Sent from filinex.com_");

    window.open(wa, "_blank", "noopener,noreferrer");
    if (window.posthog) window.posthog.capture("whatsapp_chat_sent", { project_type: data.project_type, budget: data.budget });
    close();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={close}
        data-testid="whatsapp-wizard-overlay"
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg glass-strong rounded-3xl overflow-hidden relative"
          data-testid="whatsapp-wizard"
        >
          <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-emeraldx/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-electric/15 blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="relative flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emeraldx/15">
                <span className="absolute inset-0 rounded-xl bg-emeraldx/30 animate-ping" />
                <MessageCircle className="relative h-4 w-4 text-emeraldx" />
              </span>
              <div>
                <p className="font-display text-sm font-medium leading-tight">FILINEX Live Chat</p>
                <p className="text-[10px] text-emeraldx mono-label" style={{ fontSize: "0.6rem", letterSpacing: "0.18em" }}>
                  ● Team online · ~2m avg reply
                </p>
              </div>
            </div>
            <button data-testid="wizard-close" onClick={close} className="text-white/45 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Progress */}
          <div className="relative h-0.5 bg-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-emeraldx via-electric to-violetx"
              animate={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Body */}
          <div className="relative px-5 sm:px-7 py-7 min-h-[340px] flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.key}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1"
              >
                <h3 className="font-display text-xl sm:text-2xl font-medium tracking-tight">{current.title}</h3>
                {current.subtitle && <p className="mt-2 text-sm text-white/55">{current.subtitle}</p>}

                <div className="mt-6">
                  {current.type === "welcome" && (
                    <div className="space-y-3">
                      <div className="glass rounded-2xl p-4 text-sm text-white/80 leading-relaxed">
                        Hi! 👋 I'm here to understand your project quickly so our senior team can give you a thoughtful reply on WhatsApp.
                        <br /><br />
                        Takes <span className="text-white font-medium">under 60 seconds</span>. Shall we start?
                      </div>
                      <button
                        data-testid="wizard-start"
                        onClick={() => setStep(1)}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emeraldx text-black px-5 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        Let's start <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {current.type === "input" && (
                    <div className="space-y-3">
                      <input
                        data-testid={`wizard-input-${current.field}`}
                        autoFocus
                        value={data[current.field] || ""}
                        onChange={(e) => setData((d) => ({ ...d, [current.field]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && data[current.field] && setStep((s) => s + 1)}
                        placeholder={current.placeholder}
                        className="w-full glass rounded-xl px-4 py-3.5 text-sm bg-transparent outline-none focus:border-white/30 placeholder:text-white/30"
                      />
                      <button
                        data-testid="wizard-continue"
                        disabled={!data[current.field]}
                        onClick={() => setStep((s) => s + 1)}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-5 py-3 text-sm font-medium disabled:opacity-40 hover:bg-platinum transition-colors"
                      >
                        Continue <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {current.type === "mcq" && (
                    <div className="space-y-2 max-h-[280px] overflow-y-auto no-scrollbar">
                      {current.options.map((opt) => {
                        const active = data[current.field] === opt;
                        return (
                          <button
                            key={opt}
                            data-testid={`wizard-mcq-${current.field}-${opt.slice(0, 12).replace(/\W/g, "")}`}
                            onClick={() => pick(opt)}
                            className={`group w-full text-left flex items-center justify-between gap-3 rounded-xl px-4 py-3 border text-sm transition-all ${
                              active
                                ? "border-emeraldx/50 bg-emeraldx/10 text-white"
                                : "border-white/10 hover:border-white/25 hover:bg-white/[0.04] text-white/80"
                            }`}
                          >
                            <span>{opt}</span>
                            <ArrowRight className={`h-3.5 w-3.5 transition-all ${active ? "opacity-100 text-emeraldx" : "opacity-0 group-hover:opacity-60 -translate-x-1 group-hover:translate-x-0"}`} />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {current.type === "textarea" && (
                    <div className="space-y-3">
                      <textarea
                        data-testid={`wizard-textarea-${current.field}`}
                        autoFocus
                        value={data[current.field] || ""}
                        onChange={(e) => setData((d) => ({ ...d, [current.field]: e.target.value }))}
                        rows={4}
                        placeholder="A reference site, key feature, or constraint…"
                        className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent outline-none focus:border-white/30 placeholder:text-white/30 resize-none"
                      />
                      <button
                        data-testid="wizard-continue"
                        onClick={() => setStep((s) => s + 1)}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-5 py-3 text-sm font-medium hover:bg-platinum transition-colors"
                      >
                        Continue <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {current.type === "send" && (
                    <div className="space-y-4">
                      <div className="glass rounded-2xl p-4 text-sm leading-relaxed">
                        <p className="mono-label">Your summary</p>
                        <ul className="mt-3 space-y-1.5 text-white/80 text-[13px]">
                          {data.name && <li><span className="text-white/40">Name:</span> {data.name}</li>}
                          {data.project_type && <li><span className="text-white/40">Project:</span> {data.project_type}</li>}
                          {data.goal && <li><span className="text-white/40">Goal:</span> {data.goal}</li>}
                          {data.timeline && <li><span className="text-white/40">Timeline:</span> {data.timeline}</li>}
                          {data.budget && <li><span className="text-white/40">Budget:</span> {data.budget}</li>}
                          {data.details && <li><span className="text-white/40">Notes:</span> {data.details}</li>}
                        </ul>
                      </div>
                      <button
                        data-testid="wizard-send-whatsapp"
                        onClick={submit}
                        disabled={sending}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emeraldx text-black px-5 py-3.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        <MessageCircle className="h-4 w-4" />
                        {sending ? "Opening…" : "Send to FILINEX on WhatsApp"}
                      </button>
                      <p className="text-[11px] text-white/40 text-center">
                        Opens WhatsApp with your summary pre-filled. Just tap send.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {step > 0 && step < STEPS.length - 1 && (
              <button
                data-testid="wizard-back"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="mt-4 inline-flex items-center gap-1 text-xs text-white/45 hover:text-white"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Back
              </button>
            )}
          </div>

          {/* Steps dots */}
          <div className="relative px-5 sm:px-7 pb-5 flex items-center justify-center gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === step ? "w-6 bg-emeraldx" : i < step ? "w-2 bg-emeraldx/40" : "w-2 bg-white/10"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
