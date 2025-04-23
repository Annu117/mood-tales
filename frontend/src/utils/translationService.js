import axios from 'axios';

const GOOGLE_TRANSLATE_API_KEY = process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY;
const GOOGLE_TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

// Language code mapping
const languageCodes = {
  'hi': 'hi',  // Hindi
  'en': 'en',  // English
  'es': 'es',  // Spanish
  'fr': 'fr',  // French
  'de': 'de',  // German
  'ja': 'ja',  // Japanese
  'zh': 'zh',  // Chinese
  // Add more language codes as needed
};

export const translateText = async (text, targetLanguage) => {
  try {
    // First check if we have a predefined translation
    const translations = require('./translations');
    if (translations[targetLanguage] && translations[targetLanguage][text]) {
      return translations[targetLanguage][text];
    }

    // If no predefined translation, use Google Translate API
    const response = await axios.post(
      `${GOOGLE_TRANSLATE_API_URL}?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        q: text,
        target: languageCodes[targetLanguage] || 'en',
      }
    );

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
};

// Caching mechanism to store translations
const translationCache = new Map();

export const getCachedTranslation = async (text, targetLanguage) => {
  const cacheKey = `${text}-${targetLanguage}`;
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  const translatedText = await translateText(text, targetLanguage);
  translationCache.set(cacheKey, translatedText);
  return translatedText;
}; 