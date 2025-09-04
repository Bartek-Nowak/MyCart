export const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'Polski', value: 'pl' },
] as const

export type LanguageValue = (typeof LANGUAGES)[number]['value']

export const THEMES = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
] as const

export type ThemeValue = (typeof THEMES)[number]['value']
