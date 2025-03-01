'use client'

import type { IDataHomepage } from 'fetch/homepage'
import type { IDataHomepageService } from 'fetch/service'

import dynamic from 'next/dynamic'

const Galery = dynamic(() => import('sections/Galery'), { ssr: false })
const About = dynamic(() => import('sections/About'), { ssr: false })
const HandSec = dynamic(() => import('sections/HandSec'), { ssr: false })
const Reviews = dynamic(() => import('sections/Reviews'), { ssr: false })

const DynamicSections = ({
  data,
  dataService,
}: {
  data: IDataHomepage
  dataService: IDataHomepageService[]
}) => {
  return (
    <>
      <HandSec service={dataService} />
      <Galery data={data.galery} />
      <About text={data.aboutUs} />
      <Reviews />
    </>
  )
}

export default DynamicSections
