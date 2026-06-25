import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("filinex_cookie_consent");
    if (!accepted) {
      const t = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = (mode) => {
    localStorage.setItem("filinex_cookie_consent", mode);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      data-testid="cookie-banner"
      className="fixed bottom-6 left-6 right-6 sm:right-auto sm:max-w-md z-40"
    >
      <div className="glass-strong rounded-2xl p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-electric/15">
            <Cookie className="h-4 w-4 text-electric" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium">We respect your privacy</p>
            <p className="mt-1 text-xs text-white/60 leading-relaxed">
              We use cookies to analyze traffic and improve the experience. See our{" "}
              <Link to="/privacy" className="underline hover:text-white">
                privacy policy
              </Link>
              .
            </p>
            <div className="mt-4 flex items-center gap-2">
              <button
                data-testid="cookie-reject"
                onClick={() => accept("rejected")}
                className="text-xs px-3 py-2 rounded-full border border-white/15 hover:bg-white/5 transition-colors"
              >
                Reject
              </button>
              <button
                data-testid="cookie-accept"
                onClick={() => accept("accepted")}
                className="text-xs px-3 py-2 rounded-full bg-white text-black hover:bg-platinum transition-colors font-medium"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
