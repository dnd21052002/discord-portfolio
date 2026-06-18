import {
  Hash,
  Megaphone,
  SpeakerHigh,
  ChatTeardrop,
  type Icon,
} from '@phosphor-icons/react'
import type { SectionId } from '../App'
import { useT } from '../i18n/LocaleContext'

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
}: {
  sections: Section[]
  active: SectionId
  onSelect: (id: SectionId) => void
}) {
  const { t } = useT()

  // Group sections by category
  const groups = sections.reduce<Record<string, Section[]>>((acc, s) => {
    const cat = categoryKey[s.id]
    if (!cat) return acc
    const label = t(cat.key)
    ;(acc[label] ??= []).push(s)
    return acc
  }, {})

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <button
        className="flex h-12 shrink-0 items-center gap-1.5 border-b border-border px-4 text-white shadow-sm transition-colors hover:bg-hover"
        type="button"
      >
        <span className="font-semibold">{t('sidebar.title')}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          className="ml-auto opacity-70"
          fill="currentColor"
        >
          <path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" />
        </svg>
      </button>

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
    </div>
  )
}
