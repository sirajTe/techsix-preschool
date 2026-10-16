import { useMemo, useRef, useState } from 'react'
import {
  CLASSES, DOWNLOAD_CATEGORIES, EVENT_TONE, EVENT_TYPES, GALLERY_CATEGORIES, GRADES,
  NOTICE_CATEGORIES, SUBJECTS, school,
} from '../../data/site'
import {
  addItem, downloadBlob, fmtDate, formatSize, isNew, removeItem, resetDemo, saveFile, updateItem, useCollection,
} from '../../lib/store'
import { reportCardPdf } from '../../lib/pdf'
import { downloadItem } from '../Downloads'
import { GalleryImage } from '../Gallery'
import { BrandIcon, Icon, Toast, ToneBadge } from '../../components/ui'

const today = () => new Date().toISOString().slice(0, 10)
const MAX_MB = 10

// ─── Shared building blocks ──────────────────────────────────────────────────
function PanelHeader({ icon, title, text, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="flex items-center gap-2 text-3xl font-extrabold"><span>{icon}</span>{title}</h2>
        {text && <p className="mt-1 text-sm">{text}</p>}
      </div>
      {children}
    </div>
  )
}

function FormCard({ title, onSubmit, children, submitLabel = 'Save', busy, onCancel }) {
  return (
    <form onSubmit={onSubmit} className="card p-5 sm:p-6">
      <h3 className="mb-4 flex items-center gap-2 text-xl font-bold"><Icon name="plus" className="h-5 w-5 text-brand-500" />{title}</h3>
      <div className="space-y-4">{children}</div>
      <div className="mt-5 flex gap-2">
        <button disabled={busy} className="btn-primary py-3">{busy ? 'Saving…' : submitLabel}</button>
        {onCancel && <button type="button" onClick={onCancel} className="btn-ghost py-3">Cancel</button>}
      </div>
    </form>
  )
}

function Input({ label, ...props }) {
  return <label className="block"><span className="field-label">{label}</span><input className="field" {...props} /></label>
}

function Select({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <span className="relative block">
        <select className="field appearance-none pr-10" {...props}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <Icon name="chevron" className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </span>
    </label>
  )
}

function FilePicker({ label, accept, file, onChange, hint }) {
  const ref = useRef(null)
  return (
    <div>
      <span className="field-label">{label}</span>
      <button type="button" onClick={() => ref.current?.click()}
        className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-left transition hover:border-brand-300 hover:bg-brand-50 dark:border-white/15 dark:bg-white/5 dark:hover:border-brand-500/50">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-brand-500 shadow-sm dark:bg-white/10"><Icon name={file ? 'check' : 'download'} className={`h-5 w-5 ${file ? '' : 'rotate-180'}`} /></span>
        <span className="min-w-0">
          <span className="block truncate font-bold text-ink dark:text-white">{file ? file.name : 'Tap to choose a file'}</span>
          <span className="block text-xs">{file ? formatSize(file.size) : hint}</span>
        </span>
      </button>
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => onChange(e.target.files?.[0] || null)} />
    </div>
  )
}

