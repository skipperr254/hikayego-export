import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { X, Trophy, Zap, ChevronLeft, ChevronRight, Play, Settings, Timer, Moon, Sun, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Seo from '@/components/Seo';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from '@/components/ui/switch';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const PAIRS_PER_SET = 6;

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const sortWordsBySRS = (words) => {
    return [...words].sort((a, b) => {
        const getWeight = (w) => {
            let weight = ((w.incorrect_count || 0) + 1) / ((w.correct_count || 0) + 1);
            if (w.needs_review) weight += 3;
            if (w.is_learned) weight -= 3;
            if (w.added_at) {
                const daysOld = (Date.now() - new Date(w.added_at).getTime()) / (1000 * 60 * 60 * 24);
                weight += Math.min(daysOld * 0.1, 1.5); 
            }
            return weight;
        };
        return getWeight(b) - getWeight(a) + (Math.random() - 0.5) * 0.5;
    });
};

const ConfettiBurst = () => {
  const colors = ["#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"];
  const confettiCount = 100;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-50">
      {Array.from({ length: confettiCount }).map((_, i) => {
        const angle = Math.random() * 360;
        const radius = Math.random() * 200 + 100;
        const x = Math.cos(angle * (Math.PI / 180)) * radius;
        const y = Math.sin(angle * (Math.PI / 180)) * radius;
        const size = Math.random() * 8 + 4;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              backgroundColor: colors[i % colors.length],
              width: size,
              height: size,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              x: x,
              y: y,
              opacity: [1, 1, 0],
              scale: [1, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 1.5 + 1,
              ease: "easeOut",
              delay: 0.1,
            }}
          />
        );
      })}
    </div>
  );
};

