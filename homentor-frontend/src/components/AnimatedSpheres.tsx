import React, { useEffect, useRef } from "react";

interface KeyPointSphere {
  title: string;
  content: string;
  color: string;
  size: number;
  position: {
    left: string;
    top: string;
  };
  delay: number;
  duration: number;
}

interface AnimatedSpheresProps {
  keyPoints?: KeyPointSphere[];
}

const defaultKeyPoints: KeyPointSphere[] = [
  {
    title: "HOME TUTOR",
    content: "Personalized one-on-one learning at home",
    color: "blue",
    size: 160,
    position: { left: "10%", top: "15%" },
    delay: 0,
    duration: 20,
  },
  {
    title: "School & College Teachers",
    content: "Experienced educators from top institutions",
    color: "gold",
    size: 170,
    position: { left: "65%", top: "45%" },
    delay: 2, 
    duration: 25,
  },
  {
    title: "Coaching & Counsellor",
    content: "Academic guidance and emotional support",
    color: "blue",
    size: 150,
    position: { left: "20%", top: "70%" },
    delay: 4,
    duration: 22,
  },
];

const AnimatedSpheres: React.FC<AnimatedSpheresProps> = ({ 
  keyPoints = defaultKeyPoints 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const sphereElements: HTMLDivElement[] = [];
    
    // Create the key point spheres with better spacing
    keyPoints.forEach((point, index) => {
      const sphere = document.createElement('div');
      
      // Set basic styles for the sphere
      sphere.className = `absolute rounded-full flex flex-col items-center justify-center p-4 backdrop-blur-md shadow-lg transform transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-xl animate-float-smooth`;
      sphere.style.width = `${point.size}px`;
      sphere.style.height = `${point.size}px`;
      sphere.style.left = point.position.left;
      sphere.style.top = point.position.top;
      sphere.style.opacity = "0.95";
      sphere.style.zIndex = `${20 + index}`;
      
      // Set the background color based on the logo colors
      if (point.color === 'blue') {
        sphere.style.background = `radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.4) 100%)`;
        sphere.style.border = `2px solid rgba(59, 130, 246, 0.6)`;
        sphere.style.boxShadow = `0 0 30px rgba(59, 130, 246, 0.3)`;
      } else if (point.color === 'gold') {
        sphere.style.background = `radial-gradient(circle, rgba(245, 158, 11, 0.8) 0%, rgba(245, 158, 11, 0.4) 100%)`;
        sphere.style.border = `2px solid rgba(245, 158, 11, 0.6)`;
        sphere.style.boxShadow = `0 0 30px rgba(245, 158, 11, 0.3)`;
      }
      
      // Set content with better typography
      const title = document.createElement('h3');
      title.className = "font-bold text-white text-center mb-1 text-xs leading-tight";
      title.style.textShadow = "0 1px 2px rgba(0,0,0,0.5)";
      title.textContent = point.title;
      
      const content = document.createElement('p');
      content.className = "text-xs text-white/90 text-center leading-tight px-1";
      content.style.textShadow = "0 1px 2px rgba(0,0,0,0.5)";
      content.textContent = point.content;
      
      sphere.appendChild(title);
      sphere.appendChild(content);
      
      // Animation properties with staggered timing
      sphere.style.animationDuration = `${point.duration}s`;
      sphere.style.animationDelay = `${point.delay}s`;
      sphere.style.animationIterationCount = "infinite";
      sphere.style.animationTimingFunction = "ease-in-out";
      
      // Add smooth hover effects
      sphere.addEventListener('mouseenter', () => {
        sphere.style.transform = "scale(1.1) translateZ(0)";
        sphere.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      });
      
      sphere.addEventListener('mouseleave', () => {
        sphere.style.transform = "scale(1) translateZ(0)";
        sphere.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      });
      
      // Add to DOM
      containerRef.current.appendChild(sphere);
      sphereElements.push(sphere);
    });
    
    // Create decorative smaller spheres with better positioning
    const decorativePositions = [
      { left: "85%", top: "20%" },
      { left: "5%", top: "50%" },
      { left: "45%", top: "10%" },
      { left: "75%", top: "75%" },
      { left: "40%", top: "85%" }
    ];
    
    decorativePositions.forEach((pos, i) => {
      const sphere = document.createElement('div');
      const size = Math.random() * 40 + 20; // 20px to 60px
      
      sphere.className = "absolute rounded-full animate-float-gentle";
      sphere.style.width = `${size}px`;
      sphere.style.height = `${size}px`;
      sphere.style.opacity = `${Math.random() * 0.2 + 0.1}`;
      sphere.style.left = pos.left;
      sphere.style.top = pos.top;
      sphere.style.zIndex = `${5 + i}`;
      
      // Alternating colors
      const color = i % 2 === 0 ? 
        "rgba(59, 130, 246, 0.3)" : 
        "rgba(245, 158, 11, 0.3)";
      sphere.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
      sphere.style.backdropFilter = "blur(2px)";
      
      // Staggered animation timing
      sphere.style.animationDuration = `${Math.random() * 10 + 15}s`;
      sphere.style.animationDelay = `${Math.random() * 3}s`;
      sphere.style.animationIterationCount = "infinite";
      
      containerRef.current.appendChild(sphere);
      sphereElements.push(sphere);
    });
    
    // Cleanup
    return () => {
      sphereElements.forEach(sphere => {
        if (sphere.parentNode) {
          sphere.parentNode.removeChild(sphere);
        }
      });
    };
  }, [keyPoints]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 1 }}
    />
  );
};

export default AnimatedSpheres;