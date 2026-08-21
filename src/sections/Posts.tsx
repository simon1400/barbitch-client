import type { IDataPostShort } from 'fetch/blog'

import { BlogBigShort, BlogShort } from 'components/BlogShort'
import { Container } from 'components/Container'

import { MasonryGrid } from './Masonry/MasonryGrid'

const Posts = ({ data, blog = false }: { data: IDataPostShort[]; blog?: boolean }) => {
  // Bez mutace vstupního pole — `data.shift()` v renderu ukrajoval položku
  // z pole, které vlastní volající.
  const [featured, ...rest] = data
  const items = blog ? rest : data

  return (
    <Container size={'xl'}>
      {blog && !!featured && <BlogBigShort data={featured} />}
      <h2
        className={`${blog ? 'text-resTop md:text-xxl mb-12 md:mb-17.5' : 'text-lg lg:text-big mt-10 -mb-1'} text-center`}
      >
        {blog ? 'STARŠÍ PŘÍSPĚVKY' : 'B.B.BLOG'}
      </h2>
      <div>
        <MasonryGrid sm={1}>
          {items.map((item: IDataPostShort) => (
            <BlogShort key={item.title} data={item} />
          ))}
        </MasonryGrid>
      </div>
    </Container>
  )
}

export default Posts
