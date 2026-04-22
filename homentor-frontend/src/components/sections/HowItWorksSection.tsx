import React from "react";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const steps = [
  {
    icon: Search,
    title: "Find a Mentor",
    desc: "Search and filter verified tutors by subject, location, and budget.",
  },
  {
    icon: Calendar,
    title: "Book a Session",
    desc: "Schedule at a time and place that works for you. Free or ₹99 demo available.",
  },
  {
    icon: User,
    title: "Learn & Grow",
    desc: "Enjoy personalised learning plans that help you achieve academic goals.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-14 max-w-2xl mx-auto">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-homentor-blue border border-blue-100">
            How it works
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Find the perfect mentor in three steps
          </h2>
          <p className="mt-3 text-slate-600">
            A simple flow — from discovery to the first class.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <ScrollReveal key={s.title} delay={i * 0.1}>
                <div className="relative h-full rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-homentor-blue" />
                    </div>
                    <span className="text-5xl font-bold text-slate-100 select-none">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>

                  {i < steps.length - 1 && (
                    <ArrowRight
                      aria-hidden
                      className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300"
                    />
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
