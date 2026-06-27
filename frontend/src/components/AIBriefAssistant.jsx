import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Bot, User, CheckCircle2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

function sessionId() {
  let id = localStorage.getItem("filinex_brief_session");
  if (!id) {
    id = `brief-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem("filinex_brief_session", id);
  }
  return id;
}

export default function AIBriefAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "" });
  const scrollRef = useRef(null);
  const bootedRef = useRef(false);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  };

  // bootstrap greeting (guard against React StrictMode double-mount)
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    sendToServer([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(scrollToBottom, [messages, loading]);

  const sendToServer = async (history) => {
    setLoading(true);
    try {
      const r = await api.post("/brief/chat", { session_id: sessionId(), messages: history });
      const assistant = { role: "assistant", content: r.data.reply };
      setMessages((m) => [...m, assistant]);
      if (r.data.finished) {
        setFinished(true);
        const meta = extractContact(r.data.reply);
        if (meta) setContact(meta);
      }
    } catch (err) {
      toast.error("Assistant unavailable. Please use the form below.");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading || finished) return;
    const userMsg = { role: "user", content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    await sendToServer(next);
  };

  const saveBrief = async () => {
    if (!contact.email) {
      toast.error("Add your email so we can follow up.");
      return;
    }
    setSubmitting(true);
    try {
      const summary = messages
        .filter((m) => m.role === "assistant")
        .slice(-1)[0]?.content || "AI brief session";
      await api.post("/leads", {
        name: contact.name || "AI Brief Lead",
        email: contact.email,
        source: "ai_brief",
        message: summary,
        brief_transcript: messages,
      });
      toast.success("Brief saved. A senior partner will reach out shortly.");
      if (window.posthog) window.posthog.capture("ai_brief_submitted");
      // reset for next user (keep finished state)
    } catch {
      toast.error("Could not save. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    localStorage.removeItem("filinex_brief_session");
    setMessages([]);
    setFinished(false);
    setContact({ name: "", email: "" });
    setTimeout(() => sendToServer([]), 50);
  };

  return (
    <div data-testid="ai-brief-assistant" className="glass-strong rounded-3xl overflow-hidden relative">
      <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-electric/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-violetx/15 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between gap-3 px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-electric/30 via-royal/20 to-violetx/30">
            <span className="absolute inset-0 rounded-xl bg-electric/20 blur-md" />
            <Sparkles className="relative h-5 w-5 text-white" />
          </span>
          <div>
            <p className="font-display text-base font-medium leading-tight">BriefBot · FILINEX</p>
            <p className="text-[11px] text-white/45 mono-label" style={{ fontSize: "0.6rem", letterSpacing: "0.18em" }}>
              Senior AI consultant · GPT-5.4
            </p>
          </div>
        </div>
        <button
          data-testid="brief-reset"
          onClick={reset}
          className="inline-flex items-center gap-1 text-xs text-white/45 hover:text-white transition-colors"
          aria-label="Restart conversation"
        >
          <RotateCcw className="h-3 w-3" /> Restart
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="relative px-5 sm:px-7 py-6 h-[420px] overflow-y-auto space-y-4 no-scrollbar">
        {messages.length === 0 && loading && (
          <p className="text-sm text-white/45">Connecting…</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`} data-testid={`brief-msg-${m.role}-${i}`}>
            {m.role === "assistant" && (
              <span className="shrink-0 mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                <Bot className="h-4 w-4 text-electric" />
              </span>
            )}
            <div
              className={`max-w-[85%] text-sm leading-relaxed rounded-2xl px-4 py-3 ${
                m.role === "user"
                  ? "bg-white text-black"
                  : "glass text-white/90"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
            {m.role === "user" && (
              <span className="shrink-0 mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                <User className="h-4 w-4 text-white/65" />
              </span>
            )}
          </div>
        ))}
        {loading && messages.length > 0 && (
          <div className="flex gap-3">
            <span className="shrink-0 mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
              <Bot className="h-4 w-4 text-electric" />
            </span>
            <div className="glass rounded-2xl px-4 py-3 inline-flex items-center gap-1.5">
              <Dot delay={0} />
              <Dot delay={150} />
              <Dot delay={300} />
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      {!finished ? (
        <form onSubmit={submit} className="relative px-5 sm:px-7 pb-5 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 glass rounded-full p-1.5 pl-5">
            <input
              data-testid="brief-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={loading ? "Thinking…" : "Reply to BriefBot…"}
              disabled={loading || finished}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/30 disabled:opacity-40"
            />
            <button
              data-testid="brief-send"
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-4 py-2.5 text-sm font-medium hover:bg-platinum transition-colors disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
              Send
            </button>
          </div>
          <p className="mt-2 text-[10px] text-white/30 text-center font-mono">
            BriefBot will summarise your project and create a pre-qualified lead.
          </p>
        </form>
      ) : (
        <div className="relative px-5 sm:px-7 pb-5 border-t border-white/10 pt-4 space-y-3">
          <div className="inline-flex items-center gap-2 text-sm text-emeraldx">
            <CheckCircle2 className="h-4 w-4" /> Brief complete. One last step:
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            <input
              data-testid="brief-final-name"
              value={contact.name}
              onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
              placeholder="Your name"
              className="glass rounded-xl px-4 py-3 text-sm bg-transparent outline-none focus:border-white/30"
            />
            <input
              data-testid="brief-final-email"
              type="email"
              required
              value={contact.email}
              onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
              placeholder="you@company.com"
              className="glass rounded-xl px-4 py-3 text-sm bg-transparent outline-none focus:border-white/30"
            />
          </div>
          <button
            data-testid="brief-submit"
            onClick={saveBrief}
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-5 py-3 text-sm font-medium hover:bg-platinum transition-colors disabled:opacity-60"
          >
            {submitting ? "Sending brief…" : "Send to partner team"}
          </button>
        </div>
      )}
    </div>
  );
}

function Dot({ delay }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce"
      style={{ animationDelay: `${delay}ms`, animationDuration: "900ms" }}
    />
  );
}

function extractContact(text) {
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  const nameMatch = text.match(/Contact:\s*([^,\n]+),/i);
  if (!emailMatch && !nameMatch) return null;
  return {
    name: nameMatch ? nameMatch[1].trim() : "",
    email: emailMatch ? emailMatch[0] : "",
  };
}
