import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useT } from '../i18n/LocaleContext'

type Tile = { value: number; id: number; mergedFrom?: [number, number]; isNew?: boolean }

const SIZE = 4
const COLORS: Record<number, string> = {
  2: 'bg-[#3a3c44] text-text-primary',
  4: 'bg-[#2f3136] text-text-primary',
  8: 'bg-blurple text-white',
  16: 'bg-blurple-hover text-white',
  32: 'bg-blurple-active text-white',
  64: 'bg-dnd text-white',
  128: 'bg-idle text-black',
  256: 'bg-online text-white',
  512: 'bg-[#00a8fc] text-white',
  1024: 'bg-[#e535ab] text-white',
  2048: 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-400/50',
  4096: 'bg-gradient-to-br from-red-500 to-purple-600 text-white',
  8192: 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white',
}

function emptyGrid(): (Tile | null)[][] {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(null))
}

function addRandom(grid: (Tile | null)[][]): (Tile | null)[][] {
  const empty: [number, number][] = []
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) if (!grid[r][c]) empty.push([r, c])
  if (empty.length === 0) return grid
  const [r, c] = empty[Math.floor(Math.random() * empty.length)]
  const value = Math.random() < 0.9 ? 2 : 4
  const next = grid.map((row) => [...row])
  next[r][c] = { value, id: Date.now() + Math.random(), isNew: true }
  return next
}

function initGrid(): (Tile | null)[][] {
  let g = emptyGrid()
  g = addRandom(g)
  g = addRandom(g)
  return g
}

function move(
  grid: (Tile | null)[][],
  dir: 'left' | 'right' | 'up' | 'down',
): { next: (Tile | null)[][]; score: number; moved: boolean } {
  const rotated = (g: (Tile | null)[][]) => {
    if (dir === 'left') return g
    if (dir === 'right') return g.map((row) => [...row].reverse()).reverse()
    if (dir === 'down') return g[0].map((_, c) => g.map((row) => row[c]))
    return g[0].map((_, c) => g.map((row) => row[c]).reverse())
  }

  const back = (g: (Tile | null)[][]) => {
    if (dir === 'left') return g
    if (dir === 'right') return g.reverse().map((row) => row.reverse())
    if (dir === 'down') return g[0].map((_, c) => g.map((row) => row[c]))
    return g.map((row) => row.slice().reverse())
  }

  const r = rotated(grid)
  let score = 0
  const merged = r.map((row) => {
    const filtered = row.filter((t): t is Tile => t !== null)
    const result: (Tile | null)[] = []
    for (let i = 0; i < filtered.length; i++) {
      if (i + 1 < filtered.length && filtered[i].value === filtered[i + 1].value) {
        const newVal = filtered[i].value * 2
        score += newVal
        result.push({ value: newVal, id: Date.now() + Math.random() + i, mergedFrom: [filtered[i].id, filtered[i + 1].id] })
        i++
      } else {
        result.push({ ...filtered[i], isNew: false })
      }
    }
    while (result.length < SIZE) result.push(null)
    return result
  })

  return { next: back(merged), score, moved: true }
}

function canMove(grid: (Tile | null)[][]): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!grid[r][c]) return true
      if (c < SIZE - 1 && grid[r][c]?.value === grid[r][c + 1]?.value) return true
      if (r < SIZE - 1 && grid[r][c]?.value === grid[r + 1][c]?.value) return true
    }
  }
  return false
}

