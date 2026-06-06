import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Volume2, Bookmark, Pause, Play, BookmarkCheck, CheckCircle, RotateCcw, Eye, BookmarkPlus } from 'lucide-react';

const ImmersiveReaderHeader = ({ 
  story, 
  isSaved, 
  isRead, 
  isPlaying, 
  isPaused, 
  onBack, 
  onListen, 
  onToggleSave, 
  onToggleRead,
  isEyeComfortMode,
  onToggleEyeComfortMode,
}) => {
  const getListenButtonContent = () => {
    if (isPlaying) {
      return <><Pause className="h-4 w-4 mr-2" /> Durdur</>;
    }
    if (isPaused) {
      return <><Play className="h-4 w-4 mr-2" /> Devam Et</>;
    }
    return <><Volume2 className="h-4 w-4 mr-2" /> Dinle</>;
  };

  const getListenIcon = () => {
    if (isPlaying) return <Pause className="h-5 w-5" />;
    if (isPaused) return <Play className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
            <div className="hidden sm:flex flex-col items-start">
              <h1 className="text-lg font-bold truncate max-w-xs">{story.title}</h1>
              <Badge variant="outline" className={`level-${story.level} border-current`}>{story.level.toUpperCase()}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant={isEyeComfortMode ? "secondary" : "ghost"}
              size="icon"
              onClick={onToggleEyeComfortMode}
              className="rounded-full"
              aria-label="Toggle eye comfort mode"
            >
              <Eye className="h-5 w-5" />
            </Button>

            <Button
              variant={isPlaying || isPaused ? "secondary" : "ghost"}
              size="icon"
              onClick={onListen}
              className="rounded-full md:hidden"
              aria-label="Listen to story"
            >
              {getListenIcon()}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onListen}
              className={`transition-all hidden md:inline-flex ${isPlaying ? 'bg-primary text-primary-foreground' : ''}`}
            >
              {getListenButtonContent()}
            </Button>
            <Button 
              variant={isSaved ? "default" : "outline"} 
              size="sm" 
              onClick={onToggleSave}
              className={`transition-all ${isSaved ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}`}
            >
              {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              <span className="hidden sm:inline ml-2">{isSaved ? "Kaydedildi" : "Kaydet"}</span>
            </Button>
            <Button 
              variant={isRead ? "default" : "outline"} 
              size="sm" 
              onClick={onToggleRead}
              className={`transition-all ${isRead ? 'bg-green-500 hover:bg-green-600 text-white' : ''}`}
            >
              {isRead ? <RotateCcw className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
               <span className="hidden sm:inline ml-2">{isRead ? "Okunmadı" : "Okundu"}</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default ImmersiveReaderHeader;