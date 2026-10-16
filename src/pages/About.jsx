import { about, highlights, school, TONES } from '../data/site'
import { PageHero, PhotoPlaceholder, SectionHeading } from '../components/ui'
import { AdmissionCTA } from './Home'

export default function About() {
  return (
    <>
      <PageHero eyebrow="About us" title="A happy place to begin" text={`The story, vision and people behind ${school.name}.`} emoji="🏫" />

      <section className="section container-x grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <PhotoPlaceholder emoji="🏫" tone="sky" label="School building" className="aspect-[4/3] rounded-[2rem]" />
          <PhotoPlaceholder emoji="🧒" tone="butter" label="Children at play" className="absolute -bottom-8 -right-2 hidden aspect-square w-40 rounded-3xl ring-8 ring-cream sm:flex dark:ring-night [&>span:nth-child(2)]:text-5xl" tag={false} />
        </div>
        <div>
          <p className="mb-2 font-display text-sm font-bold uppercase tracking-[0.18em] text-brand-500">Our story</p>
          <h2 className="text-3xl font-extrabold sm:text-4xl">Rooted in care, built for curiosity</h2>
          <div className="mt-5 space-y-4 text-[17px] leading-relaxed">
            {about.story.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>

      <section className="section bg-white dark:bg-white/[0.02]">
        <div className="container-x grid gap-5 md:grid-cols-2">
          <div className={`rounded-[2rem] p-8 ${TONES.peach.bg}`}>
            <div className="text-4xl">🔭</div>
            <h3 className="mt-3 text-2xl font-extrabold">Our vision</h3>
            <p className="mt-2 text-lg leading-relaxed">{about.vision}</p>
          </div>
          <div className={`rounded-[2rem] p-8 ${TONES.mint.bg}`}>
            <div className="text-4xl">🎯</div>
            <h3 className="mt-3 text-2xl font-extrabold">Our mission</h3>
            <p className="mt-2 text-lg leading-relaxed">{about.mission}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:col-span-2 lg:grid-cols-4">
            {about.values.map((v) => (
              <div key={v.title} className="card p-6">
                <div className="text-3xl">{v.icon}</div>
                <h4 className="mt-3 text-lg font-bold">{v.title}</h4>
                <p className="text-sm">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section container-x">
        <div className="card grid gap-10 overflow-hidden p-6 sm:p-10 lg:grid-cols-[320px_1fr]">
          <div>
            <PhotoPlaceholder emoji="👩‍🏫" tone="lilac" label="Principal photo" className="aspect-[4/5] rounded-3xl" />
            <p className="mt-4 text-xl font-extrabold text-ink dark:text-white">{about.principal.name}</p>
            <p className="text-sm font-bold text-brand-500">{about.principal.title}</p>
          </div>
          <div>
            <p className="mb-2 font-display text-sm font-bold uppercase tracking-[0.18em] text-brand-500">Principal's message</p>
            <div className="relative space-y-4 text-[17px] leading-relaxed">
              <span className="absolute -left-2 -top-8 font-display text-8xl leading-none text-brand-100 dark:text-brand-500/20" aria-hidden="true">“</span>
              {about.principal.message.map((p, i) => <p key={i} className={`relative ${i === 0 ? 'font-bold text-ink dark:text-white' : ''}`}>{p}</p>)}
              <p className="relative pt-2 font-display text-2xl font-bold text-ink dark:text-white">Warm regards,<br /><span className="text-brand-500">{about.principal.name}</span></p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x pb-16 md:pb-24">
        <SectionHeading eyebrow="Our promise" title="What makes TechSix different" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h) => (
            <div key={h.title} className="flex gap-4 rounded-3xl p-5 ring-1 ring-slate-900/5 dark:ring-white/10">
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl ${TONES[h.tone].bg}`}>{h.icon}</span>
              <div><h3 className="text-lg font-bold">{h.title}</h3><p className="text-sm">{h.text}</p></div>
            </div>
          ))}
        </div>
      </section>
      <AdmissionCTA />
    </>
  )
}
