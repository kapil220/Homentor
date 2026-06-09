import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      aria-label="Switch language"
      className="fixed bottom-6 right-6 z-50 flex items-center rounded-full border border-slate-200 bg-white shadow-lg overflow-hidden text-sm font-semibold hover:shadow-xl transition-shadow"
    >
      <span
        className={`px-3 py-2 transition-colors ${
          lang === 'en' ? 'bg-homentor-blue text-white' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        EN
      </span>
      <span
        className={`px-3 py-2 transition-colors ${
          lang === 'hi' ? 'bg-homentor-blue text-white' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        हिं
      </span>
    </button>
  );
};

export default LanguageToggle;
