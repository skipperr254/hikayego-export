import { useState, useEffect, useCallback, useRef } from "react";
import { Howl } from "howler";

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState([]);
  const [playbackState, setPlaybackState] = useState("stopped");
  const [speechRate, setSpeechRate] = useState(1.0);

  const audioRef = useRef(null);
  const utteranceRef = useRef(null);
  const isMountedRef = useRef(true);
  const currentWordIndexRef = useRef(-1);
  const highlightTimeoutRef = useRef(null);
  const storyContentElementRef = useRef(null);

  const cleanup = useCallback((callback) => {
    if (audioRef.current) {
      audioRef.current.stop();
      audioRef.current.off();
      audioRef.current.unload();
      audioRef.current = null;
    }
    if (
      typeof window.speechSynthesis !== "undefined" &&
      (window.speechSynthesis.speaking || window.speechSynthesis.pending)
    ) {
      window.speechSynthesis.cancel();
    }
    if (utteranceRef.current) {
      utteranceRef.current = null;
    }
    if (highlightTimeoutRef.current) {
      cancelAnimationFrame(highlightTimeoutRef.current);
    }
    currentWordIndexRef.current = -1;
    if (storyContentElementRef.current) {
      storyContentElementRef.current
        .querySelectorAll(".reading-highlight")
        .forEach((el) => el.classList.remove("reading-highlight"));
    }
    if (isMountedRef.current) {
      setPlaybackState("stopped");
    }
    if (callback) callback();
  }, []);

  const setStoryContentElement = useCallback((element) => {
    storyContentElementRef.current = element;
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    const loadVoices = () => {
      if (typeof window.speechSynthesis !== "undefined") {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0 && isMountedRef.current) {
          const englishVoices = availableVoices.filter((v) =>
            v.lang.startsWith("en-"),
          );
          setVoices(englishVoices);
        }
      }
    };
    if (typeof window.speechSynthesis !== "undefined") {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      isMountedRef.current = false;
      cleanup();
      if (typeof window.speechSynthesis !== "undefined") {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [cleanup]);

  const getBestVoice = useCallback(() => {
    const currentVoices =
      voices.length > 0
        ? voices
        : typeof window.speechSynthesis !== "undefined"
          ? window.speechSynthesis
            .getVoices()
            .filter((v) => v.lang.startsWith("en-"))
          : [];
    if (currentVoices.length === 0) return null;
    const voicePreferences = [
      (v) => /Google US English/i.test(v.name),
      (v) => /Samantha/i.test(v.name),
      (v) => /Microsoft Zira Desktop - English \(United States\)/i.test(v.name),
      (v) => v.lang === "en-US" && /neural/i.test(v.name),
      (v) => v.lang === "en-US",
    ];
    for (const preference of voicePreferences) {
      const voice = currentVoices.find(preference);
      if (voice) return voice;
    }
    return currentVoices[0] || null;
  }, [voices]);

  const highlightWord = useCallback((wordTimings) => {
    if (
      !audioRef.current ||
      !audioRef.current.playing() ||
      !storyContentElementRef.current
    )
      return;

    const seek = audioRef.current.seek();
    const timings = wordTimings;

    const adjustedSeek = seek - 0.075;
    const activeWord = timings.find(
      (timing) =>
        adjustedSeek >= timing.startTime && adjustedSeek <= timing.endTime,
    );

    if (activeWord && activeWord.wordIndex !== currentWordIndexRef.current) {
      const words =
        storyContentElementRef.current.querySelectorAll(".word-token");
      if (currentWordIndexRef.current !== -1) {
        const prevWordEl = storyContentElementRef.current.querySelector(
          `[data-word-index='${currentWordIndexRef.current}']`,
        );
        if (prevWordEl) prevWordEl.classList.remove("reading-highlight");
      }

      const currentWordEl = storyContentElementRef.current.querySelector(
        `[data-word-index='${activeWord.wordIndex}']`,
      );

      if (currentWordEl) {
        currentWordEl.classList.add("reading-highlight");
        if (isElementInView(currentWordEl)) {
        } else {
          currentWordEl.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }
      currentWordIndexRef.current = activeWord.wordIndex;
    }

    highlightTimeoutRef.current = requestAnimationFrame(() =>
      highlightWord(wordTimings),
    );
  }, []);

  function isElementInView(el) {
    const rect = el.getBoundingClientRect();
    const parentRect = storyContentElementRef.current.getBoundingClientRect();
    return (
      rect.top >= parentRect.top &&
      rect.left >= parentRect.left &&
      rect.bottom <= parentRect.bottom &&
      rect.right <= parentRect.right
    );
  }

  const handleListen = useCallback(
    (storySection) => {
      if (playbackState === "playing") {
        if (audioRef.current) audioRef.current.pause();
        else if (typeof window.speechSynthesis !== "undefined")
          window.speechSynthesis.pause();
        return;
      }
      if (playbackState === "paused") {
        if (audioRef.current) audioRef.current.play();
        else if (typeof window.speechSynthesis !== "undefined")
          window.speechSynthesis.resume();
        return;
      }

      const startNewPlayback =
        playbackState === "stopped" ||
        storySection.audio_url ||
        !utteranceRef.current;

      if (startNewPlayback) {
        cleanup();
      }

      if (
        storySection.audio_url &&
        storySection.word_timings &&
        Array.isArray(storySection.word_timings)
      ) {
        const correctedTimings = storySection.word_timings
          .filter((t) => /[a-zA-Z]/.test(t.word))
          .sort((a, b) => a.startTime - b.startTime)
          .map((t, i) => ({ ...t, wordIndex: i }));

        audioRef.current = new Howl({
          src: [storySection.audio_url],
          html5: true,
          rate: speechRate,
          onplay: () => {
            setPlaybackState("playing");
            highlightTimeoutRef.current = requestAnimationFrame(() =>
              highlightWord(correctedTimings),
            );
          },
          onpause: () => {
            setPlaybackState("paused");
            if (highlightTimeoutRef.current)
              cancelAnimationFrame(highlightTimeoutRef.current);
          },
          onstop: () => cleanup(),
          onend: () => cleanup(),
          onplayerror: (id, error) => {
            console.error("Audio play error:", error);
            cleanup();
          },
        });
        audioRef.current.play();
      } else {
        const text = storySection.content;
        if (
          !text ||
          typeof window.speechSynthesis === "undefined" ||
          !isMountedRef.current
        )
          return;
        const voice = getBestVoice();
        const newUtterance = new SpeechSynthesisUtterance(text);
        if (voice) {
          newUtterance.voice = voice;
          newUtterance.lang = voice.lang;
        }
        newUtterance.rate = speechRate;
        utteranceRef.current = newUtterance;

        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel();
        }

        newUtterance.onstart = () => {
          if (isMountedRef.current) setPlaybackState("playing");
        };
        newUtterance.onpause = () => {
          if (isMountedRef.current) setPlaybackState("paused");
        };
        newUtterance.onresume = () => {
          if (isMountedRef.current) setPlaybackState("playing");
        };
        newUtterance.onend = () => cleanup();
        newUtterance.onerror = (e) => {
          console.error("Speech synthesis error:", e);
          cleanup();
        };
        newUtterance.onboundary = (event) => {
          if (event.name !== "word" || !storyContentElementRef.current) return;

          const words = Array.from(
            storyContentElementRef.current.querySelectorAll(".word-token"),
          );
          const textUpToBoundary = text.substring(
            0,
            event.charIndex + event.charLength,
          );
          const spokenWords = textUpToBoundary.match(/[a-zA-Z0-9']+/g);
          const wordIndex = spokenWords ? spokenWords.length - 1 : -1;

          if (
            wordIndex > -1 &&
            wordIndex !== currentWordIndexRef.current &&
            wordIndex < words.length
          ) {
            if (currentWordIndexRef.current !== -1) {
              const prevWord = words[currentWordIndexRef.current];
              if (prevWord) prevWord.classList.remove("reading-highlight");
            }
            const currentWordEl = words[wordIndex];
            if (currentWordEl) {
              currentWordEl.classList.add("reading-highlight");
              if (!isElementInView(currentWordEl)) {
                currentWordEl.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                  inline: "nearest",
                });
              }
            }
            currentWordIndexRef.current = wordIndex;
          }
        };
        window.speechSynthesis.speak(newUtterance);
      }
    },
    [playbackState, speechRate, cleanup, getBestVoice, highlightWord],
  );

  const handlePronounce = useCallback(
    (wordToPronounce) => {
      if (!wordToPronounce || typeof window.speechSynthesis === "undefined")
        return;
      cleanup(() => {
        const voice = getBestVoice();
        const utterance = new SpeechSynthesisUtterance(wordToPronounce);
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang || "en-US";
        }
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
      });
    },
    [getBestVoice, cleanup],
  );

  const updateSpeechRate = useCallback(
    (newRate) => {
      setSpeechRate(newRate);
      if (audioRef.current) {
        audioRef.current.rate(newRate);
      }
      if (utteranceRef.current && playbackState !== "stopped") {
        const wasPaused = playbackState === "paused";
        window.speechSynthesis.cancel();
        utteranceRef.current.rate = newRate;
        window.speechSynthesis.speak(utteranceRef.current);
        if (wasPaused) {
          window.speechSynthesis.pause();
        }
      }
    },
    [playbackState],
  );

  return {
    voices,
    isPlaying: playbackState === "playing",
    isPaused: playbackState === "paused",
    playbackState,
    speechRate,
    setSpeechRate: updateSpeechRate,
    handlePronounce,
    handleListen,
    cleanupSpeech: cleanup,
    setStoryContentElement,
  };
};