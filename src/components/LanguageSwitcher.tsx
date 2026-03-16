"use client";

import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageProvider';
import { locales, languages, type Locale } from '../i18n/config';

export default function LanguageSwitcher() {
  const { locale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (newLocale: Locale) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-white/10 transition-colors text-white"
        title="Change Language"
      >
        <Globe className="w-5 h-5" />
        <span className="hidden lg:block text-sm font-medium uppercase">{locale}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#282828] border border-white/10 rounded-xl shadow-2xl py-2 z-50 transform origin-top-right transition-all">
          <div className="px-4 py-2 border-b border-white/10 mb-2">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Select Language</span>
          </div>
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => handleLanguageChange(l)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                locale === l ? 'bg-white/10 text-white font-bold' : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{languages[l].name}</span>
              {locale === l && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}