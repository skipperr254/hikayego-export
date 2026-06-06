import {
  useState,
  useCallback
} from 'react';
import { getWordData } from '@/lib/wordnik';
import { getTranslation } from '@/lib/dictionary';

export const useWordSelection = () => {
  const [selectedWord, setSelectedWord] = useState(null);
  const [translationInfo, setTranslationInfo] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const findLongestPhrase = useCallback(async (clickedElement, storyContentRef) => {
    const clickedWord = clickedElement.getAttribute('data-word');
    const clickedIndex = parseInt(clickedElement.getAttribute('data-index'));

    if (!clickedWord || isNaN(clickedIndex)) {
      return {
        phrase: clickedWord || '',
        elements: [clickedElement]
      };
    }

    return {
      phrase: clickedWord,
      elements: [clickedElement]
    };
  }, []);

  const handleWordClick = useCallback(async (e, storyContentRef) => {
    const clickedElement = e.target;

    if (!clickedElement.classList.contains('word-token')) {
      return;
    }

    const previouslySelected = storyContentRef.current.querySelectorAll('.selected-word');
    previouslySelected.forEach(el => el.classList.remove('selected-word'));

    const result = await findLongestPhrase(clickedElement, storyContentRef);

    result.elements.forEach(element => {
      element.classList.add('selected-word');
    });

    const wordToFetch = result.phrase.toLowerCase().trim();
    setSelectedWord(wordToFetch);
    setIsTranslating(true);
    setTranslationInfo(null);

    try {
      const translationData = await getTranslation(wordToFetch);
      const wordnikData = await getWordData(wordToFetch);

      if (translationData || wordnikData) {
        setTranslationInfo({
          word: wordToFetch,
          translation: translationData?.translation || 'Çeviri bulunamadı',
          ...translationData,
          ...wordnikData,
        });
      } else {
        setTranslationInfo({
          word: wordToFetch,
          translation: 'Veri bulunamadı.',
          definitions: [],
          examples: [],
          synonyms: [],
          antonyms: [],
          error: true
        });
      }
    } catch (error) {
      console.error('Word data fetching error:', error);
      setTranslationInfo({
        word: wordToFetch,
        translation: 'Bir hata oluştu.',
        definitions: [],
        examples: [],
        synonyms: [],
        antonyms: [],
        error: true
      });
    }

    setIsTranslating(false);
  }, [findLongestPhrase]);

  return {
    selectedWord,
    translationInfo,
    isTranslating,
    handleWordClick
  };
};