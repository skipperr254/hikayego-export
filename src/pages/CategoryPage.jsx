import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStoriesQuery } from '@/hooks/useStoriesQuery';
import { useAuth } from '@/contexts/AuthContext';
import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import StoriesGrid from '@/components/dashboard/StoriesGrid';
import StoriesGridSkeleton from '@/components/dashboard/skeletons/StoriesGridSkeleton';
import EmptyState from '@/components/dashboard/EmptyState';
import { motion } from 'framer-motion';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { user, canAccessPremiumFeatures, profile } = useAuth();
  const { stories, loading } = useStoriesQuery(user, canAccessPremiumFeatures);

  const { categoryTitle, categoryStories } = useMemo(() => {
    if (loading) return { categoryTitle: 'Yükleniyor...', categoryStories: [] };

    const userLevel = profile?.preferences?.skillLevel;
    const sortStories = (storyList) => {
      return storyList.sort((a, b) => {
        const aIsPreferredLevel = a.level === userLevel;
        const bIsPreferredLevel = b.level === userLevel;
        if (aIsPreferredLevel && !bIsPreferredLevel) return -1;
        if (!aIsPreferredLevel && bIsPreferredLevel) return 1;
        return b.rating - a.rating;
      });
    };

    let title = '';
    let filtered = [];

    if (categoryName === 'new') {
      title = 'Yeni Hikayeler';
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      filtered = stories.filter(s => new Date(s.created_at) > threeDaysAgo && !s.is_premium_placeholder);
    } else {
      title = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
      filtered = stories.filter(s => s.category === categoryName && !s.is_premium_placeholder);
    }

    return {
      categoryTitle: title,
      categoryStories: sortStories(filtered),
    };
  }, [categoryName, stories, loading, profile]);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={`${categoryTitle} Hikayeleri`}
        description={`${categoryTitle} kategorisindeki tüm İngilizce hikayeleri keşfedin.`}
      />
      <motion.header 
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold truncate">{categoryTitle}</h1>
          <div className="w-10"></div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <StoriesGridSkeleton count={12} />
        ) : categoryStories.length > 0 ? (
          <StoriesGrid stories={categoryStories} />
        ) : (
          <EmptyState onResetFilters={() => navigate('/dashboard')} />
        )}
      </main>
    </div>
  );
};

export default CategoryPage;