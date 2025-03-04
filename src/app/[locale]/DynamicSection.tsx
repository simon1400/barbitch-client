'use client'

import type { IDataPostShort } from 'fetch/blog'
import type { IDataHomepage } from 'fetch/homepage'
import type { IDataHomepageService } from 'fetch/service'

import dynamic from 'next/dynamic'

const Galery = dynamic(() => import('sections/Galery'), { ssr: false })
const About = dynamic(() => import('sections/About'), { ssr: false })
const HandSec = dynamic(() => import('sections/HandSec'), { ssr: false })
const Reviews = dynamic(() => import('sections/Reviews'), { ssr: false })
const Posts = dynamic(() => import('sections/Posts'), { ssr: false })

const DynamicSections = ({
  data,
  dataService,
  posts,
}: {
  data: IDataHomepage
  dataService: IDataHomepageService[]
  posts: IDataPostShort[]
}) => {
  return <></>
}

export default DynamicSections
