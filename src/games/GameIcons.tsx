// Custom SVG icons cho game hub
type Props = { size?: number; weight?: 'regular' | 'bold' | 'fill' | 'duotone' }

export function SnakeIcon({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h4v4H4z" fill="currentColor" />
      <path d="M8 4h4v4H8z" fill="currentColor" opacity="0.8" />
      <path d="M12 4h4v4h-4z" fill="currentColor" opacity="0.6" />
      <path d="M12 8h4v4h-4z" fill="currentColor" opacity="0.4" />
      <path d="M16 8h4v4h-4z" fill="currentColor" opacity="0.2" />
    </svg>
  )
}

export function TicTacToeIcon({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="16" y2="21" />
      <line x1="3" y1="8" x2="21" y2="8" />
      <line x1="3" y1="16" x2="21" y2="16" />
      <line x1="5" y1="5" x2="11" y2="11" />
      <line x1="11" y1="5" x2="5" y2="11" />
      <circle cx="17" cy="17" r="2.5" />
    </svg>
  )
}

export function MemoryIcon({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

export function Game2048Icon({ size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <rect x="6" y="6" width="5" height="5" rx="0.5" fill="currentColor" opacity="0.5" />
      <rect x="13" y="6" width="5" height="5" rx="0.5" fill="currentColor" />
      <rect x="6" y="13" width="5" height="5" rx="0.5" fill="currentColor" />
      <rect x="13" y="13" width="5" height="5" rx="0.5" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

export function PlayIcon({ size = 16 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
