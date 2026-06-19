import { motion } from 'motion/react'
import { profile } from '../data/profile'
import { useT } from '../i18n/LocaleContext'

export function ServerRail({ onPlay }: { onPlay?: () => void }) {
  const { t } = useT()
  const servers: Server[] = [
    {
      id: 'me',
      name: t('server.home'),
      emoji: 'N',
      imageUrl: profile.imageUrl,
      active: true,
      isHome: true,
    },
    { id: 'work', name: t('server.work'), emoji: '🛠️' },
    { id: 'play', name: t('server.play'), emoji: '🎮', onClick: onPlay },
    { id: 'add', name: t('server.add'), emoji: '+', isAdd: true },
  ]

  return (
    <nav
      aria-label="Server list"
      className="flex w-[72px] shrink-0 flex-col items-center gap-2 overflow-y-auto bg-server-rail py-3"
    >
      {servers.map((s) => (
        <ServerIcon key={s.id} server={s} />
      ))}
      <div className="my-1 h-px w-8 bg-channel-sidebar" />
      <ServerIcon
        server={{ id: 'dm', name: t('server.dm'), emoji: '💬' }}
      />
    </nav>
  )
}

type Server = {
  id: string
  name: string
  emoji: string
  imageUrl?: string
  active?: boolean
  isHome?: boolean
  isAdd?: boolean
  onClick?: () => void
}

function ServerIcon({ server }: { server: Server }) {
  const isAdd = server.isAdd

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={server.onClick}
      className={[
        'server-icon group',
        server.active ? 'active' : '',
        isAdd ? '!text-online' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={server.name}
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
