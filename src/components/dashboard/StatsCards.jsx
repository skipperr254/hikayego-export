import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Trophy, BookOpen, Flame, Sparkles, Star, Bookmark } from 'lucide-react';

const StatsCards = React.memo(({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-950 dark:via-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
          <CardContent className="p-4 text-center relative z-10">
            <div className="relative">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-1">{stats.progressPercentage}%</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">İlerleme Oranı</p>
            <div className="mt-2 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${stats.progressPercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 via-green-100 to-emerald-200 dark:from-green-950 dark:via-green-900 dark:to-emerald-800 border-green-200 dark:border-green-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent"></div>
          <CardContent className="p-4 text-center relative z-10">
            <div className="relative">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500 animate-bounce" />
            </div>
            <p className="text-3xl font-bold text-green-700 dark:text-green-300 mb-1">{stats.readCount}</p>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">Tamamlanan Hikaye</p>
            <div className="flex justify-center mt-2">
              {[...Array(Math.min(stats.readCount, 5))].map((_, i) => (
                <Star key={i} className="w-2 h-2 text-yellow-500 fill-current" />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-purple-100 to-violet-200 dark:from-purple-950 dark:via-purple-900 dark:to-violet-800 border-purple-200 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent"></div>
          <CardContent className="p-4 text-center relative z-10">
            <div className="relative">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
            </div>
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-1">{stats.totalStories}</p>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Mevcut Hikaye</p>
            <div className="mt-2 flex justify-center space-x-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-100 to-yellow-200 dark:from-amber-950 dark:via-orange-900 dark:to-yellow-800 border-amber-200 dark:border-amber-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent"></div>
          <CardContent className="p-4 text-center relative z-10">
            <div className="relative">
              <Flame className="h-8 w-8 mx-auto mb-2 text-amber-600 dark:text-amber-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-3xl font-bold text-amber-700 dark:text-amber-300 mb-1">{stats.savedCount}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Kayıtlı Hikaye</p>
            <div className="mt-2">
              <Bookmark className="w-3 h-3 mx-auto text-amber-500 fill-current" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
});

export default StatsCards;