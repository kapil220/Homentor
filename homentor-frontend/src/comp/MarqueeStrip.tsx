import React from "react";

type Props = {
  items: string[];
  variant?: "light" | "dark";
};

const MarqueeStrip = ({ items, variant = "light" }: Props) => {
  // Repeat twice so the animation loops seamlessly
  const doubled = [...items, ...items];
  const isDark = variant === "dark";
  return (
    <div
      className={`relative overflow-hidden border-y ${
        isDark
          ? "border-white/10 bg-homentor-ink text-white"
          : "border-slate-200 bg-white text-slate-900"
      }`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r ${
          isDark ? "from-homentor-ink to-transparent" : "from-white to-transparent"
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l ${
          isDark ? "from-homentor-ink to-transparent" : "from-white to-transparent"
        }`}
      />
      <div className="marquee-track py-4">
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-6 text-sm font-heading font-semibold tracking-wide"
          >
            <span className="opacity-90">{item}</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isDark ? "bg-homentor-gold/70" : "bg-homentor-blue/40"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeStrip;
