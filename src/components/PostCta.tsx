import type { BlogTopicKey } from 'lib/blogTopic'

import { isServiceTopic, TOPIC_CTA, TOPIC_LABEL } from 'lib/blogTopic'

import Button from './Button'
import { Container } from './Container'

/**
 * Uzavření trychtýře „článek → služba → rezervace“. Příspěvky byly slepá
 * ulička: žádný odkaz na službu ani na rezervaci.
 */
export const PostCta = ({ topic: key }: { topic?: BlogTopicKey }) => {
  // „Sezóna“ nemá vlastní stránku služby — obecná výzva bez odkazu na službu.
  const topic = isServiceTopic(key) ? key : undefined
  const text = key ? TOPIC_CTA[key] : 'Rezervuj si termín v Bar.Bitch v Brně.'

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
