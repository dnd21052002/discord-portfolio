import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { useT } from '../i18n/LocaleContext'

const GRID = 20
const CELL = 18
const SPEED = 110

type Point = { x: number; y: number }
type Status = 'idle' | 'playing' | 'paused' | 'over'

function randomFood(snake: Point[]): Point {
  while (true) {
    const p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }
    if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p
  }
}

export default function Snake() {
  const { t } = useT()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }])
  const [food, setFood] = useState<Point>(() => randomFood([{ x: 10, y: 10 }]))
  const [dir, setDir] = useState<Point>({ x: 1, y: 0 })
  const dirRef = useRef(dir)
  const [status, setStatus] = useState<Status>('idle')
  const [score, setScore] = useState(0)
  const [hs, setHs] = useState(() => Number(localStorage.getItem('snake-hs') || 0))

  useEffect(() => { dirRef.current = dir }, [dir])

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = GRID * CELL
    canvas.width = W
    canvas.height = W

    // Clear with bg
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--color-server-rail').trim() || '#1e1f22'
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, W)

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'
    ctx.lineWidth = 1
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL, 0)
      ctx.lineTo(i * CELL, W)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * CELL)
      ctx.lineTo(W, i * CELL)
      ctx.stroke()
    }

    // Food (pulsing red)
    const time = Date.now() / 300
    const pulse = 1 + Math.sin(time) * 0.15
    ctx.fillStyle = '#f23f43'
    ctx.shadowColor = '#f23f43'
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(
      food.x * CELL + CELL / 2,
      food.y * CELL + CELL / 2,
      (CELL / 2 - 2) * pulse,
      0, Math.PI * 2,
    )
    ctx.fill()
    ctx.shadowBlur = 0

    // Snake (gradient blurple)
    snake.forEach((seg, i) => {
      const ratio = i / Math.max(snake.length - 1, 1)
      const r = Math.round(88 + (255 - 88) * ratio)
      const g = Math.round(101 + (255 - 101) * ratio)
      const b = Math.round(242 + (255 - 242) * ratio)
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`

      const x = seg.x * CELL + 1
      const y = seg.y * CELL + 1
      const size = CELL - 2
      const radius = i === 0 ? 5 : 4

      ctx.beginPath()
      ctx.roundRect(x, y, size, size, radius)
      ctx.fill()

      // Head: eyes
      if (i === 0) {
        ctx.fillStyle = '#fff'
        const ex = seg.x * CELL + CELL / 2
        const ey = seg.y * CELL + CELL / 2
        const ox = dir.x * 2
        const oy = dir.y * 2
        const perpX = dir.y * 3
        const perpY = dir.x * 3
        ctx.beginPath()
        ctx.arc(ex + ox + perpX, ey + oy + perpY, 1.5, 0, Math.PI * 2)
        ctx.arc(ex + ox - perpX, ey + oy - perpY, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
    })
  }, [snake, food, dir])

  // Game loop
  useEffect(() => {
    if (status !== 'playing') return
    const id = setInterval(() => {
      setSnake((prev) => {
        const d = dirRef.current
        const head = { x: prev[0].x + d.x, y: prev[0].y + d.y }

        if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
          setStatus('over')
          return prev
        }
        if (prev.some((s) => s.x === head.x && s.y === head.y)) {
          setStatus('over')
          return prev
        }

        const next = [head, ...prev]
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => {
            const ns = s + 10
            if (ns > hs) {
              setHs(ns)
              localStorage.setItem('snake-hs', String(ns))
            }
            return ns
          })
          setFood(randomFood(next))
        } else {
          next.pop()
        }
        return next
      })
    }, SPEED)
    return () => clearInterval(id)
  }, [status, food, hs])

  const start = () => {
    setSnake([{ x: 10, y: 10 }])
    setDir({ x: 1, y: 0 })
    dirRef.current = { x: 1, y: 0 }
    setFood(randomFood([{ x: 10, y: 10 }]))
    setScore(0)
    setStatus('playing')
  }

  // Keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        if (status === 'idle' || status === 'over') start()
        else if (status === 'playing') setStatus('paused')
        else setStatus('playing')
        return
      }
      if (status !== 'playing') return
      const k = e.key.toLowerCase()
      const d = dirRef.current
      const tryDir = (nd: Point) => {
        if (!(d.x === -nd.x && d.y === -nd.y)) dirRef.current = nd
        setDir(nd)
      }
      if ((k === 'arrowup' || k === 'w') && d.y !== 1) tryDir({ x: 0, y: -1 })
      else if ((k === 'arrowdown' || k === 's') && d.y !== -1) tryDir({ x: 0, y: 1 })
      else if ((k === 'arrowleft' || k === 'a') && d.x !== 1) tryDir({ x: -1, y: 0 })
      else if ((k === 'arrowright' || k === 'd') && d.x !== -1) tryDir({ x: 1, y: 0 })
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [status])

  // Swipe (mobile)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touch.current || status !== 'playing') return
    const dx = e.touches[0].clientX - touch.current.x
    const dy = e.touches[0].clientY - touch.current.y
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return
    const d = dirRef.current
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && d.x !== -1) { dirRef.current = { x: 1, y: 0 }; setDir({ x: 1, y: 0 }) }
      else if (dx < 0 && d.x !== 1) { dirRef.current = { x: -1, y: 0 }; setDir({ x: -1, y: 0 }) }
    } else {
      if (dy > 0 && d.y !== -1) { dirRef.current = { x: 0, y: 1 }; setDir({ x: 0, y: 1 }) }
      else if (dy < 0 && d.y !== 1) { dirRef.current = { x: 0, y: -1 }; setDir({ x: 0, y: -1 }) }
    }
    touch.current = null
  }

  const dpad = (nd: Point) => {
    if (status !== 'playing') return
    const d = dirRef.current
    if (d.x === -nd.x && d.y === -nd.y) return
    dirRef.current = nd
    setDir(nd)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Score bar */}
      <div className="flex w-full max-w-md gap-3">
        <div className="flex-1 rounded-lg border border-border bg-channel-sidebar px-4 py-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-dim">
            {t('snake.score')}
          </div>
          <div className="text-2xl font-bold tabular-nums text-text-primary">{score}</div>
        </div>
        <div className="flex-1 rounded-lg border border-border bg-channel-sidebar px-4 py-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-text-dim">
            {t('snake.best')}
          </div>
          <div className="text-2xl font-bold tabular-nums text-online">{hs}</div>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative overflow-hidden rounded-xl border-2 border-border shadow-2xl shadow-black/40">
        <canvas
          ref={canvasRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          className="block touch-none"
          style={{ imageRendering: 'pixelated' }}
        />

        {status !== 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 backdrop-blur-sm">
            {status === 'idle' && (
              <>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl"
                >
                  🐍
                </motion.div>
                <h2 className="text-2xl font-bold text-white">{t('snake.title')}</h2>
                <p className="px-6 text-center text-sm text-text-muted">{t('snake.subtitle')}</p>
                <button onClick={start} className="btn-blurple mt-2 px-8 py-2.5 text-base" type="button">
                  ▶ {t('snake.start')}
                </button>
              </>
            )}
            {status === 'paused' && (
              <>
                <h2 className="text-2xl font-bold text-white">⏸ {t('game.paused')}</h2>
                <button onClick={() => setStatus('playing')} className="btn-blurple px-8 py-2.5" type="button">
                  ▶ {t('game.resume')}
                </button>
              </>
            )}
            {status === 'over' && (
              <>
                <div className="text-5xl">💀</div>
                <h2 className="text-2xl font-bold text-dnd">{t('game.over')}</h2>
                <p className="text-sm text-text-muted">
                  {t('game.score')}: <span className="font-bold text-white">{score}</span>
                </p>
                {score >= hs && score > 0 && (
                  <p className="text-sm font-semibold text-online">🏆 {t('game.newRecord')}</p>
                )}
                <button onClick={start} className="btn-blurple mt-2 px-8 py-2.5" type="button">
                  ↻ {t('game.restart')}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile D-pad */}
      {status === 'playing' && (
        <div className="grid grid-cols-3 gap-1.5 lg:hidden">
          <div />
          <DPad label="▲" onClick={() => dpad({ x: 0, y: -1 })} />
          <div />
          <DPad label="◀" onClick={() => dpad({ x: -1, y: 0 })} />
          <DPad label="▼" onClick={() => dpad({ x: 0, y: 1 })} />
          <DPad label="▶" onClick={() => dpad({ x: 1, y: 0 })} />
        </div>
      )}

      {/* Desktop hint */}
      <div className="hidden text-xs text-text-dim lg:block">
        {t('snake.controlsHint')}
      </div>
    </div>
  )
}

function DPad({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-channel-sidebar text-xl font-bold text-text-primary transition-all active:scale-95 active:bg-blurple active:text-white"
    >
      {label}
    </button>
  )
}
