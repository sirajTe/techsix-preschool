import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { school, TONES } from '../data/site'

const paths = {
  phone: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z',
  mail: 'M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75',
  pin: 'M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z',
  clock: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  download: 'M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3',
  menu: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5',
  close: 'M6 18 18 6M6 6l12 12',
  sun: 'M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z',
  moon: 'M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z',
  chevron: 'm19.5 8.25-7.5 7.5-7.5-7.5',
  arrow: 'M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3',
  check: 'm4.5 12.75 6 6 9-13.5',
  search: 'm21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z',
  file: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z',
  lock: 'M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z',
  trash: 'm14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0',
  plus: 'M12 4.5v15m7.5-7.5h-15',
  calendar: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5',
  logout: 'M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9',
  external: 'M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25',
}

export function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.8 }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  )
}

export function BrandIcon({ name, className = 'h-5 w-5' }) {
  const p = {
    whatsapp: 'M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41',
    instagram: 'M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07-3.2 0-3.58-.01-4.85-.07-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85 0-3.2.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z',
    facebook: 'M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07',
    youtube: 'M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z',
  }[name]
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={p} />
    </svg>
  )
}

export function Logo({ compact = false }) {
  // PLACEHOLDER logo: swap for the school's real logo file when available
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label={`${school.name} home`}>
      <span className="relative grid h-11 w-11 shrink-0 -rotate-6 place-items-center rounded-2xl bg-brand-500 font-display text-xl font-extrabold text-white shadow-md shadow-brand-500/30">
        T6
        <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-amber-300 ring-2 ring-cream dark:ring-night" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-xl font-extrabold text-ink dark:text-white">
            Tech<span className="text-brand-500">Six</span>
          </span>
          <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Preschool & Daycare</span>
        </span>
      )}
    </Link>
  )
}

export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])
  const toggle = () => {
    setDark((d) => {
      try { localStorage.setItem('techsix:theme', d ? 'light' : 'dark') } catch {}
      return !d
    })
  }
  return [dark, toggle]
}

export function ThemeToggle() {
  const [dark, toggle] = useTheme()
  return (
    <button onClick={toggle} className="grid h-10 w-10 place-items-center rounded-full text-ink ring-1 ring-slate-900/10 transition hover:bg-white dark:text-amber-200 dark:ring-white/15 dark:hover:bg-white/10" aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <Icon name={dark ? 'sun' : 'moon'} />
    </button>
  )
}

export function SectionHeading({ eyebrow, title, text, center = true }) {
  return (
    <div className={`mb-10 max-w-2xl md:mb-14 ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <p className="mb-2 font-display text-sm font-bold uppercase tracking-[0.18em] text-brand-500">{eyebrow}</p>}
      <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h2>
      {text && <p className="mt-3 text-base leading-relaxed sm:text-lg">{text}</p>}
    </div>
  )
}

// Decorative page banner used at the top of every inner page.
export function PageHero({ eyebrow, title, text, emoji }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-amber-50 to-sky-50 py-14 sm:py-20 dark:from-brand-500/10 dark:via-night dark:to-sky-500/10">
      <Blob className="-left-16 -top-16 h-56 w-56 bg-amber-200/60 dark:bg-amber-400/10" />
      <Blob className="-bottom-20 right-0 h-64 w-64 bg-sky-200/60 dark:bg-sky-400/10" />
      <div className="container-x relative flex items-center justify-between gap-6">
        <div className="max-w-2xl animate-fade-up">
          {eyebrow && <p className="mb-2 font-display text-sm font-bold uppercase tracking-[0.18em] text-brand-500">{eyebrow}</p>}
          <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl">{title}</h1>
          {text && <p className="mt-4 text-base leading-relaxed sm:text-lg">{text}</p>}
        </div>
        {emoji && <div className="hidden animate-float text-8xl drop-shadow-sm sm:block" aria-hidden="true">{emoji}</div>}
      </div>
    </section>
  )
}

export function Blob({ className = '' }) {
  return <div aria-hidden="true" className={`pointer-events-none absolute rounded-full blur-3xl ${className}`} />
}

// Illustrated stand-in for a photo, clearly labelled so it gets replaced.
export function PhotoPlaceholder({ emoji, tone = 'peach', label, className = '', tag = true }) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${TONES[tone].solid} ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.9)_1px,transparent_0)] [background-size:16px_16px] dark:opacity-10" />
      <span className="relative text-6xl drop-shadow-sm sm:text-7xl" role="img" aria-label={label}>{emoji}</span>
      {tag && (
        <span className="absolute left-3 top-3 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-600 backdrop-blur dark:bg-black/40 dark:text-slate-200">
          Placeholder photo
        </span>
      )}
    </div>
  )
}

export function ToneBadge({ tone, children, className = '' }) {
  const t = TONES[tone] || TONES.peach
  return <span className={`chip ${t.bg} ${t.text} ${className}`}>{children}</span>
}

export function EmptyState({ emoji = '🗂️', title, text, children }) {
  return (
    <div className="card mx-auto max-w-md p-10 text-center">
      <div className="mb-3 text-5xl">{emoji}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      {text && <p className="mt-1 text-sm">{text}</p>}
      {children}
    </div>
  )
}

export function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDone, 3200)
    return () => clearTimeout(t)
  }, [message, onDone])
  if (!message) return null
  return (
    <div role="status" className="fixed inset-x-0 bottom-24 z-[60] mx-auto w-fit max-w-[90vw] animate-fade-up rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-xl dark:bg-white dark:text-ink">
      {message}
    </div>
  )
}
