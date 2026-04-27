import { motion } from "framer-motion";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
  variant?: "dark" | "light";
};

const PageHero = ({
  eyebrow,
  title,
  subtitle,
  imageUrl,
  imageAlt = "",
  variant = "dark",
}: Props) => {
  const isDark = variant === "dark";
  return (
    <section
      className={`relative isolate overflow-hidden ${
        isDark
          ? "bg-mesh-dark bg-mesh-animated noise-overlay text-white"
          : "bg-mesh-light text-homentor-ink"
      }`}
    >
      <div
        aria-hidden
        className={`absolute inset-0 ${isDark ? "dot-grid-dark" : "dot-grid-light"} opacity-50`}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 md:pt-36 md:pb-24">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={imageUrl ? "lg:col-span-7" : "lg:col-span-12 text-center mx-auto max-w-3xl"}
          >
            {eyebrow && (
              <span
                className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                  isDark ? "bg-white/10 text-white border border-white/15" : "bg-blue-50 text-homentor-blue border border-blue-100"
                }`}
              >
                {eyebrow}
              </span>
            )}
            <h1 className="mt-4 font-heading font-extrabold tracking-tight leading-[1.05] [font-size:clamp(2.25rem,4vw+0.5rem,4rem)]">
              {title}
            </h1>
            {subtitle && (
              <p className={`mt-5 text-lg sm:text-xl leading-relaxed max-w-2xl ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                {subtitle}
              </p>
            )}
          </motion.div>

          {imageUrl && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="lg:col-span-5"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/30 aspect-[4/3]">
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
