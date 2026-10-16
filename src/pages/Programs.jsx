import { Link } from 'react-router-dom'
import { programs, TONES } from '../data/site'
import { Icon, PageHero, PhotoPlaceholder } from '../components/ui'
import { AdmissionCTA } from './Home'

export default function Programs() {
  return (
    <>
      <PageHero eyebrow="Programs" title="Learning through play, at every age" text="Age-appropriate programs with small classes, trained teachers and lots of hands-on fun." emoji="🧸" />

      <div className="container-x sticky top-[72px] z-30 -mt-6 flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
        {programs.map((p) => (
          <a key={p.id} href={`#${p.id}`} className="chip shrink-0 bg-white px-4 py-2 text-sm text-ink shadow-sm ring-1 ring-slate-900/5 hover:text-brand-600 dark:bg-night-card dark:text-white dark:ring-white/10">
            {p.icon} {p.name}
          </a>
        ))}
      </div>

      <section className="container-x space-y-8 pb-16 pt-8 md:pb-24">
        {programs.map((p, i) => (
          <article key={p.id} id={p.id} className="card grid scroll-mt-36 overflow-hidden md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <PhotoPlaceholder emoji={p.icon} tone={p.tone} label={`${p.name} class`} className={`min-h-56 ${i % 2 ? 'md:order-2' : ''}`} />
            <div className="p-6 sm:p-10">
              <h2 className="text-3xl font-extrabold sm:text-4xl">{p.name}</h2>
              <p className="mt-2 text-[17px] leading-relaxed">{p.summary}</p>
              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className={`rounded-2xl px-4 py-3 ${TONES[p.tone].bg}`}>
                  <dt className={`text-xs font-extrabold uppercase tracking-wider ${TONES[p.tone].text}`}>Age group</dt>
                  <dd className="font-display text-lg font-bold text-ink dark:text-white">{p.age}</dd>
                </div>
                <div className={`rounded-2xl px-4 py-3 ${TONES[p.tone].bg}`}>
                  <dt className={`text-xs font-extrabold uppercase tracking-wider ${TONES[p.tone].text}`}>Timings</dt>
                  <dd className="font-display text-lg font-bold text-ink dark:text-white">{p.timing}</dd>
                </div>
              </dl>
              <h3 className="mt-6 text-lg font-bold">What children learn</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {p.learn.map((l) => (
                  <li key={l} className="flex items-start gap-2">
                    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${TONES[p.tone].bg} ${TONES[p.tone].text}`}><Icon name="check" className="h-3 w-3" strokeWidth={3} /></span>
                    {l}
                  </li>
                ))}
              </ul>
              <Link to={`/admissions?class=${encodeURIComponent(p.name)}`} className="btn-primary mt-7">Enquire for {p.name} <Icon name="arrow" className="h-4 w-4" /></Link>
            </div>
          </article>
        ))}
      </section>
      <AdmissionCTA />
    </>
  )
}
