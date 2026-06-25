import { Link } from "react-router-dom";
import AuroraBackground from "@/components/visuals/AuroraBackground";

export default function NotFound() {
  return (
    <div data-testid="not-found-page" className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      <AuroraBackground />
      <div className="relative text-center px-5">
        <span className="mono-label">404</span>
        <h1 className="mt-3 font-display text-6xl sm:text-8xl font-medium tracking-tighter text-aurora">Off the map.</h1>
        <p className="mt-5 text-white/65 max-w-md mx-auto">
          The page you're looking for doesn't exist — but our portfolio probably does what you wanted.
        </p>
        <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-3 text-sm font-medium">
          Back to home
        </Link>
      </div>
    </div>
  );
}
