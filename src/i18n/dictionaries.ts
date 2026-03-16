import 'server-only';
import type { Locale, Dictionary } from './config';

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('./locales/en.json').then((m) => m.default as Dictionary),
  ar: () => import('./locales/ar.json').then((m) => m.default as Dictionary),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (!dictionaries[locale]) throw new Error(`No dictionary for locale: ${locale}`);
  return dictionaries[locale]();
}