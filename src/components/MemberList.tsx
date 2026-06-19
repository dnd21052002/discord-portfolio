import { profile } from '../data/profile'
import { skills } from '../data/skills'
import { useT } from '../i18n/LocaleContext'

const roleEmoji: Record<string, string> = {
  online: '🟢',
  idle: '🌙',
  dnd: '⛔',
  offline: '⚫',
}

export function UserBar() {
  const { t } = useT()
  return (
    <div className="flex h-14 shrink-0 items-center gap-2 bg-user-bar px-2">
      <button
        className="group flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-channel-sidebar"
        type="button"
      >
        <div
          className="member-avatar !h-8 !w-8"
          style={{
            backgroundImage: profile.imageUrl
              ? `url(${profile.imageUrl})`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: profile.imageUrl ? 'transparent' : undefined,
          }}
          aria-label={profile.name}
        >
          {!profile.imageUrl && profile.name.charAt(0).toUpperCase()}
          <span className={`member-status-dot ${profile.status}`} />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <div className="truncate text-sm font-semibold text-text-primary">
            {profile.name}
          </div>
          <div className="flex items-center gap-1 truncate text-xs text-text-muted">
            <span aria-hidden>{roleEmoji[profile.status]}</span>
            <span className="truncate">{t('profile.statusText')}</span>
          </div>
        </div>
      </button>
      <div className="flex items-center gap-0.5 text-text-muted">
        <IconBtn title={t('user.mute')} />
        <IconBtn title={t('user.deafen')} />
        <IconBtn title={t('user.settings')} />
      </div>
    </div>
  )
}

function IconBtn({ title }: { title: string }) {
  return (
    <button
      aria-label={title}
      title={title}
      type="button"
      className="rounded p-1.5 transition-colors hover:bg-channel-sidebar hover:text-white"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="3" />
      </svg>
    </button>
  )
}

export function MemberList({ isMobile = false }: { isMobile?: boolean } = {}) {
  const { t } = useT()
  const online = skills.filter((s) => s.level === 'expert')
  const idle = skills.filter((s) => s.level === 'proficient')
  const offline = skills.filter((s) => s.level === 'learning')

  return (
    <aside
      className="hidden w-60 shrink-0 flex-col overflow-y-auto bg-channel-sidebar px-2 py-4 lg:flex"
      style={{ display: isMobile ? 'none' : undefined }}
    >
      <MemberGroup
        title={t('members.onlineExpert')}
        count={online.length}
        members={online}
        status="online"
      />
      <MemberGroup
        title={t('members.idleProficient')}
        count={idle.length}
        members={idle}
        status="idle"
      />
      {offline.length > 0 && (
        <MemberGroup
          title={t('members.offlineLearning')}
          count={offline.length}
          members={offline}
          status="offline"
        />
      )}
      <div className="mt-4 px-2 text-[11px] uppercase tracking-wide text-text-dim">
        {t('members.nowPlaying')}
      </div>
      <div className="mx-2 mt-1 rounded-md bg-server-rail p-3 text-xs text-text-muted">
        <div className="mb-1 truncate text-text-primary">{t('profile.statusText')}</div>
        <div className="truncate">{t('profile.tagline')}</div>
      </div>
    </aside>
  )
}

function MemberGroup({
  title,
  count,
  members,
  status,
}: {
  title: string
  count: number
  members: typeof skills
  status: 'online' | 'idle' | 'offline'
}) {
  if (members.length === 0) return null
  return (
    <div className="mb-4">
      <div className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-text-dim">
        {title} — {count}
      </div>
      <ul className="space-y-0.5">
        {members.map((m) => (
          <li
            key={m.name}
            className={`member-item ${status === 'online' ? 'online' : ''}`}
          >
            <div
              className="member-avatar"
              style={{ backgroundColor: m.cssVar, color: m.onColor }}
            >
              {m.name.charAt(0)}
              <span className={`member-status-dot ${status}`} />
            </div>
            <span className="truncate" style={{ color: m.onColor }}>
              {m.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
