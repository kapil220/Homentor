import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

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
  "Economics",
];

const SubjectsSection = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12 max-w-2xl mx-auto">
          <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            Subjects
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Mentors for every subject
          </h2>
          <p className="mt-3 text-slate-600">
            Browse by subject or open the mentor directory for the full list.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {subjects.map((subject, index) => (
            <ScrollReveal key={subject} delay={index * 0.03}>
              <Link
                to={`/mentors?subject=${encodeURIComponent(subject)}`}
                className="group flex items-center justify-between rounded-xl bg-white border border-slate-200 px-4 py-3 hover:border-homentor-blue hover:shadow-md transition-all duration-200"
              >
                <span className="text-sm font-medium text-slate-800 group-hover:text-homentor-blue">
                  {subject}
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-homentor-blue transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/mentors"
            className="inline-flex items-center gap-2 text-sm font-medium text-homentor-blue hover:text-homentor-darkBlue"
          >
            Browse all mentors
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SubjectsSection;
