import { useMemo, useState } from 'react'
import { CLASSES, DOWNLOAD_CATEGORIES, TONES } from '../data/site'
import { downloadBlob, fmtDate, getFile, useCollection } from '../lib/store'
import { samplePdf } from '../lib/pdf'
import { EmptyState, Icon, PageHero, ToneBadge } from '../components/ui'

const CAT_META = {
  Books: { icon: '📚', tone: 'sky' },
  Worksheets: { icon: '📝', tone: 'mint' },
  Syllabus: { icon: '🗂️', tone: 'lilac' },
  'Holiday Homework': { icon: '🏖️', tone: 'butter' },
}

export async function downloadItem(item) {
  if (item.fileId) {
    const f = await getFile(item.fileId)
    if (f) return downloadBlob(f.blob, f.name)
    alert('This file is no longer available. Please contact the school office.')
  } else {
    await samplePdf(item)
  }
}

export default function Downloads() {
  const items = useCollection('downloads')
  const [cls, setCls] = useState('All')
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')
  const [busy, setBusy] = useState(null)

  const filtered = useMemo(
    () => items.filter((d) =>
      (cls === 'All' || d.className === cls) &&
      (cat === 'All' || d.category === cat) &&
      (!q || d.title.toLowerCase().includes(q.toLowerCase()))),
    [items, cls, cat, q],
  )

  const get = async (d) => {
    setBusy(d.id)
    try { await downloadItem(d) } finally { setBusy(null) }
  }

  return (
    <>
      <PageHero eyebrow="Parent corner" title="Downloads" text="Books lists, worksheets, syllabus and holiday homework, organised class-wise. Tap to download as PDF." emoji="📥" />
      <section className="section container-x">
        <div className="card mb-8 p-4 sm:p-5">
          <div role="tablist" aria-label="Class" className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {['All', ...CLASSES].map((c) => (
              <button key={c} role="tab" aria-selected={cls === c} onClick={() => setCls(c)}
                className={`shrink-0 rounded-2xl px-5 py-2.5 font-display text-lg font-bold transition ${cls === c ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30' : 'bg-slate-50 text-ink hover:bg-brand-50 dark:bg-white/5 dark:text-white dark:hover:bg-white/10'}`}>
                {c === 'All' ? 'All classes' : c}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {['All', ...DOWNLOAD_CATEGORIES].map((c) => (
                <button key={c} onClick={() => setCat(c)}
                  className={`chip px-3.5 py-1.5 text-sm transition ${cat === c ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300'}`}>
                  {c !== 'All' && CAT_META[c].icon} {c}
                </button>
              ))}
            </div>
            <label className="relative md:w-72">
              <span className="sr-only">Search downloads</span>
              <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search files…" className="field py-2.5 pl-10" />
            </label>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState emoji="🔎" title="No files here yet" text="Try another class or category. New material is added by the school regularly." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d) => {
              const meta = CAT_META[d.category] || CAT_META.Books
              return (
                <div key={d.id} className="card flex flex-col p-5">
                  <div className="flex items-start gap-4">
                    <span className={`relative grid h-14 w-12 shrink-0 place-items-center rounded-xl text-2xl ${TONES[meta.tone].bg}`}>
                      {meta.icon}
                      <span className="absolute -bottom-1.5 rounded bg-brand-500 px-1 text-[9px] font-extrabold text-white">PDF</span>
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-sans text-base font-extrabold leading-snug">{d.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <ToneBadge tone="peach">{d.className}</ToneBadge>
                        <ToneBadge tone={meta.tone}>{d.category}</ToneBadge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500 dark:border-white/10 dark:text-slate-400">
                    <span>{d.createdAt ? fmtDate(d.createdAt) : 'Session 2026–27'} · {d.size}</span>
                    <button onClick={() => get(d)} disabled={busy === d.id} className="btn-soft px-4 py-2">
                      <Icon name="download" className="h-4 w-4" /> {busy === d.id ? 'Preparing…' : 'Download'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
