import Button from 'components/Button'
import { Container } from 'components/Container'
import { parseHtml } from 'lib/parseHtml'

import { GaleryImages } from './GaleryImages'

interface GaleryData {
  title?: string | null
  contentBefore?: string | null
  contentAfter?: string | null
  cta?: { title: string; link: string } | null
  image: IGalery[]
}

// Serverová obálka: nadpis, text před/po a tlačítko se vykreslí na serveru
// (parseHtml v prohlížeči skládá HTML jinak → hydratační chyba), klientská
// zůstává jen mřížka fotek s prohlížečem.
export const Galery = ({
  data,
  contain = true,
  variant = 'simple',
}: {
  data: GaleryData
  contain?: boolean
  variant?: 'simple' | 'masonry'
}) => {
  if (!data || !Array.isArray(data.image) || data.image.length === 0) {
    return null
  }

  const hasIntro = !!(data.title || data.contentBefore)
  const hasOutro = !!(data.contentAfter || data.cta)

  return (
    <>
      {hasIntro && (
        <section>
          <Container size={'lg'}>
            {data.title && <h2>{data.title}</h2>}
            {data.contentBefore && <div>{parseHtml(data.contentBefore)}</div>}
          </Container>
        </section>
      )}

      <GaleryImages data={data} contain={contain} variant={variant} title={data.title} />

      {hasOutro && (
        <section className={'mb-12 md:mb-17'}>
          <Container size={'lg'}>
            {data.contentAfter && <div>{parseHtml(data.contentAfter)}</div>}
            {data.cta && (
              <div className={data.contentAfter ? 'mt-10' : ''}>
                {/* Dlouhý text tlačítka se na telefonu zalomí místo přetečení přes okraj. */}
                <Button
                  text={data.cta.title}
                  href={data.cta.link}
                  className={'max-w-full !text-wrap !h-auto min-h-[48px] md:min-h-[57px]'}
                />
              </div>
            )}
          </Container>
        </section>
      )}
    </>
  )
}
