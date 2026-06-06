import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStoriesQuery } from '@/hooks/useStoriesQuery';
import { useNavigate, useLocation } from 'react-router-dom';
import StoriesGrid from '@/components/dashboard/StoriesGrid';
import StoriesGridSkeleton from '@/components/dashboard/skeletons/StoriesGridSkeleton';
import EmptyState from '@/components/dashboard/EmptyState';
import Seo from '@/components/Seo';
import LibraryHeader from '@/components/library/LibraryHeader';
import useLocalStorage from '@/hooks/useLocalStorage';
import WelcomeModal from '@/components/dashboard/WelcomeModal';
import OnboardingSurvey from '@/components/onboarding/OnboardingSurvey';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from "@/components/ui/use-toast";
import { useMediaQuery } from '@/hooks/useMediaQuery';
import StoryCarousel from '@/components/dashboard/StoryCarousel';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Loader2, Smile, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORIES_PER_PAGE = 50;

const LazyStoryCarousel = React.memo(({ title, category, stories }) => {
  const [elementRef, isIntersecting] = useIntersectionObserver({
    rootMargin: '200px',
    triggerOnce: true,
  });

  return (
    <div ref={elementRef} style={{ minHeight: '300px' }}>
      {isIntersecting ? (
        <StoryCarousel title={title} category={category} stories={stories} />
      ) : (
        <div className="space-y-3">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse px-4 sm:px-6" />
          <div className="flex space-x-4 overflow-x-hidden pb-4 px-4 sm:px-6">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="h-full w-40 sm:w-48 flex-shrink-0">
                <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

LazyStoryCarousel.displayName = 'LazyStoryCarousel';

const KidsModeBanner = React.memo(() => {
  const navigate = useNavigate();
  return (
    <div className="bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-800 dark:text-blue-200 p-4 rounded-r-lg mb-6 flex items-center justify-between">
      <div className="flex items-center">
        <Smile className="h-6 w-6 mr-3 text-blue-500" />
        <div>
          <p className="font-bold">Çocuk Modu Aktif</p>
          <p className="text-sm">Sadece çocuklar için uygun hikayeler gösteriliyor.</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={() => navigate('/settings/appearance')}>
        <Settings className="h-4 w-4 mr-2" />
        Değiştir
      </Button>
    </div>
  );
});

KidsModeBanner.displayName = 'KidsModeBanner';

const DashboardPage = () => {
  const { user, profile, updateUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { stories, loading: storiesLoading, refetchDashboardData, isKidAccount } = useStoriesQuery();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showWelcomeModal, setShowWelcomeModal] = useLocalStorage('showWelcomeModal', true);
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  const [filters, setFilters] = useState({
    level: 'all',
    category: 'all',
    readTime: 'all',
    rating: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    if (!authLoading && profile) {
      const hasCompletedOnboarding = profile.preferences?.onboardingComplete === true;
      const hasKidAccountSet = profile.is_kid_account !== null && profile.is_kid_account !== undefined;
      
      if (!hasCompletedOnboarding || !hasKidAccountSet) {
        setShowOnboarding(true);
      }
      
      setCheckingOnboarding(false);
    }
  }, [profile, authLoading]);

  useEffect(() => {
    if (location.state?.from === 'navigation') {
      refetchDashboardData();
    }
  }, [location, refetchDashboardData]);

  const handleCloseWelcomeModal = useCallback(() => {
    setShowWelcomeModal(false);
  }, [setShowWelcomeModal]);

  const handleOnboardingComplete = useCallback(async (answers) => {
    try {
      const preferences = {
        ...(profile?.preferences || {}),
        onboardingComplete: true,
        learningGoal: answers.goal,
        preferredGenre: answers.genre,
        skillLevel: answers.level,
      };
      await updateUser({ preferences: preferences, is_kid_account: answers.is_kid_account });
      setShowOnboarding(false);

      toast({
        title: "Harika!",
        description: "Tercihlerin kaydedildi. Kütüphanen sana özel olarak düzenlendi!",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Tercihleriniz kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  }, [toast, updateUser, profile]);

  const isNewUser = useMemo(() => {
    if (!profile?.created_at) return false;
    const accountAge = Date.now() - new Date(profile.created_at).getTime();
    return accountAge < 5 * 60 * 1000;
  }, [profile?.created_at]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);
  
  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({ level: 'all', category: 'all', readTime: 'all', rating: 'all' });
    setCurrentPage(1);
  }, []);

  const handleRandomStoryClick = useCallback(() => {
    const availableStories = stories.filter(story => !story.is_locked && !story.is_premium_placeholder);
    if (availableStories.length > 0) {
        const randomStory = availableStories[Math.floor(Math.random() * availableStories.length)];
        toast({
            title: "Şanslısın!",
            description: `Rastgele hikaye seçildi: ${randomStory.title}. İyi okumalar!`,
        });
        const destination = isMobile ? `/story/${randomStory.slug}` : `/read/${randomStory.slug}`;
        navigate(destination);
    } else {
        toast({
            title: "Hikaye bulunamadı",
            description: "Şu anda rastgele seçim için uygun bir hikaye bulunmuyor.",
            variant: "destructive",
        });
    }
  }, [stories, navigate, toast, isMobile]);
  
  const filteredStories = useMemo(() => {
    if (!stories) return [];
    const nonPlaceholderStories = stories.filter(s => !s.is_premium_placeholder);
    const placeholderStory = stories.find(s => s.is_premium_placeholder);

    const filtered = nonPlaceholderStories.filter(story => {
      const searchMatch = story.title.toLowerCase().includes(searchTerm.toLowerCase());
      const levelMatch = filters.level === 'all' || story.level === filters.level;
      const categoryMatch = filters.category === 'all' || story.category === filters.category;
      
      const readTimeValue = story.read_time ? parseInt(story.read_time.split(' ')[0]) : 0;
      const readTimeMatch = filters.readTime === 'all' || (
        (filters.readTime === 'short' && readTimeValue >= 10 && readTimeValue <= 15) ||
        (filters.readTime === 'medium' && readTimeValue > 15 && readTimeValue <= 20) ||
        (filters.readTime === 'long' && readTimeValue > 20)
      );

      const ratingValue = story.rating || 0;
      const ratingMatch = filters.rating === 'all' || (
        (filters.rating === '4+' && ratingValue >= 4) ||
        (filters.rating === '3+' && ratingValue >= 3) ||
        (filters.rating === '2+' && ratingValue >= 2) ||
        (filters.rating === '1+' && ratingValue >= 1)
      );
      
      return searchMatch && levelMatch && categoryMatch && readTimeMatch && ratingMatch;
    });

    const userPreferredGenres = profile?.preferences?.preferredGenre || [];
    const userLevel = profile?.preferences?.skillLevel;

    const sorted = filtered.sort((a, b) => {
        const aIsPreferredGenre = userPreferredGenres.includes(a.category);
        const bIsPreferredGenre = userPreferredGenres.includes(b.category);
        if (aIsPreferredGenre && !bIsPreferredGenre) return -1;
        if (!aIsPreferredGenre && bIsPreferredGenre) return 1;

        const aIsPreferredLevel = a.level === userLevel;
        const bIsPreferredLevel = b.level === userLevel;
        if (aIsPreferredLevel && !bIsPreferredLevel) return -1;
        if (!aIsPreferredLevel && bIsPreferredLevel) return 1;

        return b.rating - a.rating;
    });

    if (placeholderStory && searchTerm === '' && filters.category === 'all' && filters.level === 'all') {
      return [...sorted, placeholderStory];
    }
    return sorted;

  }, [stories, searchTerm, filters, profile]);

  const paginatedStories = useMemo(() => {
    const nonPlaceholderStories = filteredStories.filter(s => !s.is_premium_placeholder);
    const placeholderStory = filteredStories.find(s => s.is_premium_placeholder);

    const startIndex = (currentPage - 1) * STORIES_PER_PAGE;
    const paginated = nonPlaceholderStories.slice(startIndex, startIndex + STORIES_PER_PAGE);
    
    if (placeholderStory && paginated.length < STORIES_PER_PAGE && searchTerm === '' && filters.category === 'all' && filters.level === 'all') {
      return [...paginated, placeholderStory];
    }
    return paginated;
  }, [filteredStories, currentPage, searchTerm, filters]);
  
  const totalPages = useMemo(() => Math.ceil(filteredStories.filter(s => !s.is_premium_placeholder).length / STORIES_PER_PAGE), [filteredStories]);

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalPages]);

  const { preferredGenres, newStories, otherGenres } = useMemo(() => {
    if (!isMobile || !stories.length) return { preferredGenres: [], newStories: [], otherGenres: [] };

    const userPreferredGenres = profile?.preferences?.preferredGenre || [];
    const userLevel = profile?.preferences?.skillLevel;
    const allAvailableGenres = [...new Set(stories.map(s => s.category).filter(Boolean))];

    const sortStories = (storyList) => {
      return storyList.sort((a, b) => {
        const aIsPreferredLevel = a.level === userLevel;
        const bIsPreferredLevel = b.level === userLevel;
        if (aIsPreferredLevel && !bIsPreferredLevel) return -1;
        if (!aIsPreferredLevel && bIsPreferredLevel) return 1;
        return b.rating - a.rating;
      });
    };

    const preferred = userPreferredGenres
      .map(genre => ({
        title: `Senin İçin: ${genre.charAt(0).toUpperCase() + genre.slice(1)}`,
        category: genre,
        stories: sortStories(stories.filter(s => s.category === genre))
      }))
      .filter(g => g.stories.length > 0);

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const newStoryList = sortStories(stories.filter(s => new Date(s.created_at) > threeDaysAgo && !s.is_premium_placeholder));

    const other = allAvailableGenres
      .filter(genre => !userPreferredGenres.includes(genre))
      .map(genre => ({
        title: genre.charAt(0).toUpperCase() + genre.slice(1),
        category: genre,
        stories: sortStories(stories.filter(s => s.category === genre))
      }))
      .filter(g => g.stories.length > 0);

    return { 
      preferredGenres: preferred, 
      newStories: newStoryList.length > 0 ? [{ title: 'Yeni', category: 'new', stories: newStoryList }] : [],
      otherGenres: other
    };
  }, [isMobile, stories, profile]);

  const renderPagination = useCallback(() => {
    const pageNumbers = [];
    const maxPagesToShow = 3;
    const pageRange = 1;

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (currentPage > pageRange + 2) {
        pageNumbers.push('...');
      }

      let start = Math.max(2, currentPage - pageRange);
      let end = Math.min(totalPages - 1, currentPage + pageRange);
      
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - pageRange - 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers.map((page, index) => (
      <PaginationItem key={`${page}-${index}`}>
        {typeof page === 'number' ? (
          <PaginationLink 
            href="#" 
            onClick={(e) => { e.preventDefault(); handlePageChange(page); }} 
            isActive={currentPage === page}
          >
            {page}
          </PaginationLink>
        ) : (
          <PaginationEllipsis />
        )}
      </PaginationItem>
    ));
  }, [currentPage, totalPages, handlePageChange]);
  
  if (checkingOnboarding) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingSurvey onComplete={handleOnboardingComplete} />;
  }

  const renderContent = () => {
    if (storiesLoading && stories.length === 0) {
      return <StoriesGridSkeleton count={isMobile ? 4 : 10} isMobile={isMobile} />;
    }

    if (isMobile) {
      if (searchTerm) {
        return paginatedStories.length > 0 ? (
          <StoriesGrid stories={paginatedStories} loading={storiesLoading} />
        ) : (
          <EmptyState onResetFilters={handleResetFilters} isSearch={true} />
        );
      }
      const carousels = [...preferredGenres, ...newStories, ...otherGenres];
      if (carousels.length > 0) {
        return (
          <div className="space-y-8 -mx-4 sm:-mx-6">
             {isKidAccount && <div className="px-4 sm:px-6"><KidsModeBanner /></div>}
            {carousels.map(genre => <LazyStoryCarousel key={genre.title} title={genre.title} category={genre.category} stories={genre.stories} />)}
          </div>
        );
      }
      if (!storiesLoading && carousels.length === 0) {
        return <EmptyState onResetFilters={handleResetFilters} isKidMode={isKidAccount} />;
      }
      return <StoriesGridSkeleton count={4} isMobile={true} />;
    }

    return paginatedStories.length > 0 ? (
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {isKidAccount && <KidsModeBanner />}
        <StoriesGrid stories={paginatedStories} loading={storiesLoading} />
        {totalPages > 1 && (
          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} disabled={currentPage === 1} />
              </PaginationItem>
              {renderPagination()}
              <PaginationItem>
                <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} disabled={currentPage === totalPages} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    ) : (
       <EmptyState onResetFilters={handleResetFilters} isSearch={!!searchTerm || filters.category !== 'all'} isKidMode={isKidAccount} />
    );
  };

  return (
    <>
      <Seo
        title="Kütüphane"
        description="İngilizce hikaye kütüphanemizi keşfedin. Seviyenize ve ilgi alanlarınıza göre hikayeler bulun."
        url="/dashboard"
      />
      <WelcomeModal isOpen={isNewUser && showWelcomeModal} onClose={handleCloseWelcomeModal} />
      <div className="w-full">
        <LibraryHeader 
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          filters={filters}
          onResetFilters={handleResetFilters}
          currentSearchTerm={searchTerm}
          onRandomStoryClick={handleRandomStoryClick}
          stories={stories}
          isKidMode={isKidAccount}
        />
        
        {renderContent()}
      </div>
    </>
  );
};

export default DashboardPage;