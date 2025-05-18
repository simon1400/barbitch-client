import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion'
import { Container } from 'components/Container'
import parse from 'html-react-parser'
import { ChevronDown } from 'lucide-react'

export const Faq = ({
  data,
}: {
  data: {
    item: {
      title: string
      content: string
    }[]
  }
}) => {
  return (
    <section className={'pb-10 md:pb-15 faq-sec'}>
      <Container size={'lg'}>
        <h2>{'FAQ'}</h2>
        <Accordion type={'single'} defaultValue={data.item[0].title}>
          {data.item.map((item) => (
            <AccordionItem
              key={item.title}
              className={'rounded-special-small shadow-lg bg-white mb-2.5'}
              value={item.title}
            >
              <AccordionTrigger
                className={
                  'p-5 text-resMd1 flex justify-between w-full items-center transition-all text-left [&[data-state=open]>svg]:rotate-180'
                }
              >
                <h3 className={'!text-resMd1 !mb-0 !mt-0'}>{item.title}</h3>
                <ChevronDown
                  className={
                    'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200'
                  }
                />
              </AccordionTrigger>
              <AccordionContent
                className={
                  'px-5 pb-0 overflow-hidden faq-content data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
                }
              >
                {parse(item.content, { trim: true })}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  )
}
