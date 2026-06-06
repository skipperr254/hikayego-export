import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, CheckCircle, BookOpen, TrendingUp } from 'lucide-react';

const ActivityStats = React.memo(({ stats }) => {
  const statCards = useMemo(() => [
    { 
      icon: BrainCircuit, 
      label: "Öğrenilen Kelime", 
      value: stats.wordsLearned, 
      color: "from-blue-500 to-cyan-500",
      description: "Koleksiyonundaki kelimeler"
    },
    { 
      icon: CheckCircle, 
      label: "Tamamlanan Quiz", 
      value: stats.quizzesCompleted, 
      color: "from-green-500 to-emerald-500",
      description: "Başarıyla tamamlananlar"
    },
    { 
      icon: BookOpen, 
      label: "Okunan Hikaye", 
      value: stats.storiesRead, 
      color: "from-purple-500 to-pink-500",
      description: "Bitirdiğin maceralar"
    },
    { 
      icon: TrendingUp, 
      label: "Genel İlerleme", 
      value: `${stats.progressPercentage}%`, 
      color: "from-amber-500 to-orange-500",
      description: "Tüm hikayelere göre"
    },
  ], [stats]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <motion.div 
          key={stat.label}
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 * index, duration: 0.3 }}
          whileHover={{ scale: 1.03, y: -5 }}
        >
          <Card className={`relative overflow-hidden bg-gradient-to-br ${stat.color} text-white border-0 shadow-md hover:shadow-lg transition-all duration-200`}>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full opacity-50" />
            <div className="absolute -bottom-8 -left-2 w-20 h-20 bg-white/10 rounded-full opacity-50" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1 md:p-4 md:pb-2 relative z-10">
              <CardTitle className="text-xs md:text-sm font-medium text-white/90">{stat.label}</CardTitle>
              <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-white/80" />
            </CardHeader>
            <CardContent className="relative z-10 p-3 pt-0 md:p-4 md:pt-0">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
              <p className="text-[10px] leading-tight md:text-xs text-white/70">{stat.description}</p>
              {stat.label === "Genel İlerleme" && (
                <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
                  <div className="bg-white h-1.5 rounded-full transition-all duration-300" style={{width: stat.value}} />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
});

ActivityStats.displayName = 'ActivityStats';

export default ActivityStats;