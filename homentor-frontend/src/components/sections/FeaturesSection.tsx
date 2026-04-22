import React from "react";
import { Book, Shield, Zap, Target, Clock, HeartHandshake } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const features = [
  {
    icon: Shield,
    title: "Verified Mentors",
    desc: "Background-checked, credential-verified educators. Only ~15% of applicants make it.",
    accent: "blue",
  },
  {
    icon: Zap,
    title: "Personalised Learning",
    desc: "Each plan is shaped around your child's goals, learning style, and pace.",
    accent: "indigo",
  },
  {
    icon: Book,
    title: "All Subjects",
    desc: "Mathematics, Science, Languages, Computer Science, test prep — we cover it.",
    accent: "amber",
  },
  {
    icon: Target,
    title: "Goal-Oriented",
    desc: "Track progress session-by-session with measurable milestones.",
    accent: "emerald",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    desc: "Pick the times that suit your family. Home visits or online — your call.",
    accent: "blue",
  },
  {
    icon: HeartHandshake,
    title: "Satisfaction Guarantee",
    desc: "Not happy with your first session? We'll refund it and find a better match.",
    accent: "indigo",
  },
];

const accentMap: Record<string, string> = {
  blue: "text-homentor-blue bg-blue-50",
  indigo: "text-indigo-600 bg-indigo-50",
  amber: "text-amber-600 bg-amber-50",
  emerald: "text-emerald-600 bg-emerald-50",
};

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-14 max-w-2xl mx-auto">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-100">
            Why Homentor
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            A better way to learn at home
          </h2>
          <p className="mt-3 text-slate-600">
            Everything parents want from a private tutor — and nothing they don't.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <ScrollReveal key={f.title} delay={i * 0.05}>
                <div className="group h-full rounded-2xl bg-white border border-slate-200 p-6 hover:border-slate-300 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <div
                    className={`inline-flex p-3 rounded-xl ${accentMap[f.accent]}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-slate-600 leading-relaxed text-sm">
                    {f.desc}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
