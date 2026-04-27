import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 220, damping: 30, mass: 0.4 });

  return (
    <motion.div
      style={{ scaleX: x, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-gradient-to-r from-homentor-blue via-homentor-gold to-homentor-coral"
    />
  );
};

export default ScrollProgressBar;
