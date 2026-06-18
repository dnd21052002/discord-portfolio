import { useEffect } from 'react'
import {
  Hash,
  Megaphone,
  SpeakerHigh,
  ChatTeardrop,
  X,
  type Icon,
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'motion/react'
import type { SectionId } from '../App'
import { useT } from '../i18n/LocaleContext'
import { UserBar } from './MemberList'

type Section = { id: SectionId; label: string }

const categoryKey: Record<string, { key: string; iconKey: 'INTRO' | 'WORK' | 'CONNECT' }> = {
  welcome: { key: 'sidebar.intro', iconKey: 'INTRO' },
  about: { key: 'sidebar.intro', iconKey: 'INTRO' },
  projects: { key: 'sidebar.work', iconKey: 'WORK' },
  tech: { key: 'sidebar.work', iconKey: 'WORK' },
  experience: { key: 'sidebar.work', iconKey: 'WORK' },
  contact: { key: 'sidebar.connect', iconKey: 'CONNECT' },
}

const categoryIcon: Record<'INTRO' | 'WORK' | 'CONNECT', Icon> = {
  INTRO: Megaphone,
  WORK: SpeakerHigh,
  CONNECT: ChatTeardrop,
}

export function ChannelSidebar({
  sections,
  active,
  onSelect,
  isOpen,
  onClose,
  isMobile = false,
}: {
  sections: Section[]
  active: SectionId
  onSelect: (id: SectionId) => void
  isOpen: boolean
  onClose: () => void
  isMobile?: boolean
}) {  const { t } = useT()

  // Lock body scroll when drawer open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const groups = sections.reduce<Record<string, Section[]>>((acc, s) => {
    const cat = categoryKey[s.id]
    if (!cat) return acc
    const label = t(cat.key)
    ;(acc[label] ??= []).push(s)
    return acc
  }, {})

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Server header — has close button on mobile */}
      <div className="flex h-12 shrink-0 items-center gap-1.5 border-b border-border bg-channel-sidebar px-4 text-white shadow-sm">
        <button
          onClick={onClose}
          className="rounded p-1 text-text-muted transition-colors hover:bg-hover hover:text-white lg:hidden"
          type="button"
          aria-label="Close sidebar"
        >
          <X size={18} weight="bold" />
        </button>
        <span className="flex-1 truncate text-left font-semibold">
          {t('sidebar.title')}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          className="opacity-70"
          fill="currentColor"
        >
          <path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" />
        </svg>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        {Object.entries(groups).map(([cat, items]) => {
          const catKey = Object.values(categoryKey).find(
            (c) => t(c.key) === cat,
          )
          const CatIcon = catKey ? categoryIcon[catKey.iconKey] : Megaphone
          return (
            <div key={cat} className="mb-4">
              <div className="mb-1 flex items-center gap-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-text-dim">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                </svg>
                {cat}
                <span className="ml-auto">
                  <CatIcon size={12} weight="fill" />
                </span>
              </div>
              <ul className="space-y-0.5">
                {items.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => onSelect(s.id)}
                      className={[
                        'channel-item w-full',
                        active === s.id ? 'active' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      type="button"
                    >
                      <span className="icon">
                        <Hash size={18} weight="bold" />
                      </span>
                      <span className="truncate">{s.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <UserBar />
    </div>
  )

  return (
    <>
      {/* Desktop: fixed sidebar — hidden when on mobile (via inline style to override Tailwind lg:flex) */}
      <div
        className="w-60 shrink-0 flex-col bg-channel-sidebar lg:flex"
        style={{ display: isMobile ? 'none' : undefined }}
      >
        <SidebarContent />
      </div>

      {/* Mobile: drawer + backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              aria-hidden
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-channel-sidebar shadow-2xl lg:hidden"
              aria-label="Server sidebar"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
