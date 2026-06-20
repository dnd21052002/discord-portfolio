import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useT } from '../i18n/LocaleContext'
import { getSudoku } from 'sudoku-gen'

type Difficulty = 'easy' | 'medium' | 'hard'
type Cell = number | null
type Board = Cell[] // length 81
type Status = 'playing' | 'won' | 'over'

const MAX_MISTAKES = 3

// ── Board helpers ──
const row = (i: number) => Math.floor(i / 9)
const col = (i: number) => i % 9
const box = (i: number) => Math.floor(row(i) / 3) * 3 + Math.floor(col(i) / 3)

function emptyBoard(): Board {
  return Array(81).fill(null)
}

// Convert sudoku-gen's 81-char string ("41--75----...") to Board
function fromString(s: string): Board {
  const out: Board = Array(81).fill(null)
  for (let i = 0; i < 81; i++) {
    const ch = s[i]
    out[i] = ch >= '1' && ch <= '9' ? Number(ch) : null
  }
  return out
}

// ── Conflict detection ──
function hasConflict(board: Board, idx: number): boolean {
  const v = board[idx]
  if (v === null) return false
  const r = row(idx), c = col(idx)
  for (let i = 0; i < 81; i++) {
    if (i === idx) continue
    if (board[i] === v) {
      if (row(i) === r || col(i) === c) return true
    }
  }
  const br = Math.floor(r / 3) * 3
  const bc = Math.floor(c / 3) * 3
  for (let dr = 0; dr < 3; dr++) {
    for (let dc = 0; dc < 3; dc++) {
      const j = (br + dr) * 9 + (bc + dc)
      if (j !== idx && board[j] === v) return true
    }
  }
  return false
}

function isCompleteAndValid(board: Board): boolean {
  for (let i = 0; i < 81; i++) {
    if (board[i] === null) return false
    if (hasConflict(board, i)) return false
  }
  return true
}

type Puzzle = { puzzle: Board; solution: Board }

function makePuzzle(diff: Difficulty): Puzzle {
  const s = getSudoku(diff)
  return {
    puzzle: fromString(s.puzzle),
    solution: fromString(s.solution),
  }
}

// ── Component ──

// ── Component ──
export default function Sudoku() {
  const { t } = useT()
  const [diff, setDiff] = useState<Difficulty>('easy')
  const [puzzleData, setPuzzleData] = useState<Puzzle | null>(null)
  const [board, setBoard] = useState<Board>(emptyBoard())
  const [selected, setSelected] = useState<number | null>(null)
  const [mistakes, setMistakes] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [status, setStatus] = useState<Status>('playing')
  const [giveUp, setGiveUp] = useState(false)
  const tickRef = useRef<number | null>(null)

  const newGame = useCallback((d: Difficulty = diff) => {
    const p = makePuzzle(d)
    setPuzzleData(p)
    setBoard([...p.puzzle])
    setSelected(null)
    setMistakes(0)
    setElapsed(0)
    setStatus('playing')
    setGiveUp(false)
  }, [diff])

  useEffect(() => { newGame('easy') }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Timer
  useEffect(() => {
    if (status !== 'playing') {
      if (tickRef.current) window.clearInterval(tickRef.current)
      return
    }
    tickRef.current = window.setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current)
    }
  }, [status])

  // Win check
  useEffect(() => {
    if (status !== 'playing' || giveUp) return
    if (puzzleData && isCompleteAndValid(board)) {
      setStatus('won')
    }
  }, [board, status, giveUp, puzzleData])

  const placeDigit = useCallback((n: number) => {
    if (status !== 'playing' || giveUp) return
    if (selected === null) return
    if (puzzleData?.puzzle[selected] !== null) return
    setBoard((prev) => {
      const next = [...prev]
      if (next[selected] === n) return prev
      next[selected] = n
      return next
    })
  }, [selected, status, giveUp, puzzleData])

  const clearCell = useCallback(() => {
    if (status !== 'playing' || giveUp) return
    if (selected === null) return
    if (puzzleData?.puzzle[selected] !== null) return
    setBoard((prev) => {
      if (prev[selected] === null) return prev
      const next = [...prev]
      next[selected] = null
      return next
    })
  }, [selected, status, giveUp, puzzleData])

  useEffect(() => {
    if (status !== 'playing' || giveUp || !puzzleData) return
    const current = board.filter((_, i) => board[i] !== null && hasConflict(board, i)).length
    if (current > mistakes) setMistakes(current)
  }, [board, mistakes, status, giveUp, puzzleData])

  useEffect(() => {
    if (mistakes >= MAX_MISTAKES && status === 'playing') setStatus('over')
  }, [mistakes, status])

  // Keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (status !== 'playing' || giveUp) return
      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault()
        placeDigit(Number(e.key))
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        e.preventDefault()
        clearCell()
      } else if (e.key.startsWith('Arrow') && selected !== null) {
        e.preventDefault()
        const r = row(selected), c = col(selected)
        let nr = r, nc = c
        if (e.key === 'ArrowUp') nr = Math.max(0, r - 1)
        else if (e.key === 'ArrowDown') nr = Math.min(8, r + 1)
        else if (e.key === 'ArrowLeft') nc = Math.max(0, c - 1)
        else if (e.key === 'ArrowRight') nc = Math.min(8, c + 1)
        setSelected(nr * 9 + nc)
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [status, giveUp, selected, placeDigit, clearCell])

  const onReset = () => {
    if (!puzzleData) return
    setBoard([...puzzleData.puzzle])
    setSelected(null)
    setMistakes(0)
    setElapsed(0)
    setStatus('playing')
    setGiveUp(false)
  }

  const changeDifficulty = (d: Difficulty) => {
    setDiff(d)
    newGame(d)
  }

  // Derived: highlight set
  const highlights = useMemo(() => {
    if (selected === null) return new Set<number>()
    const r = row(selected), c = col(selected), b = box(selected)
    const s = new Set<number>()
    for (let i = 0; i < 81; i++) {
      if (row(i) === r || col(i) === c || box(i) === b) s.add(i)
    }
    return s
  }, [selected])

  // Number remaining for each digit (for the pad)
  const remaining = useMemo(() => {
    if (!puzzleData) return {} as Record<number, number>
    const c = digitCounts(board)
    const out: Record<number, number> = {}
    for (let n = 1; n <= 9; n++) out[n] = 9 - c[n]
    return out
  }, [board, puzzleData])

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')

  const displayBoard = giveUp && puzzleData ? puzzleData.solution : board

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Top bar — difficulty + actions */}
      <div className="flex w-full max-w-md flex-wrap items-center gap-2">
        <div className="flex gap-1 rounded-lg border border-border bg-channel-sidebar p-1">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => changeDifficulty(d)}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                diff === d ? 'bg-blurple text-white' : 'text-text-muted hover:text-white'
              }`}
              type="button"
            >
              {t(`sudoku.${d}`)}
            </button>
          ))}
        </div>
        <button
          onClick={() => newGame()}
          className="ml-auto rounded-lg border border-border bg-channel-sidebar px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-hover hover:text-white"
          type="button"
        >
          ↻ {t('sudoku.newGame')}
        </button>
      </div>

      {/* Stats — time / mistakes / difficulty */}
      <div className="flex w-full max-w-md gap-2 text-center text-xs">
        <div className="flex-1 rounded-lg border border-border bg-channel-sidebar px-3 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-dim">
            {t('sudoku.time')}
          </div>
          <div className="text-xl font-bold tabular-nums text-text-primary">{mm}:{ss}</div>
        </div>
        <div className="flex-1 rounded-lg border border-border bg-channel-sidebar px-3 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-dim">
            {t('sudoku.mistakes')}
          </div>
          <div className={`text-xl font-bold tabular-nums ${mistakes > 0 ? 'text-dnd' : 'text-text-primary'}`}>
            {mistakes}/{MAX_MISTAKES}
          </div>
        </div>
        <div className="flex-1 rounded-lg border border-border bg-channel-sidebar px-3 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-dim">
            {t('sudoku.difficulty')}
          </div>
          <div className="text-xl font-bold text-emerald-400">{t(`sudoku.${diff}`)}</div>
        </div>
      </div>

      {/* Board */}
      <div className="relative w-full max-w-md">
        <div
          className="relative rounded-xl border-2 border-blurple/40 bg-server-rail p-2 shadow-2xl shadow-black/40"
          style={{ aspectRatio: '1 / 1' }}
        >
          {/* 9×9 grid — each cell has its own border for clear separation */}
          <div className="relative h-full w-full overflow-hidden rounded-md bg-channel-sidebar/50">
            <div className="grid h-full w-full grid-cols-9">
              {displayBoard.map((cell, i) => {
                const r = row(i), c = col(i)
                const isSelected = selected === i
                const isHighlighted = highlights.has(i)
                const isGiven = puzzleData?.puzzle[i] !== null
                const conflict = cell !== null && hasConflict(displayBoard, i)
                const gaveUpHere = giveUp && cell !== null && puzzleData?.solution[i] !== cell
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    type="button"
                    className={`relative flex items-center justify-center ${c < 8 ? 'border-r' : ''} ${r < 8 ? 'border-b' : ''} border-channel-sidebar/60 text-base font-semibold transition-colors sm:text-lg ${
                      conflict
                        ? '!bg-dnd/30 !text-dnd'
                        : isSelected
                          ? 'bg-blurple/40'
                          : isHighlighted
                            ? 'bg-blurple/15'
                            : 'bg-server-rail hover:bg-hover'
                    } ${isGiven ? 'text-text-primary font-bold' : 'text-blurple'} ${
                      conflict ? '!text-dnd' : ''
                    } ${gaveUpHere ? 'text-text-dim' : ''}`}
                    style={{ aspectRatio: '1 / 1' }}
                  >
                    <AnimatePresence mode="popLayout">
                      {cell !== null && (
                        <motion.span
                          key={`${i}-${cell}-${giveUp ? 'g' : 'n'}`}
                          initial={{ scale: 0.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          className="leading-none"
                        >
                          {cell}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                )
              })}
            </div>

            {/* Thick 3×3 box borders — overlay lines for clear separation */}
            <div className="pointer-events-none absolute inset-0">
              {/* Outer border accent (slightly thicker) */}
              <div className="absolute inset-0 rounded-md ring-2 ring-blurple/50" />
              {/* Vertical thick lines at column 3 and 6 (after the cell gap) */}
              <div className="absolute left-[33.333%] top-0 h-full w-[3px] -translate-x-1/2 bg-blurple/70" />
              <div className="absolute left-[66.666%] top-0 h-full w-[3px] -translate-x-1/2 bg-blurple/70" />
              {/* Horizontal thick lines at row 3 and 6 */}
              <div className="absolute top-[33.333%] left-0 h-[3px] w-full -translate-y-1/2 bg-blurple/70" />
              <div className="absolute top-[66.666%] left-0 h-[3px] w-full -translate-y-1/2 bg-blurple/70" />
            </div>
          </div>

          {/* Win / Game-over overlay */}
          <AnimatePresence>
            {status !== 'playing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/70 backdrop-blur-sm"
              >
                {status === 'won' ? (
                  <>
                    <div className="text-5xl">🎉</div>
                    <h2 className="text-2xl font-bold text-emerald-400">{t('sudoku.youWin')}</h2>
                    <p className="text-sm text-text-muted">
                      {t('sudoku.time')}: <span className="font-bold text-text-primary">{mm}:{ss}</span>
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl">{giveUp ? '🏳️' : '💀'}</div>
                    <h2 className="text-2xl font-bold text-dnd">{giveUp ? t('sudoku.giveUp') : t('sudoku.gameOver')}</h2>
                  </>
                )}
                <div className="mt-2 flex gap-2">
                  <button onClick={() => newGame()} className="btn-blurple px-6 py-2" type="button">
                    ↻ {t('sudoku.newGame')}
                  </button>
                  {status === 'over' && !giveUp && (
                    <button onClick={onReset} className="rounded-md border border-border bg-channel-sidebar px-6 py-2 text-sm font-medium text-text-body transition-colors hover:bg-hover" type="button">
                      ↻ {t('sudoku.retry')}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Number pad */}
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
          const left = remaining[n] ?? 0
          const done = left === 0
          return (
            <button
              key={n}
              onClick={() => placeDigit(n)}
              disabled={done || status !== 'playing' || giveUp}
              className={`relative flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition-colors sm:h-12 sm:w-12 sm:text-base ${
                done
                  ? 'border-border bg-channel-sidebar/30 text-text-dim opacity-50'
                  : 'border-border bg-channel-sidebar text-blurple hover:border-blurple hover:bg-blurple/10'
              }`}
              type="button"
            >
              {n}
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-server-rail text-[9px] text-text-dim">
                {left}
              </span>
            </button>
          )
        })}
        <button
          onClick={clearCell}
          disabled={status !== 'playing' || giveUp || selected === null}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-channel-sidebar text-base text-text-muted transition-colors hover:bg-hover hover:text-text-body disabled:opacity-50 sm:h-12 sm:w-12"
          type="button"
        >
          ⌫
        </button>
      </div>
    </div>
  )
}

// Helper used in remaining
function digitCounts(board: Board): Record<number, number> {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 }
  for (const v of board) if (v !== null) counts[v]++
  return counts
}