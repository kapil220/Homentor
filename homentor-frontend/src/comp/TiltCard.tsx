import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
};

const TiltCard = ({ children, className = "", intensity = 8 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0 });
  const reduce = useReducedMotion();

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const ry = (px - 0.5) * intensity;
    const rx = -(py - 0.5) * intensity;
    setT({ rx, ry });
  };
  const onLeave = () => setT({ rx: 0, ry: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={{ rotateX: t.rx, rotateY: t.ry }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      style={{ transformPerspective: 1000, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default TiltCard;
