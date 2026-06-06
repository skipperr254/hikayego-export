import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Crown, Star, Loader2, Info } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';

const WordleLeaderboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Enforce exact 24-hour current date filter based on UTC
        const todayUTC = new Date().toISOString().split('T')[0] + 'T00:00:00.000Z';

        const { data, error } = await supabase
          .from('wordle_game_stats')
          .select(`
            user_id,
            attempts,
            created_at,
            profiles:user_id (username, name, avatar_url)
          `)
          .eq('is_winner', true)
          .gte('created_at', todayUTC);
          
        if (error) throw error;
        
        const userWins = {};
        if (data) {
          data.forEach(stat => {
            if (!userWins[stat.user_id]) {
              userWins[stat.user_id] = { 
                count: 0, 
                bestScore: 999,
                profile: stat.profiles,
                user_id: stat.user_id
              };
            }
            userWins[stat.user_id].count += 1;
            if (stat.attempts < userWins[stat.user_id].bestScore) {
              userWins[stat.user_id].bestScore = stat.attempts;
            }
          });
        }
        
        const sorted = Object.values(userWins)
          .sort((a, b) => b.count !== a.count ? b.count - a.count : a.bestScore - b.bestScore)
          .slice(0, 10);
          
        setStats(sorted);
      } catch (err) {
        console.error("Error fetching leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [isOpen]);

  const getRankStyle = (idx) => {
    switch(idx) {
      case 0: return 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-yellow-950 border-yellow-200 shadow-yellow-500/20';
      case 1: return 'bg-gradient-to-br from-gray-200 to-gray-400 text-gray-800 border-gray-100 shadow-gray-400/20';
      case 2: return 'bg-gradient-to-br from-amber-600 to-orange-800 text-amber-50 border-amber-500 shadow-orange-900/20';
      default: return 'bg-secondary/50 text-muted-foreground border-transparent';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl h-12 w-full font-bold bg-amber-500/10 border-amber-500/30 text-amber-600 hover:bg-amber-500/20 hover:text-amber-700 transition-all shadow-sm hover:shadow-md">
          <Trophy className="w-4 h-4 mr-2" />
          Global Sıralama
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-[2rem] z-[150] max-h-[85vh] overflow-hidden flex flex-col p-0 border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader className="shrink-0 p-6 pb-4 border-b border-border/40 bg-card/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-10 pointer-events-none">
            <Crown className="w-32 h-32 text-amber-500" />
          </div>
          <DialogTitle className="text-2xl font-black text-center flex items-center justify-center gap-2 relative z-10">
            <Medal className="w-6 h-6 text-amber-500" />
            Global Sıralama
          </DialogTitle>
          <p className="text-center text-xs text-muted-foreground mt-2 font-medium relative z-10 flex flex-col items-center gap-1">
            <span>Sadece bugünün (son 24 saat) oyunlarına göre sıralama.</span>
            <span className="flex items-center gap-1 text-[10px] bg-secondary/50 px-2 py-0.5 rounded-full">
              <Info className="w-3 h-3" /> 24 saatte bir sıfırlanır
            </span>
          </p>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-gradient-to-b from-transparent to-secondary/5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary/60" />
              <p className="text-sm font-medium text-muted-foreground">Sıralama hesaplanıyor...</p>
            </div>
          ) : stats.length === 0 ? (
            <div className="text-center py-12 bg-card/50 rounded-2xl border border-border/40 backdrop-blur-sm">
              <Trophy className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium text-sm">Bugün henüz kazanan yok.</p>
            </div>
          ) : (
            <AnimatePresence>
              {stats.map((stat, idx) => {
                const isTop3 = idx < 3;
                const firstName = (stat.profile?.name || 'Kullanıcı').split(' ')[0];
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                    key={stat.user_id} 
                    className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all duration-300 group
                      ${isTop3 ? 'bg-card shadow-sm hover:shadow-md' : 'bg-card/60 hover:bg-card border-border/40 hover:border-border/80'}`}
                    style={isTop3 ? { borderColor: idx === 0 ? 'rgba(234,179,8,0.3)' : idx === 1 ? 'rgba(156,163,175,0.3)' : 'rgba(180,83,9,0.3)' } : {}}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black shrink-0 shadow-sm border ${getRankStyle(idx)}`}>
                        {idx === 0 ? <Crown className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow-sm" /> : idx + 1}
                      </div>
                      
                      <div className="relative">
                        <Avatar className={`w-11 h-11 sm:w-12 sm:h-12 border-2 shrink-0 transition-transform duration-300 group-hover:scale-105
                          ${idx === 0 ? 'border-yellow-400' : idx === 1 ? 'border-gray-300' : idx === 2 ? 'border-amber-700' : 'border-background shadow-sm'}`}>
                          <AvatarImage src={stat.profile?.avatar_url} alt={firstName} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {firstName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {isTop3 && (
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-background flex items-center justify-center
                            ${idx === 0 ? 'bg-yellow-400 text-yellow-900' : idx === 1 ? 'bg-gray-300 text-gray-800' : 'bg-amber-600 text-white'}`}>
                            <Star className="w-2.5 h-2.5 fill-current" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col min-w-0 flex-1 justify-center">
                        <p className={`font-bold text-sm sm:text-base truncate ${isTop3 ? 'text-foreground' : 'text-foreground/80'}`}>
                          {firstName}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right ml-2">
                      <div className="flex flex-col items-end">
                        <span className={`text-lg sm:text-xl font-black leading-none ${idx === 0 ? 'text-yellow-600 dark:text-yellow-500' : idx === 1 ? 'text-gray-500 dark:text-gray-400' : idx === 2 ? 'text-amber-700 dark:text-amber-600' : 'text-primary'}`}>
                          {stat.count} <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground mt-0.5">Kazanma</span>
                        </span>
                        <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground mt-0.5">
                          En İyi: {stat.bestScore} Deneme
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WordleLeaderboard;