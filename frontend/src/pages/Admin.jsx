import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, Mail, Building2, Globe, DollarSign, Tag, Search, Trash2 } from "lucide-react";
import api from "@/lib/api";

const STATUSES = ["new", "qualified", "meeting_scheduled", "proposal_sent", "won", "lost"];

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("filinex_admin_token"));
  return token ? <Dashboard onLogout={() => { localStorage.removeItem("filinex_admin_token"); setToken(null); }} /> : <Login onSuccess={(t) => { localStorage.setItem("filinex_admin_token", t); setToken(t); }} />;
}

function Login({ onSuccess }) {
  const [form, setForm] = useState({ email: "admin@filinex.com", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await api.post("/admin/login", form);
      onSuccess(r.data.token);
      toast.success("Welcome back.");
    } catch {
      toast.error("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="admin-login" className="min-h-screen flex items-center justify-center px-5">
      <form onSubmit={submit} className="glass-strong rounded-2xl p-8 w-full max-w-md">
        <span className="mono-label">FILINEX · Operator</span>
        <h1 className="mt-2 font-display text-2xl font-medium">Sign in to admin</h1>
        <div className="mt-6 space-y-3">
          <input
            data-testid="admin-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="admin@filinex.com"
            className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent outline-none focus:border-white/30"
          />
          <input
            data-testid="admin-password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="Password"
            className="w-full glass rounded-xl px-4 py-3 text-sm bg-transparent outline-none focus:border-white/30"
          />
        </div>
        <button
          data-testid="admin-login-submit"
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-full bg-white text-black px-5 py-3 text-sm font-medium hover:bg-platinum transition-colors disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="mt-3 text-xs text-white/40 text-center">Default: admin@filinex.com / Filinex@2026</p>
      </form>
    </div>
  );
}

function Dashboard({ onLogout }) {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    try {
      const [a, b] = await Promise.all([api.get("/leads"), api.get("/leads/stats")]);
      setLeads(a.data);
      setStats(b.data);
    } catch {
      toast.error("Failed to load.");
      onLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = leads.filter((l) => {
    const s = statusFilter === "all" || l.status === statusFilter;
    const k = q.toLowerCase();
    const match = !k || `${l.name} ${l.email} ${l.company || ""}`.toLowerCase().includes(k);
    return s && match;
  });

  const updateStatus = async (id, status) => {
    try {
      const r = await api.patch(`/leads/${id}`, { status });
      setLeads((ls) => ls.map((l) => (l.id === id ? r.data : l)));
      if (selected?.id === id) setSelected(r.data);
      load();
    } catch { toast.error("Could not update."); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    try {
      await api.delete(`/leads/${id}`);
      setLeads((ls) => ls.filter((l) => l.id !== id));
      if (selected?.id === id) setSelected(null);
      load();
    } catch { toast.error("Could not delete."); }
  };

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-obsidian">
      <header className="border-b border-white/10 px-5 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-display text-lg font-bold tracking-tight">FILINEX · Operator</span>
          <span className="mono-label" style={{ fontSize: "0.62rem" }}>Lead Pipeline</span>
        </div>
        <button data-testid="admin-logout" onClick={onLogout} className="inline-flex items-center gap-2 text-sm text-white/65 hover:text-white">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </header>

      {stats && (
        <div className="px-5 sm:px-8 py-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[["Total", stats.total], ...STATUSES.map((s) => [s.replace("_", " "), stats[s]])].map(([k, v]) => (
            <div key={k} className="glass rounded-xl px-4 py-3">
              <div className="mono-label" style={{ fontSize: "0.55rem" }}>{k}</div>
              <div className="mt-1 font-display text-2xl font-medium">{v ?? 0}</div>
            </div>
          ))}
        </div>
      )}

      <div className="px-5 sm:px-8 pb-12 grid lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5 flex-1 min-w-[200px]">
              <Search className="h-3.5 w-3.5 text-white/50" />
              <input data-testid="admin-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search leads…" className="bg-transparent outline-none text-sm flex-1 placeholder:text-white/30" />
            </div>
            <select
              data-testid="admin-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="glass rounded-full px-3 py-1.5 text-sm bg-transparent outline-none"
            >
              <option value="all" className="bg-obsidian">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s} className="bg-obsidian">{s.replace("_", " ")}</option>)}
            </select>
          </div>

          {loading && <p className="text-white/50 text-sm">Loading…</p>}
          {!loading && filtered.length === 0 && <p className="text-white/50 text-sm">No leads yet.</p>}

          <div className="space-y-2">
            {filtered.map((l) => (
              <button
                key={l.id}
                data-testid={`admin-lead-${l.id}`}
                onClick={() => setSelected(l)}
                className={`w-full text-left glass rounded-xl p-4 hover:bg-white/[0.04] transition-colors flex items-center gap-4 ${
                  selected?.id === l.id ? "border-white/30" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{l.name}</span>
                    <span className="text-xs text-white/40">· {l.email}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-white/45">
                    {l.company && <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3" /> {l.company}</span>}
                    {l.country && <span className="inline-flex items-center gap-1"><Globe className="h-3 w-3" /> {l.country}</span>}
                    {l.budget && <span className="inline-flex items-center gap-1"><DollarSign className="h-3 w-3" /> {l.budget}</span>}
                    {l.project_type && <span className="inline-flex items-center gap-1"><Tag className="h-3 w-3" /> {l.project_type}</span>}
                  </div>
                </div>
                <StatusPill status={l.status} />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          {selected ? <LeadDetail lead={selected} onStatus={updateStatus} onDelete={remove} /> : (
            <div className="glass rounded-2xl p-7 text-center text-white/40 text-sm">
              Select a lead to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const colors = {
    new: "bg-blue-500/15 text-blue-300 border-blue-500/20",
    qualified: "bg-purple-500/15 text-purple-300 border-purple-500/20",
    meeting_scheduled: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",
    proposal_sent: "bg-amber-500/15 text-amber-300 border-amber-500/20",
    won: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    lost: "bg-red-500/15 text-red-300 border-red-500/20",
  };
  return (
    <span className={`text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border ${colors[status] || "bg-white/5 text-white/60 border-white/10"}`}>
      {status?.replace("_", " ")}
    </span>
  );
}

function LeadDetail({ lead, onStatus, onDelete }) {
  return (
    <div className="glass-strong rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-medium">{lead.name}</h3>
          <a href={`mailto:${lead.email}`} className="text-sm text-electric inline-flex items-center gap-1.5 mt-1">
            <Mail className="h-3 w-3" /> {lead.email}
          </a>
        </div>
        <button onClick={() => onDelete(lead.id)} className="text-white/45 hover:text-red-300 transition-colors" data-testid="admin-lead-delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
        {[
          ["Phone", lead.phone],
          ["Company", lead.company],
          ["Country", lead.country],
          ["Budget", lead.budget],
          ["Project Type", lead.project_type],
          ["Source", lead.source],
        ].filter(([, v]) => v).map(([k, v]) => (
          <div key={k} className="glass rounded-lg px-3 py-2">
            <div className="mono-label" style={{ fontSize: "0.55rem" }}>{k}</div>
            <div className="mt-1 text-white/85">{v}</div>
          </div>
        ))}
      </dl>
      {lead.message && (
        <div className="mt-4 glass rounded-lg p-4">
          <div className="mono-label" style={{ fontSize: "0.55rem" }}>Message</div>
          <p className="mt-2 text-sm text-white/75 whitespace-pre-wrap">{lead.message}</p>
        </div>
      )}
      <div className="mt-5">
        <div className="mono-label">Update status</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => onStatus(lead.id, s)}
              data-testid={`admin-status-${s}`}
              className={`text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${
                lead.status === s ? "bg-white text-black border-white" : "border-white/10 text-white/65 hover:border-white/30"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-5 text-xs text-white/40 font-mono">
        Created · {new Date(lead.created_at).toLocaleString()}
      </p>
    </div>
  );
}
