import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useNavigate } from 'react-router-dom';
import StoriesGrid from '@/components/dashboard/StoriesGrid';
import StoriesGridSkeleton from '@/components/dashboard/skeletons/StoriesGridSkeleton';
import Seo from '@/components/Seo';
import { BookCheck, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReadStoriesPage = () => {
  const { user, canAccessPremiumFeatures, profile } = useAuth();
  const navigate = useNavigate();
  const { stories, loading: loadingStories } = useDashboardData(user, navigate, canAccessPremiumFeatures, profile);

  const readStories = React.useMemo(() => {
    if (!stories) return [];
    return stories.filter(story => story.is_read);
  }, [stories]);

  const loading = loadingStories;

  return (
    <>
      <Seo
        title="Okunan Hikayeler"
        description="Daha önce okuduğunuz hikayeleri burada bulabilirsiniz."
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <BookCheck className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Okunan Hikayeler</h1>
              <p className="text-muted-foreground">Tamamladığın hikayelere tekrar göz at.</p>
            </div>
          </div>
        </div>

        {loading ? (
          <StoriesGridSkeleton count={readStories.length > 0 ? readStories.length : 4} />
        ) : readStories.length > 0 ? (
          <StoriesGrid stories={readStories} loading={loading} />
        ) : (
          <div className="text-center py-20">
            <BookCheck className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <h2 className="mt-4 text-2xl font-semibold">Henüz hiç hikaye okumadın.</h2>
            <p className="mt-2 text-muted-foreground">Kütüphaneye git ve ilk hikayeni okumaya başla!</p>
            <Button className="mt-6" onClick={() => navigate('/dashboard')}>
              <Library className="mr-2 h-4 w-4" /> Kütüphaneye Git
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ReadStoriesPage;