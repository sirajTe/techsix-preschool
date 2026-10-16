import { useState } from 'react'
import { GRADE_KEY, school } from '../data/site'
import { fmtDate, getAll } from '../lib/store'
import { reportCardPdf } from '../lib/pdf'
import { Icon, PageHero } from '../components/ui'

const GRADE_STYLE = {
  'A+': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300',
  A: 'bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300',
  'B+': 'bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300',
  B: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
  C: 'bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300',
}

const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, ' ')

export default function Results() {
  const [form, setForm] = useState({ id: '', dob: '' })
  const [matches, setMatches] = useState(null)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(0)

  const submit = (e) => {
    e.preventDefault()
    setError('')
    const id = norm(form.id)
    const found = getAll('results').filter((r) => (norm(r.roll) === id || norm(r.name) === id) && r.dob === form.dob)
    if (!found.length) {
      setMatches(null)
      setError('No report found. Please check the name / roll number and date of birth, or contact the school office.')
      return
    }
    setMatches(found)
    setSelected(0)
    if (innerWidth < 1024) setTimeout(() => document.getElementById('report')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const r = matches?.[selected]

  return (
    <>
      <PageHero eyebrow="Parent corner" title="Progress Reports" text="View and download your child's report card securely using their roll number (or full name) and date of birth." emoji="🏅" />
      <section className="section container-x">
        <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
          <form onSubmit={submit} className="card p-6 sm:p-8 lg:sticky lg:top-28">
            <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-3xl dark:bg-amber-400/15">🔐</div>
            <h2 className="text-2xl font-extrabold">Find report card</h2>
            <p className="mt-1 text-sm">Both details must match our records.</p>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="sid" className="field-label">Roll number or student name</label>
                <input id="sid" required value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="e.g. TS-UKG-01" className="field" autoComplete="off" />
              </div>
              <div>
                <label htmlFor="dob" className="field-label">Date of birth</label>
                <input id="dob" type="date" required value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="field" />
              </div>
            </div>
            {error && <p role="alert" className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>}
            <button className="btn-primary mt-6 w-full py-3 text-base"><Icon name="search" className="h-4 w-4" /> View report</button>
            {/* DEMO ONLY: remove this hint before launch */}
            <p className="mt-4 rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-200">
              <strong>Demo:</strong> try roll no. <button type="button" className="font-mono font-bold underline" onClick={() => setForm({ id: 'TS-UKG-01', dob: '2021-05-14' })}>TS-UKG-01</button> with DOB 14 May 2021.
            </p>
          </form>

          {r ? (
            <article id="report" className="card animate-fade-up scroll-mt-24 overflow-hidden">
              <header className="bg-brand-500 p-6 text-white sm:p-8">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/80">{school.name}</p>
                <h2 className="mt-1 text-3xl font-extrabold !text-white">Progress Report</h2>
                <p className="text-white/85">{r.term}</p>
              </header>
              {matches.length > 1 && (
                <div className="flex gap-2 overflow-x-auto border-b border-slate-100 p-3 dark:border-white/10">
                  {matches.map((m, i) => (
                    <button key={m.id} onClick={() => setSelected(i)} className={`chip shrink-0 px-3 py-1.5 text-sm ${i === selected ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'bg-slate-100 dark:bg-white/10'}`}>{m.term}</button>
                  ))}
                </div>
              )}
              <div className="p-6 sm:p-8">
                <dl className="grid grid-cols-2 gap-4 rounded-3xl bg-brand-50 p-5 sm:grid-cols-3 dark:bg-white/5">
                  {[['Student', r.name], ['Roll no.', r.roll], ['Class', r.className], ['Date of birth', fmtDate(r.dob)], ['Attendance', r.attendance || '—'], ['Session', school.session]].map(([k, v]) => (
                    <div key={k}><dt className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{k}</dt><dd className="font-bold text-ink dark:text-white">{v}</dd></div>
                  ))}
                </dl>
                <h3 className="mb-3 mt-7 text-lg font-bold">Areas of development</h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(r.grades || {}).map(([s, g]) => (
                    <li key={s} className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 ring-1 ring-slate-900/5 dark:ring-white/10">
                      <span className="font-semibold text-ink dark:text-slate-200">{s}</span>
                      <span className="flex items-center gap-2">
                        <span className="hidden text-xs text-slate-500 sm:inline dark:text-slate-400">{GRADE_KEY[g]}</span>
                        <span className={`grid h-9 w-11 place-items-center rounded-xl font-display text-lg font-extrabold ${GRADE_STYLE[g] || ''}`}>{g}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                {r.remarks && (
                  <div className="mt-6 rounded-3xl bg-amber-50 p-5 dark:bg-amber-400/10">
                    <p className="mb-1 text-sm font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300">Teacher's remarks</p>
                    <p className="leading-relaxed text-ink dark:text-slate-200">{r.remarks}</p>
                  </div>
                )}
                <div className="mt-7 flex flex-wrap gap-3">
                  <button onClick={() => reportCardPdf(r)} className="btn-primary py-3"><Icon name="download" className="h-4 w-4" /> Download report card (PDF)</button>
                  <button onClick={() => { setMatches(null); setForm({ id: '', dob: '' }) }} className="btn-ghost py-3">Search another</button>
                </div>
              </div>
            </article>
          ) : (
            <div className="hidden min-h-[420px] place-items-center rounded-[2rem] border-2 border-dashed border-slate-200 p-10 text-center lg:grid dark:border-white/10">
              <div>
                <div className="mb-3 text-6xl">📄</div>
                <p className="font-display text-xl font-bold text-ink dark:text-white">Your child's report card will appear here</p>
                <p className="mt-1 text-sm">Enter the details on the left to get started.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
