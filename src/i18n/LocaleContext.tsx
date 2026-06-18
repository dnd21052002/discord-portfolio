import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { dict, defaultLocale, type Locale } from './dict'

const STORAGE_KEY = 'ngocdiep-portfolio-locale'

type Ctx = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string) => string
  formatTime: (hour: number, minute: number) => string
}

const LocaleContext = createContext<Ctx>({
  locale: defaultLocale,
  setLocale: () => {},
  t: (key) => key,
  formatTime: (h, m) => `${h}:${String(m).padStart(2, '0')}`,
})

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (saved && (saved === 'vi' || saved === 'en')) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem(STORAGE_KEY, l)
    document.documentElement.lang = l === 'vi' ? 'vi' : 'en'
  }

  const t = (key: string) => dict[locale][key] ?? key

  // "Hôm nay lúc 09:00" / "Today at 09:00"
  const formatTime = (hour: number, minute: number) => {
    const hh = String(hour).padStart(2, '0')
    const mm = String(minute).padStart(2, '0')
    return `${t('time.todayAt')} ${hh}:${mm}`
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, formatTime }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useT() {
  return useContext(LocaleContext)
}
