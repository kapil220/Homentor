import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ScrollReveal';

const SubjectsSection = () => {
  const subjects = [
    "Mathematics", 
    "Physics", 
    "Chemistry", 
    "Biology", 
    "English", 
    "History",
    "Geography",
    "Computer Science",
    "Foreign Languages",
    "Music",
    "Art",
    "Economics"
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <h2 className="section-heading relative inline-block">
            Explore Subjects
            <span className="absolute -z-10 bottom-2 left-0 h-3 bg-homentor-lightGold opacity-50 w-full"></span>
          </h2>
          <p className="section-subheading">
            Find mentors for a wide range of subjects
          </p>
        </ScrollReveal>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {subjects.map((subject, index) => (
            <ScrollReveal key={subject} delay={index * 0.05}>
              <Link 
                to={`/mentors?subject=${encodeURIComponent(subject)}`} 
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 text-center shadow-soft hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-1 hover:bg-homentor-lightBlue group min-h-[80px] flex items-center justify-center"
              >
                <span className="text-gray-900 group-hover:text-homentor-blue transition-colors text-sm sm:text-base font-medium">
                  {subject}
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;
