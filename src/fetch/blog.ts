import { REDIRECTED_POST_SLUGS } from 'lib/blogRedirects'
import { isOffSeason } from 'lib/blogTopic'
import { unstable_cache } from 'next/cache'
import qs from 'qs'

import { Axios } from '../lib/api'

/** Autor článku — komponenta `content.blog-author` (s291). */
export interface IPostAuthor {
  name: string
  role?: string | null
  photo?: IGalery | null
}

export interface IDataPost {
  title: string
  image: IGalery
  dynamicContent: any[]
  /** Datum první publikace (`blog.date`, s291) — `publishedAt` se mění s každým Publish. */
  date?: string | null
  publishedAt?: string
  updatedAt?: string
  topic?: string | null
  season?: string | null
  author?: IPostAuthor | null
  metaData?: {
    title?: string
    description?: string
    image?: IGalery
  }
}

export interface IDataPostShort {
  title: string
  slug: string
  image: IGalery
  date?: string | null
  publishedAt?: string
  updatedAt?: string
  /** Téma (`blog.topic`): klíč enumerace, u starých záznamů i text „Manikúra“ (s286). */
  topic?: string | null
  season?: string | null
  metaData?: { description?: string } | null
}

/** Datum článku pro web: první publikace, dokud pole chybí — `publishedAt`. */
export const postDate = (post: {
  date?: string | null
  publishedAt?: string
}): string | undefined => post.date || post.publishedAt || undefined

const time = (value: string | undefined): number => {
  const t = value ? new Date(value).getTime() : Number.NaN
  return Number.isNaN(t) ? 0 : t
}

/** Nejnovější první podle data první publikace. */
export const byPostDateDesc = (a: IDataPostShort, b: IDataPostShort): number =>
  time(postDate(b)) - time(postDate(a))

const DYNAMIC_CONTENT_POPULATE = {
  on: {
    'content.text': {
      populate: '*',
    },
    'content.content-baner': {
      populate: {
        cta: {
          fields: ['title', 'link'],
        },
        image: {
          fields: ['url', 'alternativeText'],
        },
      },
    },
    'content.galery': {
      populate: {
        cta: {
          fields: ['title', 'link'],
        },
        image: {
          fields: ['url', 'alternativeText'],
        },
      },
    },
    'content.faq': {
      populate: '*',
    },
  },
}

/**
 * `modern` = pole z s291 (`date`, `season`, `author`). Strapi před nasazením s291
 * je nezná a odpoví 400 — pak druhý pokus bez nich, aby blog nespadl na 404.
 */
const postQuery = (slug: string, modern: boolean) =>
  qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      fields: modern
        ? ['title', 'date', 'publishedAt', 'updatedAt', 'topic', 'season']
        : ['title', 'publishedAt', 'updatedAt', 'topic'],
      populate: {
        image: {
          fields: ['url', 'alternativeText'],
        },
        metaData: {
          populate: ['image'],
        },
        ...(modern ? { author: { populate: { photo: { fields: ['url'] } } } } : {}),
        dynamicContent: DYNAMIC_CONTENT_POPULATE,
      },
    },
    {
      encodeValuesOnly: true,
    },
  )

export const getPost = async (slug: string): Promise<IDataPost | undefined> => {
  try {
    const data: IDataPost[] = await Axios.get(`/api/blogs?${postQuery(slug, true)}`)
    return data[0]
  } catch {
    try {
      const data: IDataPost[] = await Axios.get(`/api/blogs?${postQuery(slug, false)}`)
      return data[0]
    } catch (error) {
      console.error('Failed to fetch post:', error)
      return undefined
    }
  }
}

const allPostsQuery = (modern: boolean) =>
  qs.stringify(
    {
      fields: modern
        ? ['title', 'slug', 'date', 'publishedAt', 'updatedAt', 'topic', 'season']
        : ['title', 'slug', 'publishedAt', 'updatedAt', 'topic'],
      populate: {
        image: {
          fields: ['url', 'alternativeText', 'width', 'height'],
        },
        metaData: {
          fields: ['description'],
        },
      },
      // Bez explicitního řazení a stránkování platil výchozí limit Strapi (25):
      // 26. článkem by nejstarší příspěvky tiše zmizely z /blog i ze sitemapy.
      sort: [modern ? 'date:desc' : 'publishedAt:desc'],
      pagination: {
        start: 0,
        limit: 100,
      },
    },
    {
      encodeValuesOnly: true,
    },
  )

/** Chyba se nechytá — `unstable_cache` by jinak na hodinu uložil prázdný seznam. */
const fetchAllPosts = async (): Promise<IDataPostShort[]> => {
  let data: IDataPostShort[]
  try {
    data = await Axios.get(`/api/blogs?${allPostsQuery(true)}`)
  } catch {
    data = await Axios.get(`/api/blogs?${allPostsQuery(false)}`)
  }
  return (Array.isArray(data) ? data : [])
    .filter((post) => post?.slug && !REDIRECTED_POST_SLUGS.has(post.slug))
    .sort(byPostDateDesc)
}

// /blog s filtrem `?tema=` se vykresluje na každý požadavek — seznam článků se drží
// v datové cache Next (1 h, tag `blog` shazuje webhook /api/revalidate po publikaci).
const cachedAllPosts = unstable_cache(fetchAllPosts, ['blog-all-posts-s291'], {
  revalidate: 3600,
  tags: ['blog'],
})

/**
 * Všechny publikované články, nejnovější první podle `blog.date`. Bez článků,
 * které `lib/blogRedirects` přesměrovává jinam.
 */
export const getAllPost = async (): Promise<IDataPostShort[]> => {
  try {
    return await cachedAllPosts()
  } catch (error) {
    console.error('Failed to fetch all posts:', error)
    return []
  }
}

/**
 * Tři články pro hlavní stránku (s286): nejnovější podle data, bez sezónních
 * mimo sezónu (s291) — jarní manikúra nemá v listopadu stát na hlavní.
 */
export const getHomePosts = async (): Promise<IDataPostShort[]> => {
  const posts = await getAllPost()
  return posts.filter((post) => !isOffSeason(post)).slice(0, 3)
}

interface IDataBlogPage {
  title: string
}

export const getBlogPage = async (): Promise<IDataBlogPage> => {
  const queryPage = qs.stringify(
    {
      fields: ['title'],
    },
    {
      encodeValuesOnly: true,
    },
  )

  try {
    const data: IDataBlogPage = await Axios.get(`/api/blog-page?${queryPage}`)
    return data
  } catch (error) {
    console.error('Failed to fetch blog page:', error)
    return { title: '' }
  }
}
