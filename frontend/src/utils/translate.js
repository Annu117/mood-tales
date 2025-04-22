import { useLanguage } from './LanguageContext';

export const useTranslation = () => {
  const { translateText, currentLanguage } = useLanguage();

  const t = async (text) => {
    if (currentLanguage === 'en') {
      return text;
    }
    return await translateText(text);
  };

  return { t, currentLanguage };
}; 