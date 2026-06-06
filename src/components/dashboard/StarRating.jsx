import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const StarRating = React.memo(({ storyId, initialAvgRating }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [avgRating, setAvgRating] = useState(initialAvgRating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRatingData = useCallback(async () => {
    if (!storyId) return;
    
    try {
      const { data, error } = await supabase
          .rpc('get_story_rating_details', { 
            p_story_id: storyId, 
            p_user_id: user?.id 
          });

      if (error) throw error;
      if (data && data.length > 0) {
        setAvgRating(data[0].avg_rating || 0);
        setRating(data[0].user_rating || 0);
      }
    } catch (error) {
      console.error('Error fetching rating data:', error);
    }
  }, [storyId, user?.id]);

  useEffect(() => {
    fetchRatingData();
  }, [fetchRatingData]);

  useEffect(() => {
    setAvgRating(initialAvgRating || 0);
  }, [initialAvgRating]);

  const handleRating = useCallback(async (newRating) => {
    if (!user) {
      toast({
        title: "Giriş Gerekli",
        description: "Hikayeleri oylamak için lütfen giriş yapın.",
        variant: "destructive"
      });
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    const previousRating = rating;
    setRating(newRating);

    try {
      const { error: upsertError } = await supabase
        .from('story_ratings')
        .upsert({ story_id: storyId, user_id: user.id, rating: newRating }, { onConflict: 'story_id, user_id' });

      if (upsertError) throw upsertError;

      toast({
        title: "Oyunuz Kaydedildi! ✅",
        description: `Bu hikayeye ${newRating} yıldız verdiniz.`,
      });

      fetchRatingData();

    } catch (error) {
      setRating(previousRating);
      console.error('Error submitting rating:', error);
      toast({
        title: "Hata",
        description: "Oyunuz kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [user, storyId, isSubmitting, toast, fetchRatingData, rating]);

  const handleClick = (e, star) => {
      e.preventDefault();
      e.stopPropagation();
      handleRating(star);
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center" onMouseLeave={() => setHoverRating(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.div
            key={star}
            whileHover={{ scale: 1.2, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => handleClick(e, star)}
            onMouseEnter={() => setHoverRating(star)}
          >
            <Star
              className={cn(
                "h-5 w-5 cursor-pointer transition-colors duration-200",
                (hoverRating || rating) >= star 
                  ? "text-yellow-400 fill-yellow-400" 
                  : "text-gray-300 dark:text-gray-600"
              )}
            />
          </motion.div>
        ))}
      </div>
      <span className="text-xs font-medium text-muted-foreground pt-0.5">({avgRating.toFixed(1)})</span>
    </div>
  );
});

export default StarRating;