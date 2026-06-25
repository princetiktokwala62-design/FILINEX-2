import { useRef } from "react";

/** Wraps interactive surface and tracks mouse position via CSS vars for spotlight effect. */
export default function Spotlight({ as: As = "div", className = "", children, ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <As ref={ref} onMouseMove={onMove} className={`spotlight ${className}`} {...rest}>
      {children}
    </As>
  );
}
