import { useEffect } from "react";

export default function SEO({ title, description, image, canonical }) {
  useEffect(() => {
    if (title) document.title = title;
    const setMeta = (sel, content) => {
      if (!content) return;
      let el = document.head.querySelector(sel);
      if (!el) {
        const tag = sel.startsWith("meta[name=") ? "name" : "property";
        const name = sel.match(/['"]([^'"]+)['"]/)?.[1];
        el = document.createElement("meta");
        el.setAttribute(tag, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    if (image) setMeta('meta[property="og:image"]', image);
    if (canonical) {
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }
  }, [title, description, image, canonical]);
  return null;
}
