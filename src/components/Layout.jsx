import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { school, whatsappLink } from '../data/site'
import { BrandIcon, Icon, Logo, ThemeToggle } from './ui'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  {
    label: 'Parents',
    children: [
      { to: '/downloads', label: 'Downloads', icon: '📥', hint: 'Books, worksheets & syllabus' },
      { to: '/notices', label: 'Notice Board', icon: '📌', hint: 'Latest school notices' },
      { to: '/results', label: 'Progress Reports', icon: '🏅', hint: 'View & download report cards' },
      { to: '/events', label: 'Events Calendar', icon: '📅', hint: 'Holidays, PTMs & events' },
    ],
  },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

const linkBase = 'rounded-full px-3.5 py-2 text-[15px] font-bold transition'
const linkClass = ({ isActive }) =>
  `${linkBase} ${isActive ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300' : 'text-ink hover:bg-white hover:text-brand-600 dark:text-slate-200 dark:hover:bg-white/10'}`

function ParentsMenu({ item }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { pathname } = useLocation()
  const active = item.children.some((c) => c.to === pathname)

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false)
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`${linkBase} inline-flex items-center gap-1 ${active ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300' : 'text-ink hover:bg-white hover:text-brand-600 dark:text-slate-200 dark:hover:bg-white/10'}`}
      >
        {item.label}
        <Icon name="chevron" className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-2">
          <div className="card animate-fade-up p-2">
            {item.children.map((c) => (
              <NavLink key={c.to} to={c.to} className={({ isActive }) => `flex items-start gap-3 rounded-2xl p-3 transition hover:bg-brand-50 dark:hover:bg-white/5 ${isActive ? 'bg-brand-50 dark:bg-white/5' : ''}`}>
                <span className="text-2xl leading-none">{c.icon}</span>
                <span>
                  <span className="block font-bold text-ink dark:text-white">{c.label}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{c.hint}</span>
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <div className="hidden bg-ink text-[13px] font-semibold text-white/85 md:block dark:bg-black/40">
        <div className="container-x flex h-9 items-center justify-between">
          <div className="flex items-center gap-5">
            <a href={school.phoneHref} className="flex items-center gap-1.5 hover:text-white"><Icon name="phone" className="h-4 w-4" />{school.phone}</a>
            <a href={`mailto:${school.email}`} className="flex items-center gap-1.5 hover:text-white"><Icon name="mail" className="h-4 w-4" />{school.email}</a>
            <span className="hidden items-center gap-1.5 lg:flex"><Icon name="pin" className="h-4 w-4" />{school.addressShort}</span>
          </div>
          <Link to="/admissions" className="flex items-center gap-2 text-amber-300 hover:text-amber-200">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" /></span>
            Admissions Open {school.session}
          </Link>
        </div>
      </div>

      <header className={`sticky top-0 z-40 transition-all ${scrolled ? 'bg-cream/85 shadow-[0_6px_20px_-12px_rgba(31,37,71,0.25)] backdrop-blur-lg dark:bg-night/85' : 'bg-cream dark:bg-night'}`}>
        <div className="container-x flex h-[72px] items-center justify-between gap-4">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV.map((item) =>
              item.children ? <ParentsMenu key={item.label} item={item} /> : (
                <NavLink key={item.to} to={item.to} end className={linkClass}>{item.label}</NavLink>
              ),
            )}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/admissions" className="btn-primary hidden sm:inline-flex">Admissions Open</Link>
            <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-full text-ink ring-1 ring-slate-900/10 lg:hidden dark:text-white dark:ring-white/15" aria-label="Open menu">
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} />
        <aside className={`absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col overflow-y-auto bg-cream p-5 shadow-2xl transition-transform duration-300 dark:bg-night ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="mb-6 flex items-center justify-between">
            <Logo />
            <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-slate-900/10 dark:text-white dark:ring-white/15" aria-label="Close menu">
              <Icon name="close" />
            </button>
          </div>
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.label} className="my-2 rounded-3xl bg-white p-2 ring-1 ring-slate-900/5 dark:bg-white/5 dark:ring-white/10">
                  <p className="px-3 pb-1 pt-2 text-xs font-extrabold uppercase tracking-widest text-slate-400">For parents</p>
                  {item.children.map((c) => (
                    <NavLink key={c.to} to={c.to} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-3 py-2.5 font-bold ${isActive ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300' : 'text-ink dark:text-slate-200'}`}>
                      <span className="text-xl">{c.icon}</span>{c.label}
                    </NavLink>
                  ))}
                </div>
              ) : (
                <NavLink key={item.to} to={item.to} end className={({ isActive }) => `rounded-2xl px-4 py-3 text-lg font-bold ${isActive ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300' : 'text-ink dark:text-slate-200'}`}>
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>
          <div className="mt-auto space-y-3 pt-6">
            <Link to="/admissions" className="btn-primary w-full py-3 text-base">Admissions Open {school.session}</Link>
            <a href={school.phoneHref} className="btn-ghost w-full py-3"><Icon name="phone" className="h-4 w-4" /> Call {school.phone}</a>
          </div>
        </aside>
      </div>
    </>
  )
}

