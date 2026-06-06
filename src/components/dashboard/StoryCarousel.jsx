import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, ArrowRight } from 'lucide-react';
import { cn, debounce } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import CountdownTimer from './CountdownTimer';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useQueryClient } from '@tanstack/react-query';
import { storyKeys } from '@/lib/queryKeys';
import { fetchStoryBySlug } from '@/api/stories';

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

const CarouselStoryCard = React.memo(({ story }) => {
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
    if (!story.created_at) return false;
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return new Date(story.created_at) > threeDaysAgo;
  }, [story.created_at]);

  const cardContent = (
    <Card className="h-full w-full flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group bg-card border relative rounded-xl">
      <div className="relative overflow-hidden cursor-pointer aspect-[3/4] group">
        <motion.img
          alt={story.title}
          className={cn(
            'w-full h-full object-cover transition-all duration-500 ease-in-out',
            (story.is_read || isLocked) && 'grayscale'
          )}
          src={story.image_url || "https://images.unsplash.com/photo-1650371212637-f245fd18b1d9"}
          loading="lazy"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h3 className="font-bold text-sm line-clamp-2 text-shadow">{story.title}</h3>
        </div>

        <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5 z-10">
          <Badge className={cn(getLevelBadgeClass(story.level), 'text-white shadow-lg border-transparent text-xs px-2 py-0.5')}>{story.level.toUpperCase()}</Badge>
          {isNew && !isLocked && <Badge variant="new" className="shadow-lg border-transparent">Yeni</Badge>}
        </div>
        
        {isLocked && (
           <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white p-2 text-center">
              <Lock className="h-5 w-5 mb-1.5 text-gray-300" />
              <h3 className="font-bold text-[13px] leading-tight mb-1">Yeni Hikaye Yolda!</h3>
              <p className="text-[10px] text-gray-300 mb-2 px-1">Bu hikaye yakında açılacak.</p>
              <div className="w-full transform scale-90 origin-center flex justify-center">
                <CountdownTimer onComplete={() => navigate(0)} />
              </div>
          </div>
        )}
         {story.is_read && !isLocked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">✓ Okundu</div>
          </div>
        )}
      </div>
    </Card>
  );

  const destination = isMobile ? `/story/${story.slug}` : `/read/${story.slug}`;

  return (
    <motion.div 
      className="h-full w-40 sm:w-48 flex-shrink-0"
      onMouseEnter={handleMouseEnter}
      onFocus={handleMouseEnter}
    >
      {isLocked ? (
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

const StoryCarousel = ({ title, category, stories }) => {
  const navigate = useNavigate();
  if (!stories || stories.length === 0) return null;

  const handleShowAll = () => {
    navigate(`/category/${category}`);
  };

  return (
    <motion.div 
      className="space-y-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <Button variant="ghost" size="sm" className="text-primary font-semibold" onClick={handleShowAll}>
          Tümünü Gör <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
      <div className="flex space-x-4 overflow-x-auto pb-4 px-4 sm:px-6 custom-scrollbar -mb-4">
        {stories.slice(0, 10).map(story => (
          <CarouselStoryCard key={story.id} story={story} />
        ))}
      </div>
    </motion.div>
  );
};

export default StoryCarousel;