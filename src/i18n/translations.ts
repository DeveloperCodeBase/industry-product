import { SupportedLanguage, LanguageInfo, SUPPORTED_LANGUAGES } from './types';
import { fa } from './locales/fa';
import { en } from './locales/en';
import { ar } from './locales/ar';
import { tr } from './locales/tr';

export type { SupportedLanguage, LanguageInfo };
export { SUPPORTED_LANGUAGES };

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  fa,
  en,
  ar,
  tr,
};
