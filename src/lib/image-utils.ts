const STRAPI_URL =
  process.env.NEXT_PUBLIC_APP_API || process.env.APP_API || 'https://strapi.barbitch.cz'

/**
 * Normalizes image URL from Strapi.
 * If the URL is a relative path (e.g. /uploads/...), prepends the Strapi API URL.
 * If it's already a full URL, returns it as-is.
 */
export function getStrapiImageUrl(url: string | undefined | null): string {
  if (!url) return '/assets/bigBaner.jpg'
  if (url.startsWith('http')) return url
  return `${STRAPI_URL}${url}`
}

/**
 * Neutral gray blur placeholder for images
 * Prevents green tint and provides smooth loading experience
 */
export const BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k='

/**
 * Default sizes configuration for responsive images
 */
export const DEFAULT_IMAGE_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'

/**
 * Quality settings for different image types
 */
export const IMAGE_QUALITY = {
  hero: 75,
  gallery: 70,
  thumbnail: 70,
  icon: 80,
} as const
