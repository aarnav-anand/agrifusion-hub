'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      title={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-700/60 text-green-400 text-sm font-medium hover:bg-green-700 hover:text-white transition-all duration-200 select-none"
    >
      {lang === 'en' ? (
        <>
          <span>🇮🇳</span>
          <span className="hidden sm:inline">हिंदी</span>
        </>
      ) : (
        <>
          <span>🇬🇧</span>
          <span className="hidden sm:inline">English</span>
        </>
      )}
    </button>
  );
}
