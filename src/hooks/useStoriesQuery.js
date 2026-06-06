import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchDashboardStories } from "@/api/stories";
import { storyKeys } from "@/lib/queryKeys";
import { getDailyFreeStories } from "@/utils/dailyStorySelector";
import { useAuth } from "@/contexts/AuthContext";

export const useStoriesQuery = () => {
  const { user, canAccessPremiumFeatures, profile } = useAuth();
  const isKidAccount = profile?.is_kid_account || false;

  const queryKey = storyKeys.dashboard(user?.id);
  const {
    data: allStories = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        if (!user?.id) return [];
        return await fetchDashboardStories(user.id, canAccessPremiumFeatures, false);
      } catch (error) {
        console.error("Failed to fetch stories:", error);
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const processedStories = useMemo(() => {
    if (!allStories || allStories.length === 0) return [];

    const storiesToProcess = isKidAccount
      ? allStories.filter((s) => s.is_for_kids)
      : allStories;

    if (canAccessPremiumFeatures) {
      return storiesToProcess.map((s) => ({
        ...s,
        is_locked: false,
        is_premium_placeholder: false,
      }));
    }

    const sortedStories = [...storiesToProcess].sort((a, b) => a.id - b.id);
    const { unlocked, lockedForPreview, premiumPlaceholderStory } =
      getDailyFreeStories(sortedStories, isKidAccount);

    const unlockedStories = storiesToProcess
      .filter((story) => unlocked.includes(story.id))
      .map((story) => ({
        ...story,
        is_locked: false,
        is_premium_placeholder: false,
      }));

    const previewLockedStories = storiesToProcess
      .filter((story) => lockedForPreview.includes(story.id))
      .map((story) => ({
        ...story,
        is_locked: true,
        is_preview_locked: true,
        is_premium_placeholder: false,
      }));

    const premiumPlaceholder = premiumPlaceholderStory
      ? [
        {
          ...premiumPlaceholderStory,
          id: "premium-placeholder",
          title: "Tüm Hikayelere Erişin",
          description:
            "Premium'a geçerek bu ve diğer tüm hikayelerin kilidini anında açın.",
          is_locked: true,
          is_preview_locked: false,
          is_premium_placeholder: true,
          level: "all",
          image_url:
            "https://images.unsplash.com/photo-1593349328409-72c050a4d7e1?q=80&w=2100",
        },
      ]
      : [];

    return [...unlockedStories, ...previewLockedStories, ...premiumPlaceholder];
  }, [allStories, canAccessPremiumFeatures, isKidAccount]);

  const readStoryDetails = useMemo(
    () => allStories.filter((s) => s.is_read),
    [allStories]
  );
  const savedStories = useMemo(
    () => allStories.filter((s) => s.is_saved),
    [allStories]
  );

  return {
    stories: processedStories,
    loading: isLoading || isFetching,
    readStoryDetails,
    savedStories,
    refetchDashboardData: refetch,
    isKidAccount,
  };
};