import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
    X, ArrowLeft, ArrowRight, Brain, CheckCircle, Star, Maximize, Search, Play, Layers, Pause, 
    RefreshCw, Trophy, Home, Settings, Music2, Wind, BookOpen, Moon, Sun
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Seo from '@/components/Seo';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeProvider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const sortWordsBySRS = (words) => {
    return [...words].sort((a, b) => {
        const getWeight = (w) => {
            let weight = ((w.incorrect_count || 0) + 1) / ((w.correct_count || 0) + 1);
            if (w.needs_review) weight += 5;
            if (w.is_learned) weight -= 5;
            // Add a small time-based decay factor if added_at is available
            if (w.added_at) {
                const daysOld = (Date.now() - new Date(w.added_at).getTime()) / (1000 * 60 * 60 * 24);
                weight += Math.min(daysOld * 0.1, 2); 
            }
            return weight;
        };
        // Sort descending by weight, with slight randomness
        return getWeight(b) - getWeight(a) + (Math.random() - 0.5) * 0.5;
    });
};

const FlashcardSetup = ({ onStart }) => {
    const { user, canAccessPremiumFeatures } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [categories, setCategories] = useState([]);
    const [allWords, setAllWords] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [wordCount, setWordCount] = useState(10);
    const [wordListType, setWordListType] = useState('unlearned');
    
    useEffect(() => {
        if (!user) return;
        
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: wordsData, error: wordsError } = await supabase
                    .from('user_saved_words')
                    .select('id, category_id, is_learned, needs_review')
                    .eq('user_id', user.id);
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
        let baseFilteredWords = selectedCategory === 'all' 
            ? allWords 
            : allWords.filter(w => w.category_id === parseInt(selectedCategory));

        if (wordListType === 'unlearned') {
            return baseFilteredWords.filter(w => !w.is_learned);
        }
        if (wordListType === 'review') {
            return baseFilteredWords.filter(w => w.needs_review);
        }
        return baseFilteredWords;
    }, [selectedCategory, allWords, wordListType]);
    
    const unlearnedWords = useMemo(() => allWords.filter(w => 
        (selectedCategory === 'all' || w.category_id === parseInt(selectedCategory)) && !w.is_learned
    ).length, [selectedCategory, allWords]);
    
    const reviewWords = useMemo(() => allWords.filter(w => 
        (selectedCategory === 'all' || w.category_id === parseInt(selectedCategory)) && w.needs_review
    ).length, [selectedCategory, allWords]);

    const totalWordsInCategory = useMemo(() => {
      if (selectedCategory === 'all') return allWords.length;
      return allWords.filter(w => w.category_id === parseInt(selectedCategory)).length;
    }, [selectedCategory, allWords]);


    useEffect(() => {
        const availableWords = wordsInSelectedCategory.length;
        if (availableWords > 0) {
            setWordCount(prevCount => Math.min(prevCount, availableWords) || 10);
        } else {
            setWordCount(10);
        }
    }, [wordsInSelectedCategory.length, wordListType, selectedCategory]);

    const handleStart = () => {
        if (wordsInSelectedCategory.length < 1) {
            toast({ title: "Yetersiz Kelime", description: "Seçili kriterlere uygun kelime bulunamadı.", variant: "destructive" });
            return;
        }
        
        let query = supabase
            .from('user_saved_words')
            .select('*')
            .eq('user_id', user.id);
        
        if (selectedCategory && selectedCategory !== 'all') {
            query = query.eq('category_id', selectedCategory);
        }

        if(wordListType === 'unlearned') {
            query = query.eq('is_learned', false);
        }
        
        if(wordListType === 'review') {
            query = query.eq('needs_review', true);
        }

        query.then(({ data, error }) => {
            if (error) {
                console.error('Error fetching words:', error);
                toast({ title: "Hata", description: "Kelimeler yüklenirken bir sorun oluştu.", variant: "destructive" });
            } else {
                const finalWordCount = Math.min(wordCount, data.length);
                // Apply SRS Algorithm instead of pure shuffle
                const selectedWords = sortWordsBySRS(data).slice(0, finalWordCount);
                // Optionally shuffle the selected subset slightly to avoid exact same order every time
                onStart({ words: selectedWords.sort(() => Math.random() - 0.5) });
            }
        });
    };
    
    if (loading) {
        return <div className="flex items-center justify-center h-full"><Skeleton className="w-full max-w-lg h-96" /></div>;
    }
    
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
            <Card className="shadow-2xl bg-card/80 backdrop-blur-sm border-border/20">
                <CardHeader className="text-center p-8">
                    <Layers className="mx-auto h-12 w-12 text-primary mb-4" />
                    <CardTitle className="text-3xl font-bold">Bilgi Kartı</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">Akıllı Tekrar (SRS) ile çalış</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                     <div className="space-y-6">
                        <Label className="text-lg font-semibold">Ne Çalışmak İstersin?</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Select onValueChange={setSelectedCategory} defaultValue="all" disabled={!canAccessPremiumFeatures}>
                                <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tüm Kategoriler ({allWords.length})</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.name} ({allWords.filter(w => w.category_id === cat.id).length})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={setWordListType} defaultValue="unlearned">
                                <SelectTrigger className="h-12 text-base"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unlearned">Henüz Öğrenilmemiş ({unlearnedWords})</SelectItem>
                                    <SelectItem value="review">Gözden Geçirilecekler ({reviewWords})</SelectItem>
                                    <SelectItem value="all">Tümü ({totalWordsInCategory})</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         {!canAccessPremiumFeatures && <p className="text-sm text-muted-foreground pt-1 text-center">Özel kategoriler için Premium üyelik gerekir.</p>}
                    </div>

                    <div className="space-y-4">
                         <Label className="text-lg font-semibold">Kelime Sayısı: <span className="text-primary font-bold">{wordCount}</span></Label>
                         <Slider
                            min={1}
                            max={Math.max(1, wordsInSelectedCategory.length)}
                            step={1}
                            value={[wordCount]}
                            onValueChange={(val) => setWordCount(val[0])}
                            disabled={wordsInSelectedCategory.length < 1}
                         />
                         {wordsInSelectedCategory.length < 1 && <p className="text-sm text-destructive">Bu listede oynanacak kelime yok.</p>}
                    </div>

                    <Button size="lg" className="w-full h-14 text-xl" onClick={handleStart} disabled={wordsInSelectedCategory.length < 1}>
                        <Play className="mr-2 h-6 w-6" /> Başla
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/activities')}>Aktivitelere Geri Dön</Button>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const Flashcard = ({ word, translation, isFlipped, onClick, hint }) => {
  return (
    <div className="w-full h-full aspect-[4/3] sm:aspect-[2.2] md:aspect-[2.8] perspective-1000" onClick={onClick}>
       <div className="relative w-full h-full cursor-pointer select-none">
        <motion.div
          className="relative w-full h-full transform-style-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-6 bg-card border rounded-2xl shadow-lg">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center capitalize">{word}</h2>
            {hint && <p className="mt-4 text-xl md:text-2xl text-muted-foreground tracking-widest">{hint}</p>}
          </div>
          <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-card border rounded-2xl shadow-lg transform-rotate-y-180">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center capitalize">{translation}</h2>
          </div>
        </motion.div>
      </div>
    </div>
  );
};


