import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  /** Pixels of vertical drift across the element's scroll range. Negative = moves up faster than scroll. */
  offset?: number;
  className?: string;
};

const Parallax = ({ children, offset = -60, className = "" }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-offset, offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

export default Parallax;
