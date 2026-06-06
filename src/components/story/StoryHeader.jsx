import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Volume2, Bookmark, Pause, Play, BookmarkCheck, CheckCircle, RotateCcw } from 'lucide-react';

const StoryHeader = ({ 
  story, 
  isSaved, 
  isRead, 
  isPlaying, 
  isPaused, 
  onBack, 
  onListen, 
  onToggleSave, 
  onToggleRead 
}) => {
  const getListenButtonContent = () => {
    if (isPlaying) {
      return (
        <>
          <Pause className="h-4 w-4 mr-2" />
          Durdur
        </>
      );
    } else if (isPaused) {
      return (
        <>
          <Play className="h-4 w-4 mr-2" />
          Devam Et
        </>
      );
    } else {
      return (
        <>
          <Volume2 className="h-4 w-4 mr-2" />
          Dinle
        </>
      );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <Button 
        variant="ghost" 
        onClick={onBack} 
        className="mb-6 bg-background/50 hover:bg-background/80"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Panele Dön
      </Button>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-shadow-lg">
            {story.title}
          </h1>
          <Badge className={`level-badge level-${story.level}`}>
            {story.level.toUpperCase()}
          </Badge>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onListen}
            className={`transition-all ${isPlaying ? 'bg-primary text-primary-foreground' : 'bg-background/50 hover:bg-background/80'}`}
          >
            {getListenButtonContent()}
          </Button>
          
          <Button 
            variant={isSaved ? "default" : "outline"} 
            size="sm" 
            onClick={onToggleSave}
            className={`transition-all ${
              isSaved 
                ? 'bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700' 
                : 'bg-background/50 hover:bg-background/80'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="h-4 w-4 mr-2" />
                Kaydedildi
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4 mr-2" />
                Kaydet
              </>
            )}
          </Button>
          
          <Button 
            variant={isRead ? "default" : "outline"} 
            size="sm" 
            onClick={onToggleRead}
            className={`transition-all ${
              isRead 
                ? 'bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700' 
                : 'bg-background/50 hover:bg-background/80'
            }`}
          >
            {isRead ? (
              <>
                <RotateCcw className="h-4 w-4 mr-2" />
                Okunmadı İşaretle
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Okundu İşaretle
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default StoryHeader;