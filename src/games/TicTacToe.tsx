import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { useT } from '../i18n/LocaleContext'

type Cell = 'X' | 'O' | null

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function getWinner(b: Cell[]): { line: number[]; player: 'X' | 'O' } | null {
  for (const line of LINES) {
    const [a, b1, c] = line
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) return { line, player: b[a] as 'X' | 'O' }
  }
  return null
}

// Minimax AI (unbeatable)
function aiMove(board: Cell[]): number {
  const empty = board.map((c, i) => (c === null ? i : -1)).filter((i) => i >= 0)
  if (empty.length === 0) return -1
  if (empty.length === 9) return 4 // center first

  let bestScore = -Infinity
  let bestMove = empty[0]
  for (const i of empty) {
    board[i] = 'O'
    const score = minimax(board, 0, false)
    board[i] = null
    if (score > bestScore) {
      bestScore = score
      bestMove = i
    }
  }
  return bestMove
}

function minimax(board: Cell[], depth: number, isMax: boolean): number {
  const w = getWinner(board)
  if (w) return w.player === 'O' ? 10 - depth : depth - 10
  if (board.every((c) => c !== null)) return 0

  const empty = board.map((c, i) => (c === null ? i : -1)).filter((i) => i >= 0)
  if (isMax) {
    let best = -Infinity
    for (const i of empty) {
      board[i] = 'O'
      best = Math.max(best, minimax(board, depth + 1, false))
      board[i] = null
    }
    return best
  } else {
    let best = Infinity
    for (const i of empty) {
      board[i] = 'X'
      best = Math.min(best, minimax(board, depth + 1, true))
      board[i] = null
    }
    return best
  }
}

function randomMove(board: Cell[]): number {
  const empty = board.map((c, i) => (c === null ? i : -1)).filter((i) => i >= 0)
  return empty[Math.floor(Math.random() * empty.length)]
}

export default function TicTacToe() {
  const { t } = useT()
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null))
  const [diff, setDiff] = useState<'easy' | 'hard'>('hard')
  const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0 })
  const [winner, setWinner] = useState<{ line: number[]; player: 'X' | 'O' } | null>(null)
  const [turn, setTurn] = useState<'X' | 'O'>('X')
  const [animating, setAnimating] = useState(-1)
  const aiTimeout = useRef<number | null>(null)

  const reset = (d: 'easy' | 'hard' = diff) => {
    setBoard(Array(9).fill(null))
    setWinner(null)
    setTurn('X')
    setAnimating(-1)
    if (aiTimeout.current) {
      window.clearTimeout(aiTimeout.current)
      aiTimeout.current = null
    }
    if (d === 'easy' && Math.random() > 0.5) {
      aiTimeout.current = window.setTimeout(() => makeAiMove(Array(9).fill(null)), 300)
    }
  }

  const makeAiMove = (b: Cell[]) => {
    const move = diff === 'hard' ? aiMove([...b]) : randomMove([...b])
    if (move < 0) return
    setAnimating(move)
    setTimeout(() => {
      setBoard((prev) => {
        const next = [...prev]
        next[move] = 'O'
        const w = getWinner(next)
        if (w) {
          setWinner(w)
          setScore((s) => ({ ...s, losses: s.losses + 1 }))
        } else if (next.every((c) => c !== null)) {
          setScore((s) => ({ ...s, draws: s.draws + 1 }))
        }
        return next
      })
      setTurn('X')
      setAnimating(-1)
    }, 350)
  }

  const handleClick = (i: number) => {
    if (board[i] || winner || turn !== 'X') return
    const next = [...board]
    next[i] = 'X'
    setBoard(next)
    setAnimating(i)
    setTimeout(() => setAnimating(-1), 200)

    const w = getWinner(next)
    if (w) {
      setWinner(w)
      setScore((s) => ({ ...s, wins: s.wins + 1 }))
      return
    }
    if (next.every((c) => c !== null)) {
      setScore((s) => ({ ...s, draws: s.draws + 1 }))
      return
    }
    setTurn('O')
    aiTimeout.current = window.setTimeout(() => makeAiMove(next), 350)
  }

  useEffect(() => {
    return () => {
      if (aiTimeout.current) window.clearTimeout(aiTimeout.current)
    }
  }, [])

  const isDraw = !winner && board.every((c) => c !== null)
  const status = winner ? winner.player === 'X' ? 'won' : 'lost' : isDraw ? 'draw' : 'playing'

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Header */}
      <div className="flex w-full max-w-md items-center gap-2">
        <div className="flex gap-1 rounded-lg border border-border bg-channel-sidebar p-1">
          <button
            onClick={() => { setDiff('easy'); reset('easy') }}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              diff === 'easy' ? 'bg-blurple text-white' : 'text-text-muted hover:text-white'
            }`}
            type="button"
          >
            {t('ttt.easy')}
          </button>
          <button
            onClick={() => { setDiff('hard'); reset('hard') }}
            className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
              diff === 'hard' ? 'bg-blurple text-white' : 'text-text-muted hover:text-white'
            }`}
            type="button"
          >
            {t('ttt.hard')}
          </button>
        </div>
        <button
          onClick={() => reset()}
          className="ml-auto rounded-lg border border-border bg-channel-sidebar px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-hover hover:text-white"
          type="button"
        >
          ↻ {t('ttt.reset')}
        </button>
      </div>

      {/* Score */}
      <div className="flex w-full max-w-md gap-2 text-center text-xs">
        <div className="flex-1 rounded-lg border border-online/30 bg-online/10 px-3 py-2">
          <div className="font-bold text-online">{score.wins}</div>
          <div className="text-[10px] uppercase tracking-wider text-text-muted">{t('ttt.wins')}</div>
        </div>
        <div className="flex-1 rounded-lg border border-text-dim/30 bg-channel-sidebar px-3 py-2">
          <div className="font-bold text-text-body">{score.draws}</div>
          <div className="text-[10px] uppercase tracking-wider text-text-muted">{t('ttt.draws')}</div>
        </div>
        <div className="flex-1 rounded-lg border border-dnd/30 bg-dnd/10 px-3 py-2">
          <div className="font-bold text-dnd">{score.losses}</div>
          <div className="text-[10px] uppercase tracking-wider text-text-muted">{t('ttt.losses')}</div>
        </div>
      </div>

      {/* Board */}
      <div className="relative rounded-xl border-2 border-border bg-server-rail p-3 shadow-2xl shadow-black/40">
        <div className="grid grid-cols-3 gap-2">
          {board.map((cell, i) => {
            const isWin = winner?.line.includes(i)
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleClick(i)}
                disabled={!!cell || !!winner || turn !== 'X'}
                className={`flex h-20 w-20 items-center justify-center rounded-lg border-2 bg-channel-sidebar text-4xl font-bold transition-all sm:h-24 sm:w-24 ${
                  cell === 'X' ? 'text-blurple' : cell === 'O' ? 'text-dnd' : 'border-border'
                } ${
                  isWin
                    ? cell === 'X'
                      ? 'border-blurple shadow-lg shadow-blurple/50 bg-blurple/20'
                      : 'border-dnd shadow-lg shadow-dnd/50 bg-dnd/20'
                    : 'hover:border-text-faint hover:bg-hover'
                }`}
                type="button"
              >
                {cell && (
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: animating === i ? 1.3 : 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  >
                    {cell}
                  </motion.span>
                )}
              </motion.button>
            )
          })}
        </div>

        {status !== 'playing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/70 backdrop-blur-sm"
          >
            {status === 'won' && (
              <>
                <div className="text-5xl">🎉</div>
                <h2 className="text-2xl font-bold text-blurple">{t('ttt.youWin')}</h2>
              </>
            )}
            {status === 'lost' && (
              <>
                <div className="text-5xl">🤖</div>
                <h2 className="text-2xl font-bold text-dnd">{t('ttt.youLose')}</h2>
              </>
            )}
            {status === 'draw' && (
              <>
                <div className="text-5xl">🤝</div>
                <h2 className="text-2xl font-bold text-text-primary">{t('ttt.draw')}</h2>
              </>
            )}
            <button onClick={() => reset()} className="btn-blurple px-8 py-2.5" type="button">
              ↻ {t('ttt.playAgain')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
