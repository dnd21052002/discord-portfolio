import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'motion/react'
import { useT } from '../i18n/LocaleContext'

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_DIRECTION = { x: 1, y: 0 }
const SPEED = 120 // ms per tick

type Point = { x: number; y: number }
type Direction = { x: number; y: number }

type GameStatus = 'idle' | 'playing' | 'paused' | 'over'

function randomFood(snake: Point[]): Point {
  let food: Point
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }
  } while (snake.some((s) => s.x === food.x && s.y === food.y))
  return food
}

export function Game() {
  const { t } = useT()
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE)
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION)
  const [food, setFood] = useState<Point>(() => randomFood(INITIAL_SNAKE))
  const [status, setStatus] = useState<GameStatus>('idle')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snake-high-score') || '0', 10)
  })

  const directionRef = useRef(direction)
  const nextDirectionRef = useRef(direction)

  useEffect(() => {
    directionRef.current = direction
  }, [direction])

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        if (status === 'idle' || status === 'over') {
          startGame()
        } else if (status === 'playing') {
          setStatus('paused')
        } else if (status === 'paused') {
          setStatus('playing')
        }
        return
      }

      if (status !== 'playing') return

      const key = e.key.toLowerCase()
      const dir = directionRef.current
      if ((key === 'arrowup' || key === 'w') && dir.y !== 1) {
        nextDirectionRef.current = { x: 0, y: -1 }
      } else if ((key === 'arrowdown' || key === 's') && dir.y !== -1) {
        nextDirectionRef.current = { x: 0, y: 1 }
      } else if ((key === 'arrowleft' || key === 'a') && dir.x !== 1) {
        nextDirectionRef.current = { x: -1, y: 0 }
      } else if ((key === 'arrowright' || key === 'd') && dir.x !== -1) {
        nextDirectionRef.current = { x: 1, y: 0 }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [status])

  // Game loop
  useEffect(() => {
    if (status !== 'playing') return
    const interval = setInterval(() => {
      setSnake((prev) => {
        const dir = nextDirectionRef.current
        setDirection(dir)

        const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y }

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          gameOver()
          return prev
        }

        // Self collision
        if (prev.some((s) => s.x === head.x && s.y === head.y)) {
          gameOver()
          return prev
        }

        const newSnake = [head, ...prev]

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 10)
          setFood(randomFood(newSnake))
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }, SPEED)
    return () => clearInterval(interval)
  }, [status, food])

  // Touch / swipe controls for mobile
  const touchStartRef = useRef<Point | null>(null)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current || status !== 'playing') return
      const dx = e.touches[0].clientX - touchStartRef.current.x
      const dy = e.touches[0].clientY - touchStartRef.current.y
      const threshold = 30

      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > threshold) {
          const dir = directionRef.current
          if (dx > 0 && dir.x !== -1) nextDirectionRef.current = { x: 1, y: 0 }
          else if (dx < 0 && dir.x !== 1) nextDirectionRef.current = { x: -1, y: 0 }
          touchStartRef.current = null
        }
      } else {
        if (Math.abs(dy) > threshold) {
          const dir = directionRef.current
          if (dy > 0 && dir.y !== -1) nextDirectionRef.current = { x: 0, y: 1 }
          else if (dy < 0 && dir.y !== 1) nextDirectionRef.current = { x: 0, y: -1 }
          touchStartRef.current = null
        }
      }
    },
    [status],
  )

  function startGame() {
    setSnake(INITIAL_SNAKE)
    setDirection(INITIAL_DIRECTION)
    nextDirectionRef.current = INITIAL_DIRECTION
    directionRef.current = INITIAL_DIRECTION
    setFood(randomFood(INITIAL_SNAKE))
    setScore(0)
    setStatus('playing')
  }

  function gameOver() {
    setStatus('over')
    setHighScore((prev) => {
      const newHigh = Math.max(prev, score + 10)
      localStorage.setItem('snake-high-score', String(newHigh))
      return newHigh
    })
  }

  const canvasSize = GRID_SIZE * CELL_SIZE

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Score bar */}
      <div className="flex w-full max-w-md items-center justify-between gap-4">
        <div className="rounded-lg bg-channel-sidebar px-4 py-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-text-dim">
            Score
          </div>
          <div className="text-2xl font-bold text-text-primary">{score}</div>
        </div>
        <div className="rounded-lg bg-channel-sidebar px-4 py-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-text-dim">
            Best
          </div>
          <div className="text-2xl font-bold text-online">{highScore}</div>
        </div>
      </div>

      {/* Game canvas */}
      <div
        className="relative overflow-hidden rounded-xl border-2 border-border bg-server-rail"
        style={{ width: canvasSize, height: canvasSize, maxWidth: '100vw' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
          }}
        />

        {/* Snake */}
        {snake.map((seg, i) => {
          const isHead = i === 0
          return (
            <div
              key={i}
              className={`absolute rounded-[3px] transition-all duration-75 ${
                isHead ? 'bg-blurple' : 'bg-blurple/70'
              }`}
              style={{
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                left: seg.x * CELL_SIZE + 1,
                top: seg.y * CELL_SIZE + 1,
                zIndex: 2,
              }}
            />
          )
        })}

        {/* Food */}
        <motion.div
          className="absolute rounded-full bg-dnd"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: CELL_SIZE - 4,
            height: CELL_SIZE - 4,
            left: food.x * CELL_SIZE + 2,
            top: food.y * CELL_SIZE + 2,
            zIndex: 1,
          }}
        />

        {/* Overlay: idle / paused / over */}
        {status !== 'playing' && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/70 backdrop-blur-sm">
            {status === 'idle' && (
              <>
                <div className="text-center">
                  <div className="mb-1 text-4xl">🐍</div>
                  <h2 className="text-xl font-bold text-white">Snake</h2>
                  <p className="mt-1 text-sm text-text-muted">
                    {t('game.controls')}
                  </p>
                </div>
                <button
                  onClick={startGame}
                  className="btn-blurple px-6 py-2.5 text-base"
                  type="button"
                >
                  ▶ {t('game.start')}
                </button>
              </>
            )}
            {status === 'paused' && (
              <>
                <h2 className="text-xl font-bold text-white">⏸ {t('game.paused')}</h2>
                <button
                  onClick={() => setStatus('playing')}
                  className="btn-blurple px-6 py-2.5"
                  type="button"
                >
                  ▶ {t('game.resume')}
                </button>
              </>
            )}
            {status === 'over' && (
              <>
                <div className="text-center">
                  <div className="mb-1 text-4xl">💀</div>
                  <h2 className="text-xl font-bold text-dnd">{t('game.over')}</h2>
                  <p className="mt-1 text-sm text-text-muted">
                    {t('game.score')}: <span className="font-bold text-white">{score}</span>
                  </p>
                  {score >= highScore && score > 0 && (
                    <p className="mt-1 text-sm font-semibold text-online">
                      🏆 {t('game.newRecord')}
                    </p>
                  )}
                </div>
                <button
                  onClick={startGame}
                  className="btn-blurple px-6 py-2.5"
                  type="button"
                >
                  ↻ {t('game.restart')}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Controls hint */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-text-dim">
        <kbd className="rounded border border-border bg-channel-sidebar px-1.5 py-0.5 font-mono">↑↓←→</kbd>
        <span>{t('game.or')}</span>
        <kbd className="rounded border border-border bg-channel-sidebar px-1.5 py-0.5 font-mono">WASD</kbd>
        <span className="mx-1">·</span>
        <kbd className="rounded border border-border bg-channel-sidebar px-1.5 py-0.5 font-mono">Space</kbd>
        <span>{t('game.pauseHint')}</span>
        <span className="mx-1">·</span>
        <span>{t('game.swipe')}</span>
      </div>

      {/* Mobile D-pad */}
      {status === 'playing' && (
        <div className="grid grid-cols-3 gap-1 lg:hidden" style={{ width: 150 }}>
          <div />
          <DpadBtn label="↑" onClick={() => {
            if (directionRef.current.y !== 1) nextDirectionRef.current = { x: 0, y: -1 }
          }} />
          <div />
          <DpadBtn label="←" onClick={() => {
            if (directionRef.current.x !== 1) nextDirectionRef.current = { x: -1, y: 0 }
          }} />
          <DpadBtn label="↓" onClick={() => {
            if (directionRef.current.y !== -1) nextDirectionRef.current = { x: 0, y: 1 }
          }} />
          <DpadBtn label="→" onClick={() => {
            if (directionRef.current.x !== -1) nextDirectionRef.current = { x: 1, y: 0 }
          }} />
        </div>
      )}
    </div>
  )
}

function DpadBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex h-12 w-12 items-center justify-center rounded-lg bg-channel-sidebar text-lg font-bold text-text-primary transition-colors active:bg-blurple active:text-white"
    >
      {label}
    </button>
  )
}
