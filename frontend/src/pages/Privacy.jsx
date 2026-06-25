import SEO from "@/components/SEO";

export default function Privacy() {
  return (
    <div data-testid="privacy-page" className="pt-32 pb-24 mx-auto max-w-3xl px-5 sm:px-8">
      <SEO title="Privacy Policy — FILINEX" description="FILINEX privacy policy." canonical="/privacy" />
      <span className="mono-label">Legal</span>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl font-medium tracking-tighter">Privacy Policy</h1>
      <p className="mt-6 text-white/65 leading-relaxed">
        FILINEX collects only the information you provide via our forms and contact channels.
        We use it solely to respond to your inquiry, deliver our services, and improve the website.
        We never sell your data to third parties.
      </p>
      <h2 className="mt-10 font-display text-2xl font-medium">What we collect</h2>
      <p className="mt-3 text-white/65">Name, email, phone, company, project details. Analytics events for product improvement (PostHog).</p>
      <h2 className="mt-10 font-display text-2xl font-medium">Your rights</h2>
      <p className="mt-3 text-white/65">Request deletion or export by emailing privacy@filinex.com. We respond within 30 days.</p>
    </div>
  );
}
