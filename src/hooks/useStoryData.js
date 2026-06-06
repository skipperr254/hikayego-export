import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { fetchStoryBySlug } from '@/api/stories';
import { storyKeys } from '@/lib/queryKeys';
import { useToast } from '@/components/ui/use-toast';
import { useToggleSaveStoryMutation, useToggleReadStoryMutation } from './useStoryMutations';

export const useStoryData = (slug, navigate) => {
  const { user, canAccessPremiumFeatures } = useAuth();
  const { toast } = useToast();
  
  const queryKey = storyKeys.detail(slug);
  
  const { data, isLoading: loading, isError } = useQuery({
    queryKey,
    queryFn: () => fetchStoryBySlug(slug, user?.id),
    enabled: !!slug && !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { mutate: toggleSave } = useToggleSaveStoryMutation(user, canAccessPremiumFeatures);
  const { mutate: toggleRead } = useToggleReadStoryMutation(user);

  if (isError) {
    toast({
      title: 'Hata',
      description: 'Hikaye yüklenirken bir sorun oluştu.',
      variant: 'destructive',
    });
    if (navigate) navigate('/dashboard');
  }

  const handleToggleSave = (premiumModalTrigger) => {
    if (!data?.story) return;

    if (!canAccessPremiumFeatures && !data.isSaved) {
        premiumModalTrigger(
            "Hikayeleri Kaydet",
            "Premium'a geçerek hikayeleri kaydedebilir ve dilediğin zaman kaldığın yerden devam edebilirsin."
        );
        return;
    }
    toggleSave({ storyId: data.story.id, isCurrentlySaved: data.isSaved, slug });
  };
  
  const handleToggleRead = () => {
    if (!data?.story) return;
    toggleRead({ storyId: data.story.id, isCurrentlyRead: data.isRead, slug });
  };

  return {
    story: data?.story,
    storySections: data?.storySections,
    isSaved: data?.isSaved,
    isRead: data?.isRead,
    progress: data?.progress,
    loading,
    toggleSaveStory: handleToggleSave,
    toggleReadStatus: handleToggleRead,
  };
};