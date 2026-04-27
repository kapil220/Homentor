import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Mother of Aarav, Class 9 · Indore",
    quote:
      "From a C in maths to A+ in three months. The mentor came home, on time, every week. The plan was specific to my son's gaps — not a generic syllabus dump.",
    rating: 5,
    initials: "PS",
    accent: "from-blue-500 to-indigo-600",
    metric: "Grade C → A+",
  },
  {
    name: "Rajesh Kumar",
    role: "Father of Aanya, Class 11 · Bhopal",
    quote:
      "I was sceptical of online tuition for physics. Homentor matched us with a mentor in our own neighbourhood. My daughter actually looks forward to class now.",
    rating: 5,
    initials: "RK",
    accent: "from-amber-500 to-orange-600",
    metric: "Confidence ↑",
  },
  {
    name: "Anita Patel",
    role: "Mother of Vihaan, Class 7 · Bengaluru",
    quote:
      "What sold me is that I can switch mentors if needed and the team actually listens. The booking flow is straightforward and the receipts are clean.",
    rating: 5,
    initials: "AP",
    accent: "from-emerald-500 to-teal-600",
    metric: "Stress-free",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 dot-grid-light opacity-50 -z-10"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <p className="text-sm font-semibold text-homentor-blue uppercase tracking-wider">Loved by parents</p>
          <h2 className="mt-2 text-3xl md:text-5xl font-heading font-bold text-homentor-ink tracking-tight leading-tight">
            Real outcomes, in real homes
          </h2>
          <p className="mt-4 text-slate-600 text-lg">
            Just a fraction of the families switching to Homentor across India.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`relative rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all ${
                i === 1 ? "md:-translate-y-4" : ""
              }`}
            >
              {/* Big quote glyph */}
              <Quote className="absolute -top-4 -left-2 w-12 h-12 text-blue-100" aria-hidden />

              <div className="relative">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>

                <blockquote className="text-slate-800 text-base leading-relaxed font-medium">
                  "{t.quote}"
                </blockquote>

                <span className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {t.metric}
                </span>

                <figcaption className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.accent} text-white flex items-center justify-center font-bold text-sm shrink-0`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-homentor-ink text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </figcaption>
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
