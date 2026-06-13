import React, { createContext, useContext, useState } from 'react';
import { translations, Lang } from '@/translations';

interface LanguageContextValue {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const stored = localStorage.getItem('hommentor_lang');
    return stored === 'hi' ? 'hi' : 'en';
  });

  const toggleLang = () => {
    setLang(prev => {
      const next: Lang = prev === 'en' ? 'hi' : 'en';
      localStorage.setItem('hommentor_lang', next);
      return next;
    });
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations[lang];
    for (const k of keys) result = result?.[k];
    if (typeof result === 'string') return result;
    let fallback: any = translations['en'];
    for (const k of keys) fallback = fallback?.[k];
    return typeof fallback === 'string' ? fallback : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};
