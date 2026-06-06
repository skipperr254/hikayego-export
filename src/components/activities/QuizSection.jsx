import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Trophy, Zap, Target, Sparkles, Crown } from 'lucide-react';

const QuizSection = React.memo(({ onStartQuiz, selectedCategory, categories }) => {
  const getCategoryName = () => {
    if (selectedCategory === 'all') return 'Tüm Kelimeler';
    const category = categories.find(c => c.id === selectedCategory);
    return category ? category.name : 'Seçili Kategori';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mb-12"
    >
      <Card className="relative overflow-hidden border-0 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-xl"
          ></motion.div>
          <motion.div
            animate={{ 
              x: [0, -80, 0],
              y: [0, 60, 0],
              rotate: [360, 180, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-8 right-8 w-16 h-16 bg-white/10 rounded-full blur-xl"
          ></motion.div>
          <motion.div
            animate={{ 
              x: [0, 60, 0],
              y: [0, -40, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-4 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl"
          ></motion.div>
        </div>
        
        <CardContent className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-6 flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-3"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="p-3 bg-white/20 rounded-full backdrop-blur-sm"
                >
                  <Trophy className="h-8 w-8 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Kelime Egzersizi
                  </h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <Sparkles className="h-5 w-5 text-yellow-300" />
                    <span className="text-white/90 font-medium">Bilgilerini test et!</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl"
              >
                Öğrendiğin kelimelerle kendini sına ve bilgilerini pekiştir. 
                {selectedCategory !== 'all' && (
                  <span className="font-semibold text-yellow-300">
                    {` "${getCategoryName()}" kategorisinden `}
                  </span>
                )}
                <span className="font-medium">Quiz çözerek İngilizce seviyeni artır!</span>
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Target className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Hedefli Pratik</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Zap className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Hızlı Öğrenme</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Crown className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Başarı Odaklı</span>
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="flex flex-col items-center space-y-6"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl"></div>
                <Button 
                  onClick={onStartQuiz} 
                  size="lg"
                  className="relative bg-white text-primary hover:bg-white/90 font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-white/20"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="mr-3"
                  >
                    <Play className="h-8 w-8" />
                  </motion.div>
                  Quiz Başlat
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center"
              >
                <p className="text-white/80 text-sm font-medium">
                  {getCategoryName()} ile pratik yap
                </p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1, type: "spring", stiffness: 200 }}
                      className="w-2 h-2 bg-yellow-300 rounded-full"
                    ></motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default QuizSection;