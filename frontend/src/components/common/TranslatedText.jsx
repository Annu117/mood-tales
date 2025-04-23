import React from 'react';
import { useLanguage } from '../../utils/LanguageContext';

const TranslatedText = ({ text }) => {
  const { t } = useLanguage();
  return <>{t(text)}</>;
};

export default TranslatedText; 