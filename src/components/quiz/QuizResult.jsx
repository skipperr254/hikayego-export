import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Repeat, BrainCircuit, Trophy, Star, Crown, Zap, Target } from 'lucide-react';

const QuizResult = React.memo(({ score, totalQuestions, onRestart, onBackToActivities }) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  const getScoreMessage = () => {
    if (percentage >= 90) return { message: "Efsane! 🔥", color: "text-orange-500", icon: Crown };
    if (percentage >= 80) return { message: "Mükemmel! 🎉", color: "text-green-500", icon: Trophy };
    if (percentage >= 60) return { message: "Harika! 👏", color: "text-blue-500", icon: Star };
    if (percentage >= 40) return { message: "İyi! 👍", color: "text-yellow-500", icon: Target };
    return { message: "Daha çok pratik gerekli! 💪", color: "text-red-500", icon: Zap };
  };

  const scoreData = getScoreMessage();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -50 }}
      className="w-full max-w-3xl mx-auto"
    >
      <Card className="relative overflow-hidden border-0 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-4 right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl"
          ></motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-4 left-4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl"
          ></motion.div>
        </div>
        
        <CardHeader className="text-center relative z-10 pb-4 sm:pb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-4 sm:mb-6"
          >
            {React.createElement(scoreData.icon, { 
              className: "h-20 w-20 sm:h-24 sm:w-24 text-primary" 
            })}
          </motion.div>
          <CardTitle className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-4 font-bold">Quiz Tamamlandı!</CardTitle>
          <div className={`text-2xl sm:text-3xl font-bold ${scoreData.color}`}>
            {scoreData.message}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8 sm:space-y-10 relative z-10 p-6 sm:p-8 md:p-12">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
              className="text-6xl sm:text-7xl md:text-8xl font-black bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-4"
            >
              {score}/{totalQuestions}
            </motion.div>
            <p className="text-xl sm:text-2xl text-muted-foreground">
              Başarı oranınız: <span className="font-bold text-primary text-2xl sm:text-3xl">%{percentage}</span>
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800"
            >
              <Check className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mx-auto mb-2 sm:mb-4" />
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1 sm:mb-2">{score}</div>
              <div className="text-base sm:text-lg font-medium text-green-600">Doğru Cevap</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center p-4 sm:p-6 bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 rounded-2xl border border-red-200 dark:border-red-800"
            >
              <X className="h-10 w-10 sm:h-12 sm:w-12 text-red-500 mx-auto mb-2 sm:mb-4" />
              <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-1 sm:mb-2">{totalQuestions - score}</div>
              <div className="text-base sm:text-lg font-medium text-red-600">Yanlış Cevap</div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              onClick={onRestart} 
              size="lg" 
              className="bg-primary hover:bg-primary/90 h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-bold rounded-xl"
            >
              <Repeat className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              Tekrar Dene
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onBackToActivities}
              className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-bold rounded-xl border-2"
            >
              <BrainCircuit className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
              Aktivitelere Dön
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default QuizResult;