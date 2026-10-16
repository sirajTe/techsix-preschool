import { Link } from 'react-router-dom'
import { highlights, programs, school, stats, testimonials, TONES, whatsappLink } from '../data/site'
import { fmtDate, isNew, isPast, useCollection } from '../lib/store'
import HeroArt from '../components/HeroArt'
import { Blob, BrandIcon, Icon, PhotoPlaceholder, SectionHeading, ToneBadge } from '../components/ui'

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Blob className="-left-24 top-10 h-72 w-72 bg-amber-200/70 dark:bg-amber-400/10" />
      <Blob className="right-0 top-0 h-80 w-80 bg-brand-200/60 dark:bg-brand-500/10" />
      <div className="container-x relative grid items-center gap-10 pb-16 pt-10 md:pb-24 md:pt-16 lg:grid-cols-[1.1fr_1fr]">
        <div className="animate-fade-up">
          <Link to="/admissions" className="mb-5 inline-flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-4 text-sm font-bold text-ink shadow-sm ring-1 ring-slate-900/5 dark:bg-white/10 dark:text-white dark:ring-white/10">
            <span className="rounded-full bg-brand-500 px-2.5 py-0.5 text-xs text-white">New</span>
            Admissions open for {school.session}
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
          <h1 className="text-[2.6rem] font-extrabold leading-[1.02] sm:text-6xl lg:text-[4.2rem]">
            Where little minds take <span className="relative whitespace-nowrap text-brand-500">big steps<svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 9c50-8 140-8 196-2" stroke="#ffd166" strokeWidth="5" fill="none" strokeLinecap="round" /></svg></span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed">
            <strong className="text-ink dark:text-white">{school.name}</strong>: Playgroup, Nursery, LKG, UKG and full-day Daycare in a safe, joyful and CCTV-secured campus at {school.addressShort}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/admissions" className="btn-primary px-7 py-3.5 text-base">Admissions Open {school.session} <Icon name="arrow" className="h-4 w-4" /></Link>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-ghost px-6 py-3.5 text-base">
              <BrandIcon name="whatsapp" className="h-5 w-5 text-[#25D366]" /> Book a campus visit
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-bold text-ink dark:text-slate-200">
            {['CCTV secured', 'Safe transport', 'Daycare till 7 PM'].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300"><Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} /></span>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-lg">
          <HeroArt />
          <div className="card absolute -bottom-2 left-0 flex animate-float items-center gap-3 px-4 py-3 sm:-left-4">
            <span className="text-3xl">⭐</span>
            <div><p className="font-display text-lg font-extrabold leading-none text-ink dark:text-white">500+ families</p><p className="text-xs">trust us with their little ones</p></div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="container-x">
      <div className="grid grid-cols-2 gap-3 rounded-[2rem] bg-ink p-6 text-center sm:p-8 md:grid-cols-4 dark:bg-night-card dark:ring-1 dark:ring-white/10">
        {stats.map((s) => (
          <div key={s.label} className="py-2">
            <p className="font-display text-3xl font-extrabold text-amber-300 sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-sm font-semibold text-white/75">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Highlights() {
  return (
    <section className="section container-x">
      <SectionHeading eyebrow="Why parents choose us" title="Safe, caring and full of fun" text="Everything your little one needs to feel at home and you need for complete peace of mind." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((h) => (
          <div key={h.title} className="card group p-6 transition hover:-translate-y-1">
            <div className={`mb-4 grid h-14 w-14 place-items-center rounded-2xl text-3xl transition group-hover:rotate-6 ${TONES[h.tone].bg}`}>{h.icon}</div>
            <h3 className="text-xl font-bold">{h.title}</h3>
            <p className="mt-1.5 leading-relaxed">{h.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ProgramsStrip() {
  return (
    <section className="section bg-white dark:bg-white/[0.02]">
      <div className="container-x">
        <SectionHeading eyebrow="Our programs" title="A class for every little stage" text="Thoughtfully designed programs from 18 months to 5½ years, plus full-day daycare." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {programs.map((p) => (
            <Link key={p.id} to={`/programs#${p.id}`} className={`group rounded-3xl p-6 transition hover:-translate-y-1 ${TONES[p.tone].bg}`}>
              <div className="text-4xl transition group-hover:scale-110">{p.icon}</div>
              <h3 className="mt-4 text-2xl font-extrabold">{p.name}</h3>
              <p className={`text-sm font-bold ${TONES[p.tone].text}`}>{p.age}</p>
              <p className="mt-2 text-sm leading-relaxed">{p.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-extrabold text-ink dark:text-white">Learn more <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function ParentCorner() {
  const notices = useCollection('notices').slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
  const events = useCollection('events').filter((e) => !isPast(e.endDate || e.date)).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3)
  const tiles = [
    { to: '/downloads', icon: '📥', title: 'Downloads', text: 'Books, worksheets & homework', tone: 'sky' },
    { to: '/results', icon: '🏅', title: 'Report cards', text: 'View & download progress', tone: 'butter' },
    { to: '/events', icon: '📅', title: 'Calendar', text: 'Holidays, PTMs & events', tone: 'mint' },
  ]
  return (
    <section className="section container-x">
      <SectionHeading eyebrow="Parent corner" title="Everything in one place" text="Notices, study material, report cards and the school calendar, always up to date." />
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-2xl font-bold">📌 Latest notices</h3>
            <Link to="/notices" className="text-sm font-extrabold text-brand-600 hover:underline dark:text-brand-300">View all</Link>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-white/10">
            {notices.map((n) => (
              <li key={n.id}>
                <Link to={`/notices#${n.id}`} className="flex items-start gap-4 py-3.5 transition hover:text-brand-600">
                  <span className="w-14 shrink-0 rounded-2xl bg-brand-50 py-1.5 text-center leading-tight text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
                    <span className="block font-display text-xl font-extrabold">{fmtDate(n.date, { day: 'numeric' })}</span>
                    <span className="block text-[11px] font-bold uppercase">{fmtDate(n.date, { month: 'short' })}</span>
                  </span>
                  <span className="min-w-0 pt-1">
                    <span className="flex flex-wrap items-center gap-2 font-bold text-ink dark:text-white">
                      {n.title}
                      {isNew(n.date) && <span className="chip bg-brand-500 text-white">New</span>}
                    </span>
                    <span className="mt-0.5 line-clamp-1 block text-sm">{n.body}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-2xl font-bold">📅 Coming up</h3>
            <Link to="/events" className="text-sm font-extrabold text-brand-600 hover:underline dark:text-brand-300">Calendar</Link>
          </div>
          <ul className="space-y-3">
            {events.map((e) => (
              <li key={e.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-white/5">
                <span className="w-24 shrink-0 text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400">{fmtDate(e.date, { day: 'numeric', month: 'short' })}</span>
                <span className="font-bold text-ink dark:text-white">{e.title}</span>
              </li>
            ))}
          </ul>
        </div>
        {tiles.map((t) => (
          <Link key={t.to} to={t.to} className="card group flex items-center gap-4 p-5 transition hover:-translate-y-1">
            <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-3xl ${TONES[t.tone].bg}`}>{t.icon}</span>
            <span className="flex-1">
              <span className="block text-lg font-extrabold text-ink dark:text-white">{t.title}</span>
              <span className="block text-sm">{t.text}</span>
            </span>
            <Icon name="arrow" className="h-5 w-5 text-brand-500 transition group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </section>
  )
}

function GalleryTeaser() {
  const items = useCollection('gallery').filter((g) => !g.fileId).slice(0, 5)
  return (
    <section className="section bg-white dark:bg-white/[0.02]">
      <div className="container-x">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading center={false} eyebrow="Moments" title="Life at TechSix" text="Celebrations, events and everyday adventures." />
          <Link to="/gallery" className="btn-soft mb-10 md:mb-14">Open gallery <Icon name="arrow" className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2">
          {items.map((g, i) => (
            <Link key={g.id} to="/gallery" className={`group overflow-hidden rounded-3xl ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
              <PhotoPlaceholder emoji={g.emoji} tone={g.tone} label={g.title} className={`h-full transition duration-500 group-hover:scale-105 ${i === 0 ? 'min-h-72 [&>span:nth-child(2)]:text-8xl' : 'min-h-36'}`} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="section container-x">
      <SectionHeading eyebrow="Happy parents" title="What our families say" />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((t) => (
          <figure key={t.name} className="card flex flex-col p-6">
            <div className="mb-3 text-amber-400" aria-label="5 out of 5 stars">★★★★★</div>
            <blockquote className="flex-1 leading-relaxed">“{t.text}”</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className={`grid h-11 w-11 place-items-center rounded-full font-display text-lg font-extrabold ${TONES[t.tone].bg} ${TONES[t.tone].text}`}>{t.name[0]}</span>
              <span>
                <span className="block font-bold text-ink dark:text-white">{t.name}</span>
                <span className="block text-xs">{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-slate-400">Sample testimonials for the demo. Replace with real parent reviews.</p>
    </section>
  )
}

export function AdmissionCTA() {
  return (
    <section className="container-x pb-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-brand-500 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
        <Blob className="-left-10 -top-10 h-48 w-48 bg-amber-300/50" />
        <Blob className="-bottom-16 -right-10 h-60 w-60 bg-rose-300/40" />
        <div className="relative">
          <ToneBadge tone="butter" className="mb-4 !bg-white/20 !text-white">🎒 Limited seats</ToneBadge>
          <h2 className="text-3xl font-extrabold !text-white sm:text-5xl">Admissions open for {school.session}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">Visit our campus, meet our teachers and see why families in Sector 76 love TechSix.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/admissions" className="btn bg-white px-7 py-3.5 text-base text-brand-600 hover:bg-amber-50">Enquire now</Link>
            <a href={school.phoneHref} className="btn px-7 py-3.5 text-base text-white ring-2 ring-white/60 hover:bg-white/10"><Icon name="phone" className="h-4 w-4" /> {school.phone}</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Highlights />
      <ProgramsStrip />
      <ParentCorner />
      <GalleryTeaser />
      <Testimonials />
      <AdmissionCTA />
    </>
  )
}
