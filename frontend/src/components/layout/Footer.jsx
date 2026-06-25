import { Link } from "react-router-dom";
import { useState } from "react";
import { Send, Github, Twitter, Linkedin, ArrowUpRight } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

const COLS = [
  {
    title: "Services",
    links: [
      { to: "/services#ai", label: "Artificial Intelligence" },
      { to: "/services#saas", label: "SaaS Development" },
      { to: "/services#web", label: "Custom Web Apps" },
      { to: "/services#blockchain", label: "Blockchain & Web3" },
      { to: "/services#automation", label: "Business Automation" },
      { to: "/services#enterprise", label: "Enterprise Systems" },
    ],
  },
  {
    title: "Studio",
    links: [
      { to: "/about", label: "About" },
      { to: "/portfolio", label: "Portfolio" },
      { to: "/case-studies", label: "Case Studies" },
      { to: "/blog", label: "Insights" },
      { to: "/estimator", label: "Project Estimator" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms of Service" },
      { to: "/contact", label: "Press" },
      { to: "/admin", label: "Admin" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post("/newsletter", { email });
      toast.success("Subscribed. Welcome to the FILINEX signal.");
      setEmail("");
    } catch {
      toast.error("Could not subscribe. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer data-testid="site-footer" className="relative mt-32 overflow-hidden">
      {/* aurora */}
      <div className="aurora-orb h-[28rem] w-[28rem] -top-32 -left-20 bg-electric/40" />
      <div className="aurora-orb h-[26rem] w-[26rem] -bottom-32 right-0 bg-violetx/30" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand + newsletter */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2">
              <span className="relative inline-flex h-8 w-8 items-center justify-center">
                <span className="absolute inset-0 rounded-md bg-gradient-to-br from-electric via-royal to-violetx blur-md opacity-60" />
                <span className="relative inline-block h-6 w-6 rounded-md bg-gradient-to-br from-white to-platinum/70" />
              </span>
              <span className="font-display text-2xl font-bold tracking-tight">FILINEX</span>
            </div>
            <p className="mt-5 max-w-md text-white/60 leading-relaxed">
              A premium technology studio building intelligent digital products for global businesses.
              We design AI systems, SaaS platforms, blockchain & enterprise software that ship.
            </p>

            <form onSubmit={onSubscribe} className="mt-7 max-w-md">
              <span className="mono-label">Signal · Monthly</span>
              <div className="mt-2 flex items-center glass rounded-full p-1.5 pl-5">
                <input
                  data-testid="footer-newsletter-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-white/30"
                />
                <button
                  data-testid="footer-newsletter-submit"
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full bg-white text-black px-4 py-2.5 text-sm font-medium hover:bg-platinum transition-colors disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  {loading ? "..." : "Subscribe"}
                </button>
              </div>
              <p className="mt-2 text-xs text-white/30">No spam. Unsubscribe anytime.</p>
            </form>

            <div className="mt-8 flex items-center gap-3">
              {[
                { icon: Twitter, href: "https://twitter.com", label: "twitter" },
                { icon: Linkedin, href: "https://linkedin.com", label: "linkedin" },
                { icon: Github, href: "https://github.com", label: "github" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  data-testid={`footer-social-${label}`}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full glass hover:border-white/30 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {COLS.map((col) => (
              <div key={col.title}>
                <h4 className="mono-label">{col.title}</h4>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        data-testid={`footer-link-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                        className="group inline-flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors"
                      >
                        {l.label}
                        <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-white/40 font-mono">
            © {new Date().getFullYear()} FILINEX · Crafted with obsession in NY · LDN · DXB
          </p>
          <div className="flex items-center gap-3 text-xs text-white/40">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emeraldx animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
