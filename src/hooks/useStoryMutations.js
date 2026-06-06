import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { toggleSaveStory, toggleReadStatus } from '@/api/stories';
import { storyKeys } from '@/lib/queryKeys';

export const useToggleSaveStoryMutation = (user, canAccessPremiumFeatures) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ storyId, isCurrentlySaved }) => {
      if (!user) throw new Error('User not authenticated');
      return toggleSaveStory(storyId, user.id, isCurrentlySaved, canAccessPremiumFeatures);
    },
    onMutate: async ({ storyId, isCurrentlySaved, slug }) => {
      await queryClient.cancelQueries({ queryKey: storyKeys.all });

      const dashboardQueryKey = storyKeys.dashboard(user.id);
      const detailQueryKey = storyKeys.detail(slug);

      const previousDashboardData = queryClient.getQueryData(dashboardQueryKey);
      const previousStoryDetail = queryClient.getQueryData(detailQueryKey);

      queryClient.setQueryData(dashboardQueryKey, (oldData) => {
        if (!oldData) return oldData;
        return oldData.map(story => 
          story.id === storyId ? { ...story, is_saved: !isCurrentlySaved } : story
        );
      });
      
      if (previousStoryDetail) {
          queryClient.setQueryData(detailQueryKey, (oldData) => ({
              ...oldData,
              isSaved: !isCurrentlySaved
          }));
      }

      return { previousDashboardData, previousStoryDetail, dashboardQueryKey, detailQueryKey };
    },
    onError: (err, variables, context) => {
      if (context?.previousDashboardData) {
        queryClient.setQueryData(context.dashboardQueryKey, context.previousDashboardData);
      }
      if (context?.previousStoryDetail) {
        queryClient.setQueryData(context.detailQueryKey, context.previousStoryDetail);
      }
      if (err.message.includes("Hikayeyi kaydederken")) {
        toast({
            title: 'Hata',
            description: err.message,
            variant: 'destructive',
        });
      } else {
        toast({
            title: 'Kaydetme Başarısız',
            description: "Hikaye kaydedilirken bir sorun oluştu. Lütfen tekrar deneyin.",
            variant: 'destructive',
        });
      }
    },
    onSuccess: (data, {isCurrentlySaved}) => {
        if(data.requiresPremium) {
            return;
        }

        toast({
            title: !isCurrentlySaved ? 'Kaydedildi!' : 'Kaldırıldı!',
            description: `Hikaye ${!isCurrentlySaved ? 'kitaplığınıza eklendi' : 'kitaplığınızdan çıkarıldı'}.`,
        });
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: storyKeys.dashboard(user.id) });
      queryClient.invalidateQueries({ queryKey: storyKeys.detail(variables.slug) });
    },
  });
};

export const useToggleReadStoryMutation = (user) => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ storyId, isCurrentlyRead }) => {
            if (!user) throw new Error('User not authenticated');
            return toggleReadStatus(storyId, user.id, isCurrentlyRead);
        },
        onMutate: async ({ storyId, isCurrentlyRead, slug }) => {
            await queryClient.cancelQueries({ queryKey: storyKeys.all });

            const dashboardQueryKey = storyKeys.dashboard(user.id);
            const detailQueryKey = storyKeys.detail(slug);

            const previousDashboardData = queryClient.getQueryData(dashboardQueryKey);
            const previousStoryDetail = queryClient.getQueryData(detailQueryKey);

            queryClient.setQueryData(dashboardQueryKey, (oldData) => {
                if (!oldData) return oldData;
                return oldData.map(story =>
                    story.id === storyId ? { ...story, is_read: !isCurrentlyRead } : story
                );
            });
            
            if (previousStoryDetail) {
                queryClient.setQueryData(detailQueryKey, (oldData) => ({
                    ...oldData,
                    isRead: !isCurrentlyRead
                }));
            }

            return { previousDashboardData, previousStoryDetail, dashboardQueryKey, detailQueryKey };
        },
        onError: (err, variables, context) => {
            if (context?.previousDashboardData) {
                queryClient.setQueryData(context.dashboardQueryKey, context.previousDashboardData);
            }
            if (context?.previousStoryDetail) {
                queryClient.setQueryData(context.detailQueryKey, context.previousStoryDetail);
            }
            toast({
                title: 'İşaretleme Başarısız',
                description: 'Okundu durumu güncellenirken bir hata oluştu.',
                variant: 'destructive',
            });
        },
        onSuccess: (data) => {
            toast({
                title: data.read ? 'Okundu İşaretlendi' : 'Okunmadı İşaretlendi',
                description: `Hikaye okuma durumunuz güncellendi.`,
            });
        },
        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: storyKeys.dashboard(user.id) });
            queryClient.invalidateQueries({ queryKey: storyKeys.detail(variables.slug) });
        },
    });
};