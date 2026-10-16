import { school, whatsappLink } from '../data/site'
import { BrandIcon, Icon, PageHero } from '../components/ui'

export default function Contact() {
  const cards = [
    { icon: 'phone', label: 'Call us', value: school.phone, href: school.phoneHref, tone: 'bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300' },
    { icon: 'mail', label: 'Email', value: school.email, href: `mailto:${school.email}`, tone: 'bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300' },
    { icon: 'pin', label: 'Address', value: school.address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.mapQuery)}`, tone: 'bg-orange-100 text-orange-700 dark:bg-orange-400/15 dark:text-orange-300' },
  ]
  return (
    <>
      <PageHero eyebrow="Contact" title="We'd love to meet you" text="Drop by for a campus tour, give us a call or simply say hello on WhatsApp." emoji="👋" />
      <section className="section container-x grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          {cards.map((c) => (
            <a key={c.label} href={c.href} target={c.icon === 'pin' ? '_blank' : undefined} rel="noopener noreferrer" className="card flex items-start gap-4 p-5 transition hover:-translate-y-0.5">
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${c.tone}`}><Icon name={c.icon} className="h-6 w-6" /></span>
              <span className="min-w-0">
                <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">{c.label}</span>
                <span className="block break-words font-bold text-ink dark:text-white">{c.value}</span>
              </span>
            </a>
          ))}
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-3xl bg-[#25D366] p-5 text-white shadow-lg shadow-[#25D366]/25 transition hover:-translate-y-0.5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20"><BrandIcon name="whatsapp" className="h-7 w-7" /></span>
            <span className="flex-1"><span className="block text-xs font-extrabold uppercase tracking-wider text-white/80">WhatsApp</span><span className="block text-lg font-extrabold">Chat with us now</span></span>
            <Icon name="arrow" className="h-5 w-5" />
          </a>
          <div className="card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-xl font-bold"><Icon name="clock" className="h-5 w-5 text-brand-500" /> Timings</h2>
            <dl className="divide-y divide-slate-100 text-sm dark:divide-white/10">
              {school.hours.map((h) => (
                <div key={h.day} className="flex justify-between gap-4 py-2.5">
                  <dt className="font-semibold">{h.day}</dt>
                  <dd className={`text-right font-bold ${h.time === 'Closed' ? 'text-rose-500' : 'text-ink dark:text-white'}`}>{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="card min-h-[420px] overflow-hidden p-2">
          <iframe
            title={`Map to ${school.name}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(school.mapQuery)}&output=embed`}
            className="h-full min-h-[420px] w-full rounded-[1.25rem] border-0 dark:opacity-90"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>
    </>
  )
}