const GameScreen = ({ words: initialWords, onExit, onFinish }) => {
    const [allFetchedWords, setAllFetchedWords] = useState(initialWords);
    const [words, setWords] = useState(initialWords);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [hint, setHint] = useState('');
    const [hintLevel, setHintLevel] = useState(0);
    const [showNoStarredWordsDialog, setShowNoStarredWordsDialog] = useState(false);

    const { user } = useAuth();
    const { toast } = useToast();
    const containerRef = useRef(null);
    const cardContainerRef = useRef(null);
    const autoplayIntervalRef = useRef(null);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const { theme, setTheme } = useTheme();

    const [gameSettings, setGameSettings] = useState({
        soundEffects: true,
        autoPlay: false,
        autoPlaySpeed: 3,
        frontFace: 'en',
        starredOnly: false,
    });
    
    useEffect(() => {
        const node = containerRef.current;
        if (node && isMobile) {
            const preventDefault = (e) => e.preventDefault();
            node.addEventListener('touchmove', preventDefault, { passive: false });
            return () => {
                node.removeEventListener('touchmove', preventDefault);
            };
        }
    }, [isMobile]);

    const handleSettingChange = (key, value) => {
        if (key === 'starredOnly' && value === true) {
            const starredWords = allFetchedWords.filter(w => w.is_starred);
            if (starredWords.length === 0) {
                setShowNoStarredWordsDialog(true);
                return;
            }
        }
        setGameSettings(prev => ({...prev, [key]: value}));
    };
  
    useEffect(() => {
        const currentWordId = words[currentIndex]?.id;
        const newWords = gameSettings.starredOnly 
            ? allFetchedWords.filter(w => w.is_starred)
            : allFetchedWords;
        
        if (gameSettings.starredOnly && newWords.length === 0) {
            return;
        }

        setWords(newWords);

        if (newWords.length > 0) {
             const newIndex = newWords.findIndex(w => w.id === currentWordId);
             if (newIndex !== -1) {
                 setCurrentIndex(newIndex);
             } else {
                 setCurrentIndex(0);
             }
        } else {
            setCurrentIndex(0);
        }

    }, [gameSettings.starredOnly, allFetchedWords]);
  
    const handleToggleStar = async () => {
        const currentWord = words[currentIndex];
        if (!currentWord) return;

        const newStarredState = !currentWord.is_starred;
        
        const updateWordState = (wordList) => wordList.map(w => 
            w.id === currentWord.id ? { ...w, is_starred: newStarredState } : w
        );
        
        setWords(updateWordState);
        setAllFetchedWords(updateWordState);


        const { error } = await supabase
            .from('user_saved_words')
            .update({ is_starred: newStarredState })
            .eq('id', currentWord.id)
            .eq('user_id', user.id);

        if (error) {
            console.error("Error updating star status:", error);
            toast({ title: "Hata", description: "Kelime yıldızlanırken bir sorun oluştu.", variant: "destructive" });
             const revertWordState = (wordList) => wordList.map(w => 
                w.id === currentWord.id ? { ...w, is_starred: !newStarredState } : w
            );
            setWords(revertWordState);
            setAllFetchedWords(revertWordState);
        } else {
            if (newStarredState) {
                toast({
                    title: "Kelime yıldızlandı!",
                    icon: <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                });
            }
        }
    };
  
    const resetHintsAndFlip = () => {
        setIsFlipped(false);
        setHint('');
        setHintLevel(0);
    }

    const handleNext = useCallback(() => {
        if (currentIndex < words.length - 1) {
            setDirection(1);
            setCurrentIndex(prev => prev + 1);
            resetHintsAndFlip();
        } else {
            handleSettingChange('autoPlay', false);
            onFinish({ totalWords: words.length });
        }
    }, [currentIndex, words.length, onFinish]);

    const handlePrev = useCallback(() => {
        if (currentIndex > 0) {
            setDirection(-1);
            setCurrentIndex(prev => prev - 1);
            resetHintsAndFlip();
        }
    }, [currentIndex]);
  
    const handleFlip = useCallback(() => {
        setIsFlipped(f => !f);
        if(!isFlipped) setHint('');
    }, [isFlipped]);

    const handleLearned = async () => {
        const currentWord = words[currentIndex];
        if (!currentWord || currentWord.needs_review) return;

        const newLearnedState = !currentWord.is_learned;
        
        const updateWordState = (wordList) => wordList.map(w => 
            w.id === currentWord.id ? { ...w, is_learned: newLearnedState } : w
        );

        setWords(updateWordState);
        setAllFetchedWords(updateWordState);

        const { error } = await supabase
            .from('user_saved_words')
            .update({ is_learned: newLearnedState })
            .eq('id', currentWord.id);
        
        if (error) {
            toast({ title: "Hata", description: "Durum güncellenemedi.", variant: "destructive" });
            const revertWordState = (wordList) => wordList.map(w => 
                w.id === currentWord.id ? { ...w, is_learned: !newLearnedState } : w
            );
            setWords(revertWordState);
            setAllFetchedWords(revertWordState);
        } else {
            if (newLearnedState) {
                toast({ 
                    title: "Öğrenildi olarak işaretlendi!",
                    icon: <CheckCircle className="h-5 w-5 text-green-500" />
                });
                setTimeout(handleNext, 300);
            }
        }
    };
    
    const handleNeedsReview = async () => {
        const currentWord = words[currentIndex];
        if (!currentWord || currentWord.is_learned) return;

        const newReviewState = !currentWord.needs_review;

        const updateWordState = (wordList) => wordList.map(w => 
            w.id === currentWord.id ? { ...w, needs_review: newReviewState } : w
        );
        setWords(updateWordState);
        setAllFetchedWords(updateWordState);
        
        const { error } = await supabase
            .from('user_saved_words')
            .update({ needs_review: newReviewState })
            .eq('id', currentWord.id);

        if (error) {
            toast({ title: "Hata", description: "Durum güncellenemedi.", variant: "destructive" });
            const revertWordState = (wordList) => wordList.map(w => 
                w.id === currentWord.id ? { ...w, needs_review: !newReviewState } : w
            );
            setWords(revertWordState);
            setAllFetchedWords(revertWordState);
        } else {
            if (newReviewState) {
                toast({ 
                    title: "Gözden geçirilecek!",
                    icon: <Brain className="h-5 w-5 text-blue-500" />
                });
                setTimeout(handleNext, 300);
            }
        }
    };
  
    const showHint = () => {
        if (isFlipped) return;
        const hintWord = gameSettings.frontFace === 'en' ? words[currentIndex]?.translation : words[currentIndex]?.word;
        if (!hintWord) return;

        const newHintLevel = hintLevel + 1;
        if (newHintLevel > hintWord.length) return;

        setHintLevel(newHintLevel);
        const revealed = hintWord.substring(0, newHintLevel);
        const hidden = ' _'.repeat(hintWord.length - newHintLevel).trim();
        setHint(revealed + hidden);
    };
  
    useEffect(() => {
        if (gameSettings.autoPlay) {
            clearInterval(autoplayIntervalRef.current);
            const flipDuration = 500;
            const showBackDuration = 1500;
            const totalCycle = gameSettings.autoPlaySpeed * 1000;
            
            if (totalCycle < flipDuration + showBackDuration) {
                console.warn("Autoplay speed is too fast for animations.");
            }

            autoplayIntervalRef.current = setInterval(() => {
                setIsFlipped(true);
                setTimeout(() => {
                    handleNext();
                }, showBackDuration);
            }, totalCycle);
        } else {
            clearInterval(autoplayIntervalRef.current);
        }
        return () => clearInterval(autoplayIntervalRef.current);
    }, [gameSettings.autoPlay, gameSettings.autoPlaySpeed, handleNext, currentIndex]);


    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => alert(`Error: ${err.message}`));
        } else { document.exitFullscreen(); }
    };
  
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameSettings.autoPlay) return;
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleFlip();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev, handleFlip, gameSettings.autoPlay]);

    const handleDragEnd = (event, info) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;
    
        if (offset < -100 || velocity < -500) {
            handleNext();
        } else if (offset > 100 || velocity > 500) {
            handlePrev();
        }
    };

    const cardVariants = {
        enter: (direction) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0,
            scale: 0.8
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? "100%" : "-100%",
            opacity: 0,
            scale: 0.8
        }),
    };

    const currentWordData = words[currentIndex];
    const progress = words.length > 0 ? ((currentIndex + 1) / words.length) * 100 : 0;
    const isCurrentWordLearned = currentWordData?.is_learned;
    const doesCurrentWordNeedReview = currentWordData?.needs_review;

    if (!words || words.length === 0) return (
        <div className="flex flex-col items-center justify-center text-center p-4 h-full">
            <Card className="w-full max-w-md p-8">
                <CardTitle className="text-2xl mb-4">Kelime Bulunamadı</CardTitle>
                <CardDescription>Seçtiğiniz kriterlere uygun kelime bulunamadı. Lütfen ayarlarınızı değiştirip tekrar deneyin.</CardDescription>
                <Button onClick={onExit} className="mt-6">Ayarlara Geri Dön</Button>
            </Card>
        </div>
    );

    const frontWord = gameSettings.frontFace === 'en' ? currentWordData?.word : currentWordData?.translation;
    const backWord = gameSettings.frontFace === 'en' ? currentWordData?.translation : currentWordData?.word;

    const SettingsContent = () => (
        <div className="space-y-6 p-1">
            <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode-switch" className="flex items-center gap-2 text-base">
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    Karanlık Tema
                </Label>
                <Switch id="dark-mode-switch" checked={theme === 'dark'} onCheckedChange={(v) => setTheme(v ? 'dark' : 'light')} />
            </div>
            <div className="space-y-3">
                <Label className="flex items-center gap-2 text-base"><BookOpen className="h-5 w-5" /> Ön Yüz</Label>
                <RadioGroup
                    value={gameSettings.frontFace}
                    onValueChange={(v) => handleSettingChange('frontFace', v)}
                    className="grid grid-cols-2 gap-2"
                >
                    <Label className={cn("flex items-center justify-center gap-2 rounded-md border p-3 font-semibold cursor-pointer transition-colors", gameSettings.frontFace === 'en' && "bg-primary text-primary-foreground border-primary")}>
                        <RadioGroupItem value="en" id="face-en" className="sr-only" />
                        İngilizce
                    </Label>
                    <Label className={cn("flex items-center justify-center gap-2 rounded-md border p-3 font-semibold cursor-pointer transition-colors", gameSettings.frontFace === 'tr' && "bg-primary text-primary-foreground border-primary")}>
                        <RadioGroupItem value="tr" id="face-tr" className="sr-only" />
                        Türkçe
                    </Label>
                </RadioGroup>
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="starred-only-switch" className="flex items-center gap-2 text-base"><Star className="h-5 w-5" /> Sadece Yıldızlılar</Label>
                <Switch id="starred-only-switch" checked={gameSettings.starredOnly} onCheckedChange={(v) => handleSettingChange('starredOnly', v)} />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="autoplay-switch" className="flex items-center gap-2 text-base"><Play className="h-5 w-5" /> Otomatik Oynat</Label>
                <Switch id="autoplay-switch" checked={gameSettings.autoPlay} onCheckedChange={(v) => handleSettingChange('autoPlay', v)} />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="sound-switch" className="flex items-center gap-2 text-base"><Music2 className="h-5 w-5" /> Ses Efektleri</Label>
                <Switch id="sound-switch" checked={gameSettings.soundEffects} onCheckedChange={(v) => handleSettingChange('soundEffects', v)} />
            </div>
            <div className="space-y-3">
                <Label className="flex items-center gap-2 text-base"><Wind className="h-5 w-5" /> Oynatma Hızı: <span className="font-bold">{gameSettings.autoPlaySpeed}s</span></Label>
                <Slider min={2} max={6} step={0.5} value={[gameSettings.autoPlaySpeed]} onValueChange={(v) => handleSettingChange('autoPlaySpeed', v[0])} />
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="fixed inset-0 bg-background flex flex-col p-4 md:p-8 overflow-hidden">
            <AlertDialog open={showNoStarredWordsDialog} onOpenChange={setShowNoStarredWordsDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Yıldızlı Kelime Bulunamadı</AlertDialogTitle>
                        <AlertDialogDescription>
                            "Sadece Yıldızlılar" filtresini kullanmak için önce bazı kelimeleri yıldızlamanız gerekir.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowNoStarredWordsDialog(false)}>Anladım</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <header className="flex items-center justify-between w-full max-w-6xl mx-auto mb-4 md:mb-8 text-muted-foreground flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={onExit} className="rounded-full"><X className="h-6 w-6" /></Button>
                <Button variant="outline" size="sm" onClick={showHint} className="flex items-center gap-2 border rounded-full px-4 py-2 text-sm">
                    <Search className="h-4 w-4"/><span>İpucu göster</span>
                </Button>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={handleToggleStar}>
                        <Star className={`h-6 w-6 transition-colors ${currentWordData?.is_starred ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}/>
                    </Button>
                    {isMobile ? (
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full"><Settings className="h-6 w-6" /></Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="rounded-t-2xl">
                                <SheetHeader className="mb-4">
                                    <SheetTitle>Ayarlar</SheetTitle>
                                </SheetHeader>
                                <SettingsContent />
                            </SheetContent>
                        </Sheet>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full"><Settings className="h-6 w-6" /></Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 space-y-4">
                                <div className="space-y-1">
                                    <Label className="font-semibold text-lg">Ayarlar</Label>
                                    <p className="text-sm text-muted-foreground">Oyun içi ayarları düzenle.</p>
                                </div>
                                <SettingsContent />
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center w-full my-4 relative overflow-hidden">
                <motion.div
                    ref={cardContainerRef}
                    drag={isMobile ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    className="w-full max-w-4xl h-full relative flex items-center justify-center touch-pan-y"
                >
                    <Button variant="ghost" size="icon" disabled={isCurrentWordLearned} className={`absolute -left-4 md:-left-20 rounded-full hidden md:flex ${doesCurrentWordNeedReview ? 'bg-blue-100 dark:bg-blue-900' : ''}`} onClick={handleNeedsReview}>
                        <Brain className={`h-7 w-7 ${doesCurrentWordNeedReview ? 'text-blue-500' : 'text-gray-400'}`}/>
                        <span className="sr-only">Tekrar et</span>
                    </Button>
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={cardVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.2 }
                            }}
                            className="w-full absolute"
                        >
                            <Flashcard word={frontWord} translation={backWord} isFlipped={isFlipped} onClick={handleFlip} hint={hint} />
                        </motion.div>
                    </AnimatePresence>
                    <Button variant="ghost" size="icon" disabled={doesCurrentWordNeedReview} className={`absolute -right-4 md:-right-20 rounded-full hidden md:flex ${isCurrentWordLearned ? 'bg-green-100 dark:bg-green-900' : ''}`} onClick={handleLearned}>
                        <CheckCircle className={`h-7 w-7 ${isCurrentWordLearned ? 'text-green-500' : 'text-gray-400'}`}/>
                        <span className="sr-only">Öğrendim</span>
                    </Button>
                </motion.div>
            </main>

            <footer className="w-full max-w-4xl mx-auto mt-auto flex-shrink-0">
                <div className="w-full mb-4">
                    <Progress value={progress} className="h-2" />
                    <div className="text-center text-sm text-muted-foreground mt-2">{words.length > 0 ? `${currentIndex + 1} / ${words.length}` : '0 / 0'}</div>
                </div>
                <div className="flex items-center justify-between md:hidden gap-4">
                    <Button variant="ghost" disabled={isCurrentWordLearned} className={`flex-1 ${doesCurrentWordNeedReview ? 'text-blue-500' : ''}`} onClick={handleNeedsReview}>
                        <Brain className="h-5 w-5 mr-2"/><span>Tekrar Et</span>
                    </Button>
                    <Button variant="ghost" disabled={doesCurrentWordNeedReview} className={`flex-1 ${isCurrentWordLearned ? 'text-green-500' : ''}`} onClick={handleLearned}>
                        <CheckCircle className="h-5 w-5 mr-2"/><span>Öğrendim</span>
                    </Button>
                </div>
                <div className="text-xs text-muted-foreground hidden md:flex flex-col items-center gap-2 mb-4">
                    <div className="flex items-center gap-4">
                        <span><ArrowLeft className="inline h-3 w-3"/>/<ArrowRight className="inline h-3 w-3"/> ile gezin</span>
                        <span><kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Boşluk</kbd> ile çevir</span>
                    </div>
                </div>
                <div className="flex items-center justify-center mt-4 relative">
                    <div className="flex items-center justify-center gap-4">
                        <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentIndex === 0 || gameSettings.autoPlay} className="rounded-full w-14 h-14"><ArrowLeft className="h-6 w-6" /></Button>
                        <Button variant="ghost" size="icon" className="rounded-full w-14 h-14" onClick={() => handleSettingChange('autoPlay', !gameSettings.autoPlay)}>{gameSettings.autoPlay ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}</Button>
                        <Button variant="outline" size="icon" onClick={handleNext} disabled={gameSettings.autoPlay} className="rounded-full w-14 h-14"><ArrowRight className="h-6 w-6" /></Button>
                    </div>
                    {!isMobile && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2">
                            <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleFullScreen}><Maximize className="h-5 w-5" /></Button>
                        </div>
                    )}
                </div>
            </footer>
        </div>
    );
}

const ConfettiPiece = ({ x, y, rotate }) => (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        backgroundColor: `hsl(${Math.random() * 360}, 90%, 70%)`,
        width: '8px',
        height: '16px',
        borderRadius: '4px',
      }}
      initial={{ y: -20, opacity: 0 }}
      animate={{
        y: [y, y + 200, y + 500],
        x: [x, x + (Math.random() - 0.5) * 200, x + (Math.random() - 0.5) * 400],
        rotate: [0, rotate, rotate * 2],
        opacity: [1, 1, 0],
      }}
      transition={{ duration: Math.random() * 2 + 3, ease: 'linear' }}
    />
);

const FinishScreen = ({ stats, onRestart, onExit }) => {
    const confetti = Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * -20,
        rotate: Math.random() * 360,
    }));

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-background/50 backdrop-blur-sm z-50">
            <AnimatePresence>
                {confetti.map(c => <ConfettiPiece key={c.id} {...c} />)}
            </AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 50 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative text-center p-6 sm:p-8 bg-card rounded-2xl shadow-2xl w-full max-w-md"
            >
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [-10, 10, -10, 0] }}
                    transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.2 }}
                    className="mx-auto h-24 w-24 sm:h-28 sm:w-28 text-yellow-400 bg-yellow-400/10 rounded-full flex items-center justify-center mb-6"
                >
                    <Trophy className="h-14 w-14 sm:h-16 sm:w-16" />
                </motion.div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">Harika İş!</h1>
                <p className="text-base sm:text-lg text-muted-foreground mb-8">
                    {stats.totalWords} kelimeyi başarıyla tekrar ettin.
                </p>
                <div className="flex flex-col gap-4">
                    <Button onClick={onRestart} className="w-full h-14 text-lg rounded-xl">
                        <RefreshCw className="mr-2 h-5 w-5" />
                        Tekrar Oyna
                    </Button>
                    <Button onClick={onExit} variant="outline" className="w-full h-14 text-lg rounded-xl">
                        <Home className="mr-2 h-5 w-5" />
                        Çıkış
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

const FlashcardGamePage = () => {
    const [gameState, setGameState] = useState('setup');
    const [gameWords, setGameWords] = useState([]);
    const [gameStats, setGameStats] = useState(null);
    const navigate = useNavigate();

    const handleStartGame = (settings) => {
        setGameWords(settings.words);
        setGameState('playing');
    };

    const handleFinishGame = (stats) => {
        setGameStats(stats);
        setGameState('finished');
    };

    const handleRestartGame = () => {
        setGameStats(null);
        setGameWords([]);
        setGameState('setup');
    }

    const handleExitGame = () => {
        setGameState('setup');
        setGameWords([]);
        setGameStats(null);
        navigate('/activities');
    };

    return (
        <>
            <Seo title="Bilgi Kartı" description="Kaydettiğiniz kelimeleri bilgi kartları ile tekrar edin." />
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/50 to-background p-4 relative overflow-hidden">
               <AnimatePresence mode="wait">
                 {gameState === 'setup' && (
                    <motion.div key="setup" exit={{ opacity: 0, scale: 0.95 }}>
                        <FlashcardSetup onStart={handleStartGame} />
                    </motion.div>
                 )}
                 {gameState === 'playing' && (
                    <motion.div key="playing" className="w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <GameScreen words={gameWords} onExit={handleRestartGame} onFinish={handleFinishGame} />
                    </motion.div>
                 )}
               </AnimatePresence>
               <AnimatePresence>
                {gameState === 'finished' && (
                        <FinishScreen stats={gameStats} onRestart={handleRestartGame} onExit={handleExitGame} />
                 )}
               </AnimatePresence>
            </div>
        </>
    );
};

export default FlashcardGamePage;