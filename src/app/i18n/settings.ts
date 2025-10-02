export const languages = ["ru", "kz", "en"] as const;
export const defaultLanguage = "ru";

export const languageNames = {
  ru: "Русский",
  kz: "Қазақ",
  en: "English",
} as const;

// Функция для проверки, является ли язык поддерживаемым
export function isSupportedLanguage(
  lang: string
): lang is (typeof languages)[number] {
  return languages.includes(lang as any);
}

// Функция для получения дефолтного языка
export function getDefaultLanguage(): (typeof languages)[number] {
  return defaultLanguage;
}

// Экспортируем типы
export type Language = (typeof languages)[number];
export type LanguageNames = typeof languageNames;
