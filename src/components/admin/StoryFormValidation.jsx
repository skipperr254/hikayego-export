import { useToast } from '@/components/ui/use-toast';

export const useStoryFormValidation = () => {
  const { toast } = useToast();

  const validateForm = (storyForm) => {
    if (!storyForm.title.trim()) {
      toast({
        title: "Hata",
        description: "Hikaye başlığı gereklidir.",
        variant: "destructive"
      });
      return false;
    }

    if (!storyForm.content.trim()) {
      toast({
        title: "Hata",
        description: "Hikaye içeriği gereklidir.",
        variant: "destructive"
      });
      return false;
    }

    if (storyForm.content.trim().length < 50) {
      toast({
        title: "Hata",
        description: "Hikaye içeriği en az 50 karakter olmalıdır.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  return { validateForm };
};