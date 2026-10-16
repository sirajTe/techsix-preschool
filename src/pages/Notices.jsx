import { useState } from 'react'
import { NOTICE_CATEGORIES } from '../data/site'
import { downloadBlob, fmtDate, getFile, isNew, useCollection } from '../lib/store'
import { noticePdf } from '../lib/pdf'
import { EmptyState, Icon, PageHero, ToneBadge } from '../components/ui'

const CAT_TONE = { General: 'sky', Holiday: 'rose', PTM: 'lilac', Event: 'butter', Fees: 'mint', Exam: 'peach' }

export default function Notices() {
  const notices = useCollection('notices').slice().sort((a, b) => b.date.localeCompare(a.date))
  const [cat, setCat] = useState('All')
  const [open, setOpen] = useState(() => (location.hash ? location.hash.slice(1) : notices[0]?.id))
  const list = notices.filter((n) => cat === 'All' || n.category === cat)

  const download = async (n) => {
    if (n.fileId) {
      const f = await getFile(n.fileId)
      if (f) return downloadBlob(f.blob, f.name)
    }
    noticePdf(n)
  }

  return (
    <>
      <PageHero eyebrow="Parent corner" title="Notice Board" text="Stay up to date with announcements, holidays, PTMs and events. Every notice can be downloaded as a PDF." emoji="📌" />
      <section className="section container-x">
        <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap gap-2">
          {['All', ...NOTICE_CATEGORIES].map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`chip px-4 py-2 text-sm transition ${cat === c ? 'bg-brand-500 text-white' : 'bg-white text-ink ring-1 ring-slate-900/10 hover:bg-brand-50 dark:bg-white/5 dark:text-white dark:ring-white/10'}`}>
              {c}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <EmptyState emoji="📭" title="No notices in this category" />
        ) : (
          <ol className="relative space-y-4 border-l-2 border-dashed border-brand-200 pl-6 sm:pl-8 dark:border-brand-500/30">
            {list.map((n) => {
              const expanded = open === n.id
              return (
                <li key={n.id} id={n.id} className="relative scroll-mt-28">
                  <span className={`absolute -left-[33px] top-6 h-4 w-4 rounded-full ring-4 ring-cream sm:-left-[41px] dark:ring-night ${isNew(n.date) ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                  <article className={`card overflow-hidden transition ${n.important ? 'ring-2 ring-brand-300 dark:ring-brand-500/50' : ''}`}>
                    <button onClick={() => setOpen(expanded ? null : n.id)} aria-expanded={expanded} className="flex w-full items-start gap-4 p-5 text-left sm:p-6">
                      <span className="w-16 shrink-0 rounded-2xl bg-brand-50 py-2 text-center leading-tight text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
                        <span className="block font-display text-2xl font-extrabold">{fmtDate(n.date, { day: 'numeric' })}</span>
                        <span className="block text-[11px] font-bold uppercase">{fmtDate(n.date, { month: 'short', year: '2-digit' })}</span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="mb-1.5 flex flex-wrap items-center gap-1.5">
                          {isNew(n.date) && <span className="chip bg-brand-500 text-white">● New</span>}
                          {n.important && <span className="chip bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300">Important</span>}
                          <ToneBadge tone={CAT_TONE[n.category] || 'sky'}>{n.category || 'General'}</ToneBadge>
                        </span>
                        <span className="block font-display text-xl font-bold leading-snug text-ink dark:text-white">{n.title}</span>
                        {!expanded && <span className="mt-1 line-clamp-1 block text-sm">{n.body}</span>}
                      </span>
                      <Icon name="chevron" className={`mt-2 h-5 w-5 shrink-0 text-slate-400 transition ${expanded ? 'rotate-180' : ''}`} />
                    </button>
                    {expanded && (
                      <div className="animate-fade-up border-t border-slate-100 px-5 pb-6 pt-4 sm:px-6 dark:border-white/10">
                        <p className="whitespace-pre-line leading-relaxed">{n.body}</p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          <button onClick={() => download(n)} className="btn-primary"><Icon name="download" className="h-4 w-4" /> Download PDF</button>
                          {n.fileId && <button onClick={() => noticePdf(n)} className="btn-ghost">Printable notice</button>}
                        </div>
                      </div>
                    )}
                  </article>
                </li>
              )
            })}
          </ol>
        )}
        </div>
      </section>
    </>
  )
}
