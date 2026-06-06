import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Volume2 } from 'lucide-react';

const StoryFormActions = ({
  editingStory,
  submitting,
  uploading,
  storyForm,
  onSubmit,
  onCancel,
  generationState,
}) => {
  const isGenerating = generationState?.generating;
  const isDisabled = submitting || uploading || isGenerating || !storyForm.title.trim() || !storyForm.content.trim();

  return (
    <div className="flex flex-col gap-3 pt-4">
      {isGenerating && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Volume2 className="h-4 w-4 text-primary" />
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Ses oluşturuluyor...</span>
        </div>
      )}
      {generationState?.error && !isGenerating && (
        <p className="text-sm text-destructive">{generationState.error}</p>
      )}
      <div className="flex gap-3">
        <Button
          onClick={onSubmit}
          disabled={isDisabled}
          className="flex-1"
        >
          {submitting && !isGenerating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          {editingStory ? 'Hikayeyi Güncelle' : 'Hikaye Ekle'}
        </Button>

        {editingStory && (
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={submitting || isGenerating}
            className="flex-1"
          >
            İptal Et
          </Button>
        )}
      </div>
    </div>
  );
};

export default StoryFormActions;