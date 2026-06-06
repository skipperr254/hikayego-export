import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Search, BookOpen, Clock, Star, Bookmark, BookmarkX, Loader2, Crown, Info, Library, Feather, Sunrise, Wind, TrendingUp, Rocket } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { getDailyFreeStories } from '@/utils/dailyStorySelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Seo from '@/components/Seo';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import MobileUnsupportedModal from '@/components/modals/MobileUnsupportedModal';

const levels = [
  { value: 'all', label: 'Tüm Seviyeler', icon: Library },
  { value: 'a1', label: 'A1 Başlangıç', icon: Feather },
  { value: 'a2', label: 'A2 Temel', icon: Sunrise },
  { value: 'b1', label: 'B1 Orta', icon: Wind },
  { value: 'b2', label: 'B2 Orta Üstü', icon: TrendingUp },
  { value: 'c1', label: 'C1 İleri', icon: Rocket },
];

const SavedStoriesPage = () => {
  const { user, canAccessPremiumFeatures, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [savedStories, setSavedStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const isKidAccount = profile?.is_kid_account || false;
  const isMobile = useMediaQuery('(max-width: 1023px)');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchSavedStories = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_saved_stories')
          .select(`
            story_id,
            saved_at,
            stories (id, title, description, level, read_time, rating, image_url, slug, created_at)
          `)
          .eq('user_id', user.id)
          .order('saved_at', { ascending: false });

        if (error) throw error;
        let finalSavedStories = data.filter(s => s.stories) || [];
        if (!canAccessPremiumFeatures) {
          const { data: allStories, error: storiesError } = await supabase
            .from('stories')
            .select('id, level, is_for_kids, created_at');
          if (storiesError) throw storiesError;
          
          // Filter stories based on kid mode before getting daily free stories
          const storiesToProcess = isKidAccount 
            ? allStories.filter(s => s.is_for_kids) 
            : allStories;
          
          const { unlocked: dailyUnlockedIds } = getDailyFreeStories(storiesToProcess || [], isKidAccount);
          
          finalSavedStories = finalSavedStories.filter(saved => {
            return dailyUnlockedIds.includes(saved.story_id);
          });
        }
        setSavedStories(finalSavedStories);
      } catch (err) {
        console.error('Error fetching/processing saved stories:', err);
        toast({
          title: "Hata",
          description: "Kayıtlı hikayeler yüklenirken bir hata oluştu.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedStories();
  }, [user, navigate, canAccessPremiumFeatures, isKidAccount, toast]);

  const removeSavedStory = async storyId => {
    try {
      const { error } = await supabase.from('user_saved_stories').delete().eq('user_id', user.id).eq('story_id', storyId);
      if (error) throw error;
      setSavedStories(savedStories.filter(story => story.story_id !== storyId));
      toast({
        title: "Hikaye kaldırıldı",
        description: "Hikaye kayıtlı listesinden çıkarıldı."
      });
    } catch (error) {
      console.error('Error removing saved story:', error);
      toast({
        title: "Hata",
        description: "Hikaye kaldırılırken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleStoryClick = (e, story) => {
    const isComingSoon = story.created_at && new Date(story.created_at) > new Date();
    
    if (isMobile && isComingSoon) {
      e.preventDefault();
      setShowMobileModal(true);
    }
  };

  const filteredStories = useMemo(() => savedStories.filter(savedStory => {
    const story = savedStory.stories;
    if (!story) return false;
    
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (story.description && story.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLevel = selectedLevel === 'all' || story.level === selectedLevel;

    return matchesSearch && matchesLevel;
  }), [savedStories, searchTerm, selectedLevel]);

  const renderNoAccess = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
      <Crown className="h-16 w-16 mx-auto text-amber-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Bu Bir Premium Özellik</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Hikayelerinizi kaydetmek ve daha sonra erişmek için Premium üyeliğe geçmeniz gerekmektedir.
      </p>
      <Button onClick={() => navigate('/subscription')}>
        <Crown className="mr-2 h-4 w-4" />
        Premium'a Geç
      </Button>
    </motion.div>
  );

  return (
    <>
      <Seo
        title="Kaydedilen Hikayelerim"
        description="Daha sonra okumak için kaydettiğiniz İngilizce hikayelere erişin. Favori hikayeleriniz tek bir yerde."
        url="/saved-stories"
        keywords="kaydedilen hikayeler, favori İngilizce hikayeler, İngilizce okuma listesi"
      />
      <div className="min-h-screen">
        <div className="container mx-auto py-8 px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <div className={cn(
              "relative overflow-hidden rounded-2xl p-6 sm:p-8 border bg-card bg-cover bg-center bg-no-repeat"
            )}
            style={{backgroundImage: "url('https://images.unsplash.com/photo-1543002588-b9b6b622e8af?q=80&w=2574&auto=format&fit=crop')"}}
            >
              <div className="absolute inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm"></div>
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start text-white">
                <div className="mb-4 sm:mb-0">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">Kaydedilen Hikayeler</h1>
                  <p className="text-white/80 mt-2 max-w-lg">
                    Okuma listenize eklediğiniz hikayeleri burada bulabilirsiniz.
                  </p>
                  {!canAccessPremiumFeatures && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-white/70 bg-white/10 p-3 rounded-lg border border-white/20 max-w-lg">
                      <Info className="h-5 w-5 flex-shrink-0 text-white" />
                      <span>Ücretsiz planda, yalnızca o gün için erişilebilir olan A1 ve A2 seviye hikayelerinizi burada görebilirsiniz.</span>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0 bg-white/20 rounded-full w-20 h-20 flex flex-col items-center justify-center border border-white/30 text-center">
                  <span className="text-3xl font-bold">{filteredStories.length}</span>
                  <span className="text-xs font-medium">Hikaye</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Kayıtlı hikayelerde ara..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full md:w-[240px]">
                    <SelectValue placeholder="Seviyeye göre filtrele" />
                </SelectTrigger>
                <SelectContent>
                    {levels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center gap-2">
                        <level.icon className="h-4 w-4" />
                        <span>{level.label}</span>
                        </div>
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </motion.div>

          {loading ? (
            <div className="text-center py-16"><Loader2 className="h-16 w-16 mx-auto text-primary mb-4 animate-spin" /></div>
          ) : !canAccessPremiumFeatures && savedStories.length === 0 ? (
            renderNoAccess()
          ) : filteredStories.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map((savedStory, index) => {
                const story = savedStory.stories;
                if (!story) return null;
                const storyUrl = `/story/${story.slug}`;
                const isComingSoon = story.created_at && new Date(story.created_at) > new Date();
                
                return (
                  <motion.div key={story.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
                    <Card className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group bg-card border">
                      <CardHeader className="p-0">
                        <Link to={storyUrl} onClick={(e) => handleStoryClick(e, story)} className="block">
                          <div className="relative overflow-hidden cursor-pointer aspect-video">
                            {story.image_url ? (
                              <img src={story.image_url} alt={story.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            ) : (
                              <img  alt={story.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" src="https://images.unsplash.com/photo-1675875550250-20476bf30d9c" />
                            )}
                            <div className="absolute top-3 right-3 flex gap-2">
                              <Badge className={`level-badge level-${story.level} shadow-lg`}>{story.level.toUpperCase()}</Badge>
                            </div>
                            {isComingSoon && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <Badge variant="secondary" className="bg-amber-500 text-white text-sm px-3 py-1">
                                  Yakında
                                </Badge>
                              </div>
                            )}
                          </div>
                        </Link>
                      </CardHeader>
                      <CardContent className="p-4 flex flex-col flex-grow">
                        <Link to={storyUrl} onClick={(e) => handleStoryClick(e, story)}><CardTitle className="mb-2 text-lg font-bold group-hover:text-primary transition-colors cursor-pointer line-clamp-1">{story.title}</CardTitle></Link>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">{story.description}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                          <div className="flex items-center space-x-1"><Clock className="h-3 w-3" /><span>{story.read_time}</span></div>
                          <div className="flex items-center space-x-1"><Star className="h-3 w-3 text-yellow-400 fill-current" /><span>{story.rating}</span></div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Link to={storyUrl} onClick={(e) => handleStoryClick(e, story)} className="flex-1">
                            <Button className="w-full" disabled={isComingSoon && isMobile}>
                              <BookOpen className="h-4 w-4 mr-2" />
                              {isComingSoon ? 'Yakında' : 'Oku'}
                            </Button>
                          </Link>
                          <Button variant="outline" size="icon" onClick={() => removeSavedStory(story.id)} className="hover:bg-destructive hover:text-destructive-foreground" title="Kayıtlılardan kaldır"><BookmarkX className="h-4 w-4" /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <Bookmark className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">{searchTerm || selectedLevel !== 'all' ? 'Hikaye bulunamadı' : 'Henüz kayıtlı hikayeniz yok'}</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">{searchTerm || selectedLevel !== 'all' ? 'Arama veya filtreleme kriterlerinizi değiştirmeyi deneyin.' : 'Hikayeleri okurken kaydet butonuna tıklayarak favorilerinizi oluşturmaya başlayın.'}</p>
              {(!searchTerm && selectedLevel === 'all') && <Button onClick={() => navigate('/dashboard')}>Hikayeleri Keşfet</Button>}
            </motion.div>
          )}
        </div>
      </div>

      <MobileUnsupportedModal isOpen={showMobileModal} onClose={() => setShowMobileModal(false)} />
    </>
  );
};

export default SavedStoriesPage;