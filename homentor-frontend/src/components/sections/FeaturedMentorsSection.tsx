
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import ParallaxWrapper from '@/components/ParallaxWrapper';
import TornCard from '../TornCard';

const FeaturedMentorsSection = () => {
  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background parallax elements */}
      <ParallaxWrapper speed={0.04} className="absolute top-20 left-10 w-64 h-64 bg-homentor-lightBlue rounded-full opacity-20 -z-10" easing="ease-out">
        <div></div>
      </ParallaxWrapper>
      <ParallaxWrapper speed={0.06} direction="down" className="absolute bottom-40 right-20 w-80 h-80 bg-homentor-lightGold rounded-full opacity-20 -z-10" easing="ease-out">
        <div></div>
      </ParallaxWrapper>
      
      <div className="container-tight">
        <ScrollReveal className="text-center mb-12">
          <h2 className="section-heading relative inline-block">
            Featured Mentors
            <span className="absolute -z-10 bottom-2 left-0 h-3 bg-homentor-blue opacity-30 w-full"></span>
          </h2>
          <p className="section-subheading">
            Discover some of our top-rated mentors
          </p>
        </ScrollReveal>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* {[1, 2, 3].map((index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <TornCard></TornCard>
            </ScrollReveal>
          ))} */}
        </div>
        
        <div className="text-center mt-12">
          <ScrollReveal delay={0.4}>
            <Link to="/mentors">
              <Button className="bg-homentor-gold text-homentor-charcoal hover:bg-homentor-darkGold shadow-soft hover:shadow-hover transform transition-all duration-300 hover:-translate-y-1">
                Browse All Mentors
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default FeaturedMentorsSection;