function Footer() {
  const quick = [
    ['About Us', '/about'], ['Programs', '/programs'], ['Admissions', '/admissions'], ['Gallery', '/gallery'], ['Contact', '/contact'],
  ]
  const parents = [
    ['Downloads', '/downloads'], ['Notice Board', '/notices'], ['Progress Reports', '/results'], ['Events Calendar', '/events'], ['Staff Login', '/admin'],
  ]
  const socials = [
    ['instagram', 'Instagram'], ['facebook', 'Facebook'], ['youtube', 'YouTube'],
  ]
  return (
    <footer className="relative mt-10 bg-ink pt-16 text-white/75 dark:bg-black/30">
      <svg className="absolute -top-px left-0 w-full text-cream dark:text-night" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0 0h1440v10c-120 18-240 28-360 20S840 0 720 6 480 38 360 36 120 14 0 10Z" />
      </svg>
      <div className="container-x grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <div className="[&_*]:!text-white [&_span.text-brand-500]:!text-brand-300"><Logo /></div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            A safe, joyful and caring preschool & daycare in Sector 76, Gurugram, where little minds take their first big steps.
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map(([k, label]) => (
              <a key={k} href={school.social[k]} aria-label={label} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-brand-500 hover:text-white">
                <BrandIcon name={k} className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-bold !text-white">Quick links</h3>
          <ul className="space-y-2 text-sm">{quick.map(([l, to]) => <li key={to}><Link to={to} className="hover:text-white">{l}</Link></li>)}</ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-bold !text-white">For parents</h3>
          <ul className="space-y-2 text-sm">{parents.map(([l, to]) => <li key={to}><Link to={to} className="hover:text-white">{l}</Link></li>)}</ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-bold !text-white">Get in touch</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><Icon name="pin" className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" />{school.address}</li>
            <li><a href={school.phoneHref} className="flex gap-3 hover:text-white"><Icon name="phone" className="h-5 w-5 shrink-0 text-brand-300" />{school.phone}</a></li>
            <li><a href={`mailto:${school.email}`} className="flex gap-3 hover:text-white"><Icon name="mail" className="h-5 w-5 shrink-0 text-brand-300" />{school.email}</a></li>
            <li className="flex gap-3"><Icon name="clock" className="h-5 w-5 shrink-0 text-brand-300" />Mon – Sat · 8:00 AM – 7:00 PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} {school.name}. All rights reserved.</p>
          <p>Made with 💛 for little learners</p>
        </div>
      </div>
    </footer>
  )
}

function WhatsAppFab() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-lg shadow-black/20 transition hover:scale-105 sm:px-5"
      aria-label="Chat with us on WhatsApp"
    >
      <span className="absolute inset-0 -z-10 animate-pulse-ring rounded-full bg-[#25D366]" aria-hidden="true" />
      <BrandIcon name="whatsapp" className="h-6 w-6" />
      <span className="hidden text-sm font-extrabold sm:inline">Chat with us</span>
    </a>
  )
}

export default function Layout() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const el = hash && document.getElementById(hash.slice(1))
    if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth' }))
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:font-bold">Skip to content</a>
      <Header />
      <main id="main"><Outlet /></main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
