import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/customSupabaseClient";
import { useStoryAudioGeneration } from "@/hooks/useStoryAudioGeneration";

import StoryFormHeader from "./StoryFormHeader";
import StoryFormFields from "./StoryFormFields";
import ImageUpload from "./ImageUpload";
import StoryFormActions from "./StoryFormActions";
import { useStoryFormValidation } from "./StoryFormValidation";

const StoryForm = ({
  storyForm,
  setStoryForm,
  editingStory,
  setEditingStory,
  onStoryAdded,
  onStoryUpdated,
}) => {
  const { toast } = useToast();
  const { validateForm } = useStoryFormValidation();
  const [submitting, setSubmitting] = useState(false);
  const { generationState, generateStoryAudio } = useStoryAudioGeneration();

  const handleSubmit = async () => {
    if (!validateForm(storyForm)) {
      return;
    }

    setSubmitting(true);

    try {
      const storyData = {
        title: storyForm.title,
        description: storyForm.description,
        level: storyForm.level,
        category: storyForm.category || "adventure",
        content: storyForm.content, // DO NOT TRIM content to preserve spacing
        read_time: storyForm.read_time,
        image_url: storyForm.image_url || null,
        is_featured: storyForm.is_featured,
        is_for_kids: storyForm.is_for_kids,
      };

      if (editingStory) {
        // Update existing story
        const { data, error } = await supabase
          .from("stories")
          .update({
            ...storyData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingStory.id)
          .select()
          .single();

        if (error) throw error;

        onStoryUpdated(data);
        toast({
          title: "Hikaye Güncellendi",
          description: "Hikaye başarıyla güncellendi.",
        });

        // Regenerate audio only when content actually changed.
        if (storyForm.content !== editingStory.content) {
          const { success, error: audioError, sectionsCount } =
            await generateStoryAudio(editingStory.id, storyForm.content);
          if (success) {
            toast({
              title: "Ses Hazır ✅",
              description: `${sectionsCount} bölüm için ses oluşturuldu.`,
            });
          } else {
            toast({
              title: "Ses Oluşturma Hatası",
              description: audioError,
              variant: "destructive",
            });
          }
        }
      } else {
        // Add new story
        const { data, error } = await supabase
          .from("stories")
          .insert([
            {
              ...storyData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select()
          .single();

        if (error) throw error;

        onStoryAdded(data);
        toast({
          title: "Hikaye Oluşturuldu",
          description: "Hikaye başarıyla oluşturuldu!",
        });

        // Always generate audio for new stories.
        const { success, error: audioError, sectionsCount } =
          await generateStoryAudio(data.id, storyForm.content);
        if (success) {
          toast({
            title: "Ses Hazır ✅",
            description: `${sectionsCount} bölüm için ses oluşturuldu.`,
          });
        } else {
          toast({
            title: "Ses Oluşturma Hatası",
            description: audioError,
            variant: "destructive",
          });
        }
      }

      // Reset form after everything (including audio) completes.
      handleCancel();
    } catch (error) {
      console.error("Error submitting story:", error);
      toast({
        title: "Hata",
        description: `İşlem sırasında bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingStory(null);
    setStoryForm({
      title: "",
      description: "",
      level: "a1",
      category: "adventure",
      content: "",
      read_time: "5 dk",
      image_url: "",
      is_featured: false,
      is_for_kids: false,
    });
  };

  return (
    <Card>
      <StoryFormHeader editingStory={editingStory} />
      <CardContent className='space-y-4'>
        <StoryFormFields storyForm={storyForm} setStoryForm={setStoryForm} />
        <ImageUpload storyForm={storyForm} setStoryForm={setStoryForm} />
        <StoryFormActions
          editingStory={editingStory}
          submitting={submitting}
          uploading={false}
          storyForm={storyForm}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          generationState={generationState}
        />
      </CardContent>
    </Card>
  );
};

export default StoryForm;