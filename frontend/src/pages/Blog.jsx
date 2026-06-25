import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Search } from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import api from "@/lib/api";
import AuroraBackground from "@/components/visuals/AuroraBackground";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get("/blog/posts", { params: q ? { q } : {} })
      .then((r) => !cancelled && setPosts(r.data))
      .catch(() => !cancelled && setPosts([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [q]);

  const featured = posts.filter((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <div data-testid="blog-page">
      <SEO title="Insights — FILINEX" description="Field notes on AI, SaaS, design and engineering from the FILINEX studio." canonical="/blog" />
      <section className="relative pt-40 pb-12 overflow-hidden">
        <AuroraBackground />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <span className="mono-label">Insights</span>
          <h1 className="mt-3 font-display font-medium tracking-tighter text-5xl sm:text-7xl text-platinum max-w-4xl">
            Field notes from the
            <br />
            <span className="font-serif-italic text-electric">studio.</span>
          </h1>
          <div className="mt-8 max-w-md flex items-center gap-2 glass rounded-full px-4 py-2.5">
            <Search className="h-4 w-4 text-white/50" />
            <input
              data-testid="blog-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search articles…"
              className="bg-transparent outline-none flex-1 text-sm placeholder:text-white/30"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 pb-24">
        {loading && <p className="text-white/50 text-sm">Loading…</p>}

        {featured.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-5 mb-10">
            {featured.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="glass rounded-2xl overflow-hidden group"
                data-testid={`blog-featured-${p.slug}`}
              >
                <Link to={`/blog/${p.slug}`}>
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img src={p.cover_image} alt={p.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
                    <span className="absolute top-4 left-4 mono-label glass px-2.5 py-1 rounded-full" style={{ fontSize: "0.6rem" }}>
                      {p.category}
                    </span>
                  </div>
                  <div className="p-7">
                    <h3 className="font-display text-2xl font-medium tracking-tight">{p.title}</h3>
                    <p className="mt-3 text-sm text-white/65 leading-relaxed">{p.excerpt}</p>
                    <div className="mt-5 flex items-center gap-3 text-xs text-white/40">
                      <Clock className="h-3 w-3" /> {p.reading_time} min read · {p.author}
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((p) => (
            <article key={p.id} className="glass rounded-2xl overflow-hidden group" data-testid={`blog-card-${p.slug}`}>
              <Link to={`/blog/${p.slug}`}>
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img src={p.cover_image} alt={p.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
                </div>
                <div className="p-6">
                  <span className="mono-label" style={{ fontSize: "0.6rem" }}>
                    {p.category}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-medium tracking-tight">{p.title}</h3>
                  <p className="mt-2 text-sm text-white/55 line-clamp-2">{p.excerpt}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
                    <Clock className="h-3 w-3" /> {p.reading_time} min
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
