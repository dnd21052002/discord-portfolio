import { experiences } from '../data/experience'
import { Message } from '../components/Message'
import { useT } from '../i18n/LocaleContext'

export function Experience() {
  const { t } = useT()
  return (
    <div className="space-y-1">
      <div className="mb-4 rounded-md border-l-4 border-blurple bg-embed px-4 py-3 text-sm text-text-body">
        {t('experience.guide')}
      </div>

      {experiences.map((exp, i) => {
        const period = `${exp.from} — ${exp.to === 'now' ? t('time.now') : exp.to}`
        return (
          <Message
            key={exp.id}
            author={exp.companyKey}
            avatar={i === 0 ? '💼' : '🚀'}
            color={i === 0 ? 'var(--color-role-java)' : 'var(--color-role-react)'}
            timestamp={period}
          >
            <p className="mb-1 text-base font-medium text-text-primary">
              {t(exp.roleKey)}
            </p>
            <p className="text-text-body">{t(exp.descriptionKey)}</p>
            {exp.isCurrent && (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-online/15 px-2 py-0.5 text-xs font-medium text-online">
                <span className="pulse-glow inline-block h-1.5 w-1.5 rounded-full bg-online" />
                {t('experience.currentlyHere')}
              </div>
            )}
          </Message>
        )
      })}

      <Message
        author="System"
        avatar="📌"
        color="var(--color-blurple)"
        timestamp={t('common.pinned')}
      >
        <p className="text-text-muted">
          {t('experience.systemMsg')}{' '}
          <code className="rounded bg-server-rail px-1.5 py-0.5 font-mono text-xs text-text-primary">
            ~/Developer/
          </code>{' '}
          — {t('experience.systemCount')}{' '}
          <code className="rounded bg-server-rail px-1.5 py-0.5 font-mono text-xs text-text-primary">
            20+ projects
          </code>{' '}
          {t('experience.systemStack')}
        </p>
      </Message>
    </div>
  )
}
