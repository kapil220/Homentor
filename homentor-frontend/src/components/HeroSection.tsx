import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star, BadgeCheck, Users } from "lucide-react";

const HeroSection = ({
  title = "Your Child Deserves a Mentor, Not Just a Teacher",
  description = "Get matched with trusted tutors and subject mentors who craft customized learning plans around your child's academic needs.",
}) => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Subtle grid background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 [background-image:radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.06)_1px,transparent_0)] [background-size:24px_24px]"
      />
      {/* Soft gradient glow */}
      <div
        aria-hidden
        className="absolute -top-32 left-1/2 -translate-x-1/2 h-[480px] w-[720px] rounded-full bg-gradient-to-tr from-blue-200/50 via-indigo-200/40 to-purple-200/40 blur-3xl -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-7 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-homentor-blue border border-blue-100">
              <Sparkles className="w-3.5 h-3.5" />
              Trusted by 1000+ parents
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.05]">
              {title.split(" ").map((word, i) => (
                <span key={i}>
                  {word.toLowerCase() === "mentor," ? (
                    <span className="relative inline-block">
                      <span className="text-homentor-blue">{word}</span>
                      <span className="absolute -bottom-1 left-0 w-full h-2 bg-homentor-gold/50 rounded-full -z-10" />
                    </span>
                  ) : (
                    word + " "
                  )}
                </span>
              ))}
            </h1>

            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={() => navigate("/mentors")}
                size="lg"
                className="bg-homentor-blue hover:bg-homentor-darkBlue text-white rounded-xl shadow-lg shadow-blue-600/20 h-12 px-6 text-base"
              >
                Find a Mentor
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                onClick={() => navigate("/about-us")}
                variant="outline"
                size="lg"
                className="rounded-xl h-12 px-6 text-base border-slate-200 hover:bg-slate-50"
              >
                How it works
              </Button>
            </div>

            {/* Trust row */}
            <div className="flex items-center gap-6 pt-6">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 ring-2 ring-white"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-600">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-slate-900">4.9</span>
                  <span>· 1,000+ reviews</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual: glassmorphic stat cards */}
          <div className="hidden md:block relative h-[520px]">
            <div className="absolute inset-0 grid grid-cols-2 gap-5 p-4">
              <div className="space-y-5 mt-8">
                <StatCard
                  icon={<BadgeCheck className="w-5 h-5" />}
                  label="Verified Mentors"
                  value="100+"
                  accent="blue"
                />
                <FloatingCard
                  title="Math · Grade 9"
                  subtitle="Scheduled · Tue 5 PM"
                  avatar="M"
                />
                <StatCard
                  icon={<Users className="w-5 h-5" />}
                  label="Happy Students"
                  value="1,000+"
                  accent="indigo"
                />
              </div>
              <div className="space-y-5">
                <FloatingCard
                  title="Physics Crash Course"
                  subtitle="Booked by 12 parents this week"
                  avatar="P"
                  tint="amber"
                />
                <StatCard
                  icon={<Star className="w-5 h-5" />}
                  label="Rating"
                  value="4.9 / 5"
                  accent="amber"
                />
                <FloatingCard
                  title="Priya · English"
                  subtitle="Response in < 2 hours"
                  avatar="P"
                  tint="emerald"
                />
              </div>
            </div>
            {/* Decorative glow behind cards */}
            <div
              aria-hidden
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-gradient-to-br from-blue-300/30 to-indigo-300/30 blur-3xl -z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: "blue" | "indigo" | "amber";
}) => {
  const accentClass = {
    blue: "text-homentor-blue bg-blue-50",
    indigo: "text-indigo-600 bg-indigo-50",
    amber: "text-amber-600 bg-amber-50",
  }[accent];
  return (
    <div className="rounded-2xl bg-white/90 backdrop-blur border border-slate-200/60 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`inline-flex p-2 rounded-lg ${accentClass}`}>{icon}</div>
      <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="text-2xl font-bold text-slate-900 tracking-tight">
        {value}
      </p>
    </div>
  );
};

const FloatingCard = ({
  title,
  subtitle,
  avatar,
  tint = "blue",
}: {
  title: string;
  subtitle: string;
  avatar: string;
  tint?: "blue" | "amber" | "emerald";
}) => {
  const tintClass = {
    blue: "bg-gradient-to-br from-blue-500 to-indigo-600",
    amber: "bg-gradient-to-br from-amber-400 to-amber-600",
    emerald: "bg-gradient-to-br from-emerald-500 to-teal-600",
  }[tint];
  return (
    <div className="rounded-2xl bg-white/90 backdrop-blur border border-slate-200/60 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl ${tintClass} text-white flex items-center justify-center font-semibold shadow-sm`}
        >
          {avatar}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {title}
          </p>
          <p className="text-xs text-slate-500 truncate">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
