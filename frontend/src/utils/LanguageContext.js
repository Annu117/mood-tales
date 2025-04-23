import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const languages = {
  en: 'English',
  hi: 'हिंदी',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
  zh: '中文'
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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


// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { translations } from './translations';

// const LanguageContext = createContext();

// export const languages = {
//   en: 'English',
//   hi: 'हिंदी',
//   es: 'Español',
//   fr: 'Français',
//   de: 'Deutsch',
//   ja: '日本語',
//   zh: '中文'
// };

// export const LanguageProvider = ({ children }) => {
//   const [language, setLanguage] = useState('en');

//   const t = (key) => {
//     return translations[language]?.[key] || key;
//   };
//   const changeLanguage = (lang) => {
//     if (translations[lang]) {
//       setLanguage(lang);
//       // Optionally store preference
//       localStorage.setItem('preferredLanguage', lang);
//     }
//   };
//   // Load preferred language on mount
//   useEffect(() => {
//     const storedLang = localStorage.getItem('preferredLanguage');
//     if (storedLang && translations[storedLang]) {
//       setLanguage(storedLang);
//     } else {
//       // Fallback to browser language or default
//       const browserLang = navigator.language.split('-')[0];
//       if (translations[browserLang]) {
//         setLanguage(browserLang);
//       }
//     }
//   }, []);

//   return (
//     <LanguageContext.Provider value={{ language, setLanguage, t }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };

// export const useLanguage = () => {
//   const context = useContext(LanguageContext);
//   if (!context) {
//     throw new Error('useLanguage must be used within a LanguageProvider');
//   }
//   return context;
// }; 