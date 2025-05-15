'use client'

import type { JSX } from 'react'

import { Banner } from './dynamicComponents/Banner'
import { Faq } from './dynamicComponents/Faq'
import { Galery } from './dynamicComponents/Galery'
import { Text } from './dynamicComponents/Text'

interface DynamicContentProps {
  data: any[]
}

const COMPONENTS_MAP: Record<string, (item: any, idx: number) => JSX.Element | null> = {
  'content.content-baner': (item, idx) => <Banner key={item.__component + idx} data={item} />,
  'content.galery': (item, idx) => <Galery key={item.__component + idx} data={item} />,
  'content.text': (item, idx) => <Text key={item.__component + idx} data={item} />,
  'content.faq': (item, idx) => <Faq key={item.__component + idx} data={item} />,
}

export const DynamicContent = ({ data }: DynamicContentProps) => {
  return (
    <div className={'content'}>
      {data.map((item, idx) => {
        const renderComponent = COMPONENTS_MAP[item.__component]
        return renderComponent ? renderComponent(item, idx) : null
      })}
    </div>
  )
}
