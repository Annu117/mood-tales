import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';
import { getCachedTranslation } from '../utils/translationService';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [translatedContent, setTranslatedContent] = useState({});

  const t = async (key) => {
    // First check if we have a predefined translation
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }

    // If no predefined translation, use real-time translation
    setIsLoading(true);
    try {
      const translatedText = await getCachedTranslation(key, language);
      setTranslatedContent(prev => ({
        ...prev,
        [key]: translatedText
      }));
      setIsLoading(false);
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      setIsLoading(false);
      return key; // Return original text if translation fails
    }
  };

  const changeLanguage = async (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
    // Clear translated content when language changes
    setTranslatedContent({});
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      changeLanguage, 
      t, 
      isLoading,
      translatedContent
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 