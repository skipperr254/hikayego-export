import { supabase } from '@/lib/customSupabaseClient.js';

export const translateWithDeepL = async (text, targetLang = 'TR') => {
  try {
    if (!text || text.trim().length === 0) {
      console.warn('Empty text provided to translateWithDeepL');
      return null;
    }

    const cleanText = text.trim();
    console.log(`🔄 DeepL translating: "${cleanText}"`);
    
    const { data, error } = await supabase.functions.invoke('translate', {
      body: JSON.stringify({
        text: cleanText,
        target_lang: targetLang
      })
    });

    if (error) {
      console.error('❌ DeepL translation error:', error);
      return null;
    }

    if (data && data.translation) {
      console.log(`✅ DeepL translation success: "${cleanText}" -> "${data.translation}"`);
      return data.translation;
    }

    console.warn('⚠️ DeepL returned no translation data:', data);
    return null;
  } catch (error) {
    console.error('❌ DeepL translation exception:', error);
    return null;
  }
};

export const translateBatch = async (texts, targetLang = 'TR') => {
  try {
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      console.warn('Empty texts array provided to translateBatch');
      return [];
    }

    const cleanTexts = texts.filter(text => text && text.trim().length > 0);
    
    if (cleanTexts.length === 0) {
      console.warn('No valid texts after filtering');
      return [];
    }

    console.log(`🔄 DeepL batch translating ${cleanTexts.length} texts:`, cleanTexts);

    const { data, error } = await supabase.functions.invoke('translate-batch', {
      body: JSON.stringify({
        texts: cleanTexts,
        target_lang: targetLang
      })
    });

    if (error) {
      console.error('❌ DeepL batch translation error:', error);
      return cleanTexts;
    }

    if (data && data.translations) {
      console.log(`✅ DeepL batch translation success: ${cleanTexts.length} -> ${data.translations.length}`);
      return data.translations;
    }

    console.warn('⚠️ DeepL batch returned no translation data:', data);
    return cleanTexts;
  } catch (error) {
    console.error('❌ DeepL batch translation exception:', error);
    return texts;
  }
};

export const detectLanguage = async (text) => {
  try {
    if (!text || text.trim().length === 0) {
      return 'EN';
    }

    const { data, error } = await supabase.functions.invoke('detect-language', {
      body: JSON.stringify({ text: text.trim() })
    });

    if (error) {
      console.error('Language detection error:', error);
      return 'EN';
    }

    return data?.detected_language || 'EN';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'EN';
  }
};