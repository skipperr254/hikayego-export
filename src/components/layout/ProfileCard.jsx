import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, MoreHorizontal, ArrowRight, Crown, Edit2, Save, Goal, ArrowLeft, Settings, HelpCircle, PanelLeftOpen, PanelRightClose, Mail } from 'lucide-react';
import { useStoriesQuery } from '@/hooks/useStoriesQuery';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '@/hooks/useLocalStorage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const ProfileCard = ({ isCollapsed, setCollapsed }) => {
  const { user, profile, canAccessPremiumFeatures } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { readStoryDetails, stories } = useStoriesQuery();
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  
  const [isEditing, setIsEditing] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useLocalStorage('weeklyStoryGoal', 7);
  const [tempWeeklyGoal, setTempWeeklyGoal] = useState(weeklyGoal);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setTempWeeklyGoal(weeklyGoal);
  }, [weeklyGoal]);

  const handleSaveGoal = useCallback(() => {
    if (tempWeeklyGoal < 1 || tempWeeklyGoal > 300) {
      toast({ title: "Geçersiz Hedef", description: "Haftalık hedef 1 ile 300 arasında olmalıdır.", variant: "destructive" });
      return;
    }
    setWeeklyGoal(tempWeeklyGoal);
    setIsEditing(false);
    toast({ title: "Hedef Güncellendi!", description: "Yeni hedefin başarıyla kaydedildi." });
  }, [tempWeeklyGoal, setWeeklyGoal, toast]);

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleGoalInputChange = useCallback((e) => {
    setTempWeeklyGoal(Math.min(300, Math.max(1, parseInt(e.target.value) || 1)));
  }, []);

  const handleNavigateSettings = useCallback(() => {
    navigate('/settings');
  }, [navigate]);

  const handleNavigateHelpCenter = useCallback(() => {
    navigate('/help-center');
  }, [navigate]);

  const handleToggleCollapse = useCallback(() => {
    setCollapsed(prev => !prev);
  }, [setCollapsed]);

  const handleNavigateActivity = useCallback((slug) => {
    const formatQuery = isDesktop ? '?format=desktop' : '';
    navigate(`/story/${slug}${formatQuery}`);
  }, [navigate, isDesktop]);

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const displayName = useMemo(() => profile?.name || user?.email?.split('@')[0] || 'Gezgin', [profile?.name, user?.email]);
  const avatarUrl = useMemo(() => profile?.avatar_url || user?.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.id}`, [profile?.avatar_url, user?.avatar_url, user?.id]);
  
  const readStoriesCount = useMemo(() => readStoryDetails?.length || 0, [readStoryDetails]);
  const weeklyProgress = useMemo(() => weeklyGoal > 0 ? Math.min((readStoriesCount / weeklyGoal) * 100, 100) : 0, [readStoriesCount, weeklyGoal]);
  
  const recentActivities = useMemo(() => {
    if (!stories || stories.length === 0) return [];
    
    const readStories = stories
      .filter(s => s.is_read)
      .map(s => ({ ...s, type: 'read', date: new Date(s.read_at) }))
      .sort((a, b) => b.date - a.date)
      .slice(0, 2);

    const savedStories = stories
      .filter(s => s.is_saved)
      .map(s => ({ ...s, type: 'saved', date: new Date(s.saved_at) }))
      .sort((a, b) => b.date - a.date)
      .slice(0, 2);

    return [...readStories, ...savedStories]
      .sort((a, b) => b.date - a.date)
      .slice(0, 3);
  }, [stories]);

  const PremiumAvatarWrapper = useCallback(({ children }) => {
    if (!canAccessPremiumFeatures) return children;
    return (
        <div className="relative">
            {children}
            <div className="absolute -top-1 -right-1 h-6 w-6 bg-amber-400 rounded-full flex items-center justify-center border-2 border-background shadow-md">
                <Crown className="h-3 w-3 text-white" />
            </div>
        </div>
    );
  }, [canAccessPremiumFeatures]);

  return (
    <aside
      className={cn(
        "fixed right-0 top-0 hidden h-full flex-col border-l bg-background s-desktop:flex z-40 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20 p-2" : "w-[340px] p-6"
    )}>
      <AnimatePresence>
        {isCollapsed ? (
          <motion.div 
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center space-y-4"
          >
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleToggleCollapse}>
                      <PanelLeftOpen className="h-5 w-5"/>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" align="center" sideOffset={5}><p>Genişlet</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative cursor-pointer" onClick={handleNavigateSettings}>
                      <PremiumAvatarWrapper>
                         <Avatar className="h-10 w-10">
                          <AvatarImage src={avatarUrl} alt={displayName} />
                          <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </PremiumAvatarWrapper>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left" align="center" sideOffset={5}><p>Profili Görüntüle</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <div className="w-full border-t my-2"></div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative w-10 h-10">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path
                              className="text-primary/10"
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                          />
                          <path
                              className="text-primary"
                              strokeDasharray={`${weeklyProgress}, 100`}
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              transform="rotate(-90 18 18)"
                          />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">{Math.floor(weeklyProgress)}%</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" align="center" sideOffset={5}><p>Haftalık Hedef: {readStoriesCount}/{weeklyGoal}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="w-full border-t my-2"></div>
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                        <Button variant="ghost" size="icon" onClick={handleNavigateSettings}><Settings className="h-5 w-5"/></Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left" align="center" sideOffset={5}><p>Ayarlar</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
          </motion.div>
        ) : (
        <motion.div 
          key="expanded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col h-full overflow-hidden"
        >
          <div>
            <div className="flex h-14 items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-lg text-foreground">Profilin</h2>
              </div>
              <div className="flex items-center">
                <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleNavigateSettings}><Settings className="mr-2 h-4 w-4"/>Profili Düzenle</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleNavigateHelpCenter}><HelpCircle className="mr-2 h-4 w-4"/>Yardım</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="icon" onClick={handleToggleCollapse}>
                  <PanelRightClose className="h-5 w-5"/>
                </Button>
              </div>
            </div>

            <div 
              className="flex flex-col items-center text-center mt-4"
            >
              <PremiumAvatarWrapper>
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl} alt={displayName} className="rounded-full" />
                    <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
              </PremiumAvatarWrapper>
              <h3 className="mt-4 text-xl font-bold text-foreground">{getGreeting()}, {displayName}</h3>
              <p className="mt-1 text-sm text-muted-foreground">Yolculuğuna devam et ve hedeflerine ulaş.</p>
            </div>
            
            <Card className="mt-6 p-4 bg-secondary/50">
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="edit"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="weekly-goal" className="font-semibold text-base flex items-center gap-2"><Goal className="h-4 w-4 text-primary"/> Haftalık Hedef</Label>
                      <Button variant="ghost" size="icon" onClick={handleCancelEdit}><ArrowLeft className="h-4 w-4"/></Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input id="weekly-goal" type="number" value={tempWeeklyGoal} onChange={handleGoalInputChange} className="h-10 text-center font-bold" />
                      <Button onClick={handleSaveGoal} size="icon"><Save className="h-4 w-4"/></Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="display"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-base flex items-center gap-2"><Target className="h-4 w-4 text-primary"/> Haftalık İlerleme</p>
                      <Button variant="ghost" size="icon" onClick={handleEditClick}><Edit2 className="h-4 w-4"/></Button>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-muted-foreground mb-1">
                      <span>{readStoriesCount} / {weeklyGoal} Hikaye</span>
                      <span>{weeklyProgress.toFixed(0)}%</span>
                    </div>
                    <Progress value={weeklyProgress} className="h-2" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
            
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-base text-foreground">Son Aktiviteler</h3>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/activities')}>
                      Tümü
                      <ArrowRight className="ml-1 h-4 w-4"/>
                  </Button>
              </div>
              <div className="space-y-3">
                  {recentActivities.length > 0 ? recentActivities.map((activity) => (
                      <div key={`${activity.type}-${activity.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer" onClick={() => handleNavigateActivity(activity.slug)}>
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                              <img alt={activity.title} className="w-full h-full object-cover" src={activity.image_url || "https://images.unsplash.com/photo-1695313486156-469b82f59e07"} />
                          </div>
                          <div className="flex-1 overflow-hidden">
                              <p className="font-semibold text-sm truncate">{activity.title}</p>
                              <div className="flex items-center text-xs text-muted-foreground">
                                  <p>{activity.type === 'read' ? 'Okundu' : 'Kaydedildi'}</p>
                                  <span className="mx-1.5">·</span>
                                  <Badge variant="secondary" className={cn(`level-badge level-${activity.level}`)}>{activity.level.toUpperCase()}</Badge>
                              </div>
                          </div>
                      </div>
                  )) : <p className="text-sm text-muted-foreground text-center py-4">Henüz bir aktivite yok.</p>}
              </div>
            </div>

            {isMobile && (
              <div className="mt-6 p-3 rounded-lg bg-muted/50 border border-border">
                <div className="text-xs text-muted-foreground leading-relaxed">
                  Uygulama içinden plan/hesap işlemleri desteklenmiyor. Lütfen masaüstünden devam edin. Gerekirse bizimle iletişime geçin:{' '}
                  <span className="font-medium inline-flex items-center gap-1 mt-1 text-primary">
                    <Mail className="h-3 w-3" />
                    contact@hikayego.com
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="mt-auto pt-6 text-center">
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} HikayeGO</p>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};

export default ProfileCard;