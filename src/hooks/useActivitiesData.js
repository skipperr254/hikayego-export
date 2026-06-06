import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useActivitiesData = (user, canAccessPremiumFeatures) => {
  const [words, setWords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    wordsLearned: 0,
    quizzesCompleted: 0,
    storiesRead: 0,
    progressPercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivitiesData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const fetchPromises = [
        supabase
          .from('user_saved_words')
          .select('*', { count: 'exact' })
          .eq('user_id', user.id)
          .order('added_at', { ascending: false }),
        supabase
          .from('user_quiz_attempts')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('user_read_stories')
          .select('story_id', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('stories')
          .select('id', { count: 'exact', head: true })
      ];

      if (canAccessPremiumFeatures) {
        fetchPromises.push(
          supabase
            .from('word_categories')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
        );
      }

      const results = await Promise.all(fetchPromises);
      const [wordsResult, quizAttemptsResult, readStoriesResult, totalStoriesResult, categoriesResult] = results;

      if (wordsResult.error) throw wordsResult.error;
      
      const fetchedWords = wordsResult.data || [];
      const limitedWords = canAccessPremiumFeatures ? fetchedWords : fetchedWords.slice(0, 10);
      setWords(limitedWords);
      
      if (canAccessPremiumFeatures && categoriesResult) {
        if (categoriesResult.error) throw categoriesResult.error;
        setCategories(categoriesResult.data || []);
      } else {
        setCategories([]);
      }
      
      const quizzesCompleted = quizAttemptsResult.count || 0;
      const storiesRead = readStoriesResult.count || 0;
      const totalStories = totalStoriesResult.count || 0;
      const progressPercentage = totalStories > 0 ? Math.round((storiesRead / totalStories) * 100) : 0;
      const wordsCount = wordsResult.count || 0;

      setStats({
        wordsLearned: wordsCount,
        quizzesCompleted,
        storiesRead,
        progressPercentage,
      });

    } catch (err) {
      console.error('Activities data fetch error:', err);
      setError(err.message);
      setWords([]);
      setCategories([]);
      setStats({ wordsLearned: 0, quizzesCompleted: 0, storiesRead: 0, progressPercentage: 0 });
    } finally {
      setLoading(false);
    }
  }, [user?.id, canAccessPremiumFeatures]);

  useEffect(() => {
    fetchActivitiesData();
  }, [fetchActivitiesData]);

  return {
    words,
    setWords,
    categories,
    setCategories,
    stats,
    loading,
    error,
    refetch: fetchActivitiesData
  };
};