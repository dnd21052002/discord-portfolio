import { Message, Divider } from '../components/Message'
import { profile } from '../data/profile'
import { useT } from '../i18n/LocaleContext'
import type { SectionId, View } from '../App'

const channelItems: Array<{ id: SectionId; icon: string }> = [
  { id: 'about', icon: '👤' },
  { id: 'projects', icon: '📁' },
  { id: 'tech', icon: '⚡' },
  { id: 'experience', icon: '💼' },
  { id: 'contact', icon: '📬' },
]

const gameItems: Array<{ id: string; icon: string; key: string }> = [
  { id: 'snake', icon: '🐍', key: 'gamehub.snake.title' },
  { id: 'tictactoe', icon: '❌', key: 'gamehub.tictactoe.title' },
  { id: 'memory', icon: '🧠', key: 'gamehub.memory.title' },
  { id: '2048', icon: '🔢', key: 'gamehub.2048.title' },
  { id: 'sudoku', icon: '🧩', key: 'gamehub.sudoku.title' },
]

export function Welcome({
  onNavigate,
}: {
  onNavigate?: (view: View) => void
}) {
  const { t, formatTime } = useT()

  const handleChannel = (id: SectionId) => onNavigate?.(id)
  const handleGame = (id: string) => onNavigate?.(`game:${id}` as View)
  const handleHub = () => onNavigate?.('hub')

  return (
    <div className="space-y-1">
      <Message
        author={profile.name}
        imageUrl={profile.imageUrl}
        color="var(--color-blurple)"
        timestamp={formatTime(9, 0)}
      >
        <p>
          {t('welcome.greeting')}{' '}
          <strong className="text-text-primary">@{t('profile.name')}&apos;s Portfolio</strong>{' '}
          {t('welcome.channelLabel')}{' '}
          <strong className="text-text-primary">#welcome</strong>
          {t('welcome.channelTag')}
        </p>
        <p className="mt-2">{t('welcome.intro')}</p>
        <ul className="mt-2 space-y-1 text-text-muted">
          {channelItems.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => handleChannel(c.id)}
                className="mention cursor-pointer transition-colors hover:!bg-blurple/30 hover:!text-white"
                title={`Mở #${t(`channel.${c.id === 'about' ? 'about-me' : c.id === 'tech' ? 'tech-stack' : c.id}`)}`}
              >
                <Hash aria-hidden />#{t(`channel.${c.id === 'about' ? 'about-me' : c.id === 'tech' ? 'tech-stack' : c.id}`)}
              </button>{' '}
              —{' '}
              {t(
                `topbar.desc.${c.id === 'about' ? 'about' : c.id === 'tech' ? 'tech' : c.id}`,
              ).replace(/\.$/, '')}
            </li>
          ))}
        </ul>
      </Message>

      <Message
        author="Portfolio-Bot"
        avatar="🤖"
        color="var(--color-blurple)"
        timestamp={formatTime(9, 0)}
        isBot
      >
        <p>
          <strong className="text-text-primary">@{profile.name}</strong>{' '}
          {t('welcome.botMessage')}{' '}
          <button
            type="button"
            onClick={() => handleChannel('projects')}
            className="mention cursor-pointer transition-colors hover:!bg-blurple/30 hover:!text-white"
          >
            <Hash aria-hidden />#projects
          </button>
          {t('welcome.botCheckIt')}
        </p>
      </Message>

      <Message
        author="Portfolio-Bot"
        avatar="💡"
        color="var(--color-blurple)"
        timestamp={formatTime(9, 1)}
        isBot
      >
        <p className="text-text-muted">
          <strong className="text-text-primary">{t('welcome.tip')}:</strong>{' '}
          {t('welcome.tipBody')}
        </p>
      </Message>

      <Message
        author="Portfolio-Bot"
        avatar="🎮"
        color="var(--color-blurple)"
        timestamp={formatTime(9, 2)}
        isBot
      >
        <p>
          <strong className="text-text-primary">{t('welcome.gameHubIntro')}</strong>
        </p>
        <p className="mt-2 text-text-muted">{t('welcome.gameHubBody')}</p>
        <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {gameItems.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => handleGame(g.id)}
                className="group flex w-full items-center gap-2 rounded-md border border-border bg-channel-sidebar px-3 py-2 text-left text-sm transition-colors hover:border-blurple hover:bg-blurple/15"
              >
                <span aria-hidden className="text-lg">{g.icon}</span>
                <span className="font-medium text-text-body group-hover:text-white">{t(g.key)}</span>
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={handleHub}
          className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-blurple px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blurple/80"
        >
          🎮 {t('welcome.openHub')} →
        </button>
      </Message>

      <Divider label={t('welcome.dividerLabel')} date="18/06" />

      <Message
        author={profile.name}
        imageUrl={profile.imageUrl}
        color="var(--color-blurple)"
        timestamp={formatTime(9, 15)}
      >
        <p>
          {t('welcome.refactorIntro')}{' '}
          <code className="rounded bg-server-rail px-1.5 py-0.5 font-mono text-sm text-text-body">
            ~/Developer/discord-portfolio
          </code>{' '}
          {t('welcome.refactorStack')}{' '}
          <code className="rounded bg-server-rail px-1.5 py-0.5 font-mono text-sm text-text-body">
            digital-twin
          </code>{' '}
          {t('welcome.refactorAnd')}{' '}
          <code className="rounded bg-server-rail px-1.5 py-0.5 font-mono text-sm text-text-body">
            portfolio_3d
          </code>
          .
        </p>
      </Message>

      <TypingIndicator />
    </div>
  )
}

// Helper import (re-export for clarity)
function Hash(props: { 'aria-hidden'?: boolean }) {
  return (
    <span aria-hidden={props['aria-hidden']}>#</span>
  )
}

function TypingIndicator() {
  const { t } = useT()
  return (
    <div className="message">
      <div
        className="message-avatar !h-6 !w-6"
        style={{
          backgroundImage: `url(${profile.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-label={profile.name}
      />
      <div className="flex items-center gap-2 py-2 text-xs text-text-dim">
        <span className="font-semibold text-text-primary">{profile.name}</span>
        <span>{t('status.typing')}</span>
        <span className="flex items-end gap-0.5">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </span>
      </div>
    </div>
  )
}
