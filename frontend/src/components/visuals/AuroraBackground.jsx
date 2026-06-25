export default function AuroraBackground({ className = "", intensity = 1 }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="aurora-orb animate-aurora"
        style={{
          width: 720 * intensity,
          height: 720 * intensity,
          top: "-15%",
          left: "-10%",
          background: "radial-gradient(circle at 30% 30%, rgba(0,122,255,0.55), transparent 60%)",
        }}
      />
      <div
        className="aurora-orb animate-aurora"
        style={{
          width: 680 * intensity,
          height: 680 * intensity,
          top: "20%",
          right: "-15%",
          background: "radial-gradient(circle at 70% 30%, rgba(175,82,222,0.5), transparent 60%)",
          animationDelay: "5s",
        }}
      />
      <div
        className="aurora-orb animate-aurora"
        style={{
          width: 520 * intensity,
          height: 520 * intensity,
          bottom: "-20%",
          left: "30%",
          background: "radial-gradient(circle at 50% 50%, rgba(94,92,230,0.45), transparent 60%)",
          animationDelay: "9s",
        }}
      />
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 noise" />
    </div>
  );
}
