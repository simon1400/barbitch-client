import type { IDataPostShort } from 'fetch/blog'

import { BlogBigShort, BlogShort } from 'components/BlogShort'

import { MasonryGrid } from './MasonryGrid'

const Posts = ({ data, blog = false }: { data: IDataPostShort[]; blog?: boolean }) => {
  return (
    <div className={'container mx-auto w-full max-w-[1440px] px-4'}>
      {blog && <BlogBigShort data={data.shift() as IDataPostShort} />}
      <h2
        className={`${blog ? 'text-resTop md:text-xxl mb-12 md:mb-17.5' : 'text-lg lg:text-big mt-10 -mb-1'} text-center`}
      >
        {blog ? 'STARŠÍ PŘÍSPĚVKY' : 'B.B.BLOG'}
      </h2>
      <div>
        <MasonryGrid sm={1}>
          {data.map((item: IDataPostShort) => (
            <BlogShort key={item.title} data={item} />
          ))}
        </MasonryGrid>
      </div>
    </div>
  )
}

export default Posts
