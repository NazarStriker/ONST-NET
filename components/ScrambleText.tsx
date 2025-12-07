import React, { useEffect, useState } from 'react';

interface ScrambleTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

export const ScrambleText: React.FC<ScrambleTextProps> = ({ text, className = '', speed = 50, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  
  // Ensure text is always a string to prevent "Cannot read properties of null (reading 'split')"
  const safeText = text || '';

  useEffect(() => {
    if (!safeText) {
        setIsFinished(true);
        return;
    }

    let iteration = 0;
    let interval: any = null;

    const startScramble = () => {
      interval = setInterval(() => {
        setDisplayText(prev => {
          return safeText
            .split('')
            .map((letter, index) => {
              if (index < iteration) {
                return safeText[index];
              }
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('');
        });

        if (iteration >= safeText.length) {
          clearInterval(interval);
          setIsFinished(true);
        }

        iteration += 1 / 2; // Slower reveal
      }, speed);
    };

    const timeout = setTimeout(startScramble, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [safeText, speed, delay]);

  return (
    <span className={`${className} ${isFinished ? '' : 'bg-green-900/20 text-green-400'}`}>
      {displayText || safeText.split('').map(() => CHARS[0]).join('')}
    </span>
  );
};