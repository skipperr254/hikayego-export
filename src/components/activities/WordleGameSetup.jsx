import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Hash, Loader2, AlertCircle, Clock, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import WordleHowToPlay from './WordleHowToPlay';
import WordleLeaderboard from './WordleLeaderboard';
import WordleStatsModal from './WordleStatsModal';

const WordleGameSetup = ({ onStart }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [wordLists, setWordLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');
  const [selectedLength, setSelectedLength] = useState(null);
  
  const [globalNextPlayTime, setGlobalNextPlayTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [shakeLength, setShakeLength] = useState(false);
  
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        if (!user) return;
        
        // Fetch last global play from wordle_game_stats
        const { data: playsData } = await supabase
          .from('wordle_game_stats')
          .select('created_at')
          .eq('user_id', user.id)
          .eq('mode', 'global')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (playsData) {
           const lastPlay = new Date(playsData.created_at).getTime();
           const now = Date.now();
           const twentyFourHours = 24 * 60 * 60 * 1000;
           
           if (now - lastPlay < twentyFourHours) {
             if (isMounted) setGlobalNextPlayTime(lastPlay + twentyFourHours);
           }
        }

        const { data: userLists } = await supabase
          .from('word_categories')
          .select('id, name')
          .eq('user_id', user.id);
          
        const newList = [
          { id: 'global', name: 'Global Sözlük (Tümü)' },
          { id: 'saved_all', name: 'Kendi Listeleriniz (Tümü)' }
        ];
        
        if (userLists && userLists.length > 0) {
           userLists.forEach(l => {
             newList.push({ id: `list_${l.id}`, name: `Liste: ${l.name}` });
           });
        }
        
        if (isMounted) {
          setWordLists(newList);
          setSelectedList('global');
        }
      } catch (error) {
        console.error("Error fetching word lists:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchInitialData();
    timeoutId = setTimeout(() => { if (isMounted && loading) setLoading(false); }, 5000);
    return () => { isMounted = false; clearTimeout(timeoutId); };
  }, [user, profile]);

  useEffect(() => {
    if (!globalNextPlayTime) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = globalNextPlayTime - now;
      
      if (diff <= 0) {
        setGlobalNextPlayTime(null);
        setTimeLeft('');
        clearInterval(timer);
        return;
      }
      
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [globalNextPlayTime]);

  const isGlobalRestricted = selectedList === 'global' && globalNextPlayTime !== null;

  const handleStart = async () => {
    if (isGlobalRestricted) {
      toast({
        title: "Limit Doldu",
        description: `Global sözlük 24 saatte bir oynanabilir. Kendi listelerinizi seçerek sınırsız oynamaya devam edebilirsiniz.`,
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedLength) {
      setShakeLength(true);
      setTimeout(() => setShakeLength(false), 500);
      return;
    }

    if (!selectedList || validating) return;

    setValidating(true);
    try {
      let query;
      if (selectedList === 'global') {
        query = supabase.from('wordle_dictionary').select('id', { count: 'exact', head: true }).eq('word_length', selectedLength);
      } else {
        query = supabase.from('user_saved_words').select('id', { count: 'exact', head: true }).eq('user_id', user.id);
        if (selectedList !== 'saved_all') {
          query = query.eq('category_id', selectedList.replace('list_', ''));
        }
        
        const { data } = await supabase.from('user_saved_words').select('word').eq('user_id', user.id);
        let listWords = data || [];
        if (selectedList !== 'saved_all') {
            const catId = selectedList.replace('list_', '');
            const { data: catData } = await supabase.from('user_saved_words').select('word').eq('user_id', user.id).eq('category_id', catId);
            listWords = catData || [];
        }
        const validWords = listWords.filter(w => w.word.trim().length === selectedLength && /^[a-zA-Z]+$/.test(w.word.trim()));
        
        if (validWords.length === 0) {
           toast({
             title: "Yetersiz Kelime",
             description: `Seçilen listede ${selectedLength} harfli geçerli kelime bulunamadı. Lütfen kelime ekleyin veya farklı liste seçin.`,
             variant: "destructive"
           });
           setValidating(false);
           return;
        }
      }

      if (selectedList === 'global') {
        const { count } = await query;
        if (count === 0) {
           toast({ title: "Hata", description: "Global sözlükte kelime bulunamadı.", variant: "destructive" });
           setValidating(false);
           return;
        }
      }

      onStart({ listId: selectedList, length: selectedLength });

    } catch (err) {
      console.error(err);
      toast({ title: "Hata", description: "Sözlük kontrol edilirken hata oluştu.", variant: "destructive" });
    } finally {
      setValidating(false);
    }
  };

  const selectedListName = wordLists.find(l => l.id === selectedList)?.name || "Sözlük seçin";

  const renderListOptions = () => (
    <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh] custom-scrollbar p-1">
      {wordLists.map(list => (
        <button
          key={list.id}
          onClick={() => {
            setSelectedList(list.id);
            setIsSelectorOpen(false);
          }}
          className={cn(
            "text-left px-4 py-3 rounded-xl transition-all duration-200 text-sm sm:text-base font-medium",
            selectedList === list.id 
              ? "bg-primary text-primary-foreground shadow-sm" 
              : "bg-secondary/50 hover:bg-secondary text-foreground"
          )}
        >
          {list.name}
        </button>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto flex flex-col justify-start items-center p-4 sm:p-6 md:p-8 min-h-full"
    >
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-6">
         <div className="hidden sm:block">
           <WordleHowToPlay />
         </div>
         <WordleLeaderboard />
         <WordleStatsModal />
      </div>

      <AnimatePresence mode="popLayout">
        {isGlobalRestricted && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="w-full mb-6 overflow-hidden"
          >
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-start gap-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
              <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div className="flex-1 relative z-10">
                <h4 className="font-bold text-orange-600 dark:text-orange-400 text-sm">Günlük Limit Doldu</h4>
                <p className="text-xs text-orange-600/80 dark:text-orange-400/80 mt-1 leading-relaxed">
                  24 saatte bir oynanabilir. Kendi listelerinizden sınırsız oynayabilirsiniz.
                </p>
                <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 w-fit px-2.5 py-1 rounded-md">
                  <Clock className="w-3.5 h-3.5" /> Sonraki oyun: {timeLeft}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="w-full shadow-lg border-border/60 bg-card rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden p-2 sm:p-4">
        <CardContent className="p-3 sm:p-6 space-y-6 sm:space-y-8">
          
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-foreground">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Kelime Havuzu
            </h3>
            {loading ? (
              <Skeleton className="h-12 sm:h-14 w-full rounded-2xl" />
            ) : (
              <>
                {isMobile && (
                  <Sheet open={isSelectorOpen} onOpenChange={setIsSelectorOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full h-12 justify-between rounded-2xl border-2 bg-secondary/30 hover:bg-secondary/50 font-semibold shadow-sm text-sm">
                        <span className="truncate">{selectedListName}</span>
                        <ChevronDown className="w-4 h-4 opacity-50" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="rounded-t-[2rem] p-6 pb-8">
                      <SheetHeader className="mb-4">
                        <SheetTitle className="text-left font-bold text-lg">Sözlük Seçin</SheetTitle>
                      </SheetHeader>
                      {renderListOptions()}
                    </SheetContent>
                  </Sheet>
                )}

                {isTablet && (
                  <Popover open={isSelectorOpen} onOpenChange={setIsSelectorOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-14 justify-between rounded-2xl border-2 bg-secondary/30 hover:bg-secondary/50 font-semibold shadow-sm text-base">
                        <span className="truncate">{selectedListName}</span>
                        <ChevronDown className="w-5 h-5 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2 rounded-[1.5rem] z-[100]" align="start">
                      {renderListOptions()}
                    </PopoverContent>
                  </Popover>
                )}

                {isDesktop && (
                  <Select value={selectedList} onValueChange={setSelectedList}>
                    <SelectTrigger className="w-full rounded-2xl h-14 text-base border-2 bg-secondary/30 hover:bg-secondary/50 focus:border-primary/50 focus:bg-background focus:ring-0 transition-all shadow-sm font-semibold">
                      <SelectValue placeholder="Sözlük seçin" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/60 shadow-xl z-[100] max-h-[300px]">
                      {wordLists.map(list => (
                        <SelectItem key={list.id} value={list.id} className="py-3 cursor-pointer rounded-lg text-base font-medium">
                          {list.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </>
            )}
          </div>

          <motion.div 
            className="space-y-3 sm:space-y-4"
            animate={shakeLength ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
             <div className="flex items-center justify-between">
               <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-foreground">
                 <Hash className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                 Harf Sayısı
                 {shakeLength && <span className="text-xs text-destructive ml-2 animate-pulse font-semibold bg-destructive/10 px-2 py-0.5 rounded">Seçim Yapın</span>}
               </h3>
             </div>
             <div className="grid grid-cols-3 gap-2 sm:gap-4">
               {[5, 6, 7].map(num => (
                 <motion.button
                   key={num}
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => setSelectedLength(num)}
                   className={cn(
                     "relative flex flex-col items-center justify-center py-4 sm:py-6 md:py-8 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 outline-none touch-manipulation",
                     selectedLength === num 
                       ? "border-primary bg-primary/10 text-primary shadow-sm" 
                       : "border-border/60 bg-secondary/30 hover:border-primary/40 hover:bg-secondary/60 text-foreground",
                     shakeLength && !selectedLength && "border-destructive/50 bg-destructive/5"
                   )}
                 >
                   <span className="text-2xl sm:text-3xl md:text-4xl font-black mb-1">
                     {num}
                   </span>
                   <span className={cn("text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-widest", selectedLength === num ? "text-primary/80" : "text-muted-foreground")}>
                     Harf
                   </span>
                 </motion.button>
               ))}
             </div>
          </motion.div>
        </CardContent>
      </Card>

      <motion.div className="w-full mt-6 sm:mt-8">
        <Button 
          onClick={handleStart} 
          disabled={loading || validating || isGlobalRestricted}
          className={cn(
            "w-full rounded-xl sm:rounded-2xl h-12 sm:h-14 md:h-16 text-base sm:text-lg md:text-xl font-black transition-all duration-300 border-0",
            selectedList && !loading && !validating && !isGlobalRestricted
              ? "shadow-md hover:shadow-lg hover:scale-[1.01] bg-primary text-primary-foreground" 
              : "bg-secondary text-muted-foreground opacity-70"
          )}
          size="lg"
        >
          {validating ? <Loader2 className="w-6 h-6 animate-spin" /> : isGlobalRestricted ? "Limit Doldu" : "Oyuna Başla"}
        </Button>
      </motion.div>

    </motion.div>
  );
};

export default WordleGameSetup;