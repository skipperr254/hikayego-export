import React, { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Star, Volume2, MoreVertical, FolderOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from '@/components/ui/dropdown-menu';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const MAX_FREE_WORDS = 50;

const WordGrid = React.memo(({ words, setWords, categories }) => {
  const { canAccessPremiumFeatures } = useAuth();
  const { toast } = useToast();
  const { handlePronounce } = useSpeechSynthesis();
  
  const [wordToDelete, setWordToDelete] = useState(null);

  const sortedWords = useMemo(() => {
    if (!words || words.length === 0) return [];
    return [...words].sort((a, b) => {
      if (a.is_starred && !b.is_starred) return -1;
      if (!a.is_starred && b.is_starred) return 1;
      return new Date(b.added_at) - new Date(a.added_at);
    });
  }, [words]);

  const deleteWord = useCallback(async (wordId) => {
    try {
      const { error } = await supabase.from('user_saved_words').delete().eq('id', wordId);
      if (error) throw error;
      setWords(prev => prev.filter(w => w.id !== wordId));
      toast({
        title: "Kelime silindi",
        description: "Kelime listenizden kaldırıldı."
      });
    } catch (error) {
      console.error('Delete word error:', error);
      toast({
        title: "Hata",
        description: "Kelime silinirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  }, [setWords, toast]);

  const toggleStar = useCallback(async (wordId, currentStarred) => {
    try {
      const { error } = await supabase
        .from('user_saved_words')
        .update({ is_starred: !currentStarred })
        .eq('id', wordId);
      if (error) throw error;
      
      setWords(prev => prev.map(w => w.id === wordId ? { ...w, is_starred: !currentStarred } : w));
      toast({
        title: currentStarred ? "Favorilerden çıkarıldı" : "Favorilere eklendi! ⭐",
        description: currentStarred ? "Kelime favorilerden kaldırıldı." : "Kelime favorilere eklendi."
      });
    } catch (error) {
      console.error('Toggle star error:', error);
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu.",
        variant: "destructive"
      });
    }
  }, [setWords, toast]);

  const changeCategory = useCallback(async (wordId, newCategoryId) => {
    try {
      const categoryId = newCategoryId === 'none' ? null : parseInt(newCategoryId);
      const { error } = await supabase
        .from('user_saved_words')
        .update({ category_id: categoryId })
        .eq('id', wordId);

      if (error) throw error;
      setWords(prev => prev.map(w => w.id === wordId ? { ...w, category_id: categoryId } : w));
      toast({
        title: "Kategori güncellendi",
        description: "Kelime başarıyla taşındı."
      });
    } catch (error) {
      console.error('Change category error:', error);
      toast({
        title: "Hata",
        description: "Kategori güncellenirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  }, [setWords, toast]);

  const handleSpeak = useCallback((text) => {
    handlePronounce(text);
  }, [handlePronounce]);

  if (!sortedWords || sortedWords.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col">
        <AnimatePresence mode="popLayout">
          {sortedWords.map((word) => {
            const catColor = categories.find(c => c.id === word.category_id)?.color;
            
            return (
              <motion.div
                key={word.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="group flex items-center justify-between py-3 px-2 sm:px-4 border-b border-border/50 hover:bg-secondary/40 transition-colors bg-background"
              >
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${catColor || 'bg-border/80'}`} />
                  
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[15px] sm:text-base text-foreground truncate">{word.word}</span>
                      <button 
                        onClick={() => handleSpeak(word.word)} 
                        className="text-muted-foreground/60 hover:text-primary transition-colors rounded-full p-1"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-muted-foreground truncate leading-snug">{word.translation}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => toggleStar(word.id, word.is_starred)} 
                    className={`p-2 rounded-full hover:bg-secondary transition-colors ${word.is_starred ? 'text-yellow-500' : 'text-muted-foreground/50'}`}
                  >
                    <Star className={`w-4.5 h-4.5 ${word.is_starred ? 'fill-current' : ''}`} />
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-full hover:bg-secondary text-muted-foreground/60 transition-colors">
                        <MoreVertical className="w-4.5 h-4.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 z-[100]">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <FolderOpen className="w-4 h-4 mr-2" />
                          <span>Kategori Değiştir</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => changeCategory(word.id, 'none')}>
                              Kategorisiz
                            </DropdownMenuItem>
                            {categories.map(cat => (
                              <DropdownMenuItem key={cat.id} onClick={() => changeCategory(word.id, cat.id)}>
                                <div className={`w-2 h-2 rounded-full mr-2 ${cat.color}`} />
                                {cat.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      
                      {/* Fixed: Delay opening dialog to avoid pointer-events freeze */}
                      <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setTimeout(() => setWordToDelete(word.id), 0); }} className="text-destructive focus:text-destructive cursor-pointer">
                        <Trash2 className="w-4 h-4 mr-2"/> Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AlertDialog open={!!wordToDelete} onOpenChange={(open) => !open && setWordToDelete(null)}>
        <AlertDialogContent className="z-[150] rounded-[2rem] p-6 max-w-sm">
          <div className="mx-auto w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-2">
            <Trash2 className="w-6 h-6" />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center font-bold text-xl">Kelimeyi Sil?</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Bu kelime listenizden kalıcı olarak silinecek.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-2 mt-4">
            <AlertDialogCancel className="w-full sm:w-auto h-11 rounded-xl">İptal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => { 
                if(wordToDelete) deleteWord(wordToDelete); 
                setWordToDelete(null); 
              }} 
              className="bg-destructive hover:bg-destructive/90 text-white w-full sm:w-auto h-11 rounded-xl font-bold"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {!canAccessPremiumFeatures && words.length >= MAX_FREE_WORDS && (
        <div className="mt-8 p-4 rounded-2xl bg-secondary/30 border border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-background rounded-full border border-border">
               <Star className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-bold text-sm">Kelime Limiti ({MAX_FREE_WORDS})</p>
              <p className="text-xs text-muted-foreground">Premium'a geçerek sınırsız kelime kaydedin.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

WordGrid.displayName = 'WordGrid';

export default WordGrid;