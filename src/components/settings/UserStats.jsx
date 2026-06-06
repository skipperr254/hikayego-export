import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { BookOpen, Flame, BrainCircuit, PencilRuler, HelpCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const getStreakGlow = (streak) => {
  if (streak >= 100) return 'shadow-[0_0_20px_5px_rgba(255,100,0,0.7)] ring-2 ring-orange-400';
  if (streak >= 30) return 'shadow-[0_0_15px_3px_rgba(255,150,0,0.6)] ring-1 ring-orange-500';
  if (streak >= 7) return 'shadow-[0_0_10px_2px_rgba(255,200,0,0.5)]';
  return '';
};

const StatCard = ({ icon: Icon, label, value, colorClass, tooltipText, streak }) => {
    const isStreakCard = label === "Günlük Seri";
    const streakGlow = isStreakCard ? getStreakGlow(streak) : '';

    return (
        <div className={`relative overflow-hidden rounded-2xl text-white shadow-lg ${colorClass} h-full transition-all duration-500 ${streakGlow}`}>
            <div className="relative p-4 h-full flex flex-col justify-center">
                 <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      {isStreakCard ? (
                          <motion.div
                            animate={{ scale: streak > 0 ? [1, 1.2, 1] : 1 }}
                            transition={{ repeat: streak > 0 ? Infinity : 0, duration: 2, ease: "easeInOut" }}
                          >
                             <Flame className={`h-6 w-6 transition-colors duration-500 ${streak > 0 ? 'text-red-400' : ''}`} />
                          </motion.div>
                      ) : (
                         <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{value}</p>
                      <p className="text-sm font-medium text-white/90">{label}</p>
                    </div>
                 </div>
                 {tooltipText && (
                    <TooltipProvider>
                       <Tooltip delayDuration={100}>
                         <TooltipTrigger asChild>
                           <button className="absolute top-2 right-2 p-1 text-white/70 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50">
                             <HelpCircle className="h-4 w-4"/>
                           </button>
                         </TooltipTrigger>
                         <TooltipContent><p>{tooltipText}</p></TooltipContent>
                       </Tooltip>
                    </TooltipProvider>
                 )}
            </div>
        </div>
    );
};

const WordStatCard = ({ label, value, colorClass, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index }}
        className="bg-card p-4 rounded-xl shadow-sm border flex flex-col justify-between h-full"
    >
        <div className="flex items-center justify-between">
           <p className="text-sm font-semibold text-muted-foreground">{label}</p>
           <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
        </div>
        <div>
            <p className={`text-3xl lg:text-4xl font-bold ${colorClass.replace('bg-', 'text-')}`}>{value}</p>
        </div>
    </motion.div>
);

const UserStats = ({ userId }) => {
  const [stats, setStats] = useState({
    storiesRead: 0,
    dailyStreak: 0,
    totalWords: 0,
    newWords: 0,
    learningWords: 0,
    learnedWords: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('id', userId)
        .single();
      
      if (userError) throw userError;
      
      const [
        wordsRes,
        storiesRes,
        streakRes,
      ] = await Promise.all([
        supabase.from('user_saved_words').select('is_learned,correct_count,incorrect_count', { count: 'exact', head: false }).eq('user_id', userId),
        supabase.from('user_read_stories').select('story_id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.rpc('get_user_streak', { 
            p_user_id: userId,
            p_user_creation_date: userData.created_at
        }),
      ]);

      if (wordsRes.error) throw wordsRes.error;
      if (storiesRes.error) throw storiesRes.error;
      if (streakRes.error) throw streakRes.error;
      
      const newStreak = streakRes.data || 0;
      if (newStreak > (stats.dailyStreak || 0)) {
        const pointsToAdd = newStreak * 5; 
        await supabase.rpc('add_points', { p_user_id: userId, p_points_to_add: pointsToAdd });
      }

      const wordsData = wordsRes.data || [];
      const totalWords = wordsRes.count || 0;
      let learnedWords = 0;
      let newWords = 0;
      
      for(const word of wordsData) {
        if (word.is_learned) {
          learnedWords++;
        } else if (word.correct_count === 0 && word.incorrect_count === 0) {
          newWords++;
        }
      }
      const learningWords = totalWords - learnedWords - newWords;

      setStats({
        storiesRead: storiesRes.count || 0,
        dailyStreak: newStreak,
        totalWords: totalWords,
        newWords: newWords,
        learningWords: learningWords,
        learnedWords: learnedWords,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, stats.dailyStreak]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  
  const generalStatItems = useMemo(() => {
    if (loading) return [
      { icon: BookOpen, label: "Okunan Hikaye", value: 0, colorClass: "bg-gradient-to-br from-blue-500 to-cyan-500" },
      { icon: Flame, label: "Günlük Seri", value: 0, colorClass: "bg-gradient-to-br from-amber-500 to-orange-500", streak: 0 },
    ];
    return [
      { icon: BookOpen, label: "Okunan Hikaye", value: stats.storiesRead, colorClass: "bg-gradient-to-br from-blue-500 to-cyan-500", tooltipText: "Tamamladığınız hikaye sayısı." },
      { icon: Flame, label: "Günlük Seri", value: stats.dailyStreak, colorClass: "bg-gradient-to-br from-amber-500 to-orange-500", tooltipText: "Art arda kaç gün pratik yaptığınızı gösterir. Serinizi korumak için her gün en az bir aktivite tamamlayın!", streak: stats.dailyStreak },
    ];
  }, [stats.storiesRead, stats.dailyStreak, loading]);
  
  const wordStatItems = useMemo(() => {
    if (loading) return [
        { label: "Tümü", value: 0, colorClass: "bg-primary" },
        { label: "Yeni", value: 0, colorClass: "bg-rose-500" },
        { label: "Öğreniliyor", value: 0, colorClass: "bg-amber-500" },
        { label: "Öğrenildi", value: 0, colorClass: "bg-emerald-500" },
    ];
    return [
      { label: "Tümü", value: stats.totalWords, colorClass: "bg-primary" },
      { label: "Yeni", value: stats.newWords, colorClass: "bg-rose-500" },
      { label: "Öğreniliyor", value: stats.learningWords, colorClass: "bg-amber-500" },
      { label: "Öğrenildi", value: stats.learnedWords, colorClass: "bg-emerald-500" },
    ];
  }, [stats.totalWords, stats.newWords, stats.learningWords, stats.learnedWords, loading]);

  if (loading && !stats.storiesRead) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array(2).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><PencilRuler className="text-primary"/>Genel İstatistikler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {generalStatItems.map((item, index) => (
            <StatCard key={item.label} {...item} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BrainCircuit className="text-primary"/>Kelime İstatistikleri</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {wordStatItems.map((item, index) => (
            <WordStatCard key={item.label} {...item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserStats;