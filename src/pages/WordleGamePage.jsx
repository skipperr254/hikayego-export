import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, AlertCircle, BookOpen, Lightbulb, Settings, Info, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import WordleKeyboard from '@/components/activities/WordleKeyboard';
import WordleResults from '@/components/activities/WordleResults';
import WordleGameSetup from '@/components/activities/WordleGameSetup';
import WordleHintDisplay from '@/components/activities/WordleHintDisplay';
import WordleSettings from '@/components/activities/WordleSettings';
import WordleHowToPlay from '@/components/activities/WordleHowToPlay';
import Seo from '@/components/Seo';
import ErrorBoundary from '@/components/ErrorBoundary';
import { cn } from '@/lib/utils';
import { getWordDefinitions, getRelatedWords } from '@/lib/wordnik';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const MAX_ATTEMPTS = 6;
const MAX_HINTS = 2;

const getGuessStatuses = (guess, target) => {
  const statuses = Array(target.length).fill('absent');
  const targetChars = target.split('');
  const guessChars = guess.split('');

  for (let i = 0; i < guessChars.length; i++) {
    if (guessChars[i] === targetChars[i]) {
      statuses[i] = 'correct';
      targetChars[i] = null;
    }
  }

  for (let i = 0; i < guessChars.length; i++) {
    if (statuses[i] !== 'correct' && targetChars.includes(guessChars[i])) {
      statuses[i] = 'present';
      targetChars[targetChars.indexOf(guessChars[i])] = null;
    }
  }
  return statuses;
};

const cleanText = (html) => {
  if (!html) return '';
  let text = html.replace(/<[^>]*>?/gm, '');
  text = text.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  return text.trim();
};

const withTimeout = (promise, ms) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
  ]);
};

const WordleGamePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 639px)');

  const [hardMode, setHardMode] = useState(() => localStorage.getItem('wordle_hard_mode') === 'true');
  const [onscreenOnly, setOnscreenOnly] = useState(() => localStorage.getItem('wordle_onscreen_only') === 'true');

  const [setupMode, setSetupMode] = useState(true);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [targetWord, setTargetWord] = useState('');
  const [targetTranslation, setTargetTranslation] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('playing');
  const [usedLetters, setUsedLetters] = useState({});
  const [shakeRow, setShakeRow] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const [hints, setHints] = useState([]);
  const [isFetchingHint, setIsFetchingHint] = useState(false);
  
  const [showGlobalAnnouncement, setShowGlobalAnnouncement] = useState(false);

  const initializeGame = useCallback(async (gameConfig, excludeWord = null) => {
    setLoading(true);
    setError(null);
    try {
      if (!user) throw new Error("Kullanıcı oturumu bulunamadı.");

      // Check Global Ranking Announcement
      if (gameConfig.listId === 'global') {
        const lastPlayed = localStorage.getItem('wordleGlobalRankingLastPlayed');
        const today = new Date().toISOString().split('T')[0];
        if (lastPlayed !== today) {
          setShowGlobalAnnouncement(true);
          setLoading(false);
          return; // Pause initialization until user confirms
        }
      }

      await startActualGame(gameConfig, excludeWord);

    } catch (err) {
      console.error("Game Init Error:", err);
      toast({
          title: "Hata", 
          description: err.message || 'Oyun başlatılırken bir hata oluştu.', 
          variant: "destructive"
      });
      setSetupMode(true);
      setLoading(false);
    }
  }, [user, toast]);

  const startActualGame = async (gameConfig, excludeWord = null) => {
     setLoading(true);
     try {
       let candidateWords = [];

        if (gameConfig.listId === 'global') {
          try {
            const fetchPromise = supabase
              .from('wordle_dictionary')
              .select('english_word')
              .eq('word_length', gameConfig.length);
              
            const result = await withTimeout(fetchPromise, 8000);
            if (result.error) throw result.error;
            candidateWords = result.data.map(d => ({ word: d.english_word.toUpperCase() }));
          } catch (e) {
            console.error("Global dictionary fetch error:", e);
            throw new Error('Sözlük yüklenirken bağlantı sorunu oluştu. Lütfen tekrar deneyin.');
          }
        } else {
          let query = supabase.from('user_saved_words').select('word, translation').eq('user_id', user.id);
          if (gameConfig.listId !== 'saved_all') {
            const categoryId = gameConfig.listId.replace('list_', '');
            query = query.eq('category_id', categoryId);
          }
          
          try {
            const result = await withTimeout(query, 8000);
            if (result.error) throw result.error;
            
            candidateWords = result.data
              .filter(d => d.word.trim().length === gameConfig.length && /^[a-zA-Z]+$/.test(d.word.trim()))
              .map(d => ({ word: d.word.trim().toUpperCase(), translation: d.translation }));
          } catch (e) {
            console.error("Custom list fetch error:", e);
            throw new Error('Liste yüklenirken bağlantı sorunu oluştu. Lütfen tekrar deneyin.');
          }
        }

        if (!candidateWords || candidateWords.length === 0) {
          throw new Error(`Seçilen listede ${gameConfig.length} harfli geçerli kelime bulunamadı.`);
        }

        let validCandidates = candidateWords;
        if (excludeWord && candidateWords.length > 1) {
          validCandidates = candidateWords.filter(d => d.word !== excludeWord);
        }

        const randomIndex = Math.floor(Math.random() * validCandidates.length);
        const selected = validCandidates[randomIndex];

        setTargetWord(selected.word);
        setTargetTranslation(selected.translation || '');
        setGuesses([]);
        setCurrentGuess('');
        setGameStatus('playing');
        setUsedLetters({});
        setHints([]);
        setSetupMode(false);
        setStartTime(Date.now());
        setEndTime(null);
     } catch (err) {
        console.error("Game Init Error:", err);
        toast({
            title: "Hata", 
            description: err.message || 'Oyun başlatılırken bir hata oluştu.', 
            variant: "destructive"
        });
        setSetupMode(true);
     } finally {
        setTimeout(() => setLoading(false), 300);
     }
  };

  const handleGlobalAnnouncementConfirm = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('wordleGlobalRankingLastPlayed', today);
    setShowGlobalAnnouncement(false);
    if (config) {
      startActualGame(config);
    }
  };

  const saveGameStats = async (isWon, finalAttempts, time) => {
    if (!user) return;
    try {
      await supabase.from('wordle_game_stats').insert({
        user_id: user.id,
        word_length: targetWord.length,
        attempts: finalAttempts,
        time_elapsed: time,
        is_winner: isWon,
        mode: config?.listId === 'global' ? 'global' : 'custom'
      });
      if (config?.listId === 'global') {
        const todayUTC = new Date().toISOString().split('T')[0];
        const { data: existing } = await supabase
          .from('wordle_daily_plays')
          .select('*')
          .eq('user_id', user.id)
          .eq('play_date', todayUTC)
          .eq('mode', 'global')
          .maybeSingle();

        if (existing) {
          await supabase.from('wordle_daily_plays')
            .update({ play_count: existing.play_count + 1 })
            .eq('id', existing.id);
        } else {
          await supabase.from('wordle_daily_plays')
            .insert({ user_id: user.id, play_date: todayUTC, play_count: 1, mode: 'global' });
        }
      }
    } catch (error) {
      console.error("Failed to save game stats", error);
    }
  };

  const handleStartSetup = (selectedConfig) => {
    setConfig(selectedConfig);
    initializeGame(selectedConfig);
  };

  const handleInvalidWord = useCallback(() => {
    toast({ title: "Geçersiz Kelime", description: "Bu kelime sözlükte bulunamadı.", variant: "destructive", duration: 2000 });
    setShakeRow(true);
    setTimeout(() => setShakeRow(false), 500);
  }, [toast]);

  const handleTooShort = useCallback(() => {
    toast({ title: "Eksik Harf", description: "Kelime yeterince uzun değil.", variant: "destructive", duration: 2000 });
    setShakeRow(true);
    setTimeout(() => setShakeRow(false), 500);
  }, [toast]);

  const processValidGuess = useCallback((guess) => {
    const newGuesses = [...guesses, guess];
    setGuesses(newGuesses);
    
    const statuses = getGuessStatuses(guess, targetWord);
    const newUsedLetters = { ...usedLetters };
    
    guess.split('').forEach((char, i) => {
      const status = statuses[i];
      if (newUsedLetters[char] !== 'correct') {
        if (newUsedLetters[char] === 'present' && status === 'absent') {
          // Keep it present
        } else {
           newUsedLetters[char] = status;
        }
      }
    });
    setUsedLetters(newUsedLetters);
    setCurrentGuess('');

    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);

    if (guess === targetWord) {
      setGameStatus('won');
      setEndTime(Date.now());
      saveGameStats(true, newGuesses.length, timeElapsed);
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameStatus('lost');
      setEndTime(Date.now());
      saveGameStats(false, newGuesses.length, timeElapsed);
    }
  }, [guesses, targetWord, usedLetters, startTime, config]);

  const handleEnter = useCallback(async () => {
    if (gameStatus !== 'playing' || isVerifying) return;
    
    if (currentGuess.length !== targetWord.length) {
      handleTooShort();
      return;
    }

    setIsVerifying(true);
    try {
      const dictPromise = supabase.from('wordle_dictionary').select('id').ilike('english_word', currentGuess).maybeSingle();
      const { data: dictData } = await withTimeout(dictPromise, 5000);
      if (dictData) {
        processValidGuess(currentGuess);
        return;
      }
      
      const userPromise = supabase.from('user_saved_words').select('id').ilike('word', currentGuess).maybeSingle();
      const { data: userData } = await withTimeout(userPromise, 5000);
      if (userData) {
        processValidGuess(currentGuess);
        return;
      }
      handleInvalidWord();
    } catch (error) {
      console.warn("Validation timeout/error, allowing guess to prevent block", error);
      if (error.message === 'timeout') {
         toast({ title: "Ağ Yavaş", description: "Kelime kontrolü zaman aşımına uğradı, tahmin kabul ediliyor.", variant: "warning", duration: 2000 });
         processValidGuess(currentGuess);
      } else {
         handleInvalidWord();
      }
    } finally {
      setIsVerifying(false);
    }
  }, [currentGuess, targetWord.length, gameStatus, isVerifying, handleTooShort, handleInvalidWord, processValidGuess, toast]);

  const onKeyPress = useCallback((key) => {
    if (gameStatus !== 'playing') return;
    if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (key === 'ENTER') {
      handleEnter();
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < targetWord.length) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess.length, targetWord.length, gameStatus, handleEnter]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (setupMode || loading || gameStatus !== 'playing' || onscreenOnly || isVerifying || showGlobalAnnouncement) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key) || key === 'BACKSPACE' || key === 'ENTER') {
        e.preventDefault();
        onKeyPress(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress, setupMode, loading, gameStatus, onscreenOnly, isVerifying, showGlobalAnnouncement]);

  const generateHint = async () => {
    if (hints.length >= MAX_HINTS || isFetchingHint || gameStatus !== 'playing') return;
    setIsFetchingHint(true);

    try {
      const wordLower = targetWord.toLowerCase();
      let hintData = null;

      const usedTypes = hints.map(h => h.typeCode);
      let availableTypes = ['definition', 'synonym', 'position'].filter(t => !usedTypes.includes(t));

      if (availableTypes.length === 0) availableTypes = ['position']; // Ultimate fallback

      availableTypes = availableTypes.sort(() => Math.random() - 0.5);

      for (const selectedType of availableTypes) {
        if (selectedType === 'synonym') {
          const related = await getRelatedWords(wordLower).catch(() => null);
          if (related) {
            const syns = related.find(r => r.relationshipType === 'synonym');
            if (syns && syns.words && syns.words.length > 0) {
              const engSyns = syns.words.filter(w => /^[a-zA-Z]+$/.test(w));
              if (engSyns.length > 0) {
                hintData = { 
                  type: 'Eş Anlamlı (İng)', 
                  text: engSyns.slice(0,3).join(', '), 
                  icon: <Settings className="w-5 h-5"/>, 
                  typeCode: 'synonym' 
                };
                break;
              }
            }
          }
        }

        if (selectedType === 'definition') {
          const defs = await getWordDefinitions(wordLower).catch(() => null);
          if (defs && defs.length > 0) {
            const validDefs = defs.filter(d => d.text && !d.text.toLowerCase().includes('plural of') && !d.text.toLowerCase().includes('form of'));
            if (validDefs.length > 0) {
              let text = cleanText(validDefs[0].text);
              const regex = new RegExp(wordLower, 'gi');
              text = text.replace(regex, '_____');
              hintData = { 
                type: 'İngilizce Anlamı', 
                text, 
                icon: <Lightbulb className="w-5 h-5"/>, 
                typeCode: 'definition' 
              };
              break;
            }
          }
        }

        if (selectedType === 'position') {
          const targetArr = targetWord.split('');
          const foundIndices = new Set();
          guesses.forEach(g => {
            g.split('').forEach((c, i) => { if(c === targetArr[i]) foundIndices.add(i); });
          });

          const unfoundIndices = targetArr.map((_, i) => i).filter(i => !foundIndices.has(i));
          if (unfoundIndices.length > 0) {
            const rIndex = unfoundIndices[Math.floor(Math.random() * unfoundIndices.length)];
            const l = targetArr[rIndex];
            hintData = { 
              type: 'Harf Konumu', 
              text: `Kelimenin ${rIndex + 1}. harfi: ${l}`, 
              icon: <AlertCircle className="w-5 h-5"/>, 
              typeCode: 'position' 
            };
            break;
          }
        }
      }

      if (!hintData) {
         hintData = { 
           type: 'Bilgi', 
           text: 'Tüm harfleri buldunuz, sadece doğru sıraya koyun.', 
           icon: <Info className="w-5 h-5"/>, 
           typeCode: 'error' 
         };
      }

      if (hintData && hintData.typeCode !== 'error') {
        setHints(prev => [...prev, { id: Date.now(), ...hintData }]);
      } else if (hintData.typeCode === 'error') {
         toast({ title: "Bilgi", description: "Bu kelime için başka ipucu bulunamadı.", variant: "default" });
      }

    } catch (e) {
      toast({ title: "İpucu Hatası", description: "İpucu alınamadı.", variant: "destructive" });
    } finally {
      setIsFetchingHint(false);
    }
  };

  const renderGrid = useMemo(() => {
    if (!targetWord) return null;
    const empties = MAX_ATTEMPTS - guesses.length - (gameStatus === 'playing' ? 1 : 0);
    const wordLength = targetWord.length;

    const cellSizeClass = wordLength === 7 
      ? "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-xl sm:text-2xl md:text-3xl lg:text-4xl" 
      : "w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-16 lg:h-16 text-xl sm:text-3xl md:text-4xl lg:text-5xl";

    return (
      <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-3 items-center w-full max-w-full overflow-x-hidden pt-2">
        {guesses.map((guess, i) => {
          const statuses = getGuessStatuses(guess, targetWord);
          return (
            <div key={i} className="flex gap-1.5 sm:gap-2 md:gap-3 w-full justify-center">
              {guess.split('').map((char, j) => (
                <motion.div
                  initial={{ rotateX: 90 }}
                  animate={{ rotateX: 0 }}
                  transition={{ delay: j * 0.1, duration: 0.4 }}
                  key={j}
                  className={cn(
                    "flex items-center justify-center font-black uppercase rounded-lg sm:rounded-xl border-2 shadow-sm shrink-0",
                    cellSizeClass,
                    statuses[j] === 'correct' && "bg-green-600 border-green-600 text-white shadow-[0_0_15px_rgba(22,163,74,0.3)]",
                    statuses[j] === 'present' && "bg-yellow-500 border-yellow-500 text-gray-900 shadow-[0_0_15px_rgba(234,179,8,0.3)]",
                    statuses[j] === 'absent' && "bg-gray-500 border-gray-500 text-white dark:bg-gray-700 dark:border-gray-700 opacity-100",
                  )}
                >
                  {char}
                </motion.div>
              ))}
            </div>
          );
        })}

        {gameStatus === 'playing' && (
          <motion.div 
            className="flex gap-1.5 sm:gap-2 md:gap-3 w-full justify-center"
            animate={shakeRow ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            {Array.from({ length: wordLength }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center justify-center font-black uppercase rounded-lg sm:rounded-xl transition-all duration-150 shrink-0",
                  cellSizeClass,
                  currentGuess[i] 
                    ? "border-[3px] border-primary/70 bg-card text-foreground shadow-md scale-[1.02] font-extrabold" 
                    : "border-2 border-border/80 bg-secondary/40 dark:bg-card dark:border-muted-foreground/30 text-transparent"
                )}
              >
                {currentGuess[i] || ''}
              </div>
            ))}
          </motion.div>
        )}

        {Array.from({ length: Math.max(0, empties) }).map((_, i) => (
          <div key={`empty-${i}`} className="flex gap-1.5 sm:gap-2 md:gap-3 w-full justify-center">
            {Array.from({ length: wordLength }).map((_, j) => (
              <div
                key={j}
                className={cn("rounded-lg sm:rounded-xl border-2 border-border/80 bg-secondary/40 dark:bg-card dark:border-muted-foreground/30 shrink-0", cellSizeClass)}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }, [targetWord, guesses, currentGuess, gameStatus, shakeRow]);

  if (loading && !setupMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-background">
        <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium text-sm sm:text-base">Oyun Hazırlanıyor...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-[100dvh] w-full bg-background relative overflow-hidden font-sans">
        <Seo title="Wordlego | HikayeGO" description="Kelime tahmin oyunu Wordlego ile İngilizce kelime bilginizi test edin." />

        {/* Global Header */}
        <header className="h-14 sm:h-16 md:h-20 border-b border-border/50 flex items-center justify-between px-3 sm:px-6 relative z-20 bg-background/80 backdrop-blur-xl shrink-0 shadow-sm w-full">
          <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-start">
            <Button variant="ghost" size="icon" onClick={() => navigate('/activities')} className="rounded-full hover:bg-secondary h-9 w-9 sm:h-10 sm:w-10">
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </div>
          
          <div className="flex-[2] flex justify-center items-center text-center">
            <h1 className="text-[15px] sm:text-xl md:text-2xl font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-primary truncate">
              WORDLEGO
            </h1>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
            {!setupMode && gameStatus === 'playing' && (
              <WordleHintDisplay 
                hints={hints} 
                isHardMode={hardMode} 
                maxHints={MAX_HINTS} 
                onGenerateHint={generateHint} 
                isFetching={isFetchingHint} 
              />
            )}

            {isMobile && (
              <WordleHowToPlay customTrigger={
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary h-8 w-8 sm:h-10 sm:w-10 shrink-0">
                  <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              } />
            )}

            <WordleSettings 
              hardMode={hardMode} 
              setHardMode={setHardMode} 
              onscreenOnly={onscreenOnly} 
              setOnscreenOnly={setOnscreenOnly}
              onNewGame={() => {setSetupMode(true); setTargetWord('');}} 
              isGlobal={config?.listId === 'global'}
            />
          </div>
        </header>

        <main className="flex-1 w-full relative flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            {setupMode ? (
              <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 overflow-y-auto w-full custom-scrollbar">
                <WordleGameSetup onStart={handleStartSetup} />
              </motion.div>
            ) : (
              <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col w-full">
                
                <AnimatePresence>
                  {gameStatus !== 'playing' && (
                    <WordleResults
                      isWinner={gameStatus === 'won'}
                      targetWord={targetWord}
                      attempts={guesses.length}
                      hintsUsed={hints.length}
                      timeElapsed={endTime && startTime ? Math.floor((endTime - startTime) / 1000) : 0}
                      hardMode={hardMode}
                      onPlayAgain={config?.listId === 'global' ? null : () => initializeGame(config, targetWord)}
                      onBack={() => navigate('/activities')}
                    />
                  )}
                </AnimatePresence>

                <div className="flex-1 flex flex-col items-center overflow-y-auto px-2 pb-4 pt-2 sm:pt-6 w-full custom-scrollbar">
                  <div className="w-full flex-1 flex flex-col justify-center min-h-0">
                    {renderGrid}
                  </div>
                </div>

                <div className="shrink-0 w-full z-20 bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.05)] pt-2 pb-4 sm:pt-3 sm:pb-6 lg:pb-8">
                  <WordleKeyboard
                    usedLetters={usedLetters}
                    onKeyPress={onKeyPress}
                    disabled={gameStatus !== 'playing'}
                    isVerifying={isVerifying}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <AlertDialog open={showGlobalAnnouncement} onOpenChange={setShowGlobalAnnouncement}>
          <AlertDialogContent className="w-[90vw] max-w-md mx-auto rounded-[2rem] p-6 z-[200]">
            <div className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <Globe2 className="w-8 h-8" />
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-black text-center mb-2">Global Sıralama</AlertDialogTitle>
              <AlertDialogDescription className="text-center text-base leading-relaxed">
                Global sıralama tüm sözlükten <span className="font-bold text-foreground">sadece 24 saatte 1 defa</span> oynanabilir.
                <br/><br/>
                Kendi listelerinizden ise her zaman sınırsız olarak oynamaya devam edebilirsiniz.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center mt-6">
              <Button onClick={handleGlobalAnnouncementConfirm} className="w-full h-12 rounded-xl font-bold text-base shadow-md">
                Anladım, Başla
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </ErrorBoundary>
  );
};

export default WordleGamePage;