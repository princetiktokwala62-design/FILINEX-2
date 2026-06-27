import { Link } from "react-router-dom";

/** FILINEX brand logo — a stylised F mark with platinum/aurora gradient. */
export default function Logo({ size = 32, withWordmark = true, className = "", to = "/" }) {
  const inner = (
    <span className={`inline-flex items-center gap-2.5 group ${className}`}>
      <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        {/* glow */}
        <span
          className="absolute inset-0 rounded-[28%] blur-[10px] opacity-60 group-hover:opacity-90 transition-opacity duration-500"
          style={{ background: "conic-gradient(from 140deg, #4c8dff, #5e5ce6, #af52de, #32ade6, #4c8dff)" }}
        />
        <svg
          viewBox="0 0 64 64"
          width={size}
          height={size}
          className="relative drop-shadow-[0_4px_12px_rgba(94,92,230,0.35)]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="filinex-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#e1e1ee" />
              <stop offset="70%" stopColor="#9aa6ff" />
              <stop offset="100%" stopColor="#5e5ce6" />
            </linearGradient>
            <linearGradient id="filinex-edge" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4c8dff" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#af52de" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#5e5ce6" stopOpacity="0.9" />
            </linearGradient>
            <filter id="filinex-noise">
              <feTurbulence baseFrequency="0.85" numOctaves="1" />
              <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.03 0" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>

          {/* rounded square base */}
          <rect x="2" y="2" width="60" height="60" rx="16" fill="#0a0a0a" />
          <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#filinex-edge)" opacity="0.18" />
          <rect x="2" y="2" width="60" height="60" rx="16" fill="none" stroke="url(#filinex-edge)" strokeWidth="1.2" />

          {/* stylised F: vertical stroke + two horizontal beams */}
          <g>
            <rect x="18" y="14" width="6" height="36" rx="1.5" fill="url(#filinex-grad)" />
            <rect x="18" y="14" width="28" height="6" rx="1.5" fill="url(#filinex-grad)" />
            <rect x="18" y="28" width="20" height="5" rx="1.5" fill="url(#filinex-grad)" />
          </g>

          {/* spark dot — represents intelligence */}
          <circle cx="48" cy="46" r="3" fill="#ffffff" />
          <circle cx="48" cy="46" r="6" fill="none" stroke="#4c8dff" strokeWidth="1" opacity="0.65" />

          {/* subtle film grain */}
          <rect x="2" y="2" width="60" height="60" rx="16" filter="url(#filinex-noise)" opacity="0.6" />
        </svg>
      </span>
      {withWordmark && (
        <span className="font-display font-bold tracking-tight text-platinum" style={{ fontSize: size * 0.62, lineHeight: 1 }}>
          FILI<span className="text-aurora">NEX</span>
        </span>
      )}
    </span>
  );

  if (!to) return inner;
  return <Link to={to} data-testid="brand-logo">{inner}</Link>;
}
