import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ServerRail, type ServerId } from './components/ServerRail'
import { ServerRailDrawer } from './components/ServerRailDrawer'
import { ChannelSidebar } from './components/ChannelSidebar'
import { TopBar } from './components/TopBar'
import { MemberList } from './components/MemberList'
import { MainArea } from './components/MainArea'
import { GameHub, type GameId } from './games/GameHub'
import { LocaleProvider, useT } from './i18n/LocaleContext'

// Lazy load games to keep initial bundle small
const Snake = lazy(() => import('./games/Snake'))
const TicTacToe = lazy(() => import('./games/TicTacToe'))
const MemoryMatch = lazy(() => import('./games/MemoryMatch'))
const Game2048 = lazy(() => import('./games/Game2048'))
const Sudoku = lazy(() => import('./games/Sudoku'))

export type SectionId =
  | 'welcome' | 'about' | 'projects' | 'tech' | 'experience' | 'contact'
export type ThemeId = 'dark' | 'light' | 'dracula' | 'nord'
export type View = SectionId | 'hub' | `game:${GameId}`

const sectionKeyMap: Record<SectionId, string> = {
  welcome: 'channel.welcome', about: 'channel.about-me',
  projects: 'channel.projects', tech: 'channel.tech-stack',
  experience: 'channel.experience', contact: 'channel.contact-me',
}

const gameTitleKeys: Record<GameId, string> = {
  snake: 'gamehub.snake.title',
  tictactoe: 'gamehub.tictactoe.title',
  memory: 'gamehub.memory.title',
  '2048': 'gamehub.2048.title',
  sudoku: 'gamehub.sudoku.title',
}

const THEME_KEY = 'ngocdiep-portfolio-theme'
const MOBILE_BP = 1024

function Shell() {
  const { t } = useT()
  const [active, setActive] = useState<SectionId>('welcome')
  const [view, setView] = useState<View>('welcome')
  const [activeServer, setActiveServer] = useState<ServerId>('me')
  const [theme, setTheme] = useState<ThemeId>('dark')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [serverRailOpen, setServerRailOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BP : false,
  )
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as ThemeId | null
    if (saved && ['dark', 'light', 'dracula', 'nord'].includes(saved)) setTheme(saved)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < MOBILE_BP)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  // Choose which server is active based on view
  useEffect(() => {
    if (view === 'hub' || (typeof view === 'string' && view.startsWith('game:'))) {
      setActiveServer('play')
    } else {
      setActiveServer('me')
    }
  }, [view])

  const handleSelect = (id: SectionId) => {
    setActive(id)
    setView(id)
    setActiveServer('me')
    if (isMobile) {
      setSidebarOpen(false)
      requestAnimationFrame(() => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' }))
    }
  }

  const handleServerClick = (id: ServerId) => {
    setActiveServer(id)
    if (id === 'play') {
      setView('hub')
      if (isMobile) setSidebarOpen(false)
      requestAnimationFrame(() => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' }))
    } else if (id === 'me') {
      setView(active)
      if (isMobile) setSidebarOpen(false)
    } else {
      // work / add / dm — visual only for now
      if (isMobile) setSidebarOpen(false)
    }
  }

  const handleGameSelect = (id: GameId) => {
    setView(`game:${id}` as View)
    requestAnimationFrame(() => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' }))
  }

  const handleBack = () => {
    if (typeof view === 'string' && view.startsWith('game:')) {
      setView('hub')
    } else {
      setView(active)
      setActiveServer('me')
    }
  }

  const sections = (['welcome', 'about', 'projects', 'tech', 'experience', 'contact'] as SectionId[])
    .map((id) => ({ id, label: t(sectionKeyMap[id]) }))

  const isInGameZone = view === 'hub' || (typeof view === 'string' && view.startsWith('game:'))
  const currentGameId = typeof view === 'string' && view.startsWith('game:') ? view.slice(5) as GameId : null
  const viewLabel = currentGameId ? `🐍 ${t(gameTitleKeys[currentGameId])}` : view === 'hub' ? `🎮 ${t('gamehub.title')}` : undefined

  return (
    <div className="flex h-dvh w-screen overflow-hidden bg-main text-text-body">
      {/* Server rail — hidden on mobile (drawer replaces it) */}
      <div
        className="hidden bg-server-rail lg:flex"
        style={{ display: isMobile ? 'none' : undefined }}
      >
        <ServerRail activeServer={activeServer} onSelect={handleServerClick} />
      </div>

      {/* Mobile: server rail drawer */}
      <ServerRailDrawer
        isOpen={serverRailOpen}
        onClose={() => setServerRailOpen(false)}
        onPlay={() => handleServerClick('play')}
        activeServer={activeServer}
      />

      <ChannelSidebar
        sections={sections}
        active={active}
        onSelect={handleSelect}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
        hide={isInGameZone}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          active={isInGameZone ? 'welcome' : active}
          sections={sections}
          theme={theme}
          onThemeChange={setTheme}
          isMobile={isMobile}
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenServerRail={() => setServerRailOpen(true)}
          viewLabel={viewLabel}
          onBack={isInGameZone ? handleBack : undefined}
        />
        <div className="flex min-h-0 flex-1">
          <main
            ref={mainRef}
            className="flex-1 overflow-x-hidden overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] touch-pan-y"
            style={{ background: 'var(--color-main-bg)' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={
                  isInGameZone
                    ? 'mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10'
                    : 'mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8'
                }
              >
                {view === 'hub' ? (
                  <GameHub onSelect={handleGameSelect} />
                ) : currentGameId ? (
                  <Suspense fallback={<div className="flex h-64 items-center justify-center text-text-muted">Loading...</div>}>
                    {currentGameId === 'snake' && <Snake />}
                    {currentGameId === 'tictactoe' && <TicTacToe />}
                    {currentGameId === 'memory' && <MemoryMatch />}
                    {currentGameId === '2048' && <Game2048 />}
                    {currentGameId === 'sudoku' && <Sudoku />}
                  </Suspense>
                ) : (
                  <MainArea active={active} />
                )}
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
