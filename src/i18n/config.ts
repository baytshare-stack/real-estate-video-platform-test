// src/i18n/config.ts

export type Locale = 'en' | 'ar';
export const locales: Locale[] = ['en', 'ar'];
export const defaultLocale: Locale = 'en';
export const languages: Record<Locale, { name: string; dir: 'ltr' | 'rtl' }> = {
  en: { name: 'English', dir: 'ltr' },
  ar: { name: 'العربية', dir: 'rtl' },
};

// تعريف type للقاموس المستخدم في الترجمة
export type Dictionary = {
  [namespace: string]: {
    [key: string]: string | Record<string, any>;
  };
};