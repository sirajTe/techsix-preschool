// Playful hero illustration: sun, rainbow, clouds and alphabet blocks.
export default function HeroArt() {
  return (
    <svg viewBox="0 0 520 460" className="h-auto w-full" role="img" aria-label="Illustration of a sun, rainbow and alphabet blocks">
      <defs>
        <linearGradient id="hb" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffe4d7" />
          <stop offset="1" stopColor="#dcefff" />
        </linearGradient>
      </defs>
      <path className="dark:opacity-20" fill="url(#hb)" d="M262 20c96 0 214 46 238 150s-34 220-136 258-226 22-296-44S-4 238 26 150 166 20 262 20Z" />

      {/* rainbow */}
      <g fill="none" strokeLinecap="round" strokeWidth="22">
        <path stroke="#f25c26" d="M110 300a150 150 0 0 1 300 0" />
        <path stroke="#ffd166" d="M136 300a124 124 0 0 1 248 0" />
        <path stroke="#7bd3a8" d="M162 300a98 98 0 0 1 196 0" />
        <path stroke="#8ec5ff" d="M188 300a72 72 0 0 1 144 0" />
      </g>

      {/* sun */}
      <g className="animate-float" style={{ transformOrigin: '420px 90px' }}>
        <g stroke="#ffb703" strokeWidth="6" strokeLinecap="round">
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4
            return <line key={i} x1={420 + Math.cos(a) * 44} y1={90 + Math.sin(a) * 44} x2={420 + Math.cos(a) * 58} y2={90 + Math.sin(a) * 58} />
          })}
        </g>
        <circle cx="420" cy="90" r="34" fill="#ffd166" />
        <circle cx="409" cy="85" r="3.5" fill="#1f2547" />
        <circle cx="431" cy="85" r="3.5" fill="#1f2547" />
        <path d="M408 98q12 10 24 0" stroke="#1f2547" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </g>

      {/* clouds */}
      <g fill="#fff" className="dark:opacity-90">
        <path d="M60 130a22 22 0 0 1 40-12 18 18 0 0 1 30 14h4a14 14 0 0 1 0 28H66a15 15 0 0 1-6-30Z" />
        <path d="M330 190a16 16 0 0 1 29-9 13 13 0 0 1 22 10h3a10 10 0 0 1 0 20h-50a11 11 0 0 1-4-21Z" opacity=".9" />
      </g>

      {/* blocks */}
      <g fontFamily="'Baloo 2', sans-serif" fontWeight="800" fontSize="52" textAnchor="middle">
        <g transform="rotate(-6 165 360)">
          <rect x="120" y="315" width="90" height="90" rx="18" fill="#f25c26" />
          <text x="165" y="378" fill="#fff">A</text>
        </g>
        <g transform="rotate(4 265 365)">
          <rect x="220" y="320" width="90" height="90" rx="18" fill="#7bd3a8" />
          <text x="265" y="383" fill="#fff">B</text>
        </g>
        <g transform="rotate(-3 365 360)">
          <rect x="320" y="315" width="90" height="90" rx="18" fill="#8ec5ff" />
          <text x="365" y="378" fill="#fff">C</text>
        </g>
        <g transform="rotate(8 265 270)">
          <rect x="225" y="230" width="80" height="80" rx="16" fill="#b79cff" />
          <text x="265" y="287" fill="#fff" fontSize="46">6</text>
        </g>
      </g>

      {/* stars & paper plane */}
      <g fill="#ffd166">
        <path d="M70 250l6 13 14 2-10 10 3 14-13-7-13 7 3-14-10-10 14-2Z" />
        <path d="M470 270l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1Z" />
      </g>
      <path d="M90 60q60-40 120 0t110 -10" fill="none" stroke="#1f2547" strokeOpacity=".25" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" className="dark:stroke-white" />
      <path d="M318 40l36 10-30 18-2-12Z" fill="#f25c26" />
    </svg>
  )
}
