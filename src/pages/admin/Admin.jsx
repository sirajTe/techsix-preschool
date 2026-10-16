import { useState } from 'react'
import { Link } from 'react-router-dom'
import { school } from '../../data/site'
import { useCollection } from '../../lib/store'
import { Icon, Logo, ThemeToggle } from '../../components/ui'
import { DownloadsPanel, EnquiriesPanel, EventsPanel, GalleryPanel, NoticesPanel, OverviewPanel, ResultsPanel, SettingsPanel } from './panels'

const SESSION_KEY = 'techsix:admin'

function Login({ onLogin }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const [show, setShow] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    // DEMO ONLY: a real launch must check the password on a server (see README).
    if (pw === school.adminPassword) onLogin()
    else setError(true)
  }
  return (
    <div className="grid min-h-dvh place-items-center bg-gradient-to-br from-brand-50 via-amber-50 to-sky-50 p-4 dark:from-night dark:via-night dark:to-night-card">
      <form onSubmit={submit} className="card w-full max-w-sm animate-fade-up p-8">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300"><Icon name="lock" className="h-7 w-7" /></div>
        <h1 className="text-center text-2xl font-extrabold">Staff Admin Panel</h1>
        <p className="mt-1 text-center text-sm">Sign in to manage notices, downloads, results and enquiries.</p>
        <label htmlFor="pw" className="field-label mt-6">Password</label>
        <div className="relative">
          <input id="pw" type={show ? 'text' : 'password'} value={pw} onChange={(e) => { setPw(e.target.value); setError(false) }} className="field pr-16" autoFocus autoComplete="current-password" />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-600 dark:text-brand-300">{show ? 'Hide' : 'Show'}</button>
        </div>
        {error && <p role="alert" className="mt-2 text-sm font-bold text-rose-600">Incorrect password. Please try again.</p>}
        <button className="btn-primary mt-5 w-full py-3">Sign in</button>
        {/* DEMO ONLY: remove before launch */}
        <p className="mt-4 rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-3 text-center text-xs text-amber-800 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-200">
          Demo password: <button type="button" onClick={() => setPw(school.adminPassword)} className="font-mono font-bold underline">{school.adminPassword}</button>
        </p>
        <Link to="/" className="mt-4 block text-center text-sm font-bold text-slate-500 hover:text-brand-600">← Back to website</Link>
      </form>
    </div>
  )
}

const TABS = [
  { id: 'overview', label: 'Dashboard', icon: '🏠', Panel: OverviewPanel },
  { id: 'enquiries', label: 'Enquiries', icon: '📨', Panel: EnquiriesPanel },
  { id: 'notices', label: 'Notices', icon: '📌', Panel: NoticesPanel },
  { id: 'downloads', label: 'Downloads', icon: '📥', Panel: DownloadsPanel },
  { id: 'results', label: 'Results', icon: '🏅', Panel: ResultsPanel },
  { id: 'events', label: 'Events', icon: '📅', Panel: EventsPanel },
  { id: 'gallery', label: 'Gallery', icon: '📸', Panel: GalleryPanel },
  { id: 'settings', label: 'Settings', icon: '⚙️', Panel: SettingsPanel },
]

export default function Admin() {
  const [authed, setAuthed] = useState(() => { try { return sessionStorage.getItem(SESSION_KEY) === '1' } catch { return false } })
  const [tab, setTab] = useState('overview')
  const newEnquiries = useCollection('enquiries').filter((q) => q.status === 'New').length

  const login = () => { try { sessionStorage.setItem(SESSION_KEY, '1') } catch {} ; setAuthed(true) }
  const logout = () => { try { sessionStorage.removeItem(SESSION_KEY) } catch {} ; setAuthed(false) }

  if (!authed) return <Login onLogin={login} />
  const { Panel, label } = TABS.find((t) => t.id === tab)

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-night">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-night/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo compact />
            <div className="leading-tight">
              <p className="font-display text-lg font-extrabold text-ink dark:text-white">Admin Panel</p>
              <p className="text-xs">{school.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" target="_blank" className="btn-ghost hidden px-4 py-2 sm:inline-flex"><Icon name="external" className="h-4 w-4" /> View website</Link>
            <ThemeToggle />
            <button onClick={logout} className="grid h-10 w-10 place-items-center rounded-full text-ink ring-1 ring-slate-900/10 hover:bg-rose-50 hover:text-rose-600 dark:text-white dark:ring-white/15" aria-label="Log out" title="Log out"><Icon name="logout" /></button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr]">
        <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:sticky lg:top-24 lg:mx-0 lg:flex-col lg:self-start lg:overflow-visible lg:px-0" aria-label="Admin sections">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} aria-current={tab === t.id ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-sm font-extrabold transition lg:py-3 ${tab === t.id ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25' : 'bg-white text-ink ring-1 ring-slate-900/5 hover:bg-brand-50 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10'}`}>
              <span className="text-lg">{t.icon}</span>
              <span className="flex-1">{t.label}</span>
              {t.id === 'enquiries' && newEnquiries > 0 && <span className={`chip ${tab === t.id ? 'bg-white text-brand-600' : 'bg-brand-500 text-white'}`}>{newEnquiries}</span>}
            </button>
          ))}
        </nav>
        <main className="min-w-0">
          <h1 className="sr-only">{label}</h1>
          <Panel goTo={setTab} onLogout={logout} />
        </main>
      </div>
    </div>
  )
}
