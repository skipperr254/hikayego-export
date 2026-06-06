import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const levelLabels = {
  a1: 'A1 - Başlangıç',
  a2: 'A2 - Temel',
  b1: 'B1 - Orta Alt',
  b2: 'B2 - Orta Üst',
  c1: 'C1 - İleri'
};

const LessonCard = ({ lesson, isSelected, onClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className={cn(
        "overflow-hidden h-full flex flex-col group bg-card/50 backdrop-blur-sm hover:shadow-primary/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
        isSelected && "ring-2 ring-primary shadow-primary/20"
      )}>
        <div className="relative">
          <div className="aspect-video bg-black flex items-center justify-center">
            <img 
              src={`https://i.ytimg.com/vi/${lesson.video_id}/hqdefault.jpg`}
              alt={lesson.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => { e.target.onerror = null; e.target.src='https://images.unsplash.com/photo-1567443024551-f3e3cc2be870?w=800&q=80'; }}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
              <PlayCircle className="w-16 h-16 text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
            </div>
          </div>
          {isSelected && (
             <div className="absolute top-2 right-2">
              <Badge variant="premium" className="bg-green-500/80 text-white">Oynatılıyor</Badge>
            </div>
          )}
        </div>
        <CardHeader className="flex-grow">
          <CardTitle className="text-xl group-hover:text-primary transition-colors">{lesson.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge className={`level-${lesson.level}`}>{levelLabels[lesson.level]}</Badge>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LessonCard;