import { Message, Divider } from '../components/Message'
import { profile } from '../data/profile'
import { useT } from '../i18n/LocaleContext'

export function Welcome() {
  const { t, formatTime } = useT()
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
          <li>
            <span className="mention">#about-me</span> —{' '}
            {t('topbar.desc.about').replace(/\.$/, '')}
          </li>
          <li>
            <span className="mention">#projects</span> —{' '}
            {t('topbar.desc.projects').replace(/\.$/, '')}
          </li>
          <li>
            <span className="mention">#tech-stack</span> —{' '}
            {t('topbar.desc.tech').replace(/\.$/, '')}
          </li>
          <li>
            <span className="mention">#experience</span> —{' '}
            {t('topbar.desc.experience').replace(/\.$/, '')}
          </li>
          <li>
            <span className="mention">#contact-me</span> —{' '}
            {t('topbar.desc.contact').replace(/\.$/, '')}
          </li>
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
          <span className="mention">#projects</span>
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