const MatchingGameSetup = ({ onStart }) => {
    const { user, canAccessPremiumFeatures } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [categories, setCategories] = useState([]);
    const [allWords, setAllWords] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [setCount, setSetCount] = useState(1);

    useEffect(() => {
        if (!user) return;
        
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: wordsData, error: wordsError } = await supabase.from('user_saved_words').select('id, category_id').eq('user_id', user.id);
                if (wordsError) throw wordsError;
                setAllWords(wordsData || []);

                if (canAccessPremiumFeatures) {
                    const { data: catData, error: catError } = await supabase.from('word_categories').select('*').eq('user_id', user.id);
                    if (catError) throw catError;
                    setCategories(catData || []);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast({ title: "Veri Yükleme Hatası", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, canAccessPremiumFeatures, toast]);

    const wordsInSelectedCategory = useMemo(() => {
        if (selectedCategory === 'all') return allWords;
        return allWords.filter(w => w.category_id === parseInt(selectedCategory));
    }, [selectedCategory, allWords]);
    
    const maxSets = useMemo(() => {
        const availablePairs = Math.floor(wordsInSelectedCategory.length);
        return Math.min(6, Math.floor(availablePairs / PAIRS_PER_SET));
    }, [wordsInSelectedCategory]);

    useEffect(() => {
      if (setCount > maxSets) {
        setSetCount(Math.max(1, maxSets));
      }
    }, [maxSets, setCount]);

    const handleSetCountChange = (amount) => {
        setSetCount(prev => {
            const newCount = prev + amount;
            if (newCount < 1 || newCount > maxSets) {
                return prev;
            }
            return newCount;
        });
    };

    const handleStart = () => {
        onStart({ categoryId: selectedCategory, setCount });
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full"><Skeleton className="w-full max-w-lg h-96" /></div>;
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm md:max-w-md">
            <Card className="shadow-2xl bg-card/80 backdrop-blur-sm border-border/20 rounded-2xl">
                <CardHeader className="text-center p-8">
                    <Zap className="mx-auto h-12 w-12 text-primary mb-4" />
                    <CardTitle className="text-3xl font-bold">Eşleştirme Oyunu</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">Akıllı SRS algoritması ile pratik yapın</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 px-6 pb-8">
                     <div className="space-y-4">
                        <Label className="font-semibold flex items-center gap-2"><Settings className="h-5 w-5"/> Kategori Seç</Label>
                        <Select onValueChange={setSelectedCategory} defaultValue="all" disabled={!canAccessPremiumFeatures}>
                            <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tüm Kelimeler ({allWords.length})</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                        {cat.name} ({allWords.filter(w => w.category_id === cat.id).length})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {!canAccessPremiumFeatures && <p className="text-xs text-muted-foreground text-center">Özel kategoriler için Premium üyelik gerekir.</p>}
                    </div>

                    <div className="space-y-4 text-center">
                        <Label className="font-semibold">Set Sayısı</Label>
                        <div className="flex items-center justify-center gap-4">
                            <Button variant="outline" size="icon" onClick={() => handleSetCountChange(-1)} disabled={setCount <= 1}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-2xl font-bold w-12 text-center">{setCount}</span>
                             <Button variant="outline" size="icon" onClick={() => handleSetCountChange(1)} disabled={setCount >= maxSets}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Maksimum {maxSets > 0 ? maxSets : 0} set oynanabilir.</p>
                         {wordsInSelectedCategory.length < PAIRS_PER_SET && <p className="text-sm text-destructive mt-2">Bu listede oynamak için yeterli kelime yok (en az {PAIRS_PER_SET} çift).</p>}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button size="lg" className="w-full h-12 text-lg" onClick={handleStart} disabled={wordsInSelectedCategory.length < PAIRS_PER_SET || maxSets === 0}>
                            <Play className="mr-2 h-5 w-5" /> Başla
                        </Button>
                        <Button variant="ghost" className="w-full" onClick={() => navigate('/activities')}>Geri Dön</Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const handleThemeChange = (checked) => {
  const newTheme = checked ? 'dark' : 'light';
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(newTheme);
  localStorage.setItem('vite-ui-theme', newTheme);
};

const GameSettingsMenu = ({ gameSettings, setGameSettings, children }) => {
  const [isDark, setIsDark] = useState(localStorage.getItem('vite-ui-theme') === 'dark');

  return (
    <div className="grid gap-4 p-4">
        {children}
        <div className="flex items-center justify-between">
        <Label htmlFor="theme-mode" className="flex items-center gap-2">
            {isDark ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-400" />}
            <span>Karanlık Mod</span>
        </Label>
        <Switch
            id="theme-mode"
            checked={isDark}
            onCheckedChange={(checked) => {
                setIsDark(checked);
                handleThemeChange(checked);
            }}
        />
        </div>
        <div className="flex items-center justify-between">
        <Label htmlFor="sound-effects" className="flex items-center gap-2">
            {gameSettings.soundEffects ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            <span>Ses Efektleri</span>
        </Label>
        <Switch
            id="sound-effects"
            checked={gameSettings.soundEffects}
            onCheckedChange={(checked) => setGameSettings(prev => ({ ...prev, soundEffects: checked }))}
        />
        </div>
        <div className="flex items-center justify-between">
        <Label htmlFor="reduce-motion" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span>Animasyonları Azalt</span>
        </Label>
        <Switch
            id="reduce-motion"
            checked={gameSettings.reduceMotion}
            onCheckedChange={(checked) => setGameSettings(prev => ({ ...prev, reduceMotion: checked }))}
        />
        </div>
    </div>
  );
};

const GameSettingsDisplay = ({ gameSettings, setGameSettings }) => {
    const isMobile = useMediaQuery("(max-width: 768px)");

    if (isMobile) {
        return (
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full shrink-0">
                        <Settings className="h-5 w-5 md:h-6 md:w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-2xl">
                    <GameSettingsMenu gameSettings={gameSettings} setGameSettings={setGameSettings}>
                        <SheetHeader>
                            <SheetTitle>Oyun Ayarları</SheetTitle>
                            <SheetDescription>Oyun deneyiminizi kişiselleştirin.</SheetDescription>
                        </SheetHeader>
                    </GameSettingsMenu>
                    <SheetFooter>
                        <SheetTrigger asChild>
                            <Button>Kapat</Button>
                        </SheetTrigger>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full shrink-0">
                    <Settings className="h-6 w-6" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <GameSettingsMenu gameSettings={gameSettings} setGameSettings={setGameSettings}>
                    <div className="space-y-2">
                        <p className="font-medium">Oyun Ayarları</p>
                        <p className="text-sm text-muted-foreground">Oyun deneyiminizi kişiselleştirin.</p>
                    </div>
                </GameSettingsMenu>
            </PopoverContent>
        </Popover>
    );
};


const GameScreen = ({ settings, onExit }) => {
  const [allGameWords, setAllGameWords] = useState([]);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentSetWords, setCurrentSetWords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mismatched, setMismatched] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameFinished, setGameFinished] = useState(false);
  const [timer, setTimer] = useState(0);
  const [gameSettings, setGameSettings] = useState({
    soundEffects: true,
    reduceMotion: false,
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const timerRef = useRef(null);

  const setupGame = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setGameFinished(false);
    setCurrentSetIndex(0);

    let query = supabase.from('user_saved_words').select('*').eq('user_id', user.id);
    if (settings.categoryId && settings.categoryId !== 'all') {
      query = query.eq('category_id', settings.categoryId);
    }
    const { data, error } = await query;
    
    if (error) {
        toast({title: "Hata", description: "Kelimeler yüklenemedi", variant: "destructive"});
        onExit(); return;
    }
    
    const requiredWords = settings.setCount * PAIRS_PER_SET;
    if (!data || data.length < requiredWords) {
        toast({title: "Yetersiz Kelime", description: `Bu oyunu oynamak için ${requiredWords} kelimeye ihtiyacınız var.`, variant: "destructive"});
        onExit(); return;
    }
    
    // Apply SRS Sort instead of generic shuffle to pick the hardest words
    const srsSortedWords = sortWordsBySRS(data).slice(0, requiredWords);
    // Shuffle the final selection so they don't always appear in exact priority order
    setAllGameWords(shuffleArray(srsSortedWords));
    
    setLoading(false);
  }, [user, settings, toast, onExit]);

  const startSet = useCallback((setIndex) => {
    const startIndex = setIndex * PAIRS_PER_SET;
    const endIndex = startIndex + PAIRS_PER_SET;
    const wordsForSet = allGameWords.slice(startIndex, endIndex);

    const wordCards = wordsForSet.map(w => ({ id: w.id, text: w.word, type: 'en' }));
    const translationCards = wordsForSet.map(w => ({ id: w.id, text: w.translation, type: 'tr' }));
    
    setCurrentSetWords(shuffleArray([...wordCards, ...translationCards]));
    setMatchedPairs([]);
    setSelected(null);
    setMismatched([]);
  }, [allGameWords]);

  useEffect(() => {
    setupGame();
  }, [setupGame]);

  useEffect(() => {
    if (allGameWords.length > 0) {
      startSet(0);
      setTimer(0);
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [allGameWords, startSet]);
  
  const handleCardClick = (card) => {
    if (matchedPairs.includes(card.id) || (selected && selected.text === card.text && selected.type === card.type) || mismatched.length > 0) return;

    if (!selected) {
      setSelected(card);
    } else {
      if (selected.id === card.id && selected.type !== card.type) {
        setMatchedPairs(prev => [...prev, card.id]);
        setSelected(null);
      } else {
        setMismatched([selected, card]);
        setTimeout(() => {
          setSelected(null);
          setMismatched([]);
        }, 500);
      }
    }
  };
  
  const goToNextSet = useCallback(() => {
    const nextSetIndex = currentSetIndex + 1;
    if (nextSetIndex < settings.setCount) {
        setCurrentSetIndex(nextSetIndex);
        startSet(nextSetIndex);
    } else {
        setGameFinished(true);
        clearInterval(timerRef.current);
    }
  }, [currentSetIndex, settings.setCount, startSet]);

  useEffect(() => {
    if (currentSetWords.length > 0 && matchedPairs.length === PAIRS_PER_SET) {
      setTimeout(goToNextSet, 500);
    }
  }, [matchedPairs, currentSetWords.length, goToNextSet]);
  

  if (loading) {
    return <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-4 w-full h-full p-4">
      {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="w-full h-full rounded-lg" />)}
    </div>;
  }
  
  const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col items-center p-3 md:p-4">
      <header className="w-full flex items-center justify-between mb-4 md:mb-8 flex-shrink-0 gap-2">
        <Button variant="outline" size="icon" onClick={onExit} className="rounded-full w-10 h-10 md:w-12 md:h-12 border-2 shadow-sm shrink-0">
            <X className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
        
        {/* Optimized minimalist header for mobile */}
        <div className="flex-1 flex justify-center min-w-0">
            <div className="flex items-center gap-1.5 md:gap-3 p-1.5 bg-card/80 border-2 border-border/20 rounded-full shadow-md backdrop-blur-sm overflow-hidden">
                <div className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 bg-background/80 rounded-full shrink-0">
                    <Zap className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    <span className="font-bold text-sm md:text-lg text-foreground whitespace-nowrap">{currentSetIndex + 1} <span className="text-muted-foreground hidden sm:inline">/ {settings.setCount}</span></span>
                </div>
                 <div className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 bg-background/80 rounded-full shrink-0">
                    <Timer className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    <span className="font-mono font-bold text-sm md:text-lg text-foreground tracking-wider">{formatTime(timer)}</span>
                </div>
            </div>
        </div>

        <GameSettingsDisplay gameSettings={gameSettings} setGameSettings={setGameSettings} />
      </header>

      <main className="flex-1 flex items-center justify-center w-full h-full overflow-hidden">
        <AnimatePresence mode="wait">
          {gameFinished ? (
            <motion.div key="finished" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence>
                {!gameSettings.reduceMotion && <ConfettiBurst />}
              </AnimatePresence>
              <Card className="p-8 md:p-12 max-w-lg w-full shadow-2xl bg-card/80 backdrop-blur-sm rounded-2xl z-10">
                <CardContent className="p-0 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}>
                    <Trophy className="h-24 w-24 mx-auto text-amber-400 mb-6" />
                  </motion.div>
                  <h2 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">Harika İş!</h2>
                  <p className="text-muted-foreground text-lg mb-4">{settings.setCount} seti başarıyla tamamladın.</p>
                  <p className="text-muted-foreground text-lg mb-8">Toplam Süre: <span className="font-bold text-foreground text-xl">{formatTime(timer)}</span></p>
                  <div className="flex gap-4 justify-center">
                    <Button size="lg" onClick={onExit}>Bitir</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key={currentSetIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: gameSettings.reduceMotion ? 0 : 0.2 }}
              className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-4 w-full h-full pb-2 md:p-4"
            >
              {currentSetWords.map((card) => {
                const isMatched = matchedPairs.includes(card.id);
                const isSelected = selected?.text === card.text && selected?.type === card.type;
                const isMismatched = mismatched.some(m => m.text === card.text && m.type === card.type);
                
                return (
                  <motion.div
                    key={`${card.id}-${card.type}`}
                    layout
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ 
                      opacity: isMatched ? 0 : 1,
                      scale: isMatched ? 0.5 : 1,
                      rotate: isMismatched && !gameSettings.reduceMotion ? [0, -2, 2, -2, 2, 0] : 0,
                    }}
                    transition={gameSettings.reduceMotion ? { duration: 0.1 } : { 
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.3 },
                      rotate: { duration: 0.4 }
                    }}
                    className="w-full h-full"
                  >
                    <Card
                      onClick={() => handleCardClick(card)}
                      className={cn(
                        "w-full h-full flex items-center justify-center p-1.5 md:p-2 text-center font-bold text-[13px] md:text-base cursor-pointer transition-colors duration-200 shadow-sm",
                        "border-2 break-words leading-tight rounded-xl md:rounded-2xl",
                        isSelected ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/50",
                        isMismatched && "bg-destructive/20 border-destructive",
                      )}
                    >
                      {card.text}
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};


const MatchingGamePage = () => {
    const [gameState, setGameState] = useState('setup');
    const [gameSettings, setGameSettings] = useState(null);

    const handleStartGame = (settings) => {
        setGameSettings(settings);
        setGameState('playing');
    };

    const handleExitGame = () => {
        setGameState('setup');
        setGameSettings(null);
        
        const currentTheme = localStorage.getItem('vite-ui-theme') || 'light';
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(currentTheme);
    };

    return (
        <>
            <Seo title="Eşleştirme Oyunu" description="İngilizce kelimeleri Türkçe anlamlarıyla eşleştirerek pratik yapın." />
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-background overflow-hidden">
               {gameState === 'setup' ? (
                   <div className="p-4 flex items-center justify-center w-full h-full">
                     <MatchingGameSetup onStart={handleStartGame} />
                   </div>
               ) : (
                   <GameScreen settings={gameSettings} onExit={handleExitGame} />
               )}
            </div>
        </>
    );
};

export default MatchingGamePage;