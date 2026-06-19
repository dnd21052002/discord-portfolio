import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { useT } from '../i18n/LocaleContext'

const EMOJIS = ['🎮', '🚀', '🛸', '🎯', '🎨', '📸', '🎵', '⚡']

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type Card = { id: number; emoji: string; matched: boolean; flipped: boolean }

export default function MemoryMatch() {
  const { t } = useT()
  const [cards, setCards] = useState<Card[]>([])
  const [moves, setMoves] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [won, setWon] = useState(false)
  const [bestMoves, setBestMoves] = useState(() => Number(localStorage.getItem('memory-moves') || 0))
  const [flipped, setFlipped] = useState<number[]>([])
  const lockRef = useRef(false)
  const tickRef = useRef<number | null>(null)

  const start = () => {
    const deck: Card[] = shuffle([...EMOJIS, ...EMOJIS]).map((e, i) => ({
      id: i, emoji: e, matched: false, flipped: false,
    }))
    setCards(deck)
    setMoves(0)
    setElapsed(0)
    setWon(false)
    setFlipped([])
    setRunning(true)
    lockRef.current = false
  }

  // Timer
  useEffect(() => {
    if (!running) return
    tickRef.current = window.setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current)
    }
  }, [running])

  // Match check
  useEffect(() => {
    if (flipped.length !== 2) return
    lockRef.current = true
    setMoves((m) => m + 1)
    const [a, b] = flipped
    if (cards[a]?.emoji === cards[b]?.emoji) {
      setTimeout(() => {
        setCards((cs) => cs.map((c) => (c.id === a || c.id === b ? { ...c, matched: true, flipped: true } : c)))
        setFlipped([])
        lockRef.current = false
        // Win check
        if (cards.every((c) => c.matched || c.id === a || c.id === b)) {
          setTimeout(() => {
            setWon(true)
            setRunning(false)
            if (moves + 1 < bestMoves || bestMoves === 0) {
              setBestMoves(moves + 1)
              localStorage.setItem('memory-moves', String(moves + 1))
            }
          }, 400)
        }
      }, 400)
    } else {
      setTimeout(() => {
        setCards((cs) => cs.map((c) => (c.id === a || c.id === b ? { ...c, flipped: false } : c)))
        setFlipped([])
        lockRef.current = false
      }, 800)
    }
  }, [flipped, cards, moves, bestMoves])

  const handleClick = (i: number) => {
    if (lockRef.current || cards[i].flipped || cards[i].matched) return
    setCards((cs) => cs.map((c) => (c.id === i ? { ...c, flipped: true } : c)))
    setFlipped((f) => [...f, i])
  }

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Stats */}
      <div className="flex w-full max-w-md gap-3">
        <div className="flex-1 rounded-lg border border-border bg-channel-sidebar px-3 py-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-dim">{t('memory.moves')}</div>
          <div className="text-2xl font-bold tabular-nums text-text-primary">{moves}</div>
        </div>
        <div className="flex-1 rounded-lg border border-border bg-channel-sidebar px-3 py-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-dim">{t('memory.time')}</div>
          <div className="text-2xl font-bold tabular-nums text-blurple">{mm}:{ss}</div>
        </div>
        <div className="flex-1 rounded-lg border border-border bg-channel-sidebar px-3 py-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-dim">{t('memory.best')}</div>
          <div className="text-2xl font-bold tabular-nums text-online">{bestMoves || '—'}</div>
        </div>
      </div>

      {/* Board */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {cards.length === 0 ? (
          <div className="col-span-4 flex h-72 flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-channel-sidebar/30 px-6 text-center">
            <div className="text-5xl">🧠</div>
            <h2 className="text-xl font-bold text-text-primary">{t('memory.title')}</h2>
            <p className="max-w-xs text-sm text-text-muted">{t('memory.subtitle')}</p>
            <button onClick={start} className="btn-blurple px-8 py-2.5" type="button">
              ▶ {t('memory.start')}
            </button>
          </div>
        ) : (
          cards.map((c) => (
            <CardView key={c.id} card={c} onClick={() => handleClick(c.id)} />
          ))
        )}
      </div>

      {won && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <div className="rounded-2xl border border-border bg-channel-sidebar p-8 text-center shadow-2xl">
            <div className="mb-3 text-6xl">🏆</div>
            <h2 className="mb-2 text-2xl font-bold text-online">{t('memory.won')}</h2>
            <p className="mb-1 text-text-muted">
              {t('memory.moves')}: <span className="font-bold text-text-primary">{moves}</span> ·{' '}
              {t('memory.time')}: <span className="font-bold text-blurple">{mm}:{ss}</span>
            </p>
            <button onClick={start} className="btn-blurple mt-4 px-8 py-2.5" type="button">
              ↻ {t('memory.playAgain')}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function CardView({ card, onClick }: { card: Card; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={card.matched}
      type="button"
      className="group relative h-16 w-16 sm:h-20 sm:w-20"
      style={{ perspective: 600 }}
    >
      <motion.div
        animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front (back of card, hidden when flipped) */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg border-2 border-border bg-gradient-to-br from-blurple/30 to-blurple/5 text-2xl text-blurple transition-colors group-hover:border-blurple/50"
          style={{ backfaceVisibility: 'hidden' }}
        >
          ?
        </div>
        {/* Back (emoji, shown when flipped) */}
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-lg border-2 text-3xl sm:text-4xl ${
            card.matched
              ? 'border-online bg-online/20 shadow-lg shadow-online/30'
              : 'border-blurple bg-blurple/10'
          }`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {card.emoji}
        </div>
      </motion.div>
    </button>
  )
}
