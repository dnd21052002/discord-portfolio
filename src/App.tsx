import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ServerRail } from './components/ServerRail'
import { ChannelSidebar } from './components/ChannelSidebar'
import { TopBar } from './components/TopBar'
import { UserBar, MemberList } from './components/MemberList'
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

function Shell() {
  const { t } = useT()
  const [active, setActive] = useState<SectionId>('welcome')
  const [theme, setTheme] = useState<ThemeId>('dark')

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

  const sections = (['welcome', 'about', 'projects', 'tech', 'experience', 'contact'] as SectionId[]).map(
    (id) => ({ id, label: t(sectionKeyMap[id]) })
  )

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-main text-text-body">
      <ServerRail />
      <div className="flex w-60 shrink-0 flex-col bg-channel-sidebar">
        <ChannelSidebar
          sections={sections}
          active={active}
          onSelect={setActive}
        />
        <UserBar />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          active={active}
          sections={sections}
          theme={theme}
          onThemeChange={setTheme}
        />
        <div className="flex min-h-0 flex-1">
          <main className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="mx-auto max-w-3xl px-4 py-8"
              >
                <MainArea active={active} />
              </motion.div>
            </AnimatePresence>
          </main>
          <MemberList />
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
