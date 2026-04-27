import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const rows = [
  { topic: "Mentor verification", others: "Self-declared CVs", us: "Background checks + teaching audit" },
  { topic: "Demo class", others: "Paid trial or none", us: "Free demo, no commitment" },
  { topic: "Refunds", others: "Long approval cycles", us: "100% refund on first session" },
  { topic: "Switching mentors", others: "New contract, new fee", us: "Free switch anytime" },
  { topic: "Pricing transparency", others: "Hidden until booking", us: "Visible on every profile" },
  { topic: "Home tuition", others: "Mostly online", us: "Real mentor at your home" },
];

const ComparisonSection = () => {
  return (
    <section className="py-20 bg-homentor-mist relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <p className="text-sm font-semibold text-homentor-blue uppercase tracking-wider">The difference</p>
          <h2 className="mt-2 text-3xl md:text-5xl font-heading font-bold text-homentor-ink tracking-tight leading-tight">
            Most tutoring sites send a stranger.
            <br className="hidden md:block" /> We send a vetted mentor.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-blue-900/5 overflow-hidden"
        >
          {/* Header row */}
          <div className="grid grid-cols-3 bg-gradient-to-r from-homentor-mist to-blue-50 border-b border-slate-200">
            <div className="px-5 py-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              What you care about
            </div>
            <div className="px-5 py-5 text-sm font-semibold text-slate-600 border-l border-slate-200">
              Other tutoring sites
            </div>
            <div className="px-5 py-5 text-sm font-bold text-homentor-blue border-l border-slate-200 inline-flex items-center gap-2">
              <span className="inline-flex w-6 h-6 rounded-md bg-homentor-blue text-white items-center justify-center text-[10px] font-extrabold">H</span>
              Homentor
            </div>
          </div>
          {/* Body rows */}
          {rows.map((r, i) => (
            <motion.div
              key={r.topic}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="grid grid-cols-3 border-b border-slate-100 last:border-b-0"
            >
              <div className="px-5 py-4 sm:py-5 font-medium text-homentor-ink text-sm sm:text-base">
                {r.topic}
              </div>
              <div className="px-5 py-4 sm:py-5 border-l border-slate-100 flex items-start gap-2 text-sm text-slate-600">
                <X className="w-4 h-4 mt-0.5 text-slate-400 shrink-0" />
                <span>{r.others}</span>
              </div>
              <div className="px-5 py-4 sm:py-5 border-l border-slate-100 flex items-start gap-2 text-sm text-homentor-ink font-medium bg-blue-50/40">
                <Check className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                <span>{r.us}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonSection;
