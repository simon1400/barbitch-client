import axios from 'axios'

const IG_TYPE_DATA = ['thumbnail_url', 'media_type', 'media_url', 'permalink', 'caption']
// id, timestamp, username

interface IInstagramMediaItem {
  media_type: 'CAROUSEL_ALBUM' | 'IMAGE' | 'VIDEO'
  media_url: string
  thumbnail_url?: string
  permalink?: string
  caption?: string
}

// const refreshToken = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${process.env.IG_ACCESS_TOKEN}`

export const fetchIg = async () => {
  const instagram = await axios.get(
    `https://graph.instagram.com/me/media?fields=${IG_TYPE_DATA.join(',')}&access_token=${process.env.IG_ACCESS_TOKEN}`,
  )

  const resultParse: IInstagramItem[] = instagram.data.data.map((item: IInstagramMediaItem) => ({
    type: item.media_type,
    previewUrl: item?.thumbnail_url || item.media_url,
    caption: item?.caption,
    link: item.permalink,
  }))

  return resultParse
}
