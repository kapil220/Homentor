import React from "react";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedCounter from "@/components/AnimatedCounter";

const items = [
  { end: 100, suffix: "+", label: "Verified Mentors" },
  { end: 1000, suffix: "+", label: "Happy Students" },
  { end: 30, suffix: "+", label: "Subjects Covered" },
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 md:p-12">
          <div className="grid grid-cols-3 gap-6 md:gap-10 divide-x divide-slate-200">
            {items.map((it, i) => (
              <ScrollReveal
                key={it.label}
                delay={i * 0.1}
                className="text-center px-2 md:px-6"
              >
                <AnimatedCounter
                  end={it.end}
                  suffix={it.suffix}
                  className="block text-3xl md:text-5xl font-bold text-homentor-blue tracking-tight"
                  duration={2200}
                  easing="easeOut"
                />
                <p className="mt-2 text-sm md:text-base text-slate-500">
                  {it.label}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
