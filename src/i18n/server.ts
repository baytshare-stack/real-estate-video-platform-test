"use server"; // بدل "server-only" يمكن أن يعمل مع Next.js 13+

import { cookies } from "next/headers";
import { defaultLocale, type Locale, locales } from "../i18n/config";
import { getDictionary } from "../i18n/dictionaries";

export async function getServerTranslation() {
  // قراءة لغة المستخدم من الكوكيز
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value as Locale;

  // التحقق من أن اللغة مدعومة وإلا استخدام اللغة الافتراضية
  const locale = cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale;
  const dict = await getDictionary(locale);

  // دالة لترجمة النصوص
  const t = (namespace: keyof typeof dict, key: string): string => {
    try {
      const section = dict[namespace] as Record<string, string>;
      if (section && key in section) {
        return section[key];
      }
      return key; // fallback إذا لم توجد الترجمة
    } catch {
      return key; // fallback في حالة أي خطأ
    }
  };

  return { locale, dict, t };
}