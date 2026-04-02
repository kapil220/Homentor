
import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  className?: string;
  onComplete?: () => void;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  start = 0,
  duration = 2000,
  delay = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  easing = 'easeOut',
  className = '',
  onComplete,
}) => {
  const [count, setCount] = useState(start);
  const countRef = useRef<HTMLSpanElement>(null);
  const [isInView, setIsInView] = useState(false);
  const hasAnimated = useRef(false);
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );
    
    if (countRef.current) {
      observer.observe(countRef.current);
    }
    
    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);
  
  // Easing functions
  const easingFunctions = {
    linear: (t: number) => t,
    easeIn: (t: number) => t * t,
    easeOut: (t: number) => t * (2 - t),
    easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  };
  
  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      
      let startTime: number;
      let animation: number | null = null;
      
      // Delay the animation if needed
      setTimeout(() => {
        const animate = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const easedProgress = easingFunctions[easing](progress);
          const currentValue = start + (end - start) * easedProgress;
          
          setCount(currentValue);
          
          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate);
          } else {
            setCount(end);
            if (onComplete) onComplete();
            animationRef.current = null;
          }
        };
        
        animation = requestAnimationFrame(animate);
        animationRef.current = animation;
      }, delay);
      
      return () => {
        if (animation) cancelAnimationFrame(animation);
      };
    }
  }, [isInView, start, end, duration, delay, easing, onComplete]);
  
  // Format the number with correct decimals
  const formattedCount = count.toFixed(decimals);
  
  return (
    <span ref={countRef} className={className}>
      {prefix}
      {formattedCount}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
