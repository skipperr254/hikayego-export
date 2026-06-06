import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Mic, Loader2, Plus, BookmarkCheck } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const WordAssistant = ({ 
  selectedWord, 
  translationInfo, 
  isTranslating, 
  onPronounce, 
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const { user, canAccessPremiumFeatures } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkWordStatus = async () => {
      if (!selectedWord || !user) {
        setIsSaved(false);
        return;
      }

      setCheckingStatus(true);
      try {
        const { data, error } = await supabase
          .from('user_saved_words')
          .select('id')
          .eq('user_id', user.id)
          .eq('word', selectedWord)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking word status:', error);
        }

        setIsSaved(!!data);
      } catch (error) {
        console.error('Error checking word status:', error);
        setIsSaved(false);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkWordStatus();
  }, [selectedWord, user]);

  const handleSaveWord = async () => {
    if (!selectedWord || !translationInfo || !user) {
      toast({ 
        title: "Kelime kaydedilemedi", 
        description: "Lütfen geçerli bir kelime ve çevirisi olduğundan emin olun.", 
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        // This is handled by a toast in parent now, but keeping logic for robustness
      } else {
        const { data: existingWords, error: countError } = await supabase
          .from('user_saved_words')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id);
        
        if (countError) console.error(countError);

        if (!canAccessPremiumFeatures && existingWords && existingWords.length >= 3) {
          toast({
            title: 'Sınırsız Kelime Kaydetme', 
            description: 'Daha fazla kelime kaydetmek için Premium üye olmalısınız. Ücretsiz planda en fazla 3 kelime kaydedebilirsiniz.',
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        const { error } = await supabase
          .from('user_saved_words')
          .insert({
            user_id: user.id,
            word: selectedWord,
            translation: translationInfo.translation,
            story_title: 'Hikaye',
            added_at: new Date().toISOString()
          });

        if (error) throw error;
        setIsSaved(true);
        toast({ 
          title: "Kelime kaydedildi! ✨", 
          description: `"${selectedWord}" kelimelerinize eklendi.` 
        });
      }
    } catch (error) {
      console.error('Error handling word save:', error);
      toast({ 
        title: "Hata", 
        description: "İşlem sırasında bir hata oluştu.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPartOfSpeechBadge = (partOfSpeech) => {
    const partOfSpeechMap = {
      'noun': { label: 'İsim', color: 'bg-blue-100 text-blue-800' },
      'verb': { label: 'Fiil', color: 'bg-green-100 text-green-800' },
      'adjective': { label: 'Sıfat', color: 'bg-purple-100 text-purple-800' },
      'adverb': { label: 'Zarf', color: 'bg-orange-100 text-orange-800' },
      'preposition': { label: 'Edat', color: 'bg-pink-100 text-pink-800' },
      'unknown': { label: 'Bilinmiyor', color: 'bg-gray-100 text-gray-800' }
    };
    const partInfo = partOfSpeechMap[partOfSpeech] || partOfSpeechMap['unknown'];
    return <Badge className={`text-xs ${partInfo.color} border-0`}>{partInfo.label}</Badge>;
  };

  if (!selectedWord) {
    return (
      <div className="text-center py-8 text-muted-foreground flex flex-col items-center justify-center h-full">
        <BookOpen className="h-12 w-12 mx-auto mb-4" />
        <p>Çevirmek istediğiniz kelimeye tıklayın.</p>
        <p className="text-sm mt-2">Asistanınız burada size yardımcı olacak.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-2xl font-bold text-primary capitalize">{selectedWord}</p>
          {translationInfo?.partOfSpeech && (
            <div className="mt-1">{getPartOfSpeechBadge(translationInfo.partOfSpeech)}</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onPronounce(selectedWord)} className="rounded-full">
            <Mic className="h-5 w-5" />
          </Button>
          <Button
            variant={isSaved ? "secondary" : "default"}
            size="sm"
            disabled={isTranslating || !translationInfo || isLoading || checkingStatus || isSaved}
            onClick={handleSaveWord}
            className="rounded-full"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span className="ml-2">{isSaved ? 'Kaydedildi' : 'Kaydet'}</span>
          </Button>
        </div>
      </div>
      
      {isTranslating ? (
        <div className="flex items-center text-muted-foreground">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Çevriliyor...
        </div>
      ) : (
        translationInfo && (
          <div>
            <p className="text-xl font-medium capitalize">{translationInfo.translation}</p>
            {translationInfo.example && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-semibold text-muted-foreground mb-1">Örnek Cümle:</p>
                <p className="italic">"{translationInfo.example}"</p>
                <p className="italic text-muted-foreground mt-1">"{translationInfo.example_tr}"</p>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default WordAssistant;