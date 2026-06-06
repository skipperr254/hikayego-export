import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookmarkCheck, Lock, Crown } from 'lucide-react';
import StarRating from './StarRating';
import { cn, debounce } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import CountdownTimer from './CountdownTimer';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useQueryClient } from '@tanstack/react-query';
import { storyKeys } from '@/lib/queryKeys';
import { fetchStoryBySlug } from '@/api/stories';

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

const getLevelBadgeClass = (level) => {
  switch (level) {
    case 'a1': return 'bg-green-500 hover:bg-green-600';
    case 'a2': return 'bg-blue-500 hover:bg-blue-600';
    case 'b1': return 'bg-yellow-500 hover:bg-yellow-600 text-black';
    case 'b2': return 'bg-orange-500 hover:bg-orange-600';
    case 'c1': return 'bg-red-500 hover:bg-red-600';
    default: return 'bg-gray-500 hover:bg-gray-600';
  }
};

const StoryCard = React.memo(({ story, isPlaceholder }) => {
  const { user, canAccessPremiumFeatures } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const queryClient = useQueryClient();

  const prefetchStory = useCallback((slug, userId) => {
    if (!slug || !userId) return;
    queryClient.prefetchQuery({
      queryKey: storyKeys.detail(slug),
      queryFn: () => fetchStoryBySlug(slug, userId),
      staleTime: 1000 * 60 * 2, // 2 minutes
    }).catch(err => {
      console.error("Prefetch failed:", err);
    });
  }, [queryClient]);

  const debouncedPrefetch = useCallback(debounce(prefetchStory, 300), [prefetchStory]);

  const handleMouseEnter = () => {
    if (story.slug && user?.id && !isLocked) {
      debouncedPrefetch(story.slug, user.id);
    }
  };

  const isLocked = !canAccessPremiumFeatures && story.is_locked;
  
  const isNew = React.useMemo(() => {
    if (story.is_premium_placeholder || !story.created_at) return false;
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return new Date(story.created_at) > threeDaysAgo;
  }, [story.created_at, story.is_premium_placeholder]);
  
  if (story.is_premium_placeholder) {
    return (
      <motion.div variants={cardVariants} className={cn("h-full", isPlaceholder && "sm:col-span-2")}>
        <div onClick={() => navigate('/subscription')} className="h-full cursor-pointer">
          <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group bg-card border relative">
              <div className="relative overflow-hidden aspect-video group bg-primary/10">
                   <div 
                      className="absolute inset-0 opacity-100"
                      style={{
                        backgroundColor: 'hsl(var(--background))',
                        backgroundImage: `
                          radial-gradient(at 27% 37%, hsl(var(--primary) / 0.1) 0px, transparent 50%),
                          radial-gradient(at 97% 21%, hsl(var(--primary) / 0.2) 0px, transparent 50%),
                          radial-gradient(at 75% 90%, hsl(var(--accent-foreground) / 0.1) 0px, transparent 50%),
                          radial-gradient(at 33% 96%, hsl(var(--primary) / 0.15) 0px, transparent 50%),
                          radial-gradient(at 82% 51%, hsl(var(--primary) / 0.2) 0px, transparent 50%)
                        `
                      }}
                    ></div>
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.15'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                      }}
                    ></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 border-2 border-primary/20 backdrop-blur-sm">
                        <Crown className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg sm:text-xl mb-1 text-shadow-md text-foreground">{story.title}</h3>
                    <p className="text-sm sm:text-base font-light max-w-md text-shadow text-muted-foreground">{story.description}</p>
                    <Button size="lg" className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg">
                        Premium'a Geç
                    </Button>
                  </div>
              </div>
          </Card>
        </div>
      </motion.div>
    );
  }

  const cardContent = (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group bg-card border relative">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden cursor-pointer aspect-video group">
          <motion.img
            alt={story.title}
            className={cn(
              'w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105',
              (story.is_read || isLocked) && 'grayscale'
            )}
            src={story.image_url || "https://images.unsplash.com/photo-1650371212637-f245fd18b1d9"}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

          {!isLocked && (
            <div
              className="absolute inset-0 p-4 flex items-end bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <p className="text-white text-sm line-clamp-4">{story.description}</p>
            </div>
          )}

          <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
            <Badge className={cn(getLevelBadgeClass(story.level), 'text-white shadow-lg border-transparent')}>{story.level.toUpperCase()}</Badge>
            {isNew && !isLocked && <Badge variant="new" className="shadow-lg border-transparent">Yeni</Badge>}
          </div>
          {story.is_saved && !isLocked && (
            <div className="absolute top-3 left-3 z-10 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
              <Badge variant="secondary" className="bg-blue-500 text-white shadow-lg border-transparent"><BookmarkCheck className="h-3 w-3 mr-1" />Kayıtlı</Badge>
            </div>
          )}
          
          {isLocked && (
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-2 sm:p-4 text-center">
                <>
                  <Lock className="h-6 w-6 sm:h-8 sm:w-8 mb-1 sm:mb-2" />
                  <h3 className="font-bold text-base sm:text-lg mb-1">Yeni Hikaye Yolda!</h3>
                  <p className="text-xs sm:text-sm mb-2 sm:mb-3">Bu hikaye yakında açılacak.</p>
                  <CountdownTimer onComplete={() => navigate(0)} />
                   <Button size="sm" className="mt-2 sm:mt-4 bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm" onClick={() => navigate('/subscription')}>
                    <Crown className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" /> Anında Eriş
                  </Button>
                </>
            </div>
          )}
           {story.is_read && !isLocked && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">✓ Okundu</div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex flex-col flex-grow">
          <CardTitle className={cn("mb-1 text-base font-bold transition-colors cursor-pointer line-clamp-1", !isLocked && "group-hover:text-primary")}>{story.title}</CardTitle>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-2 border-t">
          <div className="flex items-center space-x-1"><Clock className="h-3 w-3" /><span>{story.read_time}</span></div>
          <StarRating storyId={story.id} initialAvgRating={story.rating} />
        </div>
      </CardContent>
    </Card>
  );

  const destination = isMobile ? `/story/${story.slug}` : `/read/${story.slug}`;

  return (
    <motion.div 
      variants={cardVariants} 
      className="h-full"
      onMouseEnter={handleMouseEnter}
      onFocus={handleMouseEnter}
    >
      {isLocked && !story.is_premium_placeholder ? (
        <div className="h-full cursor-default">
          {cardContent}
        </div>
      ) : (
        <Link to={destination} className="h-full block">
          {cardContent}
        </Link>
      )}
    </motion.div>
  );
});

const StoriesGrid = ({ stories, loading }) => {
  if (loading) {
    return null;
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
    >
      {stories.map((story) => (
         <StoryCard key={story.unique_key || story.id} story={story} isPlaceholder={story.is_premium_placeholder} />
      ))}
    </motion.div>
  );
};

export default StoriesGrid;