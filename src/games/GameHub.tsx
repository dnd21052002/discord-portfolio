import { motion } from 'motion/react'
import { SnakeIcon, TicTacToeIcon, MemoryIcon, Game2048Icon, SudokuIcon, PlayIcon } from './GameIcons'
import { useT } from '../i18n/LocaleContext'

export type GameId = 'snake' | 'tictactoe' | 'memory' | '2048' | 'sudoku'

export type GameMeta = {
  id: GameId
  titleKey: string
  descKey: string
  emoji: string
  Icon: React.FC<{ size?: number }>
  gradient: string // tailwind gradient classes
  accent: string // tailwind text color class
}

const GAMES: GameMeta[] = [
  {
    id: 'snake',
    titleKey: 'gamehub.snake.title',
    descKey: 'gamehub.snake.desc',
    emoji: '🐍',
    Icon: SnakeIcon,
    gradient: 'from-blurple/30 via-blurple/10 to-transparent',
    accent: 'text-blurple',
  },
  {
    id: 'tictactoe',
    titleKey: 'gamehub.tictactoe.title',
    descKey: 'gamehub.tictactoe.desc',
    emoji: '⭕',
    Icon: TicTacToeIcon,
    gradient: 'from-dnd/30 via-dnd/10 to-transparent',
    accent: 'text-dnd',
  },
  {
    id: 'memory',
    titleKey: 'gamehub.memory.title',
    descKey: 'gamehub.memory.desc',
    emoji: '🧠',
    Icon: MemoryIcon,
    gradient: 'from-online/30 via-online/10 to-transparent',
    accent: 'text-online',
  },
  {
    id: '2048',
    titleKey: 'gamehub.2048.title',
    descKey: 'gamehub.2048.desc',
    emoji: '🔢',
    Icon: Game2048Icon,
    gradient: 'from-yellow-500/30 via-yellow-500/10 to-transparent',
    accent: 'text-yellow-400',
  },
  {
    id: 'sudoku',
    titleKey: 'gamehub.sudoku.title',
    descKey: 'gamehub.sudoku.desc',
    emoji: '🧩',
    Icon: SudokuIcon,
    gradient: 'from-emerald-500/30 via-emerald-500/10 to-transparent',
    accent: 'text-emerald-400',
  },
]

export function GameHub({ onSelect }: { onSelect: (id: GameId) => void }) {
  const { t } = useT()

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className="overflow-hidden rounded-xl border border-border bg-channel-sidebar">
        <div className="relative bg-gradient-to-br from-blurple/20 via-blurple/5 to-transparent p-6 sm:p-8">
          <div className="absolute -right-8 -top-8 text-[120px] opacity-10 sm:text-[180px]">
            🎮
          </div>
          <div className="relative">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blurple/40 bg-blurple/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blurple">
              <PlayIcon size={12} weight="fill" />
              {t('gamehub.aria')}
            </div>
            <h1 className="mb-2 text-2xl font-bold text-text-primary sm:text-3xl">
              {t('gamehub.title')}
            </h1>
            <p className="max-w-xl text-sm text-text-muted sm:text-base">
              {t('gamehub.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Games grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {GAMES.map((game, i) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(game.id)}
            className="group relative overflow-hidden rounded-xl border border-border bg-channel-sidebar p-5 text-left transition-colors hover:border-blurple/50"
            type="button"
          >
            {/* Background gradient overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-50 transition-opacity group-hover:opacity-100`}
            />

            <div className="relative flex items-start gap-4">
              {/* Icon */}
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-server-rail ${game.accent}`}
              >
                <game.Icon size={28} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xl">{game.emoji}</span>
                  <h3 className="text-base font-bold text-text-primary sm:text-lg">
                    {t(game.titleKey)}
                  </h3>
                </div>
                <p className="mb-3 text-xs text-text-muted sm:text-sm">
                  {t(game.descKey)}
                </p>

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-md bg-server-rail/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-dim">
                    {t('gamehub.tapToPlay')}
                  </span>
                  <span className={`text-lg ${game.accent} transition-transform group-hover:translate-x-1`}>
                    →
                  </span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Footer hint */}
      <div className="text-center text-xs text-text-dim">
        {t('gamehub.tip')}
      </div>
    </div>
  )
}
