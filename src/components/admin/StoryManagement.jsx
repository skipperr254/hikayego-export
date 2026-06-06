import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useStoryAudioGeneration } from '@/hooks/useStoryAudioGeneration';
import StoryForm from './StoryForm';
import StoryList from './StoryList';

const StoryManagement = ({
  stories,
  storyForm,
  setStoryForm,
  editingStory,
  setEditingStory,
  onStoryAdded,
  onStoryUpdated,
  onEditStory,
  onDeleteStory
}) => {
  const { toast } = useToast();
  const { generationState, generateStoryAudio } = useStoryAudioGeneration();

  const handleGenerateAudio = async (story) => {
    try {
      const { success, error, sectionsCount } = await generateStoryAudio(story.id, story.content);

      if (success) {
        toast({
          title: 'Ses Hazır ✅',
          description: `${sectionsCount} bölüm için ses oluşturuldu.`,
        });

        // Refresh the story's story_sections in parent state so badges update.
        const { data: freshSections } = await supabase
          .from('story_sections')
          .select('id, audio_url')
          .eq('story_id', story.id);

        onStoryUpdated({ ...story, story_sections: freshSections || [] });
      } else {
        toast({
          title: 'Ses Oluşturma Hatası',
          description: error || 'Bilinmeyen hata',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('[StoryManagement] handleGenerateAudio uncaught:', err);
      toast({
        title: 'Ses Oluşturma Hatası',
        description: err?.message || 'Bilinmeyen hata',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <StoryForm
        storyForm={storyForm}
        setStoryForm={setStoryForm}
        editingStory={editingStory}
        setEditingStory={setEditingStory}
        onStoryAdded={onStoryAdded}
        onStoryUpdated={onStoryUpdated}
      />
      
      <StoryList
        stories={stories}
        onEditStory={onEditStory}
        onDeleteStory={onDeleteStory}
        onGenerateAudio={handleGenerateAudio}
        generatingStoryId={generationState.generating ? generationState.storyId : null}
      />
    </div>
  );
};

export default StoryManagement;