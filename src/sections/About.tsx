import { Message } from '../components/Message'
import { profile } from '../data/profile'
import { useT } from '../i18n/LocaleContext'

export function About() {
  const { t, formatTime } = useT()
  return (
    <div className="space-y-1">
      <Message
        author={profile.name}
        imageUrl={profile.imageUrl}
        avatar="👋"
        color="var(--color-blurple)"
        timestamp={formatTime(9, 30)}
      >
        <p>{t('profile.about')}</p>
      </Message>

      <Message
        author={profile.name}
        imageUrl={profile.imageUrl}
        avatar="📍"
        color="var(--color-blurple)"
        timestamp={formatTime(9, 31)}
      >
        <p className="text-text-muted">
          <strong className="text-text-primary">{t('about.location')}</strong>{' '}
          {t('profile.location')}
        </p>
        <p className="text-text-muted">
          <strong className="text-text-primary">{t('about.languages')}</strong>{' '}
          {t('profile.languages')}
        </p>
        <p className="mt-2 text-text-muted">
          <strong className="text-text-primary">{t('about.roles')}</strong>
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {[t('profile.role.backend'), t('profile.role.fullstack'), t('profile.role.3dar')].map(
            (r) => (
              <span
                key={r}
                className="rounded-md bg-blurple/15 px-2 py-0.5 text-xs font-medium text-text-muted"
              >
                {r}
              </span>
            ),
          )}
        </div>
      </Message>
    </div>
  )
}
