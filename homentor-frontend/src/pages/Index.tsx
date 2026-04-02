
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/sections/StatsSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import SubjectsSection from '@/components/sections/SubjectsSection';
import FAQSection from '@/components/FAQSection';


const faqItems = [
  {
    question: "How does Homentor select its mentors?",
    answer: "All mentors on Homentor go through a rigorous verification process that includes background checks, academic credential verification, and teaching ability assessments. Only about 15% of applicants are accepted to ensure the highest quality of instruction."
  },
  {
    question: "Is Homentor available for all grade levels?",
    answer: "Yes, Homentor offers tutoring for students from elementary school through university level. Our mentors specialize in various subjects and age groups, so you can find the perfect match for your specific needs."
  },
  {
    question: "Can I change my mentor if I'm not satisfied?",
    answer: "Absolutely! If you feel your current mentor isn't the right fit, you can request a change at any time. Our goal is to ensure you have the best learning experience possible."
  },
  {
    question: "How much does tutoring cost?",
    answer: "Tutoring rates vary depending on the subject, level, and mentor experience. You can view each mentor's hourly rate on their profile. We offer packages that provide discounted rates for multiple sessions."
  },
  {
    question: "Is there a guarantee for satisfaction?",
    answer: "Yes, we offer a 100% satisfaction guarantee for your first session with any mentor. If you're not completely satisfied, we'll refund that session and help you find a better match."
  }
];

const Index = () => {

   useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  return (
    <Layout fullWidth={true}>
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection /> 

      {/* How It Works */}
      <HowItWorksSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Featured Mentors */}
      {/* <FeaturedMentorsSection /> */}

      {/* Subjects */}
      <SubjectsSection />

      {/* FAQ Section */}
      <FAQSection items={faqItems} />
    </Layout>
  );
};

export default Index;
