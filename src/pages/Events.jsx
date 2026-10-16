import { useMemo, useState } from 'react'
import { EVENT_TONE, EVENT_TYPES, TONES } from '../data/site'
import { fmtDate, isPast, toDate, useCollection } from '../lib/store'
import { Icon, PageHero, ToneBadge } from '../components/ui'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const key = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

// Expand multi-day events into a map of date -> events.
function byDay(events) {
  const map = {}
  for (const e of events) {
    const d = toDate(e.date)
    const end = toDate(e.endDate || e.date)
    for (; d <= end; d.setDate(d.getDate() + 1)) (map[key(d)] ||= []).push(e)
  }
  return map
}

function MonthGrid({ month, setMonth, dayMap }) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const offset = (first.getDay() + 6) % 7
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const today = key(new Date())
  const cells = [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))]
  const shift = (n) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1))

  return (
    <div className="card p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => shift(-1)} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-slate-900/10 hover:bg-slate-50 dark:ring-white/15 dark:hover:bg-white/10" aria-label="Previous month"><Icon name="chevron" className="h-5 w-5 rotate-90" /></button>
        <h2 className="text-2xl font-extrabold">{month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={() => shift(1)} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-slate-900/10 hover:bg-slate-50 dark:ring-white/15 dark:hover:bg-white/10" aria-label="Next month"><Icon name="chevron" className="h-5 w-5 -rotate-90" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-extrabold uppercase tracking-wider text-slate-400">
        {WEEKDAYS.map((d) => <div key={d} className="py-2">{d.slice(0, 2)}<span className="hidden sm:inline">{d.slice(2)}</span></div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`x${i}`} />
          const evs = dayMap[key(d)] || []
          const tone = evs[0] ? TONES[EVENT_TONE[evs[0].type]] : null
          const isToday = key(d) === today
          return (
            <div key={i} title={evs.map((e) => e.title).join(', ')}
              className={`relative flex aspect-square flex-col items-center justify-start rounded-xl p-1 text-sm font-bold sm:aspect-[1.1] sm:items-start sm:p-2 ${tone ? tone.bg : 'bg-slate-50/60 dark:bg-white/[0.03]'} ${isToday ? 'ring-2 ring-brand-500' : ''} ${d.getDay() === 0 ? 'text-rose-500' : 'text-ink dark:text-slate-200'}`}>
              {d.getDate()}
              {evs[0] && <span className={`mt-auto hidden w-full truncate text-left text-[10px] font-extrabold leading-tight sm:block ${tone.text}`}>{evs[0].title}</span>}
              {evs[0] && <span className={`mt-auto h-1.5 w-1.5 rounded-full bg-current sm:hidden ${tone.text}`} />}
            </div>
          )
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {EVENT_TYPES.map((t) => <ToneBadge key={t} tone={EVENT_TONE[t]}>{t}</ToneBadge>)}
      </div>
    </div>
  )
}

export default function Events() {
  const events = useCollection('events')
  const sorted = useMemo(() => events.slice().sort((a, b) => a.date.localeCompare(b.date)), [events])
  const dayMap = useMemo(() => byDay(events), [events])
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1) })
  const [showPast, setShowPast] = useState(false)
  const list = sorted.filter((e) => showPast || !isPast(e.endDate || e.date))

  // Group the list by month heading
  const groups = list.reduce((acc, e) => {
    const m = fmtDate(e.date, { month: 'long', year: 'numeric' })
    ;(acc[m] ||= []).push(e)
    return acc
  }, {})

  return (
    <>
      <PageHero eyebrow="Calendar" title="Events & holidays" text="Upcoming holidays, Parent-Teacher Meetings, Annual Day, Sports Day and all our celebrations." emoji="📅" />
      <section className="section container-x grid items-start gap-6 lg:grid-cols-[1.25fr_1fr]">
        <div className="lg:sticky lg:top-28"><MonthGrid month={month} setMonth={setMonth} dayMap={dayMap} /></div>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold">{showPast ? 'All events' : 'Upcoming'}</h2>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-bold">
              <input type="checkbox" checked={showPast} onChange={(e) => setShowPast(e.target.checked)} className="h-4 w-4 accent-brand-500" /> Show past
            </label>
          </div>
          {Object.keys(groups).length === 0 && <p className="card p-6 text-center">No upcoming events right now.</p>}
          <div className="space-y-6">
            {Object.entries(groups).map(([m, evs]) => (
              <div key={m}>
                <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">{m}</p>
                <ul className="space-y-3">
                  {evs.map((e) => {
                    const t = TONES[EVENT_TONE[e.type]] || TONES.sky
                    const past = isPast(e.endDate || e.date)
                    return (
                      <li key={e.id}>
                        <button onClick={() => { const d = toDate(e.date); setMonth(new Date(d.getFullYear(), d.getMonth(), 1)) }}
                          className={`card flex w-full items-center gap-4 p-4 text-left transition hover:-translate-y-0.5 ${past ? 'opacity-55' : ''}`}>
                          <span className={`w-16 shrink-0 rounded-2xl py-2 text-center leading-tight ${t.bg} ${t.text}`}>
                            <span className="block font-display text-2xl font-extrabold">{fmtDate(e.date, { day: 'numeric' })}</span>
                            <span className="block text-[11px] font-bold uppercase">{fmtDate(e.date, { weekday: 'short' })}</span>
                          </span>
                          <span className="min-w-0">
                            <span className="block font-bold text-ink dark:text-white">{e.title}</span>
                            {e.endDate && <span className="block text-xs font-bold text-slate-500 dark:text-slate-400">till {fmtDate(e.endDate, { day: 'numeric', month: 'short' })}</span>}
                            {e.description && <span className="block text-sm">{e.description}</span>}
                            <ToneBadge tone={EVENT_TONE[e.type]} className="mt-1.5">{e.type}</ToneBadge>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
