import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger, 
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { ChevronLeft, ChevronRight, Text, LifeBuoy } from 'lucide-react';

const ReaderControls = ({
  currentPage,
  totalPages,
  onPageChange,
  fontSize,
  onFontSizeChange,
  onToggleAssistant,
  speechRate,
  onSpeechRateChange,
}) => {
  const speedOptions = [0.5, 0.75, 1.0, 1.25];

  return (
    <motion.footer
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="w-1/3 flex items-center gap-2">
             <Button variant="outline" size="sm" onClick={onToggleAssistant}>
                <LifeBuoy className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Asistan</span>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4 w-1/3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onPageChange(-1)}
              disabled={currentPage === 0}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium text-muted-foreground w-16 text-center">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onPageChange(1)}
              disabled={currentPage === totalPages - 1}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="w-1/3 flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Text className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Metin & Ses</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 mb-2 p-4 bg-background/95 backdrop-blur-lg border rounded-xl shadow-2xl">
                <DropdownMenuLabel className="text-center text-base font-semibold">Metin Boyutu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-2 flex items-center gap-4">
                  <Text size={16} className="text-muted-foreground" />
                  <Slider
                    value={[fontSize]}
                    onValueChange={(value) => onFontSizeChange(value[0])}
                    min={1}
                    max={100}
                    step={1}
                  />
                  <Text size={28} className="text-muted-foreground" />
                </div>
                <div className="text-center text-sm font-bold text-primary mt-1">
                  {fontSize}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-center text-base font-semibold pt-2">Okuma Hızı</DropdownMenuLabel>
                <div className="p-2 flex items-center justify-around gap-2">
                  {speedOptions.map((speed) => (
                    <Button
                      key={speed}
                      variant={speechRate === speed ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => onSpeechRateChange(speed)}
                      className="flex-1"
                    >
                      {speed.toFixed(2)}x
                    </Button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default ReaderControls;