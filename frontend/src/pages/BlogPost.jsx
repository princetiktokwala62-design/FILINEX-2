import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import SEO from "@/components/SEO";
import api from "@/lib/api";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api
      .get(`/blog/posts/${slug}`)
      .then((r) => setPost(r.data))
      .catch(() => setErr("not_found"));
  }, [slug]);

  if (err === "not_found") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50">Post not found.</p>
          <Link to="/blog" className="mt-3 inline-flex items-center gap-2 text-sm text-electric">
            <ArrowLeft className="h-4 w-4" /> Back to all posts
          </Link>
        </div>
      </div>
    );
  }

  if (!post) return <div className="min-h-[60vh]" />;

  return (
    <article data-testid="blog-post-page" className="pt-32 pb-24">
      <SEO title={`${post.title} — FILINEX Insights`} description={post.excerpt} image={post.cover_image} canonical={`/blog/${post.slug}`} />
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> All Insights
        </Link>
        <span className="mt-8 mono-label block">{post.category}</span>
        <h1 className="mt-3 font-display text-4xl sm:text-6xl font-medium tracking-tighter">{post.title}</h1>
        <p className="mt-4 text-lg text-white/65 leading-relaxed">{post.excerpt}</p>
        <div className="mt-6 flex items-center gap-3 text-xs text-white/40">
          <Clock className="h-3 w-3" /> {post.reading_time} min read · {post.author}
        </div>
      </div>

      {post.cover_image && (
        <div className="mt-10 mx-auto max-w-5xl px-5 sm:px-8">
          <img src={post.cover_image} alt={post.title} className="w-full aspect-[16/9] object-cover rounded-2xl" />
        </div>
      )}

      <div className="mt-12 mx-auto max-w-3xl px-5 sm:px-8 prose prose-invert">
        <div
          className="text-white/80 leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: simpleMarkdown(post.content) }}
        />
      </div>
    </article>
  );
}

function simpleMarkdown(md) {
  const lines = md.split(/\r?\n/);
  const html = [];
  for (const line of lines) {
    if (/^#\s/.test(line)) html.push(`<h1 class="font-display text-3xl font-medium mt-8">${line.slice(2)}</h1>`);
    else if (/^##\s/.test(line)) html.push(`<h2 class="font-display text-2xl font-medium mt-8">${line.slice(3)}</h2>`);
    else if (/^-\s/.test(line)) html.push(`<li class="ml-5 list-disc">${inline(line.slice(2))}</li>`);
    else if (line.trim() === "") html.push("");
    else html.push(`<p class="text-white/80">${inline(line)}</p>`);
  }
  return html.join("\n");
}

function inline(s) {
  return s
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="font-serif-italic">$1</em>');
}
