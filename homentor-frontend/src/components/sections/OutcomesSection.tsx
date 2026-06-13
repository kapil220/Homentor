import { motion } from "framer-motion";
import Parallax from "@/comp/Parallax";
import { useLanguage } from "@/context/LanguageContext";

const OutcomesSection = () => {
  const { t } = useLanguage();

  const cards = [
    {
      img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
      metric: t('home.outcomesMetric1'),
      label: t('home.outcomesLabel1'),
      quote: t('home.outcomesQuote1'),
      accent: "from-blue-500 to-indigo-600",
      parallax: -50,
    },
    {
      img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=900&q=80",
      metric: t('home.outcomesMetric2'),
      label: t('home.outcomesLabel2'),
      quote: t('home.outcomesQuote2'),
      accent: "from-amber-500 to-orange-600",
      parallax: 30,
    },
    {
      img: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=900&q=80",
      metric: t('home.outcomesMetric3'),
      label: t('home.outcomesLabel3'),
      quote: t('home.outcomesQuote3'),
      accent: "from-emerald-500 to-teal-600",
      parallax: -40,
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-white via-hommentor-mist/40 to-white -z-10"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <p className="text-sm font-semibold text-hommentor-blue uppercase tracking-wider">{t('home.outcomesLabel')}</p>
          <h2 className="mt-2 text-3xl md:text-5xl font-heading font-bold text-hommentor-ink tracking-tight leading-tight">
            {t('home.outcomesTitle')}
          </h2>
          <p className="mt-4 text-slate-600 text-lg">
            {t('home.outcomesSubtitle')}
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
