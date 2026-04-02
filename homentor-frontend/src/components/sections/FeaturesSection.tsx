
import React from 'react';
import { Book, Shield, Zap } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="container-tight">
        <ScrollReveal className="text-center mb-12">
          <h2 className="section-heading relative inline-block">
            Why Choose Homentor
            <span className="absolute -z-10 bottom-2 left-0 h-3 bg-homentor-gold opacity-40 w-full"></span>
          </h2>
          <p className="section-subheading">
            We offer a superior tutoring experience with these key benefits
          </p>
        </ScrollReveal>
        
        <div className="grid md:grid-cols-3 gap-8">
          <ScrollReveal delay={0.1}>
            <div className="p-6 rounded-xl bg-gradient-to-br from-homentor-lightBlue to-white shadow-soft hover:shadow-hover transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-white rounded-full p-3 inline-block mb-4 shadow-md">
                <Shield className="h-8 w-8 text-homentor-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Mentors</h3>
              <p className="text-gray-700">
                All our mentors undergo thorough background checks and credential verification to ensure quality and safety.
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <div className="p-6 rounded-xl bg-gradient-to-br from-homentor-lightGold to-white shadow-soft hover:shadow-hover transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-white rounded-full p-3 inline-block mb-4 shadow-md">
                <Zap className="h-8 w-8 text-homentor-gold" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Personalized Learning</h3>
              <p className="text-gray-700">
                Customized learning plans designed around your specific goals, learning style, and pace.
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={0.3}>
            <div className="p-6 rounded-xl bg-gradient-to-br from-homentor-lightBlue to-white shadow-soft hover:shadow-hover transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-white rounded-full p-3 inline-block mb-4 shadow-md">
                <Book className="h-8 w-8 text-homentor-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Comprehensive Subjects</h3>
              <p className="text-gray-700">
                From mathematics and science to languages and test prep, we cover all academic subjects.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
