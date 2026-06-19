// SVG flag components — render reliably across all platforms
// (emoji flags 🇻🇳 🇬🇧 don't render on some Windows/Linux setups)

type FlagProps = { size?: number }

export function VNFlag({ size = 18 }: FlagProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 20"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Vietnam"
      style={{ borderRadius: 2, flexShrink: 0 }}
    >
      <rect width="30" height="20" fill="#DA251D" />
      <polygon
        points="15,4 16.5,8.5 21,8.5 17.5,11.5 19,16 15,13.5 11,16 12.5,11.5 9,8.5 13.5,8.5"
        fill="#FFCC00"
      />
    </svg>
  )
}

export function GBFlag({ size = 18 }: FlagProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 30"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="United Kingdom"
      style={{ borderRadius: 2, flexShrink: 0 }}
    >
      {/* Blue background */}
      <rect width="60" height="30" fill="#012169" />
      {/* White diagonal stripes */}
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
      {/* Red diagonal stripes (St Patrick's cross) */}
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="3" />
      {/* White cross of St George */}
      <path d="M30,0 V30 M0,15 H60" stroke="#FFFFFF" strokeWidth="10" />
      {/* Red cross of St George */}
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  )
}
