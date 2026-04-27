import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/comp/PageHero";
import { Phone, Mail, MapPin, MessageCircle, Loader2, CheckCircle2, Clock } from "lucide-react";

const ContactCard = ({
  icon,
  label,
  value,
  href,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  accent: string;
}) => {
  const inner = (
    <>
      <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${accent} mb-4`}>
        {icon}
      </div>
      <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{label}</p>
      <p className="mt-1 font-heading font-semibold text-lg text-homentor-ink break-words">{value}</p>
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        className="block bg-white border border-slate-200 rounded-2xl p-6 hover:border-homentor-blue hover:shadow-lg transition-all"
      >
        {inner}
      </a>
    );
  }
  return <div className="bg-white border border-slate-200 rounded-2xl p-6">{inner}</div>;
};

function ContactUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ duplicate?: boolean } | null>(null);
  const [error, setError] = useState("");

  const validPhone = /^[6-9]\d{9}$/.test(phone);
  const canSubmit = name.trim().length > 1 && validPhone;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setError("Please enter your name and a valid 10-digit phone number.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/parent-leads`,
        {
          fullName: name.trim(),
          phone: phone.trim(),
          additionalDetails: `contact-page${message ? ` — ${message.trim()}` : ""}`,
        }
      );
      setSuccess({ duplicate: !!res.data?.duplicate });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong. Please try calling us.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <PageHero
        variant="dark"
        eyebrow="Get in touch"
        title="We're a phone call away — and we actually pick up."
        subtitle="Tell us what you need. Most parents hear back within 30 minutes during working hours."
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Contact details */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5 space-y-4"
            >
              <ContactCard
                icon={<Phone className="w-5 h-5" />}
                label="Phone"
                value="+91 9203149956"
                href="tel:+919203149956"
                accent="bg-blue-50 text-homentor-blue"
              />
              <ContactCard
                icon={<MessageCircle className="w-5 h-5" />}
                label="WhatsApp"
                value="Chat with our team"
                href="https://wa.me/919203149956?text=Hi%20Homentor"
                accent="bg-emerald-50 text-emerald-600"
              />
              <ContactCard
                icon={<Mail className="w-5 h-5" />}
                label="Email"
                value="homentorindia@gmail.com"
                href="mailto:homentorindia@gmail.com"
                accent="bg-amber-50 text-amber-600"
              />
              <ContactCard
                icon={<MapPin className="w-5 h-5" />}
                label="Office"
                value="22 — Scheme No. 54, PU-4, Vijay Nagar, Indore — 452010, MP"
                accent="bg-indigo-50 text-indigo-600"
              />

              <div className="bg-homentor-mist rounded-2xl p-5 flex items-start gap-3 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-white text-homentor-blue inline-flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-homentor-ink">Working hours</p>
                  <p className="text-sm text-slate-600 mt-0.5">Mon — Sat · 9:00 AM to 8:00 PM IST</p>
                  <p className="text-xs text-slate-500 mt-0.5">We respond on Sundays for booked demos only.</p>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-7"
            >
              <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-200 p-7 sm:p-9">
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      key="ok"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-10"
                    >
                      <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-heading font-bold text-homentor-ink">
                        {success.duplicate ? "We have your details" : "Got it — we'll be in touch"}
                      </h3>
                      <p className="text-slate-600 mt-2 max-w-md mx-auto">
                        {success.duplicate
                          ? "Our team will reach out to you within a day."
                          : "Expect a call from our team within 30 minutes during working hours."}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={submit}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-5"
                      noValidate
                    >
                      <div>
                        <p className="text-xs font-semibold text-homentor-blue uppercase tracking-wider">
                          Send a message
                        </p>
                        <h2 className="mt-1 text-2xl sm:text-3xl font-heading font-bold text-homentor-ink leading-tight">
                          Tell us what you need — we'll handle the rest.
                        </h2>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">
                            Your name
                          </label>
                          <input
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full name"
                            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-homentor-blue focus:border-transparent transition"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-600 mb-1.5">
                            Phone
                          </label>
                          <div className="flex items-stretch h-12 rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-homentor-blue focus-within:border-transparent transition">
                            <span className="px-4 inline-flex items-center text-sm font-medium text-slate-500 border-r border-slate-200">
                              +91
                            </span>
                            <input
                              type="tel"
                              inputMode="tel"
                              autoComplete="tel-national"
                              placeholder="10-digit number"
                              value={phone}
                              onChange={(e) =>
                                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                              }
                              className="flex-1 px-4 bg-transparent focus:outline-none"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">
                          Message <span className="text-slate-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                          rows={5}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Tell us what you're looking for — class, subject, location, anything else."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-homentor-blue focus:border-transparent transition resize-none"
                        />
                      </div>

                      {error && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full h-12 bg-homentor-blue hover:bg-homentor-darkBlue text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 inline-flex items-center justify-center"
                      >
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send message"}
                      </button>

                      <p className="text-[11px] text-slate-500 text-center">
                        Or call us directly at{" "}
                        <a href="tel:+919203149956" className="text-homentor-blue font-medium hover:underline">
                          +91 9203149956
                        </a>
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default ContactUs;
