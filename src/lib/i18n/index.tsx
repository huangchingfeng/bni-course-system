"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { translations, Locale, localeNames } from "./translations"

// ============================================================
// i18n Context & Provider
// ============================================================

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: typeof translations["zh-TW"]
  locales: typeof localeNames
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

interface I18nProviderProps {
  children: ReactNode
  defaultLocale?: Locale
}

export function I18nProvider({ children, defaultLocale = "zh-TW" }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    // Save preference to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("bni-locale", newLocale)
    }
  }, [])

  const value: I18nContextType = {
    locale,
    setLocale,
    t: translations[locale],
    locales: localeNames,
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}

export function useTranslation() {
  const { t } = useI18n()
  return t
}

export { translations, localeNames }
export type { Locale }
