import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useStoryData } from '@/hooks/useStoryData';
import { Loader2 } from 'lucide-react';
import Seo from '@/components/Seo';
import StoryReader from '@/components/story/StoryReader';

const StoryPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { story, storySections, isSaved, isRead, loading, toggleSaveStory, toggleReadStatus, progress } = useStoryData(slug, user, navigate);

  const [initialPage, setInitialPage] = useState(0);
  const [initialHighlight, setInitialHighlight] = useState(null);

  useEffect(() => {
    if (!loading && story && progress && initialHighlight === null) {
      const { page_number, word_index, show_highlight } = progress;
      if (show_highlight && page_number >= 0) {
        setInitialPage(page_number);
        setInitialHighlight(word_index);
      } else if (page_number >= 0) {
        setInitialPage(page_number);
      }
    }
  }, [loading, story, progress, initialHighlight]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Hikaye yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!loading && !story) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="text-center"><p className="text-muted-foreground">Hikaye bulunamadı veya içeriği boş.</p></div>
      </div>
    );
  }

  if (!story) {
    return null; 
  }

  return (
    <>
      <Seo
        title={story.title}
        description={story.description}
        image={story.image_url}
        url={`/read/${story.slug}`}
        type="article"
        keywords={`${story.level} İngilizce hikaye, ${story.title}, İngilizce okuma parçası`}
        schema={{
          "@type": "Book",
          "name": story.title,
          "author": {
            "@type": "Organization",
            "name": "HikayeGO"
          },
          "inLanguage": "en",
          "description": story.description,
          "image": story.image_url,
          "bookFormat": "https://schema.org/EBook",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": story.rating || "4.5",
            "bestRating": "5",
            "ratingCount": story.rating_count || "100"
          }
        }}
      />
      <StoryReader
        story={story}
        storySections={storySections}
        isSaved={isSaved}
        isRead={isRead}
        onToggleSave={toggleSaveStory}
        onToggleRead={toggleReadStatus}
        initialPage={initialPage}
        initialHighlight={initialHighlight}
      />
    </>
  );
};

export default StoryPage;