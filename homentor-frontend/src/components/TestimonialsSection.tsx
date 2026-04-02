
import React, { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  content: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}

interface TestimonialsSectionProps {
  title?: string;
  description?: string;
  testimonials: Testimonial[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  title = "What Our Students Say",
  description = "Read what students and parents have to say about their experience with Homentor",
  testimonials
}) => {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check if section is in view
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInView && !inView) {
          setInView(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on initial render
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [inView]);

  // Calculate parallax effect for section elements
  const getParallaxStyle = (speed: number, direction: 'up' | 'down' = 'up') => {
    if (!inView) return {};
    const factor = direction === 'up' ? -1 : 1;
    return {
      transform: `translateY(${scrollY * speed * factor}px)`,
    };
  };

  return (
    <section ref={sectionRef} className="py-20 bg-white relative overflow-hidden">
      {/* Decorative parallax elements */}
      <div
        className="absolute top-0 left-10 w-40 h-40 bg-homentor-lightBlue rounded-full opacity-20 -z-10"
        style={getParallaxStyle(0.05)}
      />
      <div
        className="absolute bottom-20 right-20 w-64 h-64 bg-homentor-lightGold rounded-full opacity-20 -z-10"
        style={getParallaxStyle(0.08, 'down')}
      />
      
      {/* Top wave divider */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none transform rotate-180 translate-y-1">
        <svg className="relative block w-full h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
            fill="white"
            style={{ filter: "drop-shadow(0px -2px 4px rgba(0,0,0,0.05))" }}
          ></path>
        </svg>
      </div>
      
      <div className="container-tight">
        <div 
          className="text-center mb-16 scroll-reveal"
          ref={(el) => {
            if (el && inView) {
              el.classList.add('revealed');
            }
          }}
        >
          <h2 className="section-heading relative inline-block">
            {title}
            <span className="absolute -z-10 bottom-2 left-0 h-3 bg-homentor-lightGold opacity-40 w-full"></span>
          </h2>
          <p className="section-subheading">{description}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="testimonial-card overflow-hidden glassmorphism hover:bg-white scroll-reveal"
              style={{ transitionDelay: `${index * 0.1}s` }}
              ref={(el) => {
                if (el && inView) {
                  el.classList.add('revealed');
                }
              }}
            >
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star 
                      key={starIndex} 
                      className={`h-5 w-5 ${
                        starIndex < testimonial.rating 
                          ? 'fill-current text-homentor-gold' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic relative">
                  <span className="absolute -left-2 -top-2 text-4xl text-homentor-lightGold opacity-30">"</span>
                  {testimonial.content}
                  <span className="absolute -right-2 bottom-0 text-4xl text-homentor-lightGold opacity-30">"</span>
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4 border-2 border-white shadow-md">
                    {/* <img 
                      src={testimonial.avatar} 
                      alt={`${testimonial.author} avatar`}
                      className="w-full h-full object-cover"
                    /> */}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none transform translate-y-1">
        <svg className="relative block w-full h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" 
            fill="white"
            style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.05))" }}
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default TestimonialsSection;
