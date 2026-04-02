
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ScrollReveal from '@/components/ScrollReveal';
import ParallaxWrapper from '@/components/ParallaxWrapper';

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-blue-50 relative overflow-hidden ">
      {/* SVG wave divider - top */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none transform rotate-180 translate-y-1">
        <svg className="relative block w-full h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
            fill="white"
          ></path>
        </svg>
      </div>
      
      {/* Background decorative elements */}
      <ParallaxWrapper speed={0.03} className="absolute top-40 right-10 w-60 h-60 bg-homentor-lightBlue rounded-full opacity-30 -z-10" easing="ease-out">
        <div></div>
      </ParallaxWrapper>
      <ParallaxWrapper speed={0.05} direction="down" className="absolute bottom-20 left-10 w-40 h-40 bg-homentor-lightGold rounded-full opacity-30 -z-10" easing="ease-out">
        <div></div>
      </ParallaxWrapper>
      
      <div className="container-tight my-10  relative z-10">
        <ScrollReveal className="text-center mb-12" cascade={true} cascadeDelay={0.1}>
          <h2 className="section-heading relative inline-block">
            How Homentor Works
            <span className="absolute -z-10 bottom-2 left-0 h-3 bg-homentor-lightBlue opacity-40 w-full"></span>
          </h2>
          <p className="section-subheading">
            Find the perfect mentor in just a few simple steps
          </p>
        </ScrollReveal>
        
        <div className="grid md:grid-cols-3 gap-8">
          <ScrollReveal delay={0.1} distance={40}>
            <Card className="card-hover border-none glassmorphism">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="feature-icon">
                    <Search className="h-8 w-8 text-homentor-blue" />
                  </div>
                  <Badge variant="blue" className="mb-3">Step 1</Badge>
                  <h3 className="text-xl font-semibold mb-3">Find a Mentor</h3>
                  <p className="text-gray-600">
                    Search and filter through our database of verified tutors based on subject, location, and budget.
                  </p>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2} distance={40}>
            <Card className="card-hover border-none glassmorphism">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="feature-icon">
                    <Calendar className="h-8 w-8 text-homentor-blue" />
                  </div>
                  <Badge variant="blue" className="mb-3">Step 2</Badge>
                  <h3 className="text-xl font-semibold mb-3">Book a Session</h3>
                  <p className="text-gray-600">
                    Schedule a session with your chosen mentor at a time and place that works for you.
                  </p>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
          
          <ScrollReveal delay={0.3} distance={40}>
            <Card className="card-hover border-none glassmorphism">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="feature-icon">
                    <User className="h-8 w-8 text-homentor-blue" />
                  </div>
                  <Badge variant="blue" className="mb-3">Step 3</Badge>
                  <h3 className="text-xl font-semibold mb-3">Learn & Grow</h3>
                  <p className="text-gray-600">
                    Enjoy personalized learning experiences that help you achieve your academic goals.
                  </p>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
        
        {/* <div className="text-center mt-12">
          <ScrollReveal delay={0.4}>
            <Link to="/how-it-works">
              <Button variant="outline" className="border-homentor-blue text-homentor-blue hover:bg-homentor-lightBlue transform transition-all duration-300 hover:-translate-y-1">
                Learn More About Our Process
              </Button>
            </Link>
          </ScrollReveal>
        </div> */}
      </div>
      
      {/* SVG wave divider - bottom */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none transform translate-y-1">
        <svg className="relative block w-full h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
            fill="white"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HowItWorksSection;
