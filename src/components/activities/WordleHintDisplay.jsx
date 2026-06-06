import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Lightbulb, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WordleHintDisplay = ({ hints, isHardMode, maxHints, onGenerateHint, isFetching }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (isHardMode) return null;

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (open && hints.length === 0 && !isFetching) {
      onGenerateHint();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full font-bold border-primary/50 text-primary hover:bg-primary/10 transition-colors h-8 px-2 sm:h-9 sm:px-3 text-[10px] sm:text-xs md:text-sm"
        >
          {isFetching ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 animate-spin" /> : <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />}
          <span className="hidden sm:inline">İpucu</span> ({hints.length}/{maxHints})
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[90vw] sm:w-[350px] p-0 rounded-2xl overflow-hidden border-2 z-[100]" align="end">
        <div className="bg-primary/10 p-3 border-b border-border/50 flex justify-between items-center">
          <h4 className="font-bold text-sm text-foreground">İpuçları</h4>
          <Button 
            size="sm" 
            onClick={onGenerateHint} 
            disabled={hints.length >= maxHints || isFetching}
            className="h-7 text-[10px] rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
          >
            {isFetching ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Lightbulb className="w-3 h-3 mr-1" />}
            Yeni İpucu
          </Button>
        </div>
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2 space-y-2">
          {hints.length === 0 && isFetching && (
            <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
              <p className="text-xs font-medium">İlk ipucu hazırlanıyor...</p>
            </div>
          )}
          {hints.length === 0 && !isFetching && (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-xs font-medium">Henüz ipucu almadınız.</p>
            </div>
          )}
          <AnimatePresence mode="popLayout">
            {hints.map((hint, idx) => (
              <motion.div
                key={hint.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary/50 p-3 rounded-xl flex gap-3 items-start"
              >
                <div className="p-1.5 bg-background rounded-lg text-primary shadow-sm shrink-0">
                  {hint.icon}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <span className="font-bold text-[10px] sm:text-xs uppercase tracking-wider text-primary/80 block mb-0.5">
                    İpucu {idx + 1}: {hint.type}
                  </span>
                  <span className="font-medium text-xs sm:text-sm text-foreground leading-snug break-words">
                    {hint.text}
                  </span>
                </div>
              </motion.div>
            ))}
            {isFetching && hints.length > 0 && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-3">
                 <Loader2 className="w-5 h-5 animate-spin text-primary" />
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WordleHintDisplay;