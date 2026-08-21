import type { BlogTopic } from 'lib/blogTopic'

import { TOPIC_CTA, TOPIC_LABEL } from 'lib/blogTopic'

import Button from './Button'
import { Container } from './Container'

/**
 * Uzavření trychtýře „článek → služba → rezervace“. Příspěvky byly slepá
 * ulička: žádný odkaz na službu ani na rezervaci.
 */
export const PostCta = ({ topic }: { topic?: BlogTopic }) => {
  const text = topic ? TOPIC_CTA[topic] : 'Rezervujte si termín v Barbitch Beauty Studiu v Brně.'

  return (
    <Container size={'xl'}>
      <aside className={'bg-accent text-white px-6 py-10 md:px-14 md:py-12 mb-14'}>
        <p className={'text-resMd1 md:text-h5 font-bold mb-6'}>{text}</p>
        <div className={'flex flex-wrap gap-4'}>
          <Button text={'Rezervovat termín'} href={'/book'} small />
          {!!topic && (
            <Button
              text={`Více o službě: ${TOPIC_LABEL[topic]}`}
              href={`/service/${topic}`}
              small
              inverse
            />
          )}
        </div>
      </aside>
    </Container>
  )
}
