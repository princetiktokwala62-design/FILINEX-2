import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, MapPin, Mail, Phone } from "lucide-react";
import SEO from "@/components/SEO";
import api from "@/lib/api";
import AuroraBackground from "@/components/visuals/AuroraBackground";

const BUDGETS = ["< $2.5k", "$2.5k – $7.5k", "$7.5k – $25k", "$25k – $75k", "$75k+"];
const PROJECT_TYPES = ["AI Solution", "SaaS Platform", "Web Application", "Blockchain / Web3", "Automation", "Enterprise System", "Not sure yet"];

export default function Contact() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", country: "", budget: "", project_type: "", message: "",
  });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Name and email are required.");
      return;
    }
    setSending(true);
    try {
      await api.post("/leads", { ...form, source: "contact" });
      toast.success("Received. We'll be in touch shortly.");
      setDone(true);
      if (window.posthog) window.posthog.capture("contact_form_submitted");
      // Open WhatsApp with the full summary so admin gets a direct message too
      const wa = waLink(buildLeadMessage({ ...form, source: "Contact Form" }) + "\n\n_Sent from filinex.com_");
      setTimeout(() => window.open(wa, "_blank", "noopener,noreferrer"), 600);
    } catch {
      toast.error("Could not send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div data-testid="contact-page">
      <SEO title="Contact — FILINEX" description="Start a project with FILINEX. We respond within 24 hours." canonical="/contact" />
      <section className="relative pt-40 pb-12 overflow-hidden">
        <AuroraBackground />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <span className="mono-label">Begin</span>
          <h1 className="mt-3 font-display font-medium tracking-tighter text-5xl sm:text-7xl text-platinum max-w-4xl">
            Tell us about
            <br />
            <span className="font-serif-italic text-electric">your idea.</span>
          </h1>
          <p className="mt-6 max-w-xl text-white/65 text-lg">
            A short brief is enough. We respond within 24 hours with a clear next step. Need a faster quote?{" "}
            <a href="/estimator" className="text-electric underline-offset-4 hover:underline">Use the proposal builder</a>.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 sm:px-8 pb-24">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-5">
            <div className="glass rounded-2xl p-6">
              <Mail className="h-4 w-4 text-electric" />
              <p className="mt-3 mono-label">Email</p>
              <a href="mailto:hello@filinex.com" className="mt-1 block text-white">hello@filinex.com</a>
            </div>
            <div className="glass rounded-2xl p-6">
              <Phone className="h-4 w-4 text-electric" />
              <p className="mt-3 mono-label">WhatsApp</p>
              <a href="https://wa.me/14155551234" target="_blank" rel="noreferrer" className="mt-1 block text-white">+1 (415) 555-1234</a>
            </div>
            <div className="glass rounded-2xl p-6">
              <MapPin className="h-4 w-4 text-electric" />
              <p className="mt-3 mono-label">Studios</p>
              <p className="mt-1 text-white">New York · London · Dubai</p>
            </div>

            <div className="glass-strong rounded-2xl p-6">
              <p className="mono-label">Response time</p>
              <p className="mt-2 font-display text-2xl font-medium">~ 2h 14m</p>
              <p className="mt-1 text-xs text-white/50">Average for inbound during business hours.</p>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            data-testid="contact-form"
            className="lg:col-span-8 glass-strong rounded-3xl p-7 sm:p-10 relative overflow-hidden"
          >
            <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-electric/15 blur-3xl pointer-events-none" />
            <div className="grid sm:grid-cols-2 gap-4 relative">
              <Field label="Name *" value={form.name} onChange={(v) => set("name", v)} testid="contact-name" />
              <Field label="Email *" type="email" value={form.email} onChange={(v) => set("email", v)} testid="contact-email" />
              <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} testid="contact-phone" />
              <Field label="Company" value={form.company} onChange={(v) => set("company", v)} testid="contact-company" />
              <Field label="Country" value={form.country} onChange={(v) => set("country", v)} testid="contact-country" />
              <Select label="Budget" value={form.budget} onChange={(v) => set("budget", v)} options={BUDGETS} testid="contact-budget" />
              <Select label="Project type" value={form.project_type} onChange={(v) => set("project_type", v)} options={PROJECT_TYPES} testid="contact-project-type" />
              <div className="sm:col-span-2">
                <label className="mono-label">Tell us about your project</label>
                <textarea
                  data-testid="contact-message"
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  rows={5}
                  className="mt-2 w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 placeholder:text-white/30 bg-transparent"
                  placeholder="What are you building, who is it for, and what's the timeline?"
                />
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 relative">
              <p className="text-xs text-white/40">By submitting, you agree to our privacy policy. NDA available on request.</p>
              <button
                data-testid="contact-submit"
                type="submit"
                disabled={sending || done}
                className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-platinum transition-colors disabled:opacity-60 glow-shadow btn-magnet"
              >
                {done ? "Sent ✓" : sending ? "Sending…" : "Send brief"}
                {!done && !sending && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", testid }) {
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

function Select({ label, value, onChange, options, testid }) {
  return (
    <div>
      <label className="mono-label">{label}</label>
      <select
        data-testid={testid}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 bg-transparent appearance-none"
      >
        <option value="" className="bg-obsidian">Select…</option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-obsidian">{o}</option>
        ))}
      </select>
    </div>
  );
}
