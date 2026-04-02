import { useState, useEffect } from 'react';

export const useTypingAnimation = (text: string, typingSpeed: number = 150, holdDuration: number = 5000) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isTyping) {
      if (displayText.length < text.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(text.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        // Text is complete, hold for specified duration
        timeoutId = setTimeout(() => {
          setIsTyping(false);
          setDisplayText('');
        }, holdDuration);
      }
    } else {
      // Start typing again
      setIsTyping(true);
    }

    return () => clearTimeout(timeoutId);
  }, [displayText, text, typingSpeed, holdDuration, isTyping]);

  return displayText;
};
