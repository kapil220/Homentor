
import React, { useEffect, useRef, useState } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  description?: string;
  items: FAQItem[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ 
  title = "Frequently Asked Questions", 
  description = "Find answers to common questions about Homentor", 
  items 
}) => {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
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

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background decorative elements with parallax */}
      <div 
        className="absolute -top-20 -right-20 h-64 w-64 bg-homentor-lightBlue rounded-full opacity-30 -z-10"
        style={{ transform: `translateY(${scrollY * 0.05}px)` }}
      />
      <div 
        className="absolute bottom-0 left-0 h-48 w-48 bg-homentor-lightGold rounded-full opacity-20 -z-10"
        style={{ transform: `translateY(${scrollY * -0.08}px)` }}
      />
      
      <div className="container-tight">
        <div 
          className="text-center mb-12 scroll-reveal"
          ref={(el) => {
            if (el && inView) {
              el.classList.add('revealed');
            }
          }}
        >
          <h2 className="section-heading relative inline-block">
            {title}
            <span className="absolute -z-10 bottom-2 left-0 h-3 bg-homentor-lightBlue opacity-30 w-full"></span>
          </h2>
          <p className="section-subheading">{description}</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {items.map((item, index) => (
            <Collapsible
              key={index}
              open={!!openItems[index]}
              onOpenChange={() => toggleItem(index)}
              className="glassmorphism rounded-xl shadow-soft border border-gray-100 overflow-hidden scroll-reveal"
              style={{ transitionDelay: `${index * 0.1}s` }}
              ref={(el) => {
                if (el && inView) {
                  el.classList.add('revealed');
                }
              }}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-4 text-left group">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-homentor-blue transition-colors">{item.question}</h3>
                <div className="bg-homentor-lightBlue rounded-full p-1 flex-shrink-0 transition-transform duration-300 transform group-hover:bg-homentor-blue group-hover:text-white">
                  {openItems[index] ? (
                    <ChevronUp className="h-5 w-5 text-homentor-blue group-hover:text-white" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-homentor-blue group-hover:text-white" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="overflow-hidden transition-all duration-300">
                <div className="px-6 pb-4 pt-2 text-gray-600">
                  <p>{item.answer}</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
