import {
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  Globe,
  ChatCircle,
} from '@phosphor-icons/react'
import { profile } from '../data/profile'
import { Message } from '../components/Message'
import { useT } from '../i18n/LocaleContext'

const channels = [
  {
    icon: EnvelopeSimple,
    labelKey: 'common.inbox',
    key: 'email' as const,
    color: 'var(--color-role-java)',
  },
  {
    icon: GithubLogo,
    labelKey: 'common.notifications',
    key: 'github' as const,
    color: 'var(--color-text-primary)',
  },
  {
    icon: LinkedinLogo,
    labelKey: 'common.members',
    key: 'linkedin' as const,
    color: 'var(--color-role-typescript)',
  },
  {
    icon: Globe,
    labelKey: 'sidebar.title',
    key: 'website' as const,
    color: 'var(--color-role-react)',
  },
]

export function Contact() {
  const { t, formatTime } = useT()
  return (
    <div className="space-y-1">
      <Message
        author={profile.name}
        imageUrl={profile.imageUrl}
        avatar="📬"
        color="var(--color-blurple)"
        timestamp={formatTime(10, 0)}
      >
        <p>{t('contact.greeting')}</p>
      </Message>

      <div className="my-4 grid gap-3 sm:grid-cols-2">
        {channels.map((c) => {
          const value = profile[c.key]
          const href =
            c.key === 'email' ? `mailto:${value}` : (value as string)
          const display = value.replace('https://', '').replace('mailto:', '')
          return (
            <a
              key={c.key}
              href={href}
              target={c.key === 'email' ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-lg border border-border bg-channel-sidebar p-4 transition-all hover:-translate-y-0.5 hover:border-blurple/40"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
                style={{ background: `${c.color}1f`, color: c.color }}
              >
                <c.icon size={20} weight="bold" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-text-dim">
                  {t(c.labelKey)}
                </div>
                <div className="truncate text-sm font-medium text-white">
                  {display}
                </div>
              </div>
            </a>
          )
        })}
      </div>

      <div className="my-4 rounded-md bg-server-rail p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-dim">
          <ChatCircle size={14} />
          {t('common.newThread')}
        </div>
        <div className="rounded-md bg-input-bg p-3 text-sm text-text-faint">
          Message @{profile.name}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-text-dim">
          <span>{t('common.markdown')}</span>
          <span className="rounded bg-blurple px-3 py-1 font-medium text-white opacity-60">
            {t('common.send')}
          </span>
        </div>
      </div>

      <Message
        author="Portfolio-Bot"
        avatar="🤖"
        color="var(--color-blurple)"
        timestamp={formatTime(10, 1)}
        isBot
      >
        <p className="text-text-muted">
          <strong className="text-white">{t('contact.noteTitle')}:</strong>{' '}
          {t('contact.noteBody')}{' '}
          <a
            href={`mailto:${profile.email}`}
            className="text-text-link hover:underline"
          >
            email
          </a>{' '}
          {t('contact.noteEnd')}
        </p>
      </Message>
    </div>
  )
}
