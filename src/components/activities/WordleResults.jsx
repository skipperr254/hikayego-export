import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Frown, RotateCcw, Home, Clock, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WordleResults = ({ isWinner, targetWord, attempts, hintsUsed, timeElapsed, hardMode, onPlayAgain, onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-sm"
    >
      <div className="bg-card border border-border p-6 rounded-3xl shadow-xl max-w-sm w-full text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          {isWinner ? <Trophy className="w-8 h-8 text-primary" /> : <Frown className="w-8 h-8 text-destructive" />}
        </div>
        
        <h2 className="text-2xl font-black mb-2">
          {isWinner ? 'Tebrikler! Kazandınız!' : 'Maalesef, Kaybettiniz!'}
        </h2>
        
        <p className="text-lg text-muted-foreground mb-6">
          Kelime: <span className="font-bold text-foreground">{targetWord}</span>
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-secondary/50 p-3 rounded-xl flex flex-col items-center">
            <Hash className="w-5 h-5 text-primary mb-1" />
            <span className="text-sm font-medium text-muted-foreground">Deneme</span>
            <span className="text-lg font-bold">{attempts}/6</span>
          </div>
          <div className="bg-secondary/50 p-3 rounded-xl flex flex-col items-center">
            <Clock className="w-5 h-5 text-primary mb-1" />
            <span className="text-sm font-medium text-muted-foreground">Süre</span>
            <span className="text-lg font-bold">{timeElapsed}s</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {onPlayAgain && (
            <Button onClick={onPlayAgain} className="w-full h-12 rounded-xl font-bold text-base" size="lg">
              <RotateCcw className="w-5 h-5 mr-2" /> Tekrar Oyna
            </Button>
          )}
          <Button onClick={onBack} variant={onPlayAgain ? "outline" : "default"} className="w-full h-12 rounded-xl font-bold text-base" size="lg">
            <Home className="w-5 h-5 mr-2" /> Anasayfaya Dön
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default WordleResults;