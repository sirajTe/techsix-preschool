import { useEffect, useState } from 'react'
import { GALLERY_CATEGORIES } from '../data/site'
import { useCollection, useFileUrl } from '../lib/store'
import { Icon, PageHero, PhotoPlaceholder } from '../components/ui'

export function GalleryImage({ item, className = '' }) {
  const url = useFileUrl(item.fileId)
  if (item.fileId) {
    return url
      ? <img src={url} alt={item.title} loading="lazy" className={`h-full w-full object-cover ${className}`} />
      : <div className={`h-full w-full animate-pulse bg-slate-200 dark:bg-white/10 ${className}`} />
  }
  return <PhotoPlaceholder emoji={item.emoji} tone={item.tone} label={item.title} className={`h-full w-full ${className}`} />
}

export default function Gallery() {
  const items = useCollection('gallery')
  const [cat, setCat] = useState('All')
  const [active, setActive] = useState(null)
  const list = items.filter((g) => cat === 'All' || g.category === cat)

  useEffect(() => {
    if (active === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null)
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % list.length)
      if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + list.length) % list.length)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [active, list.length])

  const current = active !== null ? list[active] : null

  return (
    <>
      <PageHero eyebrow="Gallery" title="Smiles, colours & celebrations" text="A peek into everyday life at TechSix: festivals, events, activities and our campus." emoji="📸" />
      <section className="section container-x">
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {['All', ...GALLERY_CATEGORIES].map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`chip px-4 py-2 text-sm transition ${cat === c ? 'bg-brand-500 text-white' : 'bg-white text-ink ring-1 ring-slate-900/10 hover:bg-brand-50 dark:bg-white/5 dark:text-white dark:ring-white/10'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {list.map((g, i) => (
            <button key={g.id} onClick={() => setActive(i)} className={`group relative overflow-hidden rounded-3xl text-left focus-visible:outline-2 focus-visible:outline-brand-500 ${i % 5 === 0 ? 'aspect-[4/5] md:row-span-2 md:aspect-auto' : 'aspect-square'}`}>
              <GalleryImage item={g} className="transition duration-500 group-hover:scale-105" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-10 text-sm font-bold text-white">
                {g.title}
                <span className="block text-xs font-semibold text-white/75">{g.category}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {current && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur" onClick={() => setActive(null)} role="dialog" aria-modal="true" aria-label={current.title}>
          <button className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close"><Icon name="close" /></button>
          <button onClick={(e) => { e.stopPropagation(); setActive((active - 1 + list.length) % list.length) }} className="absolute left-2 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6" aria-label="Previous"><Icon name="chevron" className="h-5 w-5 rotate-90" /></button>
          <figure onClick={(e) => e.stopPropagation()} className="w-full max-w-3xl animate-fade-up">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl"><GalleryImage item={current} className="[&>span:nth-child(2)]:text-9xl" /></div>
            <figcaption className="mt-3 text-center font-bold text-white">{current.title} <span className="font-normal text-white/60">· {current.category}</span></figcaption>
          </figure>
          <button onClick={(e) => { e.stopPropagation(); setActive((active + 1) % list.length) }} className="absolute right-2 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6" aria-label="Next"><Icon name="chevron" className="h-5 w-5 -rotate-90" /></button>
        </div>
      )}
    </>
  )
}
