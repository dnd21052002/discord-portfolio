import { motion } from 'motion/react'
import { skills } from '../data/skills'
import { useT } from '../i18n/LocaleContext'

const categoryOrder: Array<(typeof skills)[number]['category']> = [
  'language',
  'backend',
  'frontend',
  'mobile',
  'data',
  'devops',
]

export function TechStack() {
  const { t } = useT()
  const groups = categoryOrder.map((c) => ({
    cat: c,
    items: skills.filter((s) => s.category === c),
  }))

  return (
    <div className="space-y-6">
      <div className="rounded-md border-l-4 border-blurple bg-embed px-4 py-3 text-sm text-text-body">
        {t('tech.guide')}
      </div>

      {groups.map((g) =>
        g.items.length === 0 ? null : (
          <section key={g.cat}>
            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-dim">
              ── {g.cat} ──
            </h2>
            <div className="space-y-1">
              {g.items.map((s, i) => (
                <SkillRow key={s.name} skill={s} index={i} />
              ))}
            </div>
          </section>
        ),
      )}
    </div>
  )
}

function SkillRow({
  skill,
  index,
}: {
  skill: (typeof skills)[number]
  index: number
}) {
  const { t } = useT()
  const status =
    skill.level === 'expert'
      ? 'online'
      : skill.level === 'proficient'
        ? 'idle'
        : 'offline'

  const levelLabel =
    skill.level === 'expert'
      ? t('tech.expert')
      : skill.level === 'proficient'
        ? t('tech.proficient')
        : t('tech.learning')

  return (
    <motion.div
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      className="member-item !opacity-100"
    >
      <div
        className="member-avatar !h-8 !w-8"
        style={{
          backgroundColor: skill.cssVar,
          color: skill.onColor,
        }}
      >
        <skill.Icon size={20} aria-label={skill.name} />
        <span className={`member-status-dot ${status}`} />
      </div>
      <span className="truncate font-medium text-text-body">
        {skill.name}
      </span>
      <span className="ml-auto text-[11px] uppercase tracking-wide text-text-dim">
        {levelLabel}
      </span>
    </motion.div>
  )
}