function DeleteButton({ onConfirm, label = 'Delete' }) {
  const [ask, setAsk] = useState(false)
  if (ask) {
    return (
      <span className="flex items-center gap-1">
        <button onClick={onConfirm} className="chip bg-rose-500 px-3 py-1.5 text-white">Yes, delete</button>
        <button onClick={() => setAsk(false)} className="chip bg-slate-100 px-3 py-1.5 dark:bg-white/10">No</button>
      </span>
    )
  }
  return (
    <button onClick={() => setAsk(true)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10" aria-label={label} title={label}>
      <Icon name="trash" className="h-[18px] w-[18px]" />
    </button>
  )
}

function useToast() {
  const [msg, setMsg] = useState('')
  return [<Toast key="t" message={msg} onDone={() => setMsg('')} />, setMsg]
}

function checkFile(file, kind) {
  if (!file) return `Please choose a ${kind}.`
  if (file.size > MAX_MB * 1024 * 1024) return `File is too large. Please keep it under ${MAX_MB} MB.`
  return null
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export function OverviewPanel({ goTo }) {
  const enquiries = useCollection('enquiries')
  const notices = useCollection('notices')
  const downloads = useCollection('downloads')
  const results = useCollection('results')
  const stats = [
    { label: 'New enquiries', value: enquiries.filter((q) => q.status === 'New').length, icon: '📨', tab: 'enquiries', tone: 'bg-orange-100 dark:bg-orange-400/15' },
    { label: 'Notices posted', value: notices.length, icon: '📌', tab: 'notices', tone: 'bg-sky-100 dark:bg-sky-400/15' },
    { label: 'Files for parents', value: downloads.length, icon: '📥', tab: 'downloads', tone: 'bg-emerald-100 dark:bg-emerald-400/15' },
    { label: 'Report cards', value: results.length, icon: '🏅', tab: 'results', tone: 'bg-amber-100 dark:bg-amber-400/15' },
  ]
  const actions = [
    ['📌', 'Post a notice', 'notices'], ['📥', 'Upload worksheet / book', 'downloads'], ['🏅', 'Add student result', 'results'], ['📅', 'Add an event', 'events'], ['📸', 'Upload photos', 'gallery'],
  ]
  return (
    <>
      <div className="mb-6 overflow-hidden rounded-[2rem] bg-brand-500 p-6 text-white sm:p-8">
        <p className="text-sm font-bold text-white/80">{fmtDate(today(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <h2 className="mt-1 text-3xl font-extrabold !text-white">Welcome back! 👋</h2>
        <p className="mt-1 text-white/85">Manage everything on the {school.short} website from here. No coding needed.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <button key={s.label} onClick={() => goTo(s.tab)} className="card p-5 text-left transition hover:-translate-y-0.5">
            <span className={`mb-3 grid h-11 w-11 place-items-center rounded-xl text-xl ${s.tone}`}>{s.icon}</span>
            <span className="block font-display text-3xl font-extrabold text-ink dark:text-white">{s.value}</span>
            <span className="block text-sm font-semibold">{s.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <div className="card p-5 sm:p-6">
          <h3 className="mb-4 text-xl font-bold">Quick actions</h3>
          <div className="grid gap-2">
            {actions.map(([icon, label, tab]) => (
              <button key={label} onClick={() => goTo(tab)} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-left font-bold text-ink transition hover:bg-brand-50 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                <span className="text-xl">{icon}</span><span className="flex-1">{label}</span><Icon name="arrow" className="h-4 w-4 text-brand-500" />
              </button>
            ))}
          </div>
        </div>
        <div className="card p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold">Latest admission enquiries</h3>
            <button onClick={() => goTo('enquiries')} className="text-sm font-extrabold text-brand-600 dark:text-brand-300">View all</button>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-white/10">
            {enquiries.slice(0, 5).map((q) => (
              <li key={q.id} className="flex items-center gap-3 py-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 font-display font-extrabold text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">{q.childName[0]}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold text-ink dark:text-white">{q.childName} · {q.className}</span>
                  <span className="block truncate text-xs">{q.parentName} · {q.phone} · {fmtDate(q.createdAt)}</span>
                </span>
                <StatusBadge status={q.status} />
              </li>
            ))}
            {!enquiries.length && <li className="py-6 text-center text-sm">No enquiries yet.</li>}
          </ul>
        </div>
      </div>
    </>
  )
}

// ─── Enquiries ───────────────────────────────────────────────────────────────
const STATUSES = ['New', 'Contacted', 'Visited', 'Admitted', 'Not interested']
const STATUS_TONE = { New: 'peach', Contacted: 'sky', Visited: 'lilac', Admitted: 'mint', 'Not interested': 'rose' }
const StatusBadge = ({ status }) => <ToneBadge tone={STATUS_TONE[status] || 'sky'}>{status}</ToneBadge>

export function EnquiriesPanel() {
  const enquiries = useCollection('enquiries')
  const [filter, setFilter] = useState('All')
  const [q, setQ] = useState('')
  const list = enquiries.filter((e) =>
    (filter === 'All' || e.status === filter) &&
    (!q || `${e.childName} ${e.parentName} ${e.phone}`.toLowerCase().includes(q.toLowerCase())))

  const exportCsv = () => {
    const cols = ['createdAt', 'childName', 'age', 'className', 'parentName', 'phone', 'message', 'status']
    const esc = (v = '') => `"${String(v).replace(/"/g, '""')}"`
    const csv = [cols.join(','), ...enquiries.map((e) => cols.map((c) => esc(c === 'createdAt' ? fmtDate(e[c]) : e[c])).join(','))].join('\n')
    downloadBlob(new Blob(['﻿' + csv], { type: 'text/csv' }), `TechSix enquiries ${today()}.csv`)
  }

  return (
    <>
      <PanelHeader icon="📨" title="Admission enquiries" text="Enquiries submitted from the website's Admissions page.">
        <button onClick={exportCsv} className="btn-ghost"><Icon name="download" className="h-4 w-4" /> Export to Excel (CSV)</button>
      </PanelHeader>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {['All', ...STATUSES].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`chip px-3 py-1.5 text-sm ${filter === s ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'bg-white ring-1 ring-slate-900/10 dark:bg-white/5 dark:ring-white/10'}`}>
              {s} <span className="opacity-60">{s === 'All' ? enquiries.length : enquiries.filter((e) => e.status === s).length}</span>
            </button>
          ))}
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or phone…" className="field py-2.5 sm:w-64" />
      </div>
      <div className="space-y-3">
        {list.map((e) => (
          <div key={e.id} className="card p-4 sm:p-5">
            <div className="flex flex-wrap items-start gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-xl font-bold text-ink dark:text-white">{e.childName}</p>
                  <ToneBadge tone="peach">{e.className}</ToneBadge>
                  <span className="text-xs font-semibold text-slate-500">{e.age}</span>
                </div>
                <p className="mt-0.5 text-sm"><strong className="text-ink dark:text-slate-200">{e.parentName}</strong> · {e.phone} · {fmtDate(e.createdAt, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</p>
                {e.message && <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm dark:bg-white/5">“{e.message}”</p>}
              </div>
              <div className="flex items-center gap-2">
                <select value={e.status} onChange={(ev) => updateItem('enquiries', e.id, { status: ev.target.value })} className="field w-auto py-2 text-sm font-bold" aria-label="Status">
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <a href={`tel:+91${e.phone}`} className="grid h-9 w-9 place-items-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300" aria-label="Call"><Icon name="phone" className="h-4 w-4" /></a>
                <a href={`https://wa.me/91${e.phone}?text=${encodeURIComponent(`Hello ${e.parentName}, thank you for your enquiry at ${school.name} for ${e.childName}.`)}`} target="_blank" rel="noopener noreferrer" className="grid h-9 w-9 place-items-center rounded-full bg-[#25D366]/15 text-[#128C7E]" aria-label="WhatsApp"><BrandIcon name="whatsapp" className="h-4 w-4" /></a>
                <DeleteButton onConfirm={() => removeItem('enquiries', e.id)} />
              </div>
            </div>
          </div>
        ))}
        {!list.length && <p className="card p-8 text-center">No enquiries match.</p>}
      </div>
    </>
  )
}

// ─── Notices ─────────────────────────────────────────────────────────────────
export function NoticesPanel() {
  const notices = useCollection('notices').slice().sort((a, b) => b.date.localeCompare(a.date))
  const blank = { title: '', date: today(), category: 'General', body: '', important: false }
  const [form, setForm] = useState(blank)
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [toast, say] = useToast()

  const submit = async (e) => {
    e.preventDefault()
    if (file && checkFile(file)) return alert(checkFile(file))
    setBusy(true)
    try {
      const fileId = file ? await saveFile(file) : undefined
      addItem('notices', { ...form, fileId })
      setForm(blank); setFile(null)
      say('✅ Notice published on the website')
    } finally { setBusy(false) }
  }

  return (
    <>
      <PanelHeader icon="📌" title="Notice board" text="Notices from the last 7 days show a “New” badge automatically. Parents can download every notice as a PDF." />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,420px)_1fr]">
        <FormCard title="Post a new notice" onSubmit={submit} submitLabel="Publish notice" busy={busy}>
          <Input label="Title *" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. School closed on Friday" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date *" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <Select label="Category" options={NOTICE_CATEGORIES} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <label className="block"><span className="field-label">Notice details *</span>
            <textarea required rows={5} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="field" placeholder="Write the full notice for parents…" />
          </label>
          <FilePicker label="Attach a PDF (optional)" accept="application/pdf" file={file} onChange={setFile} hint={`If attached, parents download this file. PDF, up to ${MAX_MB} MB`} />
          <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={form.important} onChange={(e) => setForm({ ...form, important: e.target.checked })} className="h-4 w-4 accent-brand-500" /> Mark as important (highlighted)</label>
        </FormCard>
        <div className="space-y-3">
          {notices.map((n) => (
            <div key={n.id} className="card flex items-start gap-4 p-4">
              <span className="w-14 shrink-0 rounded-xl bg-brand-50 py-1.5 text-center leading-tight text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
                <span className="block font-display text-xl font-extrabold">{fmtDate(n.date, { day: 'numeric' })}</span>
                <span className="block text-[10px] font-bold uppercase">{fmtDate(n.date, { month: 'short' })}</span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-1.5 font-bold text-ink dark:text-white">
                  {n.title}
                  {isNew(n.date) && <span className="chip bg-brand-500 text-white">New</span>}
                  {n.important && <span className="chip bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300">Important</span>}
                  {n.fileId && <span className="chip bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300">📎 PDF</span>}
                </p>
                <p className="line-clamp-2 text-sm">{n.body}</p>
              </div>
              <DeleteButton onConfirm={() => removeItem('notices', n.id)} />
            </div>
          ))}
        </div>
      </div>
      {toast}
    </>
  )
}

// ─── Downloads ───────────────────────────────────────────────────────────────
export function DownloadsPanel() {
  const items = useCollection('downloads')
  const blank = { title: '', className: 'Nursery', category: 'Worksheets' }
  const [form, setForm] = useState(blank)
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [filter, setFilter] = useState('All')
  const [toast, say] = useToast()

  const submit = async (e) => {
    e.preventDefault()
    const err = checkFile(file, 'PDF file')
    if (err) return alert(err)
    setBusy(true)
    try {
      const fileId = await saveFile(file)
      addItem('downloads', { ...form, title: form.title || file.name.replace(/\.pdf$/i, ''), fileId, size: formatSize(file.size) })
      setForm({ ...blank, className: form.className, category: form.category }); setFile(null)
      say('✅ File uploaded, now visible to parents')
    } finally { setBusy(false) }
  }

  const list = items.filter((d) => filter === 'All' || d.className === filter)
  return (
    <>
      <PanelHeader icon="📥" title="Downloads" text="Upload books lists, worksheets, syllabus and holiday homework. They appear instantly on the Downloads page under the chosen class." />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,420px)_1fr]">
        <FormCard title="Upload a file" onSubmit={submit} submitLabel="Upload" busy={busy}>
          <FilePicker label="PDF file *" accept="application/pdf,.pdf" file={file} onChange={setFile} hint={`PDF, up to ${MAX_MB} MB`} />
          <Input label="Title (shown to parents)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. UKG Maths Worksheet 4" />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Class" options={CLASSES} value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} />
            <Select label="Type" options={DOWNLOAD_CATEGORIES} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
        </FormCard>
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {['All', ...CLASSES].map((c) => (
              <button key={c} onClick={() => setFilter(c)} className={`chip px-3 py-1.5 text-sm ${filter === c ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'bg-white ring-1 ring-slate-900/10 dark:bg-white/5 dark:ring-white/10'}`}>
                {c} <span className="opacity-60">{c === 'All' ? items.length : items.filter((d) => d.className === c).length}</span>
              </button>
            ))}
          </div>
          <div className="card divide-y divide-slate-100 dark:divide-white/10">
            {list.map((d) => (
              <div key={d.id} className="flex items-center gap-3 p-4">
                <span className="grid h-11 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-[10px] font-extrabold text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">PDF</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-ink dark:text-white">{d.title}</p>
                  <p className="text-xs">{d.className} · {d.category} · {d.fileId ? d.size : 'Sample (demo)'}</p>
                </div>
                <button onClick={() => downloadItem(d)} className="grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10" aria-label="Preview download" title="Download"><Icon name="download" className="h-[18px] w-[18px]" /></button>
                <DeleteButton onConfirm={() => removeItem('downloads', d.id)} />
              </div>
            ))}
            {!list.length && <p className="p-8 text-center text-sm">No files for this class yet.</p>}
          </div>
        </div>
      </div>
      {toast}
    </>
  )
}

// ─── Results ─────────────────────────────────────────────────────────────────
export function ResultsPanel() {
  const results = useCollection('results')
  const blank = { name: '', roll: '', className: 'Nursery', dob: '', term: `Term 1 (${school.session})`, attendance: '', remarks: '', grades: Object.fromEntries(SUBJECTS.map((s) => [s, 'A'])) }
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState(null)
  const [q, setQ] = useState('')
  const [toast, say] = useToast()
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const dup = results.find((r) => r.id !== editing && r.roll.trim().toLowerCase() === form.roll.trim().toLowerCase() && r.term === form.term)
    if (dup) return alert(`A ${form.term} result already exists for roll no. ${form.roll}. Edit that one instead.`)
    const rec = { ...form, roll: form.roll.trim().toUpperCase(), name: form.name.trim() }
    if (editing) { updateItem('results', editing, rec); say('✅ Result updated') }
    else { addItem('results', rec); say('✅ Result published. Parents can now view it.') }
    setForm(blank); setEditing(null)
  }

  const edit = (r) => { setEditing(r.id); setForm({ ...blank, ...r }); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const list = useMemo(() => results.filter((r) => !q || `${r.name} ${r.roll}`.toLowerCase().includes(q.toLowerCase())), [results, q])

  return (
    <>
      <PanelHeader icon="🏅" title="Results & progress reports" text="Parents view these on the Results page using the roll number (or name) and date of birth." />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,460px)_1fr]">
        <FormCard title={editing ? 'Edit result' : 'Add a student result'} onSubmit={submit} submitLabel={editing ? 'Save changes' : 'Publish result'} onCancel={editing ? () => { setEditing(null); setForm(blank) } : null}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Student name *" required value={form.name} onChange={set('name')} placeholder="Full name" />
            <Input label="Roll number *" required value={form.roll} onChange={set('roll')} placeholder="e.g. TS-LKG-05" />
            <Select label="Class" options={CLASSES} value={form.className} onChange={set('className')} />
            <Input label="Date of birth *" type="date" required value={form.dob} onChange={set('dob')} />
            <Input label="Term *" required value={form.term} onChange={set('term')} />
            <Input label="Attendance" value={form.attendance} onChange={set('attendance')} placeholder="e.g. 94%" />
          </div>
          <div>
            <span className="field-label">Grades</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {SUBJECTS.map((s) => (
                <div key={s} className="flex items-center justify-between gap-2 rounded-2xl bg-slate-50 py-1.5 pl-3 pr-1.5 dark:bg-white/5">
                  <span className="text-sm font-semibold text-ink dark:text-slate-200">{s}</span>
                  <div className="flex gap-0.5">
                    {GRADES.map((g) => (
                      <button type="button" key={g} onClick={() => setForm({ ...form, grades: { ...form.grades, [s]: g } })}
                        className={`h-8 min-w-8 rounded-lg px-1 text-xs font-extrabold transition ${form.grades[s] === g ? 'bg-brand-500 text-white' : 'text-slate-500 hover:bg-white dark:hover:bg-white/10'}`}>{g}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <label className="block"><span className="field-label">Teacher's remarks</span>
            <textarea rows={3} value={form.remarks} onChange={set('remarks')} className="field" placeholder="A few encouraging lines about the child's progress…" />
          </label>
        </FormCard>
        <div>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or roll no…" className="field mb-3" />
          <div className="card divide-y divide-slate-100 dark:divide-white/10">
            {list.map((r) => (
              <div key={r.id} className={`flex items-center gap-3 p-4 ${editing === r.id ? 'bg-brand-50 dark:bg-brand-500/10' : ''}`}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 font-display font-extrabold text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">{r.name[0]}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-ink dark:text-white">{r.name} <span className="font-mono text-xs font-semibold text-slate-500">{r.roll}</span></p>
                  <p className="text-xs">{r.className} · {r.term} · DOB {fmtDate(r.dob)}</p>
                </div>
                <button onClick={() => reportCardPdf(r)} className="grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10" title="Download PDF" aria-label="Download PDF"><Icon name="download" className="h-[18px] w-[18px]" /></button>
                <button onClick={() => edit(r)} className="chip bg-slate-100 px-3 py-1.5 dark:bg-white/10">Edit</button>
                <DeleteButton onConfirm={() => removeItem('results', r.id)} />
              </div>
            ))}
            {!list.length && <p className="p-8 text-center text-sm">No results found.</p>}
          </div>
        </div>
      </div>
      {toast}
    </>
  )
}

// ─── Events ──────────────────────────────────────────────────────────────────
export function EventsPanel() {
  const events = useCollection('events').slice().sort((a, b) => a.date.localeCompare(b.date))
  const blank = { title: '', date: today(), endDate: '', type: 'Event', description: '' }
  const [form, setForm] = useState(blank)
  const [toast, say] = useToast()
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (form.endDate && form.endDate < form.date) return alert('End date cannot be before the start date.')
    addItem('events', { ...form, endDate: form.endDate || undefined })
    setForm(blank)
    say('✅ Added to the events calendar')
  }

  return (
    <>
      <PanelHeader icon="📅" title="Events calendar" text="Holidays, PTMs, celebrations and sports days shown on the Events page and home page." />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,420px)_1fr]">
        <FormCard title="Add an event or holiday" onSubmit={submit} submitLabel="Add to calendar">
          <Input label="Title *" required value={form.title} onChange={set('title')} placeholder="e.g. Sports Day" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date *" type="date" required value={form.date} onChange={set('date')} />
            <Input label="End date (if multi-day)" type="date" value={form.endDate} min={form.date} onChange={set('endDate')} />
          </div>
          <Select label="Type" options={EVENT_TYPES} value={form.type} onChange={set('type')} />
          <Input label="Short description" value={form.description} onChange={set('description')} placeholder="e.g. Reporting time 8:30 AM" />
        </FormCard>
        <div className="card divide-y divide-slate-100 dark:divide-white/10">
          {events.map((e) => (
            <div key={e.id} className="flex items-center gap-3 p-4">
              <span className="w-24 shrink-0 text-sm font-extrabold text-ink dark:text-white">{fmtDate(e.date, { day: 'numeric', month: 'short', year: '2-digit' })}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink dark:text-white">{e.title}</p>
                <p className="truncate text-xs">{e.endDate ? `till ${fmtDate(e.endDate)} · ` : ''}{e.description}</p>
              </div>
              <ToneBadge tone={EVENT_TONE[e.type]}>{e.type}</ToneBadge>
              <DeleteButton onConfirm={() => removeItem('events', e.id)} />
            </div>
          ))}
        </div>
      </div>
      {toast}
    </>
  )
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
export function GalleryPanel() {
  const items = useCollection('gallery')
  const [files, setFiles] = useState([])
  const [form, setForm] = useState({ title: '', category: 'Celebrations' })
  const [busy, setBusy] = useState(false)
  const [toast, say] = useToast()
  const ref = useRef(null)

  const submit = async (e) => {
    e.preventDefault()
    if (!files.length) return alert('Please choose at least one photo.')
    if (files.some((f) => f.size > MAX_MB * 1024 * 1024)) return alert(`Each photo must be under ${MAX_MB} MB.`)
    setBusy(true)
    try {
      for (const [i, f] of files.entries()) {
        const fileId = await saveFile(f)
        addItem('gallery', { title: form.title ? (files.length > 1 ? `${form.title} ${i + 1}` : form.title) : f.name.replace(/\.\w+$/, ''), category: form.category, fileId })
      }
      say(`✅ ${files.length} photo${files.length > 1 ? 's' : ''} added to the gallery`)
      setFiles([]); setForm({ ...form, title: '' })
    } finally { setBusy(false) }
  }

  return (
    <>
      <PanelHeader icon="📸" title="Photo gallery" text="Upload event and activity photos. The illustrated placeholders can be deleted once real photos are added." />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,420px)_1fr]">
        <FormCard title="Upload photos" onSubmit={submit} submitLabel="Add to gallery" busy={busy}>
          <div>
            <span className="field-label">Photos *</span>
            <button type="button" onClick={() => ref.current?.click()} className="flex w-full flex-col items-center gap-1 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition hover:border-brand-300 hover:bg-brand-50 dark:border-white/15 dark:bg-white/5">
              <span className="text-3xl">🖼️</span>
              <span className="font-bold text-ink dark:text-white">{files.length ? `${files.length} photo${files.length > 1 ? 's' : ''} selected` : 'Tap to choose photos'}</span>
              <span className="text-xs">JPG or PNG · you can select several at once</span>
            </button>
            <input ref={ref} type="file" accept="image/*" multiple className="hidden" onChange={(e) => setFiles([...e.target.files])} />
          </div>
          <Input label="Caption" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Diwali celebration 2026" />
          <Select label="Album" options={GALLERY_CATEGORIES} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        </FormCard>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((g) => (
            <div key={g.id} className="card overflow-hidden">
              <div className="aspect-square"><GalleryImage item={g} className="[&>span:nth-child(2)]:text-5xl" /></div>
              <div className="flex items-center gap-1 p-2 pl-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink dark:text-white">{g.title}</p>
                  <p className="text-xs">{g.category}{!g.fileId && ' · placeholder'}</p>
                </div>
                <DeleteButton onConfirm={() => removeItem('gallery', g.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {toast}
    </>
  )
}

// ─── Settings ────────────────────────────────────────────────────────────────
export function SettingsPanel({ onLogout }) {
  const [toast, say] = useToast()
  return (
    <>
      <PanelHeader icon="⚙️" title="Settings" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-xl font-bold">Reset demo data</h3>
          <p className="mt-1 text-sm">Removes everything added in this browser and restores the sample notices, files, results, events and photos.</p>
          <button onClick={async () => { if (confirm('Reset all data back to the demo content?')) { await resetDemo(); say('✅ Demo data restored') } }} className="btn mt-4 bg-rose-50 text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30">Reset to demo content</button>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-bold">Signed in</h3>
          <p className="mt-1 text-sm">You stay signed in until you close this browser tab.</p>
          <button onClick={onLogout} className="btn-ghost mt-4"><Icon name="logout" className="h-4 w-4" /> Log out</button>
        </div>
        <div className="card p-6 md:col-span-2">
          <h3 className="text-xl font-bold">Need help?</h3>
          <p className="mt-1 text-sm">Every change you make here appears on the website instantly. To change the school's address, phone, timings or programs, contact your website administrator.</p>
        </div>
      </div>
      {toast}
    </>
  )
}
