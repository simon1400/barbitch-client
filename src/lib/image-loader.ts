const IMAGEKIT_ENDPOINT = 'https://ik.imagekit.io/njc0tvfgn'

interface ImageLoaderParams {
  src: string
  width: number
  quality?: number
}

export default function imageLoader({ src, width, quality }: ImageLoaderParams): string {
  // Local assets (SVGs, static files in /assets/) — serve as-is, no optimization needed
  if (src.startsWith('/')) {
    return src
  }

  // Already an ImageKit URL — add transformations directly
  if (src.startsWith(IMAGEKIT_ENDPOINT)) {
    return `${src}?tr=w-${width},q-${quality || 75},f-auto`
  }

  // External URLs (Strapi, Instagram, Google, Cloudinary, etc.)
  // ImageKit proxies and optimizes any external URL via web proxy origin
  return `${IMAGEKIT_ENDPOINT}/tr:w-${width},q-${quality || 75},f-auto/${src}`
}
