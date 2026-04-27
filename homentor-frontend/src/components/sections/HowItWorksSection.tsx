import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ClipboardList, UserCheck, GraduationCap, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Tell us about your child",
    body: "Share your child's class, subject and what you're hoping to achieve. Takes 60 seconds.",
  },
  {
    icon: UserCheck,
    title: "Get matched with a verified mentor",
    body: "We hand-pick mentors based on your area, budget and goals. You see profiles and ratings before you decide.",
  },
  {
    icon: GraduationCap,
    title: "Start with a free demo",
    body: "Book a free demo class first. If it's not the right fit, we refund your first session — no questions asked.",
  },
];

const HowItWorksSection = () => {
  const navigate = useNavigate();

  return (
    <section id="how-it-works" className="py-20 bg-homentor-mist">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <p className="text-sm font-semibold text-homentor-blue uppercase tracking-wider">How it works</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-heading font-bold text-homentor-ink tracking-tight">
            Three steps from "we need a tutor" to your child's first class
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="relative bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <span className="absolute top-5 right-5 text-5xl font-heading font-extrabold text-slate-100 leading-none select-none">
                  0{i + 1}
                </span>
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-homentor-blue mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-homentor-ink">{s.title}</h3>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">{s.body}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4 }}
          className="text-center mt-10"
        >
          <button
            onClick={() => navigate("/mentors")}
            className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-homentor-blue hover:bg-homentor-darkBlue text-white font-semibold shadow-lg shadow-blue-600/20"
          >
            Get matched in 60 seconds
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