export default function Game2048() {
  const { t } = useT()
  const [grid, setGrid] = useState<(Tile | null)[][]>(() => initGrid())
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(() => Number(localStorage.getItem('2048-best') || 0))
  const [over, setOver] = useState(false)
  const [won, setWon] = useState(false)
  const [continuePlay, setContinuePlay] = useState(false)
  const startRef = useRef(grid)

  const newGame = () => {
    const g = initGrid()
    setGrid(g)
    startRef.current = g
    setScore(0)
    setOver(false)
    setWon(false)
    setContinuePlay(false)
  }

  const makeMove = useCallback(
    (dir: 'left' | 'right' | 'up' | 'down') => {
      if (over || (won && !continuePlay)) return
      setGrid((prev) => {
        const { next, score: gained, moved } = move(prev, dir)
        if (!moved) return prev
        if (gained > 0) {
          setScore((s) => {
            const ns = s + gained
            if (ns > best) {
              setBest(ns)
              localStorage.setItem('2048-best', String(ns))
            }
            return ns
          })
        }
        const withNew = addRandom(next)
        if (!canMove(withNew)) {
          setTimeout(() => setOver(true), 200)
        }
        // Win check
        for (const row of withNew) {
          for (const tile of row) {
            if (tile && tile.value === 2048 && !won) {
              setWon(true)
            }
          }
        }
        return withNew
      })
    },
    [over, won, continuePlay, best],
  )

  // Keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === 'arrowleft' || k === 'a') makeMove('left')
      else if (k === 'arrowright' || k === 'd') makeMove('right')
      else if (k === 'arrowup' || k === 'w') makeMove('up')
      else if (k === 'arrowdown' || k === 's') makeMove('down')
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [makeMove])

  // Swipe
  const touch = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touch.current) return
    const dx = e.touches[0].clientX - touch.current.x
    const dy = e.touches[0].clientY - touch.current.y
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) makeMove('right')
      else makeMove('left')
    } else {
      if (dy > 0) makeMove('down')
      else makeMove('up')
    }
    touch.current = null
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Score row */}
      <div className="flex w-full max-w-md gap-3">
        <div className="flex-1 rounded-lg border border-border bg-channel-sidebar px-3 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-dim">{t('g2048.score')}</div>
          <div className="text-xl font-bold tabular-nums text-text-primary">{score}</div>
        </div>
        <div className="flex-1 rounded-lg border border-border bg-channel-sidebar px-3 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-dim">{t('g2048.best')}</div>
          <div className="text-xl font-bold tabular-nums text-online">{best}</div>
        </div>
        <button
          onClick={newGame}
          className="rounded-lg border border-border bg-channel-sidebar px-3 py-2 text-xs font-medium text-text-muted transition-colors hover:bg-hover hover:text-white"
          type="button"
        >
          ↻ {t('g2048.new')}
        </button>
      </div>

      {/* Board */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        className="relative rounded-xl border-2 border-border bg-server-rail/80 p-2 shadow-2xl shadow-black/40"
        style={{ touchAction: 'none' }}
      >
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: SIZE }).map((_, r) =>
            Array.from({ length: SIZE }).map((_, c) => {
              const tile = grid[r][c]
              return (
                <div
                  key={`${r}-${c}`}
                  className="flex h-16 w-16 items-center justify-center rounded-lg bg-channel-sidebar/40 text-sm font-bold sm:h-20 sm:w-20 sm:text-base"
                >
                  <AnimatePresence>
                    {tile && (
                      <motion.div
                        key={tile.id}
                        initial={{ scale: tile.isNew ? 0 : 1.2, opacity: tile.isNew ? 0 : 1 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute inset-1 flex items-center justify-center rounded-md ${COLORS[tile.value] || 'bg-blurple text-white'}`}
                      >
                        {tile.value}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            }),
          )}
        </div>

        {/* Win overlay */}
        <AnimatePresence>
          {won && !continuePlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/70 backdrop-blur-sm"
            >
              <div className="text-5xl">🏆</div>
              <h2 className="text-2xl font-bold text-yellow-400">{t('g2048.youWin')}</h2>
              <p className="text-sm text-text-muted">{t('g2048.winScore')} <span className="font-bold text-yellow-400">{score}</span></p>
              <button
                onClick={() => setContinuePlay(true)}
                className="btn-blurple px-6 py-2"
                type="button"
              >
                {t('g2048.continue')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game over overlay */}
        <AnimatePresence>
          {over && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/70 backdrop-blur-sm"
            >
              <div className="text-5xl">💀</div>
              <h2 className="text-2xl font-bold text-dnd">{t('g2048.over')}</h2>
              <p className="text-sm text-text-muted">{t('g2048.score')}: <span className="font-bold text-white">{score}</span></p>
              <button
                onClick={newGame}
                className="btn-blurple px-6 py-2"
                type="button"
              >
                ↻ {t('g2048.tryAgain')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile D-pad */}
      <div className="grid grid-cols-3 gap-1.5 lg:hidden">
        <div />
        <DPad label="▲" onClick={() => makeMove('up')} />
        <div />
        <DPad label="◀" onClick={() => makeMove('left')} />
        <DPad label="▼" onClick={() => makeMove('down')} />
        <DPad label="▶" onClick={() => makeMove('right')} />
      </div>
    </div>
  )
}

function DPad({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-channel-sidebar text-base font-bold text-text-primary active:scale-95 active:bg-blurple active:text-white"
    >
      {label}
    </button>
  )
}
