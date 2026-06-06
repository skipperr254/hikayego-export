import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export const useStoryInteraction = (user, story, selectedWord, toast, triggerPremiumModal, currentPage, pageContainerRef) => {
  const { canAccessPremiumFeatures } = useAuth();
  const [isCurrentWordSaved, setIsCurrentWordSaved] = useState(false);
  const [isCheckingSaveStatus, setIsCheckingSaveStatus] = useState(false);
  const [isSavingWord, setIsSavingWord] = useState(false);

  useEffect(() => {
    const checkWordStatus = async () => {
      if (!selectedWord || !user) {
        setIsCurrentWordSaved(false);
        return;
      }
      setIsCheckingSaveStatus(true);
      try {
        const { data, error } = await supabase
          .from('user_saved_words')
          .select('id')
          .eq('user_id', user.id)
          .eq('word', selectedWord)
          .maybeSingle();
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        setIsCurrentWordSaved(!!data);
      } catch (error) {
        console.error('Error checking word status:', error);
        setIsCurrentWordSaved(false);
      } finally {
        setIsCheckingSaveStatus(false);
      }
    };
    checkWordStatus();
  }, [selectedWord, user]);

  const handleSaveWord = useCallback(async (word, translation) => {
    if (!word || !translation || !user || !story) {
      toast({ title: "Kelime kaydedilemedi", variant: "destructive" });
      return;
    }
    if (isCurrentWordSaved) {
      toast({ title: "Zaten Kayıtlı", description: `"${word}" kelimesi zaten listenizde.` });
      return;
    }
    setIsSavingWord(true);
    try {
      if (!canAccessPremiumFeatures) {
        const { count, error } = await supabase
          .from('user_saved_words')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        if (error) throw error;
        if (count >= 10) {
          toast({
            title: "Kelime Limiti Doldu",
            description: "Maksimum 10 kelime sınırına ulaştınız. Daha fazla kelime kaydetmek için Premium'a geçin.",
            variant: "destructive"
          });
          setIsSavingWord(false);
          return;
        }
      }
      const { error } = await supabase
        .from('user_saved_words')
        .insert({
          user_id: user.id,
          word: word,
          translation: translation,
          story_title: story.title,
          added_at: new Date().toISOString()
        });
      if (error) {
        if (error.message.includes('violates check constraint "user_saved_words_user_id_check"')) {
           toast({
            title: "Kelime Limiti Doldu",
            description: "Maksimum 10 kelime sınırına ulaştınız. Daha fazla kelime kaydetmek için Premium'a geçin.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        setIsCurrentWordSaved(true);
        toast({
          title: "Kelime Kaydedildi!",
          description: `"${word}" kelimesi listenize eklendi.`
        });
      }
    } catch (error) {
      console.error('Error saving word:', error);
      toast({ title: "Hata", description: "Kelime kaydedilirken bir hata oluştu.", variant: "destructive" });
    } finally {
      setIsSavingWord(false);
    }
  }, [user, story, toast, isCurrentWordSaved, canAccessPremiumFeatures]);

  const saveProgress = useCallback((isMarkingPosition = false) => {
    if (pageContainerRef.current && user && story) {
      const container = pageContainerRef.current;
      const scrollPosition = container.scrollHeight > container.clientHeight
        ? container.scrollTop / (container.scrollHeight - container.clientHeight)
        : 0;

      const centerX = container.getBoundingClientRect().left + container.clientWidth / 2;
      const centerY = container.getBoundingClientRect().top + container.clientHeight / 2;
      const element = document.elementFromPoint(centerX, centerY);
      const wordElement = element?.closest('.word-token');
      const wordIndex = wordElement ? parseInt(wordElement.getAttribute('data-word-index'), 10) : null;

      try {
        const progressData = {
          page_number: currentPage,
          scroll_position: isNaN(scrollPosition) ? 0 : scrollPosition,
          word_index: wordIndex,
          updated_at: new Date().toISOString(),
          show_highlight: isMarkingPosition,
        };
        localStorage.setItem(`story_progress_${user.id}_${story.id}`, JSON.stringify(progressData));
      } catch (e) {
        console.error("Failed to save progress to localStorage", e);
      }
    }
  }, [user, story, currentPage, pageContainerRef]);

  const handleMarkPosition = useCallback(() => {
    saveProgress(true);
    toast({
      title: "Konum işaretlendi! 📍",
      description: "Hikayeye döndüğünüzde buradan devam edebilirsiniz.",
    });
  }, [saveProgress, toast]);

  return {
    isCurrentWordSaved,
    isCheckingSaveStatus,
    isSavingWord,
    handleSaveWord,
    saveProgress,
    handleMarkPosition
  };
};