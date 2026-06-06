import { basicWords } from './basicWords.js';
import { storyWords } from './storyWords.js';
import { phrasalVerbs } from './phrasalVerbs.js';
import { animalWords } from './animalWords.js';
import { characterWords } from './characterWords.js';
import { commonWords } from './commonWords.js';
import { advancedWords } from './advancedWords.js';
import { modernWords } from './modernWords.js';
import { translateWithDeepL, translateBatch } from '@/lib/deepl.js';
import { supabase } from '@/lib/customSupabaseClient.js';
import { detectPartOfSpeech, getPartOfSpeechLabel } from './partOfSpeechDetector.js';
import { generateSmartExample } from './exampleGenerator.js';

export const dictionary = {
  ...phrasalVerbs,      
  ...advancedWords,     
  ...modernWords,       
  ...commonWords,       
  ...basicWords,        
  ...storyWords,        
  ...animalWords,       
  ...characterWords     
};

export {
  basicWords,
  storyWords,
  phrasalVerbs,
  animalWords,
  characterWords,
  commonWords,
  advancedWords,
  modernWords
};

const translationCache = new Map();

export const getTranslation = async (word) => {
  if (!word) return null;
  
  const cleanWord = word.toLowerCase().trim();
  
  if (translationCache.has(cleanWord)) {
    return translationCache.get(cleanWord);
  }
  
  try {
    const { data: cachedTranslation, error } = await supabase
      .from('word_translations')
      .select('translation, source')
      .eq('word', cleanWord)
      .maybeSingle();

    if (!error && cachedTranslation) {
      const detectedPartOfSpeech = detectPartOfSpeech(cleanWord, cachedTranslation.translation);
      const example = generateSmartExample(cleanWord, cachedTranslation.translation, detectedPartOfSpeech);
      const result = {
        translation: cachedTranslation.translation,
        type: getPartOfSpeechLabel(detectedPartOfSpeech),
        partOfSpeech: detectedPartOfSpeech,
        example: example.en,
        example_tr: example.tr,
        source: cachedTranslation.source
      };
      translationCache.set(cleanWord, result);
      return result;
    }
  } catch (error) {
    console.warn('Cache lookup failed:', error);
  }
  
  let result = dictionary[cleanWord];
  if (result) {
    if (!result.partOfSpeech || result.partOfSpeech === 'unknown') {
      result.partOfSpeech = detectPartOfSpeech(cleanWord, result.translation);
    }
    
    result.type = getPartOfSpeechLabel(result.partOfSpeech);
    
    if (!result.example || result.example.includes('is very important')) {
      const example = generateSmartExample(cleanWord, result.translation, result.partOfSpeech);
      result = {
        ...result,
        example: example.en,
        example_tr: example.tr
      };
    }
    
    translationCache.set(cleanWord, result);
    return result;
  }
  
  const noPunctuation = cleanWord.replace(/[.,!?;:"()[\]{}]/g, '');
  result = dictionary[noPunctuation];
  if (result) {
    if (!result.partOfSpeech || result.partOfSpeech === 'unknown') {
      result.partOfSpeech = detectPartOfSpeech(noPunctuation, result.translation);
    }
    
    result.type = getPartOfSpeechLabel(result.partOfSpeech);
    
    if (!result.example || result.example.includes('is very important')) {
      const example = generateSmartExample(noPunctuation, result.translation, result.partOfSpeech);
      result = {
        ...result,
        example: example.en,
        example_tr: example.tr
      };
    }
    
    translationCache.set(cleanWord, result);
    return result;
  }
  
  const words = cleanWord.split(' ');
  if (words.length > 1) {
    const wordTranslations = [];
    let allFound = true;
    
    for (const singleWord of words) {
      if (dictionary[singleWord]) {
        wordTranslations.push(dictionary[singleWord].translation);
      } else {
        allFound = false;
        break;
      }
    }
    
    if (allFound && wordTranslations.length > 0) {
      const combinedTranslation = wordTranslations.join(' ');
      const example = generateSmartExample(cleanWord, combinedTranslation, 'compound phrase');
      const compoundResult = {
        translation: combinedTranslation,
        type: 'Birleşik İfade',
        partOfSpeech: 'compound phrase',
        example: example.en,
        example_tr: example.tr
      };
      translationCache.set(cleanWord, compoundResult);
      return compoundResult;
    }
  }
  
  try {
    const deeplTranslation = await translateWithDeepL(cleanWord);
    
    if (deeplTranslation && deeplTranslation !== cleanWord && deeplTranslation.toLowerCase() !== cleanWord.toLowerCase()) {
      const cleanTranslation = deeplTranslation
        .replace(/^.*in context:\s*/i, '')
        .replace(/^.*bağlamında:\s*/i, '')
        .replace(/^.*context:\s*/i, '')
        .replace(/^.*örnek cümlede:\s*/i, '')
        .trim();
      
      const detectedPartOfSpeech = detectPartOfSpeech(cleanWord, cleanTranslation);
      const example = generateSmartExample(cleanWord, cleanTranslation, detectedPartOfSpeech);
      const deeplResult = {
        translation: cleanTranslation,
        type: getPartOfSpeechLabel(detectedPartOfSpeech),
        partOfSpeech: detectedPartOfSpeech,
        example: example.en,
        example_tr: example.tr,
        source: 'deepl'
      };
      
      translationCache.set(cleanWord, deeplResult);
      
      try {
        await supabase
          .from('word_translations')
          .upsert({
            word: cleanWord,
            translation: cleanTranslation,
            source: 'deepl',
            created_at: new Date().toISOString()
          }, {
            onConflict: 'word'
          });
      } catch (dbError) {
        console.warn('Failed to cache translation in database:', dbError);
      }
      
      return deeplResult;
    }
  } catch (error) {
    console.warn('DeepL translation failed, falling back to pattern matching:', error);
  }
  
  const patternResult = createSmartTranslation(cleanWord);
  translationCache.set(cleanWord, patternResult);
  return patternResult;
};

const createSmartTranslation = (word) => {
  const detectedPartOfSpeech = detectPartOfSpeech(word);
  
  const patterns = [
    { pattern: /ing$/, translation: word.replace(/ing$/, 'ma/me'), partOfSpeech: 'gerund' },
    { pattern: /ed$/, translation: word.replace(/ed$/, 'dı/di'), partOfSpeech: 'past participle' },
    { pattern: /s$/, translation: word.replace(/s$/, ''), partOfSpeech: 'verb' },
    { pattern: /ly$/, translation: word.replace(/ly$/, 'ca/ce'), partOfSpeech: 'adverb' },
    { pattern: /tion$/, translation: word.replace(/tion$/, 'syon'), partOfSpeech: 'noun' },
    { pattern: /sion$/, translation: word.replace(/sion$/, 'syon'), partOfSpeech: 'noun' },
    { pattern: /ness$/, translation: word.replace(/ness$/, 'lık'), partOfSpeech: 'noun' },
    { pattern: /ment$/, translation: word.replace(/ment$/, 'ment'), partOfSpeech: 'noun' },
    { pattern: /ity$/, translation: word.replace(/ity$/, 'ite'), partOfSpeech: 'noun' },
    { pattern: /er$/, translation: word.replace(/er$/, 'ci'), partOfSpeech: 'noun' },
    { pattern: /or$/, translation: word.replace(/or$/, 'ör'), partOfSpeech: 'noun' },
    { pattern: /ful$/, translation: word.replace(/ful$/, 'lu'), partOfSpeech: 'adjective' },
    { pattern: /less$/, translation: word.replace(/less$/, 'sız'), partOfSpeech: 'adjective' },
    { pattern: /able$/, translation: word.replace(/able$/, 'ebilir'), partOfSpeech: 'adjective' },
    { pattern: /ible$/, translation: word.replace(/ible$/, 'ebilir'), partOfSpeech: 'adjective' },
    { pattern: /ous$/, translation: word.replace(/ous$/, 'lu'), partOfSpeech: 'adjective' },
    { pattern: /ive$/, translation: word.replace(/ive$/, 'ici'), partOfSpeech: 'adjective' },
    { pattern: /al$/, translation: word.replace(/al$/, 'al'), partOfSpeech: 'adjective' },
    { pattern: /ic$/, translation: word.replace(/ic$/, 'ik'), partOfSpeech: 'adjective' },
    { pattern: /er$/, translation: word.replace(/er$/, 'daha'), partOfSpeech: 'comparative adjective' },
    { pattern: /est$/, translation: word.replace(/est$/, 'en'), partOfSpeech: 'superlative adjective' }
  ];

  for (const { pattern, translation, partOfSpeech } of patterns) {
    if (pattern.test(word)) {
      const finalPartOfSpeech = partOfSpeech || detectedPartOfSpeech;
      const example = generateSmartExample(word, translation, finalPartOfSpeech);
      return {
        translation: translation,
        type: getPartOfSpeechLabel(finalPartOfSpeech),
        partOfSpeech: finalPartOfSpeech,
        example: example.en,
        example_tr: example.tr,
        source: 'pattern'
      };
    }
  }

  const basicTranslation = word.replace(/[aeiou]/g, match => {
    const vowelMap = { 'a': 'a', 'e': 'e', 'i': 'i', 'o': 'o', 'u': 'u' };
    return vowelMap[match] || match;
  });

  const example = generateSmartExample(word, basicTranslation, detectedPartOfSpeech);
  return {
    translation: basicTranslation,
    type: getPartOfSpeechLabel(detectedPartOfSpeech),
    partOfSpeech: detectedPartOfSpeech,
    example: example.en,
    example_tr: example.tr,
    source: 'fallback'
  };
};

export const getWordFrequency = (word) => {
  const cleanWord = word.toLowerCase().trim();
  
  const highFrequency = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'over', 'after', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'our', 'their', 'this', 'that', 'these', 'those', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'any', 'some', 'many', 'much', 'more', 'most', 'other', 'such', 'no', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'now', 'here', 'there', 'then', 'well', 'also', 'back', 'still', 'way', 'even', 'new', 'old', 'see', 'know', 'get', 'give', 'take', 'come', 'go', 'make', 'think', 'say', 'tell', 'ask', 'work', 'seem', 'feel', 'try', 'leave', 'call'];
  
  if (highFrequency.includes(cleanWord)) return 'high';
  
  if (dictionary[cleanWord]) return 'medium';
  
  return 'low';
};

export const getContextualTranslation = async (word, context = '') => {
  const baseTranslation = await getTranslation(word);
  if (!baseTranslation) return null;
  
  const contextLower = context.toLowerCase();
  
  if (contextLower.includes('computer') || contextLower.includes('software') || contextLower.includes('program')) {
    if (modernWords[word.toLowerCase()]) {
      return modernWords[word.toLowerCase()];
    }
  }
  
  if (contextLower.includes('story') || contextLower.includes('tale') || contextLower.includes('once upon')) {
    if (storyWords[word.toLowerCase()] || characterWords[word.toLowerCase()]) {
      return storyWords[word.toLowerCase()] || characterWords[word.toLowerCase()];
    }
  }
  
  return baseTranslation;
};

export const preloadTranslations = async (words) => {
  const uncachedWords = words.filter(word => !translationCache.has(word.toLowerCase()));
  
  if (uncachedWords.length === 0) return;
  
  try {
    const { data: cachedTranslations } = await supabase
      .from('word_translations')
      .select('word, translation, source')
      .in('word', uncachedWords.map(w => w.toLowerCase()));
    
    if (cachedTranslations) {
      cachedTranslations.forEach(({ word, translation, source }) => {
        const detectedPartOfSpeech = detectPartOfSpeech(word, translation);
        const example = generateSmartExample(word, translation, detectedPartOfSpeech);
        translationCache.set(word, {
          translation,
          type: getPartOfSpeechLabel(detectedPartOfSpeech),
          partOfSpeech: detectedPartOfSpeech,
          example: example.en,
          example_tr: example.tr,
          source
        });
      });
    }
    
    const stillUncached = uncachedWords.filter(word => !translationCache.has(word.toLowerCase()));
    
    if (stillUncached.length > 0 && stillUncached.length <= 50) {
      try {
        const translations = await translateBatch(stillUncached);
        
        if (translations && translations.length === stillUncached.length) {
          stillUncached.forEach((word, index) => {
            const translation = translations[index];
            if (translation && translation !== word && translation.toLowerCase() !== word.toLowerCase()) {
              const cleanTranslation = translation
                .replace(/^.*in context:\s*/i, '')
                .replace(/^.*bağlamında:\s*/i, '')
                .replace(/^.*context:\s*/i, '')
                .replace(/^.*örnek cümlede:\s*/i, '')
                .trim();
              
              const detectedPartOfSpeech = detectPartOfSpeech(word, cleanTranslation);
              const example = generateSmartExample(word, cleanTranslation, detectedPartOfSpeech);
              const result = {
                translation: cleanTranslation,
                type: getPartOfSpeechLabel(detectedPartOfSpeech),
                partOfSpeech: detectedPartOfSpeech,
                example: example.en,
                example_tr: example.tr,
                source: 'deepl'
              };
              translationCache.set(word.toLowerCase(), result);
              
              supabase
                .from('word_translations')
                .upsert({
                  word: word.toLowerCase(),
                  translation: cleanTranslation,
                  source: 'deepl',
                  created_at: new Date().toISOString()
                }, {
                  onConflict: 'word'
                })
                .catch(err => console.warn('Failed to cache batch translation:', err));
            }
          });
        }
      } catch (error) {
        console.warn('Batch translation preload failed:', error);
      }
    }
  } catch (error) {
    console.warn('Translation preload failed:', error);
  }
};