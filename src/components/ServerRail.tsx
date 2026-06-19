import { motion } from 'motion/react'
import { profile } from '../data/profile'
import { useT } from '../i18n/LocaleContext'

export type ServerId = 'me' | 'work' | 'play' | 'add' | 'dm'

type Server = {
  id: ServerId
  name: string
  emoji: string
  imageUrl?: string
  isHome?: boolean
  isAdd?: boolean
}

export function ServerRail({
  activeServer,
  onSelect,
}: {
  activeServer: ServerId
  onSelect: (id: ServerId) => void
}) {
  const { t } = useT()
  const servers: Server[] = [
    {
      id: 'me',
      name: t('server.home'),
      emoji: 'N',
      imageUrl: profile.imageUrl,
      isHome: true,
    },
    { id: 'work', name: t('server.work'), emoji: '🛠️' },
    { id: 'play', name: t('server.play'), emoji: '🎮' },
    { id: 'add', name: t('server.add'), emoji: '+', isAdd: true },
  ]

  return (
    <nav
      aria-label="Server list"
      className="flex w-[72px] shrink-0 flex-col items-center gap-2 overflow-y-auto bg-server-rail py-3"
    >
      {servers.map((s) => (
        <ServerIcon
          key={s.id}
          server={s}
          isActive={s.id === activeServer}
          onClick={() => onSelect(s.id)}
        />
      ))}
      <div className="my-1 h-px w-8 bg-channel-sidebar" />
      <ServerIcon
        server={{ id: 'dm', name: t('server.dm'), emoji: '💬' }}
        isActive={activeServer === 'dm'}
        onClick={() => onSelect('dm')}
      />
    </nav>
  )
}

function ServerIcon({
  server,
  isActive,
  onClick,
}: {
  server: Server
  isActive: boolean
  onClick: () => void
}) {
  const isAdd = server.isAdd

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={[
        'server-icon group',
        isActive ? 'active' : '',
        isAdd ? '!text-online' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={server.name}
      aria-current={isActive ? 'true' : undefined}
    >
      {server.imageUrl ? (
        <span
          className="block h-full w-full overflow-hidden rounded-[inherit]"
          style={{
            backgroundImage: `url(${server.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ) : (
        <span className="text-lg font-semibold" aria-hidden>
          {server.emoji}
        </span>
      )}
      <span className="server-tooltip">{server.name}</span>
    </motion.button>
  )
}
