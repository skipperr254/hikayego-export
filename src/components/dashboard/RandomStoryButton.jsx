import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dices } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getDailyFreeStories } from '@/utils/dailyStorySelector';

const RandomStoryButton = ({ stories, loading }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { canAccessPremiumFeatures, profile } = useAuth();
  const isKidAccount = profile?.is_kid_account || false;

  const selectRandomStory = useCallback(() => {
    if (loading || stories.length === 0) {
      toast({
        title: 'Hikayeler Yükleniyor',
        description: 'Lütfen hikayeler yüklenirken bekleyin.',
        variant: 'destructive',
      });
      return;
    }

    setIsSpinning(true);

    setTimeout(() => {
      let availableStories;
      if (canAccessPremiumFeatures) {
        availableStories = stories.filter(s => !s.is_premium_placeholder);
      } else {
        const { unlocked } = getDailyFreeStories(stories, isKidAccount);
        availableStories = stories.filter(s => unlocked.includes(s.id));
      }

      if (availableStories.length === 0) {
        toast({
          title: 'Uygun Hikaye Bulunamadı',
          description: 'Şu anda okunacak uygun bir hikaye bulunmuyor.',
          variant: 'destructive',
        });
        setIsSpinning(false);
        return;
      }

      const randomIndex = Math.floor(Math.random() * availableStories.length);
      const randomStory = availableStories[randomIndex];

      navigate(`/story/${randomStory.slug}`, { state: { from: 'random-dice' } });

      setTimeout(() => setIsSpinning(false), 500);
    }, 1000);
  }, [stories, loading, navigate, toast, canAccessPremiumFeatures]);

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        onClick={selectRandomStory}
        disabled={isSpinning || loading}
        className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
        size="lg"
      >
        <motion.div
          animate={{ rotate: isSpinning ? 360 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <Dices className="mr-2 h-5 w-5" />
        </motion.div>
        {isSpinning ? 'Seçiliyor...' : 'Rastgele Hikaye'}
      </Button>
    </motion.div>
  );
};

export default RandomStoryButton;