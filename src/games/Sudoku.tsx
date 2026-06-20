import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useT } from '../i18n/LocaleContext'

type Difficulty = 'easy' | 'medium' | 'hard'
type Cell = number | null
type Board = Cell[] // length 81
type Status = 'playing' | 'won' | 'over'

// Minimum empties per digit (1-9) by difficulty.
// Easy:   every digit must have ≥ 4 empty cells → max 5 givens per digit
// Medium: every digit must have ≥ 5 empty cells → max 4 givens per digit
// Hard:   every digit must have ≥ 6 empty cells → max 3 givens per digit
const MIN_EMPTIES_PER_DIGIT: Record<Difficulty, number> = {
  easy: 4,
  medium: 5,
  hard: 6,
}
// Target total givens per puzzle (lower bound = harder).
// Below this, carving stops even if more cells could be removed.
// This prevents puzzles that are trivially easy because too many
// cells were stripped (still unique solution, but no challenge).
const TARGET_TOTAL_GIVENS: Record<Difficulty, number> = {
  easy: 40,   // ~41 empties — comfortable
  medium: 32, // ~49 empties — moderate
  hard: 26,   // ~55 empties — challenging
}
const MAX_MISTAKES = 3

// ── Seeded RNG (mulberry32) — keeps generator deterministic per seed ──
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ── Board helpers ──
const row = (i: number) => Math.floor(i / 9)
const col = (i: number) => i % 9
const box = (i: number) => Math.floor(row(i) / 3) * 3 + Math.floor(col(i) / 3)

function emptyBoard(): Board {
  return Array(81).fill(null)
}

function isValidPlacement(board: Board, idx: number, n: number): boolean {
  const r = row(idx), c = col(idx)
  for (let i = 0; i < 9; i++) {
    if (i !== idx && board[i] === n) {
      const ri = row(i), ci = col(i)
      if (ri === r || ci === c) return false
    }
  }
  // 3x3 box
  const br = Math.floor(r / 3) * 3
  const bc = Math.floor(c / 3) * 3
  for (let dr = 0; dr < 3; dr++) {
    for (let dc = 0; dc < 3; dc++) {
      const j = (br + dr) * 9 + (bc + dc)
      if (j !== idx && board[j] === n) return false
    }
  }
  return true
}

// ── Backtracking solver — counts solutions up to `cap` ──
function countSolutions(board: Board, cap = 2): number {
  const empty: number[] = []
  for (let i = 0; i < 81; i++) if (board[i] === null) empty.push(i)
  let count = 0

  const solve = (k: number): boolean => {
    if (count >= cap) return true
    if (k >= empty.length) {
      count++
      return count >= cap
    }
    const idx = empty[k]
    for (let n = 1; n <= 9; n++) {
      if (isValidPlacement(board, idx, n)) {
        board[idx] = n
        if (solve(k + 1)) return true
        board[idx] = null
      }
    }
    return false
  }
  solve(0)
  return count
}

// ── Generate a full solved board ──
function generateSolved(rng: () => number): Board {
  const board = emptyBoard()
  const order = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }

  const fill = (idx: number): boolean => {
    if (idx >= 81) return true
    if (board[idx] !== null) return fill(idx + 1)
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    for (let i = digits.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[digits[i], digits[j]] = [digits[j], digits[i]]
    }
    for (const n of digits) {
      if (isValidPlacement(board, idx, n)) {
        board[idx] = n
        if (fill(idx + 1)) return true
        board[idx] = null
      }
    }
    return false
  }
  fill(0)
  return board
}

// ── Count occurrences of each digit in puzzle ──
function countDigits(board: Board): number[] {
  const c = [0, 0, 0, 0, 0, 0, 0, 0, 0] // index 0 unused, index d-1 = count of digit d
  for (const v of board) if (v !== null && v >= 1 && v <= 9) c[v - 1]++
  return c
}

// ── Carve a puzzle by removing cells symmetrically; enforce per-digit min empties
// and a total givens lower bound (stop carving early if puzzle already hard enough) ──
function carvePuzzle(
  solved: Board,
  minEmptiesPerDigit: number,
  targetTotalGivens: number,
  rng: () => number,
): Board {
  const puzzle = [...solved]
  let givensPerDigit = countDigits(puzzle) // start with 9 givens per digit

  const positions = Array.from({ length: 81 }, (_, i) => i)
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[positions[i], positions[j]] = [positions[j], positions[i]]
  }

  // Helper: check whether we may still remove a cell with this digit.
  const mayRemoveDigit = (d: number): boolean => {
    return givensPerDigit[d - 1] > 9 - minEmptiesPerDigit
  }

  // Helper: total remaining givens
  const totalGivens = (): number => {
    let c = 0
    for (const v of puzzle) if (v !== null) c++
    return c
  }

  for (const i of positions) {
    // Early stop: already at the target givens count — puzzle hard enough
    if (totalGivens() <= targetTotalGivens) break

    const digit = puzzle[i]
    if (digit === null) continue
    if (!mayRemoveDigit(digit)) continue

    const mirror = 80 - i
    let pair: number[]
    if (i === mirror) {
      pair = [i]
    } else {
      const mirrorDigit = puzzle[mirror]
      if (mirrorDigit === null) continue
      // IMPORTANT: enforce constraint for BOTH digits in the pair
      if (!mayRemoveDigit(digit)) continue
      if (!mayRemoveDigit(mirrorDigit)) continue
      pair = [i, mirror]
    }

    const backup = pair.map((p) => puzzle[p])
    pair.forEach((p) => {
      if (puzzle[p] !== null) {
        givensPerDigit[puzzle[p]! - 1]--
      }
      puzzle[p] = null
    })

    const copy = [...puzzle]
    const solCount = countSolutions(copy, 2)
    if (solCount !== 1) {
      // Restore values + counts
      pair.forEach((p, k) => {
        puzzle[p] = backup[k]
        if (backup[k] !== null) {
          givensPerDigit[backup[k]! - 1]++
        }
      })
    }
  }
  return puzzle
}

// ── Conflict detection: returns true if the cell value conflicts with peers ──
function hasConflict(board: Board, idx: number): boolean {
  const v = board[idx]
  if (v === null) return false
  const r = row(idx), c = col(idx)
  for (let i = 0; i < 9; i++) {
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
  const seed = Date.now() + Math.floor(Math.random() * 1e9)
  const rng = mulberry32(seed)
  const solution = generateSolved(rng)
  // Retry a few times if carving fails to reach the digit-empties target.
  let best: { puzzle: Board; solution: Board } | null = null
  for (let attempt = 0; attempt < 3; attempt++) {
    const carved = carvePuzzle(
      solution,
      MIN_EMPTIES_PER_DIGIT[diff],
      TARGET_TOTAL_GIVENS[diff],
      rng,
    )
    // Defensive verification — givens MUST be valid (subset of valid solution).
    if (validateGivens(carved, solution)) {
      best = { puzzle: carved, solution }
      break
    }
  }
  if (!best) {
    best = {
      puzzle: carvePuzzle(
        solution,
        MIN_EMPTIES_PER_DIGIT[diff],
        TARGET_TOTAL_GIVENS[diff],
        rng,
      ),
      solution,
    }
  }
  // Log actual stats for debugging difficulty calibration.
  if (typeof window !== 'undefined' && (window as any).__sudokuDebug) {
    const empties = best.puzzle.filter((c) => c === null).length
    const counts = countDigits(best.puzzle)
    console.log(
      `[sudoku ${diff}] givens=${81 - empties} empties=${empties} perDigit=${counts
        .map((c, i) => `${i + 1}:${9 - c}`)
        .join(' ')}`,
    )
  }
  return best
}

function validateGivens(puzzle: Board, solution: Board): boolean {
  // 1. Every non-null cell must match the solution.
  for (let i = 0; i < 81; i++) {
    if (puzzle[i] !== null && puzzle[i] !== solution[i]) return false
  }
  // 2. No two givens in the same row/col/box may hold the same digit.
  for (let i = 0; i < 81; i++) {
    if (puzzle[i] === null) continue
    for (let j = i + 1; j < 81; j++) {
      if (puzzle[j] === null) continue
      if (puzzle[i] === puzzle[j]) {
        if (row(i) === row(j) || col(i) === col(j) || box(i) === box(j)) return false
      }
    }
  }
  return true
}

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
          {/* 9×9 grid with thin separator between cells (1px) */}
          <div className="relative h-full w-full overflow-hidden rounded-md bg-border">
            <div className="grid h-full w-full grid-cols-9 gap-px">
              {displayBoard.map((cell, i) => {
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
                    className={`relative flex items-center justify-center text-base font-semibold transition-colors sm:text-lg ${
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