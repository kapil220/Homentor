
import React, { useEffect, useRef, useState } from 'react';

interface ParallaxWrapperProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  style?: React.CSSProperties;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

const ParallaxWrapper: React.FC<ParallaxWrapperProps> = ({
  children,
  speed = 0.05,
  direction = 'up',
  className = '',
  style = {},
  easing = 'ease-out',
}) => {
  const [scrollY, setScrollY] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [elementTop, setElementTop] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  
  // Update element position and window dimensions
  useEffect(() => {
    const updatePosition = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setElementTop(rect.top + window.scrollY);
      }
      setWindowHeight(window.innerHeight);
    };
    
    // Initial position
    updatePosition();
    
    // Update on resize
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check if element is in view with buffer zone
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const buffer = windowHeight * 0.5; // 50% buffer for smoother transitions
        const isInView = rect.top < windowHeight + buffer && rect.bottom > -buffer;
        
        if (isInView !== inView) {
          setInView(isInView);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on initial render
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [inView, windowHeight]);
  
  // Calculate parallax offset based on the element's position in the viewport
  const getParallaxOffset = () => {
    if (!inView) return 0;
    
    // Calculate how far the element is from the center of the viewport
    const viewportCenter = scrollY + windowHeight / 2;
    const elementCenter = elementTop + (elementRef.current?.offsetHeight || 0) / 2;
    const distanceFromCenter = viewportCenter - elementCenter;
    
    // Apply direction to the translation
    switch (direction) {
      case 'up': return -distanceFromCenter * speed;
      case 'down': return distanceFromCenter * speed;
      case 'left': return -distanceFromCenter * speed;
      case 'right': return distanceFromCenter * speed;
      default: return -distanceFromCenter * speed;
    }
  };
  
  const parallaxOffset = getParallaxOffset();
  const transform = inView
    ? direction === 'left' || direction === 'right'
      ? `translateX(${parallaxOffset}px)`
      : `translateY(${parallaxOffset}px)`
    : '';
  
  return (
    <div
      ref={elementRef}
      className={`transform will-change-transform ${className}`}
      style={{
        ...style,
        transform,
        transition: `transform 0.1s ${easing}`,
      }}
    >
      {children}
    </div>
  );
};

export default ParallaxWrapper;
