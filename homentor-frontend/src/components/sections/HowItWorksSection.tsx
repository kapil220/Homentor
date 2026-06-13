import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ClipboardList, UserCheck, GraduationCap, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const HowItWorksSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const steps = [
    { icon: ClipboardList, title: t('home.step1Title'), body: t('home.step1Body') },
    { icon: UserCheck,    title: t('home.step2Title'), body: t('home.step2Body') },
    { icon: GraduationCap, title: t('home.step3Title'), body: t('home.step3Body') },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-hommentor-mist">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12 max-w-2xl mx-auto"
        >
          <p className="text-sm font-semibold text-hommentor-blue uppercase tracking-wider">{t('home.howItWorksLabel')}</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-heading font-bold text-hommentor-ink tracking-tight">
            {t('home.howItWorksHeading')}
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
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-hommentor-blue mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-hommentor-ink">{s.title}</h3>
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
            className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-hommentor-blue hover:bg-hommentor-darkBlue text-white font-semibold shadow-lg shadow-blue-600/20"
          >
            {t('home.bookFreeDemo')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
