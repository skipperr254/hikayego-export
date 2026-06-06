import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BarChart2, Loader2, Target, Trophy, Flame, Award } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const WordleStatsModal = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalGames: 0,
    wins: 0,
    winPercentage: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
  });

  useEffect(() => {
    if (!isOpen || !user) return;
    
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('wordle_game_stats')
          .select('is_winner, attempts, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          let wins = 0;
          let currentStreak = 0;
          let maxStreak = 0;
          const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
          
          data.forEach(game => {
            if (game.is_winner) {
              wins++;
              currentStreak++;
              maxStreak = Math.max(maxStreak, currentStreak);
              if (game.attempts >= 1 && game.attempts <= 6) {
                distribution[game.attempts]++;
              }
            } else {
              currentStreak = 0;
            }
          });
          
          setStats({
            totalGames: data.length,
            wins,
            winPercentage: Math.round((wins / data.length) * 100),
            currentStreak,
            maxStreak,
            distribution
          });
        }
      } catch (err) {
        console.error("Error fetching user stats", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [isOpen, user]);

  const maxDistValue = Math.max(...Object.values(stats.distribution), 1);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl h-12 w-full font-bold bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary transition-all shadow-sm hover:shadow-md">
          <BarChart2 className="w-5 h-5 mr-2" />
          İstatistiklerim
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-[2rem] z-[150] p-6 bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-black text-center flex items-center justify-center gap-2">
            <BarChart2 className="w-6 h-6 text-primary" />
            Oyun İstatistikleri
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary/60" />
            <p className="text-sm font-medium text-muted-foreground">İstatistikleriniz yükleniyor...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col items-center justify-center bg-secondary/40 p-3 rounded-2xl">
                <Target className="w-5 h-5 text-blue-500 mb-1" />
                <span className="text-2xl font-black">{stats.totalGames}</span>
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground text-center leading-tight">Oynanan</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-secondary/40 p-3 rounded-2xl">
                <Trophy className="w-5 h-5 text-yellow-500 mb-1" />
                <span className="text-2xl font-black">%{stats.winPercentage}</span>
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground text-center leading-tight">Kazanma</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-secondary/40 p-3 rounded-2xl">
                <Flame className="w-5 h-5 text-orange-500 mb-1" />
                <span className="text-2xl font-black">{stats.currentStreak}</span>
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground text-center leading-tight">Seri</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-secondary/40 p-3 rounded-2xl">
                <Award className="w-5 h-5 text-purple-500 mb-1" />
                <span className="text-2xl font-black">{stats.maxStreak}</span>
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground text-center leading-tight">En İyi Seri</span>
              </div>
            </div>

            <div className="bg-card p-4 rounded-2xl border border-border/40 shadow-sm">
              <h3 className="text-sm font-bold mb-4">Tahmin Dağılımı</h3>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map(num => {
                  const count = stats.distribution[num];
                  const percentage = Math.max((count / maxDistValue) * 100, 5); 
                  
                  return (
                    <div key={num} className="flex items-center gap-2 text-sm">
                      <div className="w-3 font-bold text-muted-foreground text-right">{num}</div>
                      <div className="flex-1 h-6 bg-secondary/30 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full flex items-center justify-end px-2 text-xs font-bold text-white
                            ${count > 0 ? 'bg-primary' : 'bg-secondary/50 text-transparent'}`}
                        >
                          {count > 0 ? count : ''}
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WordleStatsModal;