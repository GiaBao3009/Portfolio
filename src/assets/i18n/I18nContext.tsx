import React, { createContext, useContext, useEffect, useState } from 'react'
import { en } from './en'
import { vi } from './vi'
import type { TranslationDictionary } from './types'

export type Language = 'en' | 'vi'

export interface I18nContextType {
  lang: Language
  setLang: (lang: Language) => void
  toggleLang: () => void
  t: TranslationDictionary
}

const translations: Record<Language, TranslationDictionary> = {
  en,
  vi,
}

const I18nContext = createContext<I18nContextType | null>(null)

/**
 * Provider quản lý đa ngôn ngữ (Tiếng Việt & Tiếng Anh)
 * Lưu trữ trạng thái trong localStorage để duy trì lựa chọn của người dùng.
 */
export function I18nProvider({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  // Mặc định tiếng Anh (EN), ưu tiên lựa chọn đã lưu trong localStorage
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_lang_v2')
      if (saved === 'en' || saved === 'vi') return saved
    }
    return 'en'
  })

  // Đổi ngôn ngữ và lưu vào localStorage
  const setLang = (newLang: Language) => {
    setLangState(newLang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_lang_v2', newLang)
      document.documentElement.lang = newLang
    }
  }

  // Chuyển đổi qua lại giữa tiếng Việt và tiếng Anh
  const toggleLang = () => {
    const nextLang = lang === 'vi' ? 'en' : 'vi'
    setLang(nextLang)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = lang
    }
  }, [lang])

  return (
    <I18nContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t: translations[lang],
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}

/**
 * Custom hook lấy từ điển bản dịch và hàm chuyển đổi ngôn ngữ
 */
export function useI18n(): I18nContextType {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
