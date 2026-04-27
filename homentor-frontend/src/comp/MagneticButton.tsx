import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  magnetStrength?: number;
};

const MagneticButton = ({
  children,
  magnetStrength = 0.3,
  className = "",
  ...rest
}: Props) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    setPos({ x: dx * magnetStrength, y: dy * magnetStrength });
  };

  const onLeave = () => setPos({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 300, damping: 22, mass: 0.5 }}
      whileTap={{ scale: 0.96 }}
      className={className}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  );
};

export default MagneticButton;
