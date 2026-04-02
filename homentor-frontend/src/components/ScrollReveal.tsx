
import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  scale?: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  className?: string;
  style?: React.CSSProperties;
  threshold?: number;
  once?: boolean;
  cascade?: boolean;
  cascadeDelay?: number;
  rootMargin?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  duration = 0.8,
  direction = 'up',
  distance = 30,
  scale = 1,
  easing = 'ease-out',
  className = '',
  style = {},
  threshold = 0.1,
  once = true,
  cascade = false,
  cascadeDelay = 0.1,
  rootMargin = '0px 0px -100px 0px',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // If once is true, unobserve after revealing
          if (once && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, rootMargin, once]);
  
  // Determine initial transform based on direction and scale
  const getInitialTransform = () => {
    let transform = '';
    
    // Apply scale if different from 1
    if (scale !== 1) {
      transform += `scale(${isVisible ? 1 : scale}) `;
    }
    
    // Apply directional translation
    if (direction !== 'none') {
      switch (direction) {
        case 'up': transform += `translateY(${isVisible ? 0 : distance}px)`; break;
        case 'down': transform += `translateY(${isVisible ? 0 : -distance}px)`; break;
        case 'left': transform += `translateX(${isVisible ? 0 : distance}px)`; break;
        case 'right': transform += `translateX(${isVisible ? 0 : -distance}px)`; break;
        default: transform += `translateY(${isVisible ? 0 : distance}px)`;
      }
    }
    
    return transform;
  };
  
  // Apply cascade effect to children if needed
  const renderChildren = () => {
    if (!cascade || !React.Children.count(children)) {
      return children;
    }
    
    return React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child;
      
      const cascadeDelayValue = delay + (index * cascadeDelay);
      
      return React.cloneElement(child as React.ReactElement<any>, {
        style: {
          ...(child.props.style || {}),
          transitionDelay: `${cascadeDelayValue}s`,
          opacity: isVisible ? 1 : 0,
          transition: `opacity ${duration}s ${easing}, transform ${duration}s ${easing}`,
        },
      });
    });
  };
  
  const revealStyles: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: getInitialTransform(),
    transition: `opacity ${duration}s ${easing}, transform ${duration}s ${easing}`,
    transitionDelay: !cascade ? `${delay}s` : '0s',
    willChange: 'opacity, transform',
    ...style,
  };
  
  return (
    <div
      ref={elementRef}
      className={className}
      style={revealStyles}
    >
      {cascade ? renderChildren() : children}
    </div>
  );
};

export default ScrollReveal;
