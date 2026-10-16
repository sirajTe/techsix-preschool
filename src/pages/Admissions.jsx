import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CLASSES, school, whatsappLink } from '../data/site'
import { addItem } from '../lib/store'
import { BrandIcon, Icon, PageHero } from '../components/ui'

const STEPS = [
  { icon: '📝', title: 'Send an enquiry', text: 'Fill the form or WhatsApp us.' },
  { icon: '🏫', title: 'Visit the campus', text: 'Meet teachers & see classrooms.' },
  { icon: '📄', title: 'Submit documents', text: 'Birth certificate, photos, address proof & medical certificate.' },
  { icon: '🎒', title: 'Welcome aboard!', text: 'Orientation and a gentle settling-in week.' },
]

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs font-bold text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  )
}

const mobile = (phone) => phone.replace(/\D/g, '').slice(-10)

const empty = { childName: '', age: '', parentName: '', phone: '', className: '', message: '' }

export default function Admissions() {
  const [params] = useSearchParams()
  const [form, setForm] = useState(() => ({ ...empty, className: params.get('class') || '' }))
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(null)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const validate = () => {
    const e = {}
    if (form.childName.trim().length < 2) e.childName = "Please enter your child's name"
    if (!form.age.trim()) e.age = "Please enter your child's age"
    if (form.parentName.trim().length < 2) e.parentName = 'Please enter your name'
    if (!/^[6-9]\d{9}$/.test(mobile(form.phone))) e.phone = 'Please enter a valid 10-digit mobile number'
    if (!form.className) e.className = 'Please choose a class'
    setErrors(e)
    return !Object.keys(e).length
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const rec = addItem('enquiries', { ...form, phone: mobile(form.phone), status: 'New' })
    setDone(rec)
    setForm(empty)
  }

  const waText = (r) => `Hi ${school.short}! Admission enquiry for ${r.session || school.session}:\nChild: ${r.childName} (${r.age})\nClass: ${r.className}\nParent: ${r.parentName}\nPhone: ${r.phone}${r.message ? `\nMessage: ${r.message}` : ''}`

  return (
    <>
      <PageHero eyebrow={`Admissions ${school.session}`} title="Join the TechSix family" text="Seats are limited in every class. Send us an enquiry and our team will call you back within one working day." emoji="🎒" />
      <section className="section container-x grid items-start gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="text-3xl font-extrabold">How admission works</h2>
          <ol className="mt-6 space-y-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="card flex items-start gap-4 p-5">
                <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-2xl dark:bg-brand-500/15">
                  {s.icon}
                  <span className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-brand-500 text-xs font-extrabold text-white">{i + 1}</span>
                </span>
                <div><h3 className="text-lg font-bold">{s.title}</h3><p className="text-sm">{s.text}</p></div>
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-3xl bg-amber-50 p-5 text-sm dark:bg-amber-400/10">
            <p className="font-extrabold text-ink dark:text-amber-200">Age criteria (as on 31st March 2027)</p>
            <p className="mt-1">Playgroup 1.5+ · Nursery 2.5+ · LKG 3.5+ · UKG 4.5+ years</p>
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          {done ? (
            <div className="animate-fade-up py-6 text-center">
              <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-4xl dark:bg-emerald-400/15">🎉</div>
              <h2 className="text-3xl font-extrabold">Thank you, {done.parentName.split(' ')[0]}!</h2>
              <p className="mx-auto mt-2 max-w-sm">We've received your enquiry for <strong>{done.childName}</strong> ({done.className}). Our admissions team will call you on <strong>{done.phone}</strong> shortly.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a href={whatsappLink(waText(done))} target="_blank" rel="noopener noreferrer" className="btn bg-[#25D366] text-white hover:brightness-95"><BrandIcon name="whatsapp" /> Also send on WhatsApp</a>
                <button onClick={() => setDone(null)} className="btn-ghost">New enquiry</button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <h2 className="text-3xl font-extrabold">Admission enquiry</h2>
              <p className="mt-1 text-sm">Fields marked * are required.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field id="childName" error={errors.childName} label="Child's name *"><input id="childName" value={form.childName} onChange={set('childName')} className="field" placeholder="e.g. Aarav" /></Field>
                <Field id="age" error={errors.age} label="Child's age *"><input id="age" value={form.age} onChange={set('age')} className="field" placeholder="e.g. 3 years 2 months" /></Field>
                <Field id="parentName" error={errors.parentName} label="Parent's name *"><input id="parentName" value={form.parentName} onChange={set('parentName')} className="field" placeholder="Full name" autoComplete="name" /></Field>
                <Field id="phone" error={errors.phone} label="Mobile number *"><input id="phone" type="tel" inputMode="numeric" value={form.phone} onChange={set('phone')} className="field" placeholder="10-digit mobile" autoComplete="tel" /></Field>
              </div>
              <div className="mt-4">
                <Field id="className" error={errors.className} label="Class applying for *">
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {[...CLASSES, 'Daycare'].map((c) => (
                      <button type="button" key={c} onClick={() => setForm({ ...form, className: c })} aria-pressed={form.className === c}
                        className={`rounded-2xl px-2 py-3 text-sm font-extrabold transition ${form.className === c ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30' : 'bg-slate-50 text-ink ring-1 ring-slate-900/10 hover:bg-brand-50 dark:bg-white/5 dark:text-white dark:ring-white/10'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
              <div className="mt-4">
                <label htmlFor="message" className="field-label">Message (optional)</label>
                <textarea id="message" rows={3} value={form.message} onChange={set('message')} className="field resize-none" placeholder="Preferred visit time, transport needs, questions…" />
              </div>
              <button className="btn-primary mt-6 w-full py-3.5 text-base">Submit enquiry <Icon name="arrow" className="h-4 w-4" /></button>
              <p className="mt-3 text-center text-xs">Prefer to talk? Call <a href={school.phoneHref} className="font-bold text-brand-600 dark:text-brand-300">{school.phone}</a> or <Link to="/contact" className="font-bold text-brand-600 dark:text-brand-300">visit us</Link>.</p>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
