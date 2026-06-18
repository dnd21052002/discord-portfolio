import type { ReactNode } from 'react'
import { useT } from '../i18n/LocaleContext'

type Props = {
  author: string
  avatar?: string
  imageUrl?: string
  color?: string
  timestamp: string
  isBot?: boolean
  children: ReactNode
}

export function Message({
  author,
  avatar,
  imageUrl,
  color = '#ffffff',
  timestamp,
  isBot,
  children,
}: Props) {
  const { t } = useT()
  return (
    <div className="message message-in group">
      <div
        className="message-avatar"
        style={{
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: imageUrl ? 'transparent' : color,
        }}
        aria-label={author}
      >
        {!imageUrl && (avatar ?? author.charAt(0).toUpperCase())}
      </div>
      <div className="min-w-0 flex-1">
        <div className="message-header mb-0.5">
          <span className="message-author" style={{ color }}>
            {author}
          </span>
          {isBot && (
            <span className="rounded bg-blurple px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
              {t('common.bot')}
            </span>
          )}
          <span className="message-timestamp">{timestamp}</span>
        </div>
        <div className="message-content">{children}</div>
      </div>
    </div>
  )
}

export function Divider({
  label,
  date,
}: {
  label: string
  date: string
}) {
  return (
    <div className="my-6 flex items-center gap-3 px-4">
      <div className="h-px flex-1 bg-border-strong" />
      <span className="text-xs font-semibold uppercase tracking-wide text-text-dim">
        {date} — {label}
      </span>
      <div className="h-px flex-1 bg-border-strong" />
    </div>
  )
}
