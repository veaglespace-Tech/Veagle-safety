import React, { useState, useEffect } from 'react';

export const TypewriterText = ({
  words = [
    'Instant 3-Second Protection',
    '24/7 Live GPS Tracking',
    'Silent Police Dispatch',
    'Trusted Emergency Network',
  ],
  typingSpeed = 70,
  deletingSpeed = 35,
  pauseDuration = 2200,
  className = '',
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullWord = words[currentWordIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        // Typing letters
        setCurrentText(fullWord.substring(0, currentText.length + 1));

        if (currentText === fullWord) {
          // Pause at end of word before deleting
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        // Deleting letters
        setCurrentText(fullWord.substring(0, currentText.length - 1));

        if (currentText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    };

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(handleTyping, speed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={`inline-inline-flex items-baseline ${className}`}>
      <span className="transition-all duration-75">{currentText}</span>
      <span 
        className="inline-block ml-[2px] w-[3px] h-[0.85em] bg-[#FF5C8A] rounded-full animate-pulse align-middle shadow-[0_0_10px_#FF5C8A]"
        style={{ verticalAlign: 'baseline', marginBottom: '-0.05em' }}
      />
    </span>
  );
};

export default TypewriterText;
