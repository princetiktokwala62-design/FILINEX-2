import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/** Magnetic button — element subtly follows the cursor on hover. */
export default function MagneticButton({ children, className = "", strength = 0.35, ...rest }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 240, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 240, damping: 18, mass: 0.4 });
  const x = useTransform(sx, (v) => v);
  const y = useTransform(sy, (v) => v);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    mx.set((e.clientX - cx) * strength);
    my.set((e.clientY - cy) * strength);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y }}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
