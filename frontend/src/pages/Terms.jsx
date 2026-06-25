import SEO from "@/components/SEO";

export default function Terms() {
  return (
    <div data-testid="terms-page" className="pt-32 pb-24 mx-auto max-w-3xl px-5 sm:px-8">
      <SEO title="Terms of Service — FILINEX" description="FILINEX terms of service." canonical="/terms" />
      <span className="mono-label">Legal</span>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl font-medium tracking-tighter">Terms of Service</h1>
      <p className="mt-6 text-white/65 leading-relaxed">
        These terms govern your use of the FILINEX website and any subsequent engagement.
        Detailed engagement terms are provided in a separate Master Services Agreement before work begins.
      </p>
      <h2 className="mt-10 font-display text-2xl font-medium">Acceptable use</h2>
      <p className="mt-3 text-white/65">No automated scraping or abusive submissions. We reserve the right to block abusive traffic.</p>
      <h2 className="mt-10 font-display text-2xl font-medium">Intellectual property</h2>
      <p className="mt-3 text-white/65">All content on this website is © FILINEX. Engagement work product is owned by the client per the MSA.</p>
    </div>
  );
}
