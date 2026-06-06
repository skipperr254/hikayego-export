import { basicGrammarRules } from './basicGrammar.js';
import { pronounsAndAdjectives } from './pronounsAndAdjectives.js';
import { verbsAndAdverbs } from './verbsAndAdverbs.js';

// Combine all grammar rules
export const grammarRules = {
  ...basicGrammarRules,
  ...pronounsAndAdjectives,
  ...verbsAndAdverbs
};

export const getGrammarTip = (word, userSubscription = false) => {
  const rule = grammarRules[word.toLowerCase()];
  
  if (!rule) {
    return null;
  }

  // Enhanced tip for all users with natural explanations
  const enhancedTip = {
    type: rule.type,
    explanation: rule.explanation,
    isPremium: false
  };

  return enhancedTip;
};