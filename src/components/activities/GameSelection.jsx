import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Layers, Copy, Puzzle, ChevronLeft, ChevronRight, PlayCircle, Keyboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

const gameOptions = [
  {
    title: "Flashcard",
    description: "Hızlı tekrar",
    icon: Layers,
    path: "/activities/flashcards",
    bgColor: "bg-gradient-to-br from-blue-500 to-blue-700",
    iconBgColor: "bg-blue-400",
    minWords: 1
  },
  {
    title: "Eşleştirme",
    description: "Hafızanı test et",
    icon: Copy,
    path: "/activities/matching-game",
    bgColor: "bg-gradient-to-br from-purple-500 to-purple-700",
    iconBgColor: "bg-purple-400",
    minWords: 4
  },
  {
    title: "Quiz",
    description: "Bilgini sına",
    icon: Puzzle,
    path: "/quiz/setup",
    bgColor: "bg-gradient-to-br from-emerald-500 to-emerald-700",
    iconBgColor: "bg-emerald-400",
    minWords: 4
  },
  {
    title: "Wordle",
    description: "Kelime tahmini",
    icon: Keyboard,
    path: "/wordle",
    bgColor: "bg-gradient-to-br from-amber-500 to-orange-600",
    iconBgColor: "bg-amber-400",
    minWords: 1
  },
];

const GameCard = React.memo(({ game, onStart, wordCount, isMobile, isActive }) => {
  const { toast } = useToast();

  const handleCardClick = useCallback(() => {
    if (isMobile && !isActive) return;
    
    if (wordCount < game.minWords) {
      toast({
        title: "Yetersiz Kelime",
        description: `Bu oyunu oynamak için en az ${game.minWords} kelimeye ihtiyacınız var.`,
        variant: "destructive",
      });
      return;
    }
    onStart(game.path);
  }, [isMobile, isActive, wordCount, game.minWords, game.path, onStart, toast]);

  return (
    <motion.div
      onClick={handleCardClick}
      whileHover={!isMobile ? { y: -5, scale: 1.02 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        "relative w-full h-[220px] rounded-3xl overflow-hidden p-6 flex flex-col justify-between text-white shadow-lg",
        game.bgColor,
        isMobile ? "cursor-grab active:cursor-grabbing" : "cursor-pointer"
      )}
    >
      <div className={`absolute -bottom-12 -right-12 w-48 h-48 ${game.iconBgColor} rounded-full opacity-30 blur-2xl`} />
      <game.icon className="absolute top-6 right-6 h-16 w-16 text-white/10" />

      <div className="relative z-10">
        <h3 className="text-2xl font-bold">{game.title}</h3>
        <p className="text-white/80 mt-1">{game.description}</p>
      </div>

      <div className="relative z-10 flex items-end justify-between gap-4">
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
          <p className="text-xs font-medium text-white/80">Kelime Sayısı</p>
          <p className="text-xl font-bold">{wordCount}</p>
        </div>
        <div 
          aria-hidden="true"
          className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
        >
          <PlayCircle className="h-8 w-8 text-white" />
        </div>
      </div>
    </motion.div>
  );
});

GameCard.displayName = 'GameCard';

const GameSelection = ({ selectedCategory, wordCount }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [currentIndex, setCurrentIndex] = useState(1);

  const handleGameStart = useCallback((path) => {
    const categoryQuery = selectedCategory === 'all' || !selectedCategory ? '' : `?category=${selectedCategory}`;
    navigate(`${path}${categoryQuery}`);
  }, [selectedCategory, navigate]);

  const nextGame = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % gameOptions.length);
  }, []);

  const prevGame = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + gameOptions.length) % gameOptions.length);
  }, []);

  const handleDragEnd = useCallback((event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 50 || velocity > 200) {
      prevGame();
    } else if (offset < -50 || velocity < -200) {
      nextGame();
    }
  }, [nextGame, prevGame]);

  const getCardPosition = useCallback((index) => {
    const distance = 70;
    const order = index - currentIndex;
    
    if (order === 0) return '0%';
    if (order === 1 || order === -3) return `${distance}%`; // handle wrap around for 4 items
    if (order === -1 || order === 3) return `-${distance}%`;
    
    return order > 0 ? '150%' : '-150%';
  }, [currentIndex]);

  const cardPositions = useMemo(() => 
    gameOptions.map((_, index) => getCardPosition(index)),
    [getCardPosition]
  );

  if (!isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {gameOptions.map((game, index) => (
            <GameCard 
              key={game.title}
              game={game} 
              onStart={handleGameStart}
              wordCount={wordCount}
              isMobile={false}
              isActive={true}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 relative h-[250px] flex items-center justify-center overflow-hidden"
    >
      <AnimatePresence initial={false}>
        {gameOptions.map((game, index) => (
          <motion.div
            key={game.title}
            className="absolute w-[80%] max-w-sm"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            initial={{ x: cardPositions[index] }}
            animate={{ 
              x: cardPositions[index], 
              scale: index === currentIndex ? 1 : 0.8, 
              opacity: index === currentIndex ? 1 : 0.7,
              zIndex: index === currentIndex ? 10 : 1,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            <GameCard
              game={game}
              onStart={handleGameStart}
              wordCount={wordCount}
              isMobile={true}
              isActive={index === currentIndex}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <Button 
        onClick={prevGame} 
        size="icon" 
        variant="ghost" 
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 rounded-full h-9 w-9 bg-black/10 hover:bg-black/20 text-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button 
        onClick={nextGame} 
        size="icon" 
        variant="ghost" 
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 rounded-full h-9 w-9 bg-black/10 hover:bg-black/20 text-white"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </motion.div>
  );
};

export default GameSelection;