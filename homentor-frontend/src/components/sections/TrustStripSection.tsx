import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { BadgeCheck, Users, BookOpen, ShieldCheck } from "lucide-react";

type Item = {
  icon: React.ReactNode;
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
};

const items: Item[] = [
  { icon: <BadgeCheck className="w-5 h-5" />, end: 100, suffix: "+", label: "Verified Mentors" },
  { icon: <Users className="w-5 h-5" />, end: 1000, suffix: "+", label: "Happy Students" },
  { icon: <BookOpen className="w-5 h-5" />, end: 30, suffix: "+", label: "Subjects Covered" },
  { icon: <ShieldCheck className="w-5 h-5" />, end: 100, suffix: "%", label: "First-class Refund Guarantee" },
];

const Counter = ({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? end : 0);

  useEffect(() => {
    if (!inView || reduce) {
      if (reduce) setVal(end);
      return;
    }
    const start = performance.now();
    const dur = 1600;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(end * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, reduce]);

  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString()}
      {suffix}
    </span>
  );
};

const TrustStripSection = () => {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-homentor-mist to-white p-6 sm:p-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {items.map((it, i) => (
              <motion.div
                key={it.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="text-center sm:text-left"
              >
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-homentor-blue mb-3">
                  {it.icon}
                </div>
                <p className="text-3xl sm:text-4xl font-heading font-bold text-homentor-ink tracking-tight">
                  <Counter end={it.end} suffix={it.suffix} prefix={it.prefix} />
                </p>
                <p className="text-sm text-slate-600 mt-1">{it.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustStripSection;
