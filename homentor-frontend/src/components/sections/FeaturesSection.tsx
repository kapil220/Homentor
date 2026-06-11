import { motion } from "framer-motion";
import {
  BadgeCheck,
  Sparkles,
  Home,
  Gift,
  ShieldCheck,
  Repeat,
  Phone,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const FeaturesSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <p className="text-sm font-semibold text-homentor-blue uppercase tracking-wider">{t('home.featuresLabel')}</p>
          <h2 className="mt-2 text-3xl md:text-5xl font-heading font-bold text-homentor-ink tracking-tight leading-tight">
            {t('home.featuresTitle')}
          </h2>
          <p className="mt-4 text-slate-600 text-lg">
            {t('home.featuresDesc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5">
          <Tile
            colSpan="md:col-span-3 md:row-span-2"
            accent="blue"
            icon={<BadgeCheck className="w-6 h-6" />}
            title={t('home.featuresTile1Title')}
            body={t('home.featuresTile1Body')}
            highlight={
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 ring-2 ring-white"
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-homentor-ink">{t('home.featuresTile1Highlight')}</span>
                </p>
              </div>
            }
          />

          <Tile
            colSpan="md:col-span-3"
            accent="amber"
            icon={<Sparkles className="w-5 h-5" />}
            title={t('home.featuresTile2Title')}
            body={t('home.featuresTile2Body')}
          />

          <Tile
            colSpan="md:col-span-3"
            accent="coral"
            icon={<Home className="w-5 h-5" />}
            title={t('home.featuresTile3Title')}
            body={t('home.featuresTile3Body')}
          />

          <Tile
            colSpan="md:col-span-2"
            accent="emerald"
            icon={<Gift className="w-5 h-5" />}
            title={t('home.featuresTile4Title')}
            body={t('home.featuresTile4Body')}
          />

          <Tile
            colSpan="md:col-span-2"
            accent="indigo"
            icon={<ShieldCheck className="w-5 h-5" />}
            title={t('home.featuresTile5Title')}
            body={t('home.featuresTile5Body')}
          />

          <Tile
            colSpan="md:col-span-2"
            accent="blue"
            icon={<Repeat className="w-5 h-5" />}
            title={t('home.featuresTile6Title')}
            body={t('home.featuresTile6Body')}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-600"
        >
          <Phone className="w-4 h-4 text-homentor-blue" />
          <span>
            {t('home.featuresTalkFirst')}{" "}
            <a href="tel:+919203149956" className="font-semibold text-homentor-blue hover:underline">
              +91 9203149956
            </a>
          </span>
        </motion.div>
      </div>
    </section>
  );
};

const accentBg = {
  blue: "bg-blue-50 text-homentor-blue",
  amber: "bg-amber-50 text-amber-600",
  coral: "bg-rose-50 text-homentor-coral",
  emerald: "bg-emerald-50 text-emerald-600",
  indigo: "bg-indigo-50 text-indigo-600",
} as const;

const Tile = ({
  colSpan,
  accent = "blue",
  icon,
  title,
  body,
  highlight,
}: {
  colSpan: string;
  accent?: keyof typeof accentBg;
  icon: React.ReactNode;
  title: string;
  body: string;
  highlight?: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{ duration: 0.45 }}
    className={`group relative ${colSpan} bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 hover:border-homentor-gold hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden`}
  >
    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${accentBg[accent]} mb-5 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="font-heading font-bold text-xl sm:text-2xl text-homentor-ink leading-snug">
      {title}
    </h3>
    <p className="text-slate-600 text-sm sm:text-base mt-2.5 leading-relaxed">{body}</p>
    {highlight}
    <div
      aria-hidden
      className="absolute -bottom-20 -right-20 w-44 h-44 bg-gradient-to-tr from-homentor-blue/10 via-amber-200/20 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
    />
  </motion.div>
);

export default FeaturesSection;
