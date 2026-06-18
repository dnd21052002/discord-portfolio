import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ServerRail } from './components/ServerRail'
import { ChannelSidebar } from './components/ChannelSidebar'
import { TopBar } from './components/TopBar'
import { MemberList } from './components/MemberList'
import { MainArea } from './components/MainArea'
import { LocaleProvider, useT } from './i18n/LocaleContext'

export type SectionId =
  | 'welcome'
  | 'about'
  | 'projects'
  | 'tech'
  | 'experience'
  | 'contact'

export type ThemeId = 'dark' | 'light' | 'dracula' | 'nord'

const sectionKeyMap: Record<SectionId, string> = {
  welcome: 'channel.welcome',
  about: 'channel.about-me',
  projects: 'channel.projects',
  tech: 'channel.tech-stack',
  experience: 'channel.experience',
  contact: 'channel.contact-me',
}

const THEME_KEY = 'ngocdiep-portfolio-theme'
const MOBILE_BP = 1024 // lg breakpoint

function Shell() {
  const { t } = useT()
  const [active, setActive] = useState<SectionId>('welcome')
  const [theme, setTheme] = useState<ThemeId>('dark')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BP : false,
  )
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as ThemeId | null
    if (saved && ['dark', 'light', 'dracula', 'nord'].includes(saved)) {
      setTheme(saved)
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  // Track viewport for responsive behaviour
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < MOBILE_BP)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Auto-close mobile sidebar when switching channel
  const handleSelect = (id: SectionId) => {
    setActive(id)
    if (isMobile) {
      setSidebarOpen(false)
      // Scroll main content to top on mobile (drawer close + new content)
      requestAnimationFrame(() => {
        mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      })
    }
  }

  const sections = (['welcome', 'about', 'projects', 'tech', 'experience', 'contact'] as SectionId[]).map(
    (id) => ({ id, label: t(sectionKeyMap[id]) }),
  )

  return (
    <div className="flex h-dvh w-screen overflow-hidden bg-main text-text-body">
      {/* Server rail — hidden on mobile (inline style overrides Tailwind lg:block) */}
      <div
        className="hidden bg-server-rail lg:block"
        style={{ display: isMobile ? 'none' : undefined }}
      >
        <ServerRail />
      </div>

      {/* Channel sidebar — drawer on mobile, fixed on desktop */}
      <ChannelSidebar
        sections={sections}
        active={active}
        onSelect={handleSelect}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          active={active}
          sections={sections}
          theme={theme}
          onThemeChange={setTheme}
          isMobile={isMobile}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <div className="flex min-h-0 flex-1">
          <main
            ref={mainRef}
            className="flex-1 overflow-x-hidden overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] touch-pan-y"
            style={{ background: 'var(--color-main-bg)' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8"
              >
                <MainArea active={active} />
              </motion.div>
            </AnimatePresence>
          </main>
          <MemberList isMobile={isMobile} />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <LocaleProvider>
      <Shell />
    </LocaleProvider>
  )
}
