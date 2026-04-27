import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/comp/PageHero";
import {
  IndianRupee,
  CalendarCheck,
  Users,
  ShieldCheck,
  TrendingUp,
  Heart,
  ArrowRight,
} from "lucide-react";

const benefits = [
  {
    icon: IndianRupee,
    title: "Earn ₹15k–₹60k a month",
    body: "Set your own monthly rate. Mentors with strong outcomes consistently earn more.",
    accent: "blue",
  },
  {
    icon: CalendarCheck,
    title: "Teach from your area",
    body: "We match you with families in your city, so you don't waste hours commuting across town.",
    accent: "amber",
  },
  {
    icon: Users,
    title: "Pick your students",
    body: "See parent details, child's class, subject and goals before saying yes to any booking.",
    accent: "emerald",
  },
  {
    icon: ShieldCheck,
    title: "Paid on time, every time",
    body: "Bookings are confirmed up front. We handle invoicing and follow-ups so you focus on teaching.",
    accent: "indigo",
  },
];

const steps = [
  { n: "01", title: "Apply", body: "Fill in a short form — qualifications, subjects, area, expected fee." },
  { n: "02", title: "Verify", body: "Background check, document and credential verification, short teaching audit." },
  { n: "03", title: "Onboard", body: "Profile goes live. We start sending you matched bookings in your area." },
  { n: "04", title: "Teach & earn", body: "Run sessions, get reviewed, build a reputation, raise your fee over time." },
];

const ForMentors = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <Layout>
      <PageHero
        variant="dark"
        eyebrow="For mentors"
        title="Teach more. Earn more. Skip the chasing."
        subtitle="Homentor brings parents to you, handles payments and admin, and only sends families who match your subject and area."
        imageUrl="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80"
        imageAlt="Mentor teaching at home"
      />

      {/* Stats band */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { n: "100+", l: "Verified mentors" },
            { n: "1,000+", l: "Parent matches" },
            { n: "₹40k", l: "Avg monthly earnings" },
            { n: "4.9★", l: "Mentor rating" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-heading font-extrabold text-3xl sm:text-4xl text-homentor-ink tracking-tight">
                {s.n}
              </p>
              <p className="text-sm text-slate-500 mt-1">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-homentor-mist">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12 max-w-2xl mx-auto"
          >
            <p className="text-sm font-semibold text-homentor-blue uppercase tracking-wider">Why teach on Homentor</p>
            <h2 className="mt-2 text-3xl md:text-5xl font-heading font-bold text-homentor-ink tracking-tight leading-tight">
              Built to make teaching your full income, not a side hustle
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  className="bg-white rounded-3xl border border-slate-200 p-7 hover:border-homentor-gold hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 ${
                    b.accent === "blue" ? "bg-blue-50 text-homentor-blue" :
                    b.accent === "amber" ? "bg-amber-50 text-amber-600" :
                    b.accent === "emerald" ? "bg-emerald-50 text-emerald-600" :
                    "bg-indigo-50 text-indigo-600"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-homentor-ink">{b.title}</h3>
                  <p className="text-slate-600 mt-2 leading-relaxed">{b.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to join */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-14 max-w-2xl mx-auto"
          >
            <p className="text-sm font-semibold text-homentor-blue uppercase tracking-wider">How to join</p>
            <h2 className="mt-2 text-3xl md:text-5xl font-heading font-bold text-homentor-ink tracking-tight">
              Four steps to your first booking
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="relative bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all"
              >
                <span className="text-4xl font-heading font-extrabold text-slate-100 block leading-none mb-3">
                  {s.n}
                </span>
                <h3 className="font-heading font-bold text-lg text-homentor-ink">{s.title}</h3>
                <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4 }}
            className="mt-12 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 sm:p-12 text-white flex flex-col md:flex-row items-start md:items-center gap-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-bold text-2xl">
                Your first month, on us.
              </h3>
              <p className="mt-2 text-blue-100 max-w-2xl">
                We waive our service fee on your first month of bookings. You keep 100% of what parents pay.
              </p>
            </div>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-white text-homentor-blue font-semibold whitespace-nowrap"
            >
              Apply now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-homentor-mist">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.figure
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm"
          >
            <div className="flex items-center gap-2 text-homentor-gold mb-4">
              <TrendingUp className="w-5 h-5" />
              <span className="font-heading font-semibold text-sm uppercase tracking-wider">Mentor story</span>
            </div>
            <blockquote className="text-xl sm:text-2xl text-homentor-ink font-heading font-medium leading-snug">
              "I was teaching 4 students through WhatsApp groups and tired of chasing fees.
              Homentor brought me 11 paid bookings in my first 2 months — I didn't pitch a single parent."
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 pt-5 border-t border-slate-100">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold">
                R
              </div>
              <div>
                <p className="font-semibold text-homentor-ink">Rekha M.</p>
                <p className="text-sm text-slate-500">Mathematics Mentor · Indore</p>
              </div>
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-mesh-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight">
            Apply in 5 minutes. Teach by next week.
          </h2>
          <p className="mt-4 text-slate-300 text-lg">
            We'll review your application within 48 hours and walk you through onboarding personally.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-homentor-gold hover:bg-homentor-darkGold text-homentor-ink font-semibold shadow-xl"
            >
              Apply now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://wa.me/919203149956?text=Hi%20Homentor%2C%20I%27d%20like%20to%20become%20a%20mentor"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 h-12 px-5 rounded-xl border border-white/20 hover:bg-white/10 font-medium"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ForMentors;
