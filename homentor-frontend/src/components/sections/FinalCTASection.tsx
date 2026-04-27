import { motion } from "framer-motion";
import { Phone, MessageCircle, Sparkles } from "lucide-react";
import LeadCaptureForm from "@/comp/LeadCaptureForm";

const FinalCTASection = () => {
  return (
    <section
      id="final-cta"
      className="relative py-20 overflow-hidden bg-gradient-to-br from-homentor-blue via-[#0a86d8] to-homentor-darkBlue"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:24px_24px]"
      />
      <div
        aria-hidden
        className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-amber-400/20 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-7 text-white"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full bg-white/15 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              Free demo · No commitment
            </span>
            <h2 className="mt-4 text-3xl md:text-5xl font-heading font-bold tracking-tight leading-tight">
              Book a free demo class this week
            </h2>
            <p className="mt-4 text-blue-100 max-w-xl text-lg">
              Tell us your child's class and a phone number — we'll match you with a verified mentor and confirm a demo within 24 hours.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="tel:+919203149956"
                className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-white text-homentor-blue font-semibold hover:bg-amber-50 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call +91 9203149956
              </a>
              <a
                href="https://wa.me/919203149956?text=Hi%20Homentor%2C%20I%27d%20like%20to%20book%20a%20free%20demo"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp us
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <LeadCaptureForm source="landing-final-cta" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
