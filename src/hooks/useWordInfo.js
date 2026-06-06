import { useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/customSupabaseClient";

const cache = new Map();

export const useWordInfo = () => {
  const [wordInfo, setWordInfo] = useState(null);
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);
  const [infoError, setInfoError] = useState(null);
  const currentWordRef = useRef(null);

  const fetchWordInfo = useCallback(async (word) => {
    if (!word || word === currentWordRef.current) {
      if (cache.has(word)) setWordInfo(cache.get(word));
      return;
    }

    currentWordRef.current = word;
    setIsFetchingInfo(true);
    setInfoError(null);
    setWordInfo(null);

    if (cache.has(word)) {
      setWordInfo(cache.get(word));
      setIsFetchingInfo(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("get-word-info", {
        body: { word },
      });

      if (error) {
        throw error;
      }

      if (!data || !data.success || !data.info) {
        throw new Error("No word info found or invalid response structure");
      }

      const wordDetails = data.info; // Use data.info directly without parsing
      if (!wordDetails || !wordDetails.senses || wordDetails.senses.length === 0) {
        throw new Error("No definition found");
      }

      cache.set(word, wordDetails);
      setWordInfo(wordDetails);
    } catch (error) {
      console.error("Error fetching word info:", error);
      setInfoError(error.message);
    } finally {
      setIsFetchingInfo(false);
    }
  }, []);

  const clearWordInfo = useCallback(() => {
    setWordInfo(null);
    setIsFetchingInfo(false);
    setInfoError(null);
    currentWordRef.current = null;
  }, []);

  return { wordInfo, isFetchingInfo, infoError, fetchWordInfo, clearWordInfo };
};