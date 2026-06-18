import { motion } from 'motion/react'
import { GithubLogo, ArrowSquareOut } from '@phosphor-icons/react'
import { projects } from '../data/projects'
import { useT } from '../i18n/LocaleContext'

export function Projects() {
  const { t } = useT()
  return (
    <div className="space-y-1">
      <div className="mb-4 rounded-md border-l-4 border-blurple bg-embed px-4 py-3 text-sm text-text-body">
        <strong className="text-white">📌 {t('projects.pinned')}</strong> ·{' '}
        {t('projects.pinnedDesc')}{' '}
        <code className="rounded bg-server-rail px-1.5 py-0.5 font-mono text-xs">
          ~/Developer
        </code>
        . {t('projects.eachThread')}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </div>
  )
}

type Project = (typeof projects)[number]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { t } = useT()
  const description = t(project.descriptionKey)
  const highlight = project.highlightKey ? t(project.highlightKey) : null

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="group rounded-lg border border-border bg-channel-sidebar p-4 transition-colors hover:border-blurple/40"
    >
      <header className="mb-2 flex items-center gap-2">
        <span className="text-2xl" aria-hidden>
          {project.emoji}
        </span>
        <h3 className="truncate text-base font-semibold text-white">
          {project.name}
        </h3>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto rounded p-1 text-text-muted transition-colors hover:bg-hover hover:text-white"
            aria-label="Open link"
          >
            <ArrowSquareOut size={16} />
          </a>
        )}
      </header>

      <p className="mb-3 text-sm leading-relaxed text-text-body">{description}</p>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <span
            key={s}
            className="rounded-md bg-server-rail px-2 py-0.5 text-[11px] font-medium text-text-muted"
          >
            {s}
          </span>
        ))}
      </div>

      {highlight && highlight !== project.highlightKey && (
        <div className="mb-2 flex items-center gap-1.5 text-xs text-text-faint">
          <span aria-hidden>✨</span>
          <span className="italic">{highlight}</span>
        </div>
      )}

      <footer className="flex items-center gap-1.5 overflow-hidden border-t border-border pt-2 text-xs text-text-dim">
        <GithubLogo size={14} className="shrink-0" />
        <code className="truncate font-mono">{project.path}</code>
      </footer>
    </motion.article>
  )
}
