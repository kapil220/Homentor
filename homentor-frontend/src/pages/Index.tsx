import { useEffect } from "react";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import TrustStripSection from "@/components/sections/TrustStripSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import FeaturedMentorsSection from "@/components/sections/FeaturedMentorsSection";
import OutcomesSection from "@/components/sections/OutcomesSection";
import SubjectsSection from "@/components/sections/SubjectsSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import FinalCTASection from "@/components/sections/FinalCTASection";
import StickyLeadButton from "@/comp/StickyLeadButton";
import MarqueeStrip from "@/comp/MarqueeStrip";

const heroMarquee = [
  "100+ Verified Mentors",
  "CBSE · ICSE · State Boards",
  "JEE & NEET Prep",
  "Free Demo Class",
  "100% Refund Guarantee",
  "Home Tuition Across India",
  "1,000+ Happy Parents",
  "Switch Mentors Anytime",
];

const subjectsMarquee = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Hindi",
  "Social Science",
  "Computer Science",
  "Economics",
  "Accounts",
  "Business Studies",
];

const faqItems = [
  {
    question: "How much does tutoring cost?",
    answer:
      "Each mentor sets their own monthly fee based on subject and experience — you see the exact amount on every mentor's profile before you book. The free demo class is always included; you only pay if you decide to continue.",
  },
  {
    question: "Is there a guarantee for satisfaction?",
    answer:
      "Yes — 100% refund on the first paid session if it isn't a fit. No emails or forms; one phone call and we sort it.",
  },
  {
    question: "How does Homentor select its mentors?",
    answer:
      "Every applicant goes through background checks, credential verification and a teaching audit. Only about 15% are accepted onto the platform.",
  },
  {
    question: "Can I change my mentor if I'm not satisfied?",
    answer:
      "Absolutely. Tell us and we'll match you with someone new at no extra cost. We track switches as a quality signal.",
  },
  {
    question: "Is Homentor available for all grade levels?",
    answer:
      "We cover Class 1 through Class 12 plus competitive exam prep, across most major subjects. If you don't see your subject in the list, ask — we likely have a mentor for it.",
  },
];

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout fullWidth={true}>
      <HeroSection />
      <MarqueeStrip items={heroMarquee} variant="dark" />

      <TrustStripSection />
      <HowItWorksSection />
      <FeaturedMentorsSection />
      <OutcomesSection />

      <MarqueeStrip items={subjectsMarquee} variant="light" />

      <SubjectsSection />
      <FeaturesSection />
      <ComparisonSection />
      <TestimonialsSection />
      <FAQSection items={faqItems} />
      <FinalCTASection />

      <StickyLeadButton />
    </Layout>
  );
};

export default Index;
