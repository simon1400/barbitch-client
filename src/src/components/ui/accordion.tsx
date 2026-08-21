/* eslint-disable perfectionist/sort-imports */
/* eslint-disable import/order */
'use client'

import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import * as React from 'react'

const Accordion = AccordionPrimitive.Root

const AccordionItem = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
  ref?: React.RefObject<React.ElementRef<typeof AccordionPrimitive.Item> | null>
}) => <AccordionPrimitive.Item ref={ref} className={cn('', className)} {...props} />
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = ({
  ref,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
  ref?: React.RefObject<React.ElementRef<typeof AccordionPrimitive.Trigger> | null>
}) => (
  <AccordionPrimitive.Header className={'flex'}>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex justify-between w-full items-center transition-all text-left [&[data-state=open]>svg]:rotate-180',
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        className={'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200'}
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
)
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = ({
  ref,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
  ref?: React.RefObject<React.ElementRef<typeof AccordionPrimitive.Content> | null>
}) => (
  <AccordionPrimitive.Content
    ref={ref}
    // `data-[state=closed]:h-0` je nutné kvůli `forceMount`: bez něj se obsah
    // při prvním vykreslení zobrazí v plné výšce (animace se spouští až při
    // změně stavu, ne po načtení). Pro Content bez `forceMount` je to no-op,
    // protože zavřený se vůbec nerenderuje. Klíčové snímky animace mají
    // v kaskádě přednost, takže rozbalování i sbalování animuje dál.
    className={
      'overflow-hidden text-sm data-[state=closed]:h-0 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
    }
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
)
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
