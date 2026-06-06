import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const nextThemeLabel = theme === 'dark' ? 'Açık Tema' : 'Koyu Tema';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" onClick={handleToggle} aria-label={`Geçiş yap: ${nextThemeLabel}`}>
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={theme}
              initial={{ y: -20, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.25, type: 'spring', stiffness: 200, damping: 20 }}
              className="flex items-center justify-center"
            >
              {theme === 'dark' ? (
                <Sun className="h-[1.2rem] w-[1.2rem] transition-colors text-yellow-400 hover:text-yellow-300" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] transition-colors text-slate-400 hover:text-slate-300" />
              )}
            </motion.div>
          </AnimatePresence>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{nextThemeLabel}</p>
      </TooltipContent>
    </Tooltip>
  );
}