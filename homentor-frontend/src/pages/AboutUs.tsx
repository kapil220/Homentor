import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHero from "@/comp/PageHero";
import Parallax from "@/comp/Parallax";
import {
  Target,
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  Award,
  Compass,
  ArrowRight,
} from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Outcomes over hours",
    body: "We track grade movement, confidence, and exam scores — not minutes logged. Every mentor is judged on whether your child actually progressed.",
    accent: "blue",
  },
  {
    icon: HeartHandshake,
    title: "Parents are partners",
    body: "We loop you in on the plan, the progress and the gaps. No black-box tutoring sessions you only hear about at fee time.",
    accent: "amber",
  },
  {
    icon: ShieldCheck,
    title: "Safety, always",
    body: "Background checks and credential verification on every mentor. Home tuition only with adults you'd be comfortable having in your home.",
    accent: "emerald",
  },
  {
    icon: Sparkles,
    title: "Small things, done well",
    body: "Clean receipts. On-time arrivals. Fast support. Refunds on a phone call. The unglamorous details add up to trust.",
    accent: "indigo",
  },
];

const milestones = [
  { year: "2023", title: "Homentor begins", body: "Built in Indore for parents who couldn't find a tutor they trusted." },
  { year: "2024", title: "100+ verified mentors", body: "First batch of mentors onboarded across MP, after a 6-step audit." },
  { year: "2025", title: "1,000+ families served", body: "Expanded across India with home tuition and exam prep cohorts." },
  { year: "Today", title: "Free demo on every booking", body: "Every parent gets to try before they pay. Refund on the first session, no questions." },
];

function AboutUs() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <Layout>
      <PageHero
        variant="dark"
        eyebrow="About Homentor"
        title="A mentor for every child — not just a tutor for the syllabus."
        subtitle="We pair parents with verified, vetted mentors who teach the way each child actually learns. Less boilerplate, more outcomes."
        imageUrl="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80"
        imageAlt="Mentor and student studying together"
      />

      {/* Mission */}
      <section className="relative py-24 bg-white overflow-hidden">
        <Parallax
          offset={-40}
          className="absolute -top-20 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-100/60 to-amber-100/40 blur-3xl -z-10"
        >
          <div />
        </Parallax>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm font-semibold text-homentor-blue uppercase tracking-wider">Our mission</p>
              <h2 className="mt-2 text-3xl md:text-5xl font-heading font-bold text-homentor-ink tracking-tight leading-tight">
                Bring the best teachers home — and make sure they actually teach.
              </h2>
              <p className="mt-5 text-slate-600 text-lg leading-relaxed">
                Most tutoring platforms list whoever signs up. We reject 85% of applicants and audit
                the rest, because parents shouldn't have to fix a tutoring mismatch on top of everything
                else.
              </p>
              <p className="mt-4 text-slate-600 text-lg leading-relaxed">
                Our job is to find the right adult for your child's pace, style, and goals — and stay accountable
                to the outcome.
              </p>
              <Link
                to="/mentors"
                className="mt-7 inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-homentor-blue hover:bg-homentor-darkBlue text-white font-semibold shadow-lg shadow-blue-600/20"
              >
                Find a mentor
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] border border-slate-200 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80"
                  alt="Student with mentor"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl flex items-center gap-3 w-[220px]">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Acceptance rate</p>
                  <p className="font-heading font-bold text-homentor-ink">15% of applicants</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-homentor-mist">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-14 max-w-2xl mx-auto"
          >
            <p className="text-sm font-semibold text-homentor-blue uppercase tracking-wider">What we value</p>
            <h2 className="mt-2 text-3xl md:text-5xl font-heading font-bold text-homentor-ink tracking-tight">
              Four rules we don't break
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  className="group bg-white border border-slate-200 rounded-3xl p-7 hover:border-homentor-gold hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-5 ${
                    v.accent === "blue" ? "bg-blue-50 text-homentor-blue" :
                    v.accent === "amber" ? "bg-amber-50 text-amber-600" :
                    v.accent === "emerald" ? "bg-emerald-50 text-emerald-600" :
                    "bg-indigo-50 text-indigo-600"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-homentor-ink">{v.title}</h3>
                  <p className="text-slate-600 mt-2 leading-relaxed">{v.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story / Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-14 max-w-2xl mx-auto"
          >
            <p className="text-sm font-semibold text-homentor-blue uppercase tracking-wider">Our story</p>
            <h2 className="mt-2 text-3xl md:text-5xl font-heading font-bold text-homentor-ink tracking-tight">
              From one anxious parent to thousands
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-5 sm:left-1/2 -translate-x-0 sm:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className={`relative flex sm:items-center mb-10 ${
                  i % 2 === 0 ? "sm:justify-start" : "sm:justify-end"
                }`}
              >
                <div className="absolute left-5 sm:left-1/2 -translate-x-1/2 -top-1 sm:top-1/2 sm:-translate-y-1/2 w-3 h-3 rounded-full bg-homentor-blue ring-4 ring-blue-100" />
                <div className={`pl-12 sm:pl-0 ${i % 2 === 0 ? "sm:pr-[52%]" : "sm:pl-[52%]"} sm:w-full`}>
                  <span className="text-xs font-semibold text-homentor-blue uppercase tracking-wider">{m.year}</span>
                  <h3 className="font-heading font-bold text-xl text-homentor-ink mt-1">{m.title}</h3>
                  <p className="text-slate-600 mt-1.5 leading-relaxed">{m.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-24 bg-homentor-mist">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center gap-8"
          >
            <div className="shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-homentor-blue to-indigo-600 text-white flex items-center justify-center font-heading font-extrabold text-4xl shadow-xl">
                PP
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold text-homentor-blue uppercase tracking-wider">Founder</p>
              <h3 className="mt-1 font-heading font-bold text-2xl text-homentor-ink">Prashant Pansey</h3>
              <p className="text-slate-500 text-sm">Founder & CEO</p>
              <blockquote className="mt-5 text-slate-700 leading-relaxed">
                "I started Homentor because no parent should have to gamble on their child's tutor.
                If we won't put a mentor in front of our own kids, they don't make it onto the platform."
              </blockquote>
              <div className="mt-5 inline-flex items-center gap-2 text-sm text-homentor-blue font-medium">
                <Compass className="w-4 h-4" />
                Based in Indore · Working across India
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-mesh-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.4 }}
            className="text-3xl md:text-5xl font-heading font-bold tracking-tight"
          >
            Ready to find the right mentor?
          </motion.h2>
          <p className="mt-4 text-slate-300 text-lg">
            Free demo class · 100% refund on the first session · No card upfront.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/mentors"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-homentor-gold hover:bg-homentor-darkGold text-homentor-ink font-semibold shadow-xl"
            >
              Find a mentor
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact-us"
              className="inline-flex items-center h-12 px-5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-medium"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default AboutUs;
