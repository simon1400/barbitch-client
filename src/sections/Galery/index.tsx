import type { IGalleryItem } from 'fetch/homepage'
import type { IDataHomepageService } from 'fetch/service'
import type { GalleryChip, GalleryPhoto } from 'sections/Galery/types'

import GalleryStrip from './GalleryStrip'

interface GaleryProps {
  /** Nové pole `homepage.galleryItems` (služba + popisek). */
  items: IGalleryItem[]
  /** Staré pole `homepage.galery` — záloha, dokud `galleryItems` není vyplněné. */
  fallback: IGalery[]
  /** Pořadí čipů = pořadí služeb ve Strapi (stejné jako v menu). */
  services: IDataHomepageService[]
  instagramUrl?: string
  linkToReserve: string
}

const toPhotos = (items: IGalleryItem[], fallback: IGalery[]): GalleryPhoto[] => {
  if (items.length > 0) {
    return items.map((item, i) => {
      const service = item.service?.slug
        ? { title: item.service.title, slug: item.service.slug }
        : null
      const caption = item.caption?.trim() || service?.title || 'Naše práce'
      return {
        key: `${i}:${item.image.url}`,
        url: item.image.url,
        alt:
          item.image.alternativeText ||
          item.caption?.trim() ||
          (service ? `${service.title} — práce salonu Barbitch` : '') ||
          `Fotka ${i + 1} z galerie Barbitch`,
        caption,
        service,
      }
    })
  }
  return fallback
    .filter((img) => img.url?.startsWith('http'))
    .map((img, i) => ({
      key: `${i}:${img.url}`,
      url: img.url,
      alt: img.alternativeText || `Fotka ${i + 1} z galerie Barbitch`,
      caption: 'Naše práce',
      service: null,
    }))
}

/** Čipy jen pro služby, které mají aspoň jednu fotku; pořadí podle Strapi. */
const toChips = (photos: GalleryPhoto[], services: IDataHomepageService[]): GalleryChip[] => {
  const used = new Map<string, string>()
  photos.forEach((p) => {
    if (p.service && !used.has(p.service.slug)) used.set(p.service.slug, p.service.title)
  })
  const order = services.map((s) => s.slug)
  return [...used.entries()]
    .sort(([a], [b]) => {
      const ia = order.indexOf(a)
      const ib = order.indexOf(b)
      return (ia < 0 ? order.length : ia) - (ib < 0 ? order.length : ib)
    })
    .map(([slug, label]) => ({ slug, label }))
}

/** `https://www.instagram.com/barbitch.cz/` → `@barbitch.cz` */
const instagramHandle = (url: string) => {
  try {
    const name = new URL(url).pathname.split('/').find(Boolean)
    return name ? `@${name}` : 'Instagram'
  } catch {
    return 'Instagram'
  }
}

const Galery = ({ items, fallback, services, instagramUrl, linkToReserve }: GaleryProps) => {
  const photos = toPhotos(items, fallback)
  if (photos.length === 0) return null

  return (
    <section className={'pt-14 pb-20 lg:pt-24 lg:pb-27'} aria-labelledby={'nase-prace'}>
      <GalleryStrip
        photos={photos}
        chips={toChips(photos, services)}
        instagram={
          instagramUrl ? { url: instagramUrl, handle: instagramHandle(instagramUrl) } : undefined
        }
        linkToReserve={linkToReserve}
      />
    </section>
  )
}

export default Galery
