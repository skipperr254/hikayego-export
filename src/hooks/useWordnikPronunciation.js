import { useState, useCallback } from "react";
import { supabase } from "@/lib/customSupabaseClient";

const SUPABASE_FUNCTION_URL =
  "https://vjxkmufoztgzrnwaxswo.supabase.co/functions/v1/get-pronunciation";

const pronunciationCache = new Map();

const speakWithWebSpeech = (word) => {
  if (typeof window.speechSynthesis === "undefined") return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => /Google US English/i.test(v.name)) ||
    voices.find((v) => /Samantha/i.test(v.name)) ||
    voices.find((v) => v.lang === "en-US") ||
    voices[0];
  if (preferred) {
    utterance.voice = preferred;
    utterance.lang = preferred.lang;
  }
  utterance.rate = 0.8;
  window.speechSynthesis.speak(utterance);
};

export const useWordnikPronunciation = () => {
  const [isPronouncing, setIsPronouncing] = useState(false);
  const [pronunciationError, setPronunciationError] = useState(null);

  const getPronunciationAudio = useCallback(async (word) => {
    if (pronunciationCache.has(word)) {
      return pronunciationCache.get(word);
    }

    setIsPronouncing(true);
    setPronunciationError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Authentication session not found.");

      const response = await fetch(SUPABASE_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ word }),
      });

      const data = await response.json();

      if (data && data.success && data.audio_file_url) {
        pronunciationCache.set(word, data.audio_file_url);
        return data.audio_file_url;
      } else {
        setPronunciationError(data.message || "Failed to get pronunciation.");
        return null;
      }
    } catch (error) {
      console.error(
        "Error fetching pronunciation from Supabase function:",
        error
      );
      setPronunciationError("Failed to fetch pronunciation.");
      return null;
    } finally {
      setIsPronouncing(false);
    }
  }, []);

  const playPronunciation = useCallback(
    async (word) => {
      const audioUrl = await getPronunciationAudio(word);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play().catch((e) => {
          console.error("Audio playback failed, falling back to Web Speech:", e);
          speakWithWebSpeech(word);
        });
      } else {
        // Lemonfox failed or returned no URL — fall back to Web Speech API
        speakWithWebSpeech(word);
      }
    },
    [getPronunciationAudio]
  );

  return { playPronunciation, isPronouncing, pronunciationError };
};