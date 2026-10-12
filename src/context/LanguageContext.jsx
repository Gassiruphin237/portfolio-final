import { useState } from 'react';
import { LanguageContext } from './languageStore';

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const browserLanguage = window.navigator.language;

    return browserLanguage?.toLowerCase().startsWith('en') ? 'en' : 'fr';
  });

  const toggleLanguage = () => {
    setLang((current) => (current === 'fr' ? 'en' : 'fr'));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
