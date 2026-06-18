import { useState, useRef, useEffect } from 'react'
import {
  Hash,
  Bell,
  PushPinSimple,
  Users,
  MagnifyingGlass,
  Tray,
  PaintBrush,
  Globe,
  List,
  Check,
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'motion/react'
import type { SectionId } from '../App'
import type { ThemeId } from '../App'
import { useT } from '../i18n/LocaleContext'
import { profile } from '../data/profile'

type Section = { id: SectionId; label: string }

const themes: { id: ThemeId; key: string; preview: string }[] = [
  { id: 'dark', key: 'theme.dark', preview: '#313338' },
  { id: 'light', key: 'theme.light', preview: '#ffffff' },
  { id: 'dracula', key: 'theme.dracula', preview: '#282a36' },
  { id: 'nord', key: 'theme.nord', preview: '#434c5e' },
]

const langs: { id: 'vi' | 'en'; key: string; flag: string }[] = [
  { id: 'vi', key: 'lang.vi', flag: '🇻🇳' },
  { id: 'en', key: 'lang.en', flag: '🇬🇧' },
]

const descKey: Record<SectionId, string> = {
  welcome: 'topbar.desc.welcome',
  about: 'topbar.desc.about',
  projects: 'topbar.desc.projects',
  tech: 'topbar.desc.tech',
  experience: 'topbar.desc.experience',
  contact: 'topbar.desc.contact',
}

export function TopBar({
  active,
  sections,
  theme,
  onThemeChange,
  isMobile,
  onOpenSidebar,
}: {
  active: SectionId
  sections: Section[]
  theme: ThemeId
  onThemeChange: (t: ThemeId) => void
  isMobile: boolean
  onOpenSidebar: () => void
}) {
  const { t, locale, setLocale } = useT()
  const section = sections.find((s) => s.id === active)
  const [themeOpen, setThemeOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const themeRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!themeOpen) return
    const handler = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [themeOpen])

  useEffect(() => {
    if (!langOpen) return
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [langOpen])

  return (
    <header className="channel-header">
      {/* Hamburger — only mobile */}
      {isMobile && (
        <button
          onClick={onOpenSidebar}
          aria-label={t('common.members')}
          className="rounded p-1.5 text-text-muted transition-colors hover:bg-hover hover:text-white"
          type="button"
        >
          <List size={20} weight="bold" />
        </button>
      )}

      {/* Mobile: small avatar of owner (acts as "server" icon) */}
      {isMobile && (
        <div
          className="h-6 w-6 shrink-0 overflow-hidden rounded-full"
          style={{
            backgroundImage: `url(${profile.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-label={profile.name}
        />
      )}

      <Hash size={22} weight="bold" className="text-text-dim" />
      <h1 className="truncate text-base font-semibold text-white">
        {section?.label}
      </h1>
      <span className="mx-3 hidden h-6 w-px shrink-0 bg-border-strong sm:inline-block" />
      <p className="hidden truncate text-sm text-text-muted sm:block">
        {t(descKey[active])}
      </p>

      <div className="ml-auto flex shrink-0 items-center gap-1 text-text-muted">
        {/* Language switcher */}
        <div ref={langRef} className="relative">
          <button
            onClick={() => {
              setLangOpen((o) => !o)
              setThemeOpen(false)
            }}
            aria-label={t('common.changeLang')}
            className={[
              'flex items-center gap-1 rounded px-1.5 py-1.5 text-xs font-semibold transition-colors',
              langOpen
                ? 'bg-hover text-white'
                : 'text-text-muted hover:bg-hover hover:text-white',
            ].join(' ')}
            type="button"
          >
            <Globe size={18} weight={langOpen ? 'fill' : 'regular'} />
            <span className="uppercase">{locale}</span>
          </button>
          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-lg border border-border bg-server-rail shadow-2xl"
              >
                <div className="border-b border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-text-dim">
                  {t('lang.title')}
                </div>
                <ul className="p-1">
                  {langs.map((l) => (
                    <li key={l.id}>
                      <button
                        onClick={() => {
                          setLocale(l.id)
                          setLangOpen(false)
                        }}
                        className={[
                          'flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors',
                          locale === l.id
                            ? 'bg-active text-white'
                            : 'text-text-body hover:bg-hover',
                        ].join(' ')}
                        type="button"
                      >
                        <span className="text-lg" aria-hidden>
                          {l.flag}
                        </span>
                        <span className="flex-1">{t(l.key)}</span>
                        {locale === l.id && (
                          <Check size={14} weight="bold" className="text-blurple" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme switcher */}
        <div ref={themeRef} className="relative">
          <button
            onClick={() => {
              setThemeOpen((o) => !o)
              setLangOpen(false)
            }}
            aria-label={t('common.changeTheme')}
            className={[
              'rounded p-1.5 transition-colors hover:bg-hover',
              themeOpen
                ? 'bg-hover text-white'
                : 'text-text-muted hover:text-white',
            ].join(' ')}
            type="button"
          >
            <PaintBrush size={20} weight={themeOpen ? 'fill' : 'regular'} />
          </button>
          <AnimatePresence>
            {themeOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-server-rail shadow-2xl"
              >
                <div className="border-b border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-text-dim">
                  {t('theme.title')}
                </div>
                <ul className="p-1">
                  {themes.map((th) => (
                    <li key={th.id}>
                      <button
                        onClick={() => {
                          onThemeChange(th.id)
                          setThemeOpen(false)
                        }}
                        className={[
                          'flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors',
                          theme === th.id
                            ? 'bg-active text-white'
                            : 'text-text-body hover:bg-hover',
                        ].join(' ')}
                        type="button"
                      >
                        <span
                          className="h-5 w-5 shrink-0 rounded-full border border-border-strong"
                          style={{ background: th.preview }}
                        />
                        <span className="flex-1">{t(th.key)}</span>
                        {theme === th.id && (
                          <Check size={14} weight="bold" className="text-blurple" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search — hidden on small mobile */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder={t('common.search')}
            className="h-7 w-32 rounded-md bg-server-rail px-3 text-sm text-text-body placeholder:text-text-placeholder outline-none transition-all focus:w-52 lg:w-36 lg:focus:w-56"
          />
          <MagnifyingGlass
            size={14}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-text-placeholder"
          />
        </div>

        {/* Other actions — progressively hidden on smaller screens */}
        <button
          aria-label={t('common.pinned')}
          className="hidden rounded p-1.5 transition-colors hover:bg-hover hover:text-white md:inline-flex"
          type="button"
        >
          <PushPinSimple size={20} />
        </button>
        <button
          aria-label={t('common.members')}
          className="hidden rounded p-1.5 transition-colors hover:bg-hover hover:text-white xl:inline-flex"
          type="button"
        >
          <Users size={20} />
        </button>
        <button
          aria-label={t('common.inbox')}
          className="hidden rounded p-1.5 transition-colors hover:bg-hover hover:text-white lg:inline-flex"
          type="button"
        >
          <Tray size={20} />
        </button>
        <button
          aria-label={t('common.notifications')}
          className="rounded p-1.5 transition-colors hover:bg-hover hover:text-white"
          type="button"
        >
          <Bell size={20} />
        </button>
      </div>
    </header>
  )
}
