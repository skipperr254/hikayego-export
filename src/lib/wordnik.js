const API_KEY = 'gngr3yiqulde4tcpjf08s821q8fvovtsqpe4iqrx592hz4c6m';
const BASE_URL = 'https://api.wordnik.com/v4/word.json';

const fetchWordnik = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}&api_key=${API_KEY}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Wordnik API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data && data.length > 0 ? data : null;
  } catch (error) {
    console.error('Error fetching from Wordnik:', error);
    return null;
  }
};

export const getWordDefinitions = async (word) => {
  return fetchWordnik(`${word}/definitions?limit=5&includeRelated=false&useCanonical=false&includeTags=false`);
};

export const getWordExamples = async (word) => {
  return fetchWordnik(`${word}/examples?includeDuplicates=false&useCanonical=false&limit=5`);
};

export const getRelatedWords = async (word) => {
  return fetchWordnik(`${word}/relatedWords?useCanonical=false&relationshipTypes=synonym,antonym&limitPerRelationshipType=10`);
};

export const getWordPronunciation = async (word) => {
  return fetchWordnik(`${word}/pronunciations?useCanonical=false&limit=1`);
};

export const getWordData = async (word) => {
  try {
    const [definitions, examples, relatedWords] = await Promise.all([
      getWordDefinitions(word),
      getWordExamples(word),
      getRelatedWords(word)
    ]);

    const synonyms = relatedWords?.find(r => r.relationshipType === 'synonym')?.words || [];
    const antonyms = relatedWords?.find(r => r.relationshipType === 'antonym')?.words || [];

    return {
      definitions: definitions || [],
      examples: examples?.examples || [],
      synonyms,
      antonyms,
    };
  } catch (error) {
    console.error(`Error getting all data for ${word}:`, error);
    return null;
  }
};