import { motion } from "framer-motion";
import Parallax from "@/comp/Parallax";

const cards = [
  {
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
    metric: "Grade C → A+",
    label: "Mathematics, Class 9",
    quote: "Three months. One mentor. Best decision I made for my son.",
    accent: "from-blue-500 to-indigo-600",
    parallax: -50,
  },
  {
    img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=900&q=80",
    metric: "JEE Advanced cleared",
    label: "Physics + Chemistry, Class 12",
    quote: "Personalised plan around her exam dates. She felt prepared.",
    accent: "from-amber-500 to-orange-600",
    parallax: 30,
  },
  {
    img: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=900&q=80",
    metric: "Reads aloud confidently",
    label: "English, Class 4",
    quote: "From shy to story-telling in the classroom — in two months.",
    accent: "from-emerald-500 to-teal-600",
    parallax: -40,
  },
];

const OutcomesSection = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-white via-homentor-mist/40 to-white -z-10"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <p className="text-sm font-semibold text-homentor-blue uppercase tracking-wider">Outcomes</p>
          <h2 className="mt-2 text-3xl md:text-5xl font-heading font-bold text-homentor-ink tracking-tight leading-tight">
            What changes when the mentor is the right fit
          </h2>
          <p className="mt-4 text-slate-600 text-lg">
            A small sample of what families have written to us this year.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <Parallax key={c.label} offset={c.parallax} className="md:[&>*]:mt-0">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-2xl transition-shadow"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.label}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${c.accent} shadow-lg`}
                    >
                      {c.metric}
                    </span>
                    <p className="mt-3 text-sm font-semibold opacity-90">{c.label}</p>
                    <p className="mt-2 text-base leading-snug font-medium">"{c.quote}"</p>
                  </div>
                </div>
              </motion.div>
            </Parallax>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OutcomesSection;
