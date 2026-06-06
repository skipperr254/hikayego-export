import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useStoriesQuery } from '@/hooks/useStoriesQuery';
import { useNavigate } from 'react-router-dom';
import StoriesGrid from '@/components/dashboard/StoriesGrid';
import StoriesGridSkeleton from '@/components/dashboard/skeletons/StoriesGridSkeleton';
import Seo from '@/components/Seo';
import { Bookmark, BookCheck, Library as LibraryIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EmptyLibraryState = ({ type, onNavigate }) => {
  const messages = {
    saved: {
      icon: <Bookmark className="mx-auto h-16 w-16 text-muted-foreground/50" />,
      title: "Henüz hiç hikaye kaydetmedin.",
      description: "Beğendiğin hikayeleri kaydederek kendi kitaplığını oluştur.",
    },
    read: {
      icon: <BookCheck className="mx-auto h-16 w-16 text-muted-foreground/50" />,
      title: "Henüz hiç hikaye okumadın.",
      description: "Kütüphaneye git ve ilk hikayeni okumaya başla!",
    }
  };

  const content = messages[type];

  return (
    <div className="text-center py-20">
      {content.icon}
      <h2 className="mt-4 text-2xl font-semibold">{content.title}</h2>
      <p className="mt-2 text-muted-foreground">{content.description}</p>
      <Button className="mt-6" onClick={onNavigate}>
        <LibraryIcon className="mr-2 h-4 w-4" /> Kütüphaneye Git
      </Button>
    </div>
  );
};

const LibraryPage = () => {
  const { user, canAccessPremiumFeatures } = useAuth();
  const navigate = useNavigate();
  const { stories, loading: loadingStories } = useStoriesQuery(user, canAccessPremiumFeatures);
  const [activeTab, setActiveTab] = useState("saved");

  const savedStories = useMemo(() => {
    if (!stories) return [];
    return stories.filter(story => story.is_saved);
  }, [stories]);

  const readStories = useMemo(() => {
    if (!stories) return [];
    return stories.filter(story => story.is_read);
  }, [stories]);

  const loading = loadingStories;

  return (
    <>
      <Seo
        title="Kitaplığım"
        description="Kaydettiğiniz ve okuduğunuz hikayeleri burada bulabilirsiniz."
        url="/library"
      />
      <div className="container mx-auto px-0 sm:px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 px-4 sm:px-0">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <LibraryIcon className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Kitaplığım</h1>
              <p className="text-muted-foreground">Kişisel koleksiyonuna göz at.</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="saved" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
            <TabsTrigger value="saved" className="h-10 text-base">
              <Bookmark className="mr-2 h-5 w-5" /> Kaydedilenler
            </TabsTrigger>
            <TabsTrigger value="read" className="h-10 text-base">
              <BookCheck className="mr-2 h-5 w-5" /> Okunanlar
            </TabsTrigger>
          </TabsList>
          <TabsContent value="saved">
            {loading ? (
              <StoriesGridSkeleton count={savedStories.length > 0 ? savedStories.length : 4} />
            ) : savedStories.length > 0 ? (
              <StoriesGrid stories={savedStories} loading={loading} />
            ) : (
              <EmptyLibraryState type="saved" onNavigate={() => navigate('/dashboard')} />
            )}
          </TabsContent>
          <TabsContent value="read">
            {loading ? (
              <StoriesGridSkeleton count={readStories.length > 0 ? readStories.length : 4} />
            ) : readStories.length > 0 ? (
              <StoriesGrid stories={readStories} loading={loading} />
            ) : (
              <EmptyLibraryState type="read" onNavigate={() => navigate('/dashboard')} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default LibraryPage;