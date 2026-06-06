import React from 'react';
import { motion } from 'framer-motion';
import { Delete, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
];

const WordleKeyboard = ({ 
  usedLetters, 
  onKeyPress, 
  disabled, 
  isVerifying
}) => {

  const getKeyStatusClass = (key) => {
    const status = usedLetters[key];
    if (status === 'correct') return 'bg-green-600 text-white border-green-700 shadow-inner';
    if (status === 'present') return 'bg-yellow-500 text-gray-900 border-yellow-600 shadow-inner';
    if (status === 'absent') return 'bg-gray-500 text-white dark:bg-gray-800 dark:text-gray-400 border-transparent shadow-inner opacity-70';
    return 'bg-secondary hover:bg-secondary/80 text-foreground border-border/60 shadow-sm hover:shadow-md';
  };

  const handleKeyClick = (key) => {
    if (disabled || isVerifying) return;
    onKeyPress(key);
  };

  const renderKeyContent = (key) => {
    if (key === 'BACKSPACE') return <Delete className="w-5 h-5 sm:w-6 sm:h-6" />;
    if (key === 'ENTER') {
      return isVerifying ? <Loader2 className="w-4 h-4 sm:w-5 animate-spin mx-auto" /> : "ENTER";
    }
    return key;
  };

  return (
    <div className="w-full max-w-[800px] mx-auto flex flex-col gap-1.5 sm:gap-2 select-none touch-none px-1">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5 md:gap-2 w-full">
          {row.map((key) => {
            const isSpecial = key === 'ENTER' || key === 'BACKSPACE';
            const isEnter = key === 'ENTER';
            const isDisabled = disabled || isVerifying;
            
            return (
              <motion.button
                whileTap={{ scale: isDisabled ? 1 : 0.92 }}
                key={key}
                onClick={(e) => {
                  e.preventDefault();
                  handleKeyClick(key);
                }}
                disabled={isDisabled}
                className={cn(
                  "flex items-center justify-center rounded-lg sm:rounded-xl font-bold transition-colors touch-manipulation",
                  "border-b-4 active:border-b-0 active:translate-y-1", 
                  isSpecial 
                    ? "px-1 sm:px-3 text-[10px] sm:text-xs md:text-sm flex-[1.5] max-w-[4.5rem] sm:max-w-[6rem]" 
                    : "flex-1 max-w-[2.5rem] sm:max-w-[3.5rem] md:max-w-[4rem] text-[13px] sm:text-lg md:text-xl",
                  "h-12 sm:h-14 md:h-16",
                  isEnter
                    ? "bg-primary text-primary-foreground border-primary/80 shadow-md hover:bg-primary/90"
                    : getKeyStatusClass(key),
                  isDisabled ? "opacity-60 cursor-not-allowed pointer-events-none" : "cursor-pointer"
                )}
                aria-label={isSpecial ? key : `Harf ${key}`}
              >
                {renderKeyContent(key)}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default WordleKeyboard;