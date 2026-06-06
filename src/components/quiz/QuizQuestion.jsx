import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Volume2, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { cn } from '@/lib/utils';

const QuizQuestion = ({
  question,
  onAnswerSelect,
  isAnswered,
  selectedAnswer,
  timeLeft,
  score,
  streak,
  currentQuestionIndex,
  totalQuestions,
  onExit
}) => {
  const { handlePronounce } = useSpeechSynthesis();
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Info */}
      <div className="bg-card/60 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-border/50 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onExit}
            className="h-10 w-10 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-6 font-bold text-base">
            <div className="flex items-center gap-2 text-foreground">
               <Clock className="w-5 h-5 text-primary" />
               <span className={cn("transition-colors", timeLeft <= 5 && "text-destructive animate-pulse")}>
                 {timeLeft}s
               </span>
            </div>
            {streak > 2 && (
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="flex items-center gap-1.5 text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full"
              >
                <Flame className="h-4 w-4" fill="currentColor" />
                <span>{streak}</span>
              </motion.div>
            )}
            <div className="text-foreground">
              Skor: <span className="text-primary">{score}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 px-2">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span>Soru {currentQuestionIndex + 1}</span>
            <span>Toplam {totalQuestions}</span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-secondary" indicatorColor="bg-primary" />
        </div>
      </div>

      {/* Elegant Word Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative bg-card rounded-[2.5rem] p-8 sm:p-12 border border-border shadow-xl text-center group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10 rounded-[2.5rem] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[140px] sm:min-h-[180px]">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight break-words max-w-full leading-tight mb-6 drop-shadow-sm">
            {question.word}
          </h2>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePronounce(question.word)}
            className="h-14 w-14 rounded-full border-2 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 shadow-sm"
          >
            <Volume2 className="h-6 w-6" />
          </Button>
        </div>
      </motion.div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = isAnswered && option === question.correctAnswer;
          const isWrong = isAnswered && isSelected && option !== question.correctAnswer;
          
          let buttonClass = "bg-card border-border/60 hover:border-primary/50 hover:shadow-md text-foreground";
          
          if (isAnswered) {
             if (isCorrect) {
               buttonClass = "bg-emerald-500 border-emerald-600 text-white shadow-lg ring-2 ring-emerald-500/50 ring-offset-2 ring-offset-background";
             } else if (isWrong) {
               buttonClass = "bg-destructive border-destructive text-white opacity-90 scale-[0.98]";
             } else {
               buttonClass = "bg-card/50 border-border/30 text-muted-foreground opacity-50 scale-[0.98]";
             }
          } else if (isSelected) {
            buttonClass = "bg-primary/10 border-primary text-primary shadow-inner";
          }

          return (
            <motion.button
              key={index}
              disabled={isAnswered}
              whileHover={!isAnswered ? { scale: 1.02, y: -2 } : {}}
              whileTap={!isAnswered ? { scale: 0.98 } : {}}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              onClick={() => onAnswerSelect(option)}
              className={cn(
                "relative flex items-center justify-center p-5 sm:p-6 rounded-2xl border-2 text-lg sm:text-xl font-bold transition-all duration-300 w-full min-h-[80px]",
                buttonClass
              )}
            >
              <span className="break-words max-w-full">{option}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizQuestion;