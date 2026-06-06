import { useState } from "react";
import { supabase } from "@/lib/customSupabaseClient";

/**
 * Hook that manages the full audio generation pipeline for a story by invoking
 * the `story-audio-pipeline` Supabase edge function, which handles:
 *   - Splitting content into sections (<=1500 chars, paragraph-aware)
 *   - Deleting / inserting story_sections (service role, bypasses RLS)
 *   - Calling Lemonfox TTS for each section
 *   - Uploading audio to GCS and updating the DB
 *
 * Returns:
 *   generateStoryAudio(storyId, content) -> { success, sectionsCount?, error? }
 *   generationState: { generating, storyId, error }
 */
export const useStoryAudioGeneration = () => {
  const [generationState, setGenerationState] = useState({
    generating: false,
    storyId: null,
    error: null,
  });

  const generateStoryAudio = async (storyId, content) => {
    setGenerationState({ generating: true, storyId, error: null });

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "story-audio-pipeline",
        { body: { storyId, content } },
      );

      if (fnError) {
        throw new Error(`Fonksiyon cagrisi basarisiz: ${fnError.message}`);
      }

      if (!data || !data.success) {
        throw new Error(data?.error || "Ses olusturma basarisiz");
      }

      setGenerationState({ generating: false, storyId: null, error: null });
      return { success: true, sectionsCount: data.sectionsCount };
    } catch (error) {
      const message = error?.message || "Ses olusturma basarisiz";
      console.error("[useStoryAudioGeneration] error:", message);
      setGenerationState({ generating: false, storyId: null, error: message });
      return { success: false, error: message };
    }
  };

  return { generationState, generateStoryAudio };
};