import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Sparkles, Star, ArrowRight, BadgeCheck, ShieldCheck, Users } from "lucide-react";
import LeadCaptureForm from "@/comp/LeadCaptureForm";
import MagneticButton from "@/comp/MagneticButton";

const HeroSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const formY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const dotsY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative isolate overflow-hidden bg-mesh-dark bg-mesh-animated noise-overlay text-white"
    >
      {/* Dot grid (parallax) */}
      <motion.div style={{ y: dotsY }} aria-hidden className="absolute inset-0 dot-grid-dark opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Pitch — parallax shifts down on scroll */}
          <motion.div style={{ y: headlineY }} className="lg:col-span-7 space-y-7">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full bg-white/10 text-white border border-white/15 backdrop-blur"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
              </span>
              <span>Now booking demos for this week</span>
            </motion.span>

            {/* Headline */}
            <h1 className="font-heading font-extrabold tracking-tight text-white leading-[0.98] [font-size:clamp(2.75rem,6vw+0.5rem,5.75rem)]">
              <Word delay={0.05}>Your child</Word>{" "}
              <Word delay={0.1}>deserves a</Word>{" "}
              <span className="relative inline-block">
                <motion.span
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
                  className="text-gradient-brand"
                >
                  mentor
                </motion.span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.55, duration: 0.6 }}
                  className="absolute -bottom-1 left-0 right-0 h-2 bg-homentor-gold/80 rounded-full origin-left"
                />
              </span>
              <br />
              <Word delay={0.25}>not just a</Word>{" "}
              <Word delay={0.3} className="text-white/70">teacher.</Word>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="text-lg sm:text-xl text-slate-300 max-w-xl leading-relaxed"
            >
              Get matched with verified, hand-picked home tutors who craft a plan
              around your child's pace, exam dates and weak topics.{" "}
              <span className="text-white font-semibold">Free demo · 100% refund on the first session.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              <MagneticButton
                onClick={() => navigate("/mentors")}
                className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-homentor-gold hover:bg-homentor-darkGold text-homentor-ink font-semibold shadow-xl shadow-amber-900/30 transition-colors"
              >
                Find a Mentor
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>

              <button
                onClick={() => {
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center h-12 px-5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-medium backdrop-blur"
              >
                How it works
              </button>
            </motion.div>

            {/* Trust row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="flex flex-wrap items-center gap-x-7 gap-y-3 pt-5"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 ring-2 ring-homentor-ink"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-300">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-white">4.9</span>
                  <span>· 1,000+ parents</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <BadgeCheck className="w-4 h-4 text-blue-300" />
                Verified mentors only
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% refund guarantee
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Lead form + floating mini card (subtle reverse parallax) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ y: formY }}
            className="lg:col-span-5 relative"
          >
            <LeadCaptureForm source="landing-hero" />

            {/* Floating proof card (desktop) */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="hidden lg:flex absolute -left-8 -bottom-6 items-center gap-3 px-4 py-3 rounded-2xl bg-white shadow-xl shadow-blue-900/20 border border-slate-100"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Last 7 days</p>
                <p className="text-sm font-semibold text-homentor-ink">142 parents matched</p>
              </div>
            </motion.div>

            {/* Floating sparkle ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              className="hidden lg:block absolute -right-6 -top-6 w-20 h-20"
              aria-hidden
            >
              <div className="w-full h-full rounded-full border-2 border-dashed border-amber-300/40" />
              <Sparkles className="absolute top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 text-amber-300" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Word = ({ children, delay = 0, className = "" }: { children: string; delay?: number; className?: string }) => (
  <motion.span
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.45, ease: [0.2, 0.7, 0.3, 1] }}
    className={`inline-block mr-[0.18em] ${className}`}
  >
    {children}
  </motion.span>
);

export default HeroSection;
