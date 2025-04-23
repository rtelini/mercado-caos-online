
import { useState, useEffect } from 'react';

export const useTaskTimer = (initialTime: number, onComplete: (success: boolean) => void) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleComplete(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleComplete = (success: boolean) => {
    setIsOpen(false);
    onComplete(success);
  };

  return {
    timeLeft,
    isOpen,
    handleComplete
  };
};
