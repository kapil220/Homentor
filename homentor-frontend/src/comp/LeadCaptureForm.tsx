import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";

type Variant = "card" | "inline";

const CLASS_OPTIONS = [
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "Class 11", "Class 12", "Other",
];

const SUBJECT_OPTIONS = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "English", "Hindi", "Social Science", "Computer", "Other",
];

type Props = {
  variant?: Variant;
  source?: string;
};

const LeadCaptureForm = ({ variant = "card", source = "landing-hero" }: Props) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [classes, setClasses] = useState("");
  const [subjects, setSubjects] = useState("");
  const [area, setArea] = useState("");
  const [showOptional, setShowOptional] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ duplicate?: boolean } | null>(null);
  const [error, setError] = useState("");

  const validPhone = /^[6-9]\d{9}$/.test(phone);
  const canSubmit = name.trim().length > 1 && validPhone && classes;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setError("Please fill name, a valid 10-digit mobile number and your child's class.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const payload: any = {
        fullName: name.trim(),
        phone: phone.trim(),
        classes,
        additionalDetails: source,
      };
      if (subjects) payload.subjects = subjects;
      if (area) payload.location = { area };
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/parent-leads`,
        payload
      );
      setSuccess({ duplicate: !!res.data?.duplicate });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please call us at +91 9203149956."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const baseClasses =
    variant === "card"
      ? "bg-white/95 backdrop-blur rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-200 p-6 sm:p-7"
      : "bg-white/80 backdrop-blur rounded-2xl border border-slate-200 p-6 sm:p-8";

  return (
    <div className={baseClasses}>
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-6"
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-homentor-ink">
              {success.duplicate ? "We already have your details" : "Thanks! We'll call you shortly"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {success.duplicate
                ? "Our team will reach out to you within a day."
                : "Expect a call from our team within 30 minutes."}
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
            noValidate
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-homentor-blue uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              Free demo · No commitment
            </div>

            <h3 className="text-xl sm:text-2xl font-heading font-semibold text-homentor-ink leading-tight">
              Get matched with the right mentor
            </h3>

            <div className="space-y-3">
              <div>
                <label htmlFor="lead-name" className="sr-only">Full name</label>
                <input
                  id="lead-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Parent's full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-homentor-blue focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="lead-phone" className="sr-only">Phone</label>
                <div className="flex items-stretch h-12 rounded-xl border border-slate-200 bg-white focus-within:ring-2 focus-within:ring-homentor-blue focus-within:border-transparent transition">
                  <span className="px-4 inline-flex items-center text-sm font-medium text-slate-500 border-r border-slate-200">
                    +91
                  </span>
                  <input
                    id="lead-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="flex-1 px-4 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    required
                  />
                </div>
                {phone.length > 0 && !validPhone && (
                  <p className="text-xs text-amber-600 mt-1">Enter a valid 10-digit number</p>
                )}
              </div>

              <div>
                <label htmlFor="lead-class" className="sr-only">Child's class</label>
                <select
                  id="lead-class"
                  value={classes}
                  onChange={(e) => setClasses(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-homentor-blue focus:border-transparent transition"
                  required
                >
                  <option value="">Child's class</option>
                  {CLASS_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setShowOptional((v) => !v)}
                className="text-xs text-homentor-blue font-medium hover:underline"
              >
                {showOptional ? "Hide optional details" : "Add subject / area (optional)"}
              </button>

              <AnimatePresence>
                {showOptional && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 overflow-hidden"
                  >
                    <select
                      value={subjects}
                      onChange={(e) => setSubjects(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-homentor-blue"
                    >
                      <option value="">Subject (optional)</option>
                      {SUBJECT_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Area / locality (optional)"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-homentor-blue"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-homentor-blue hover:bg-homentor-darkBlue text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 text-base"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Book a free demo"
              )}
            </Button>

            <p className="text-[11px] text-slate-500 text-center">
              By submitting you agree to be contacted by our team. No spam, promise.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeadCaptureForm;
