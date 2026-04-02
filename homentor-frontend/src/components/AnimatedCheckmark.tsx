import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

const AnimatedCheckmark = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {/* Ripple effect */}
      <div className={`absolute inset-0 rounded-full bg-green-200 ${isVisible ? 'animate-ping' : 'opacity-0'}`}></div>
      <div className={`absolute inset-0 rounded-full bg-green-300 ${isVisible ? 'animate-ping' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}></div>
      
      {/* Main checkmark */}
      <div className={`relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-4 shadow-lg transform transition-all duration-700 ${isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
        <CheckCircle className="w-16 h-16 text-white" />
      </div>
    </div>
  );
};

export default AnimatedCheckmark;