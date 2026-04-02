import React from 'react';
import { useTypingAnimation } from '../hooks/useTypingAnimation';

interface AnimatedSelectPlaceholderProps {
  text: string;
  className?: string;
}

const AnimatedSelectPlaceholder: React.FC<AnimatedSelectPlaceholderProps> = ({ 
  text, 
  className = "" 
}) => {

const animatedText = useTypingAnimation(text, 150, 5000);
  
  return (
    <span className={`${className}`}>
      {animatedText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

export default AnimatedSelectPlaceholder;
