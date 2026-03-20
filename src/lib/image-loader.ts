const IMAGEKIT_ENDPOINT = 'https://ik.imagekit.io/njc0tvfgn'

interface ImageLoaderParams {
  src: string
  width: number
  quality?: number
}

export default function imageLoader({ src, width, quality }: ImageLoaderParams): string {
  // Local assets (SVGs, static files in /assets/) — serve as-is
  if (src.startsWith('/')) {
    return src
  }

  // Already an ImageKit URL — add transformations directly
  if (src.startsWith(IMAGEKIT_ENDPOINT)) {
    const separator = src.includes('?') ? '&' : '?'
    return `${src}${separator}tr=w-${width},q-${quality || 75},f-auto`
  }

  // Cloudinary — use native URL-based transformations
  if (src.includes('res.cloudinary.com')) {
    return src.replace('/upload/', `/upload/w_${width},q_${quality || 75},f_auto/`)
  }

  // External URLs (Strapi, Instagram, Google) — serve as-is
  // ImageKit proxy requires Web Proxy origin configured in dashboard
  return src
}
