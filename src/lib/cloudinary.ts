/**
 * Cloudinary utilities for the Streamline app.
 *
 * Cloudinary auto-generates a JPEG thumbnail for every uploaded video.
 * We derive the URL at render-time by transforming the video URL — no extra
 * API call needed.
 *
 * Example input:
 *   https://res.cloudinary.com/dglsxasmb/video/upload/v1234/abc123.mp4
 * Output:
 *   https://res.cloudinary.com/dglsxasmb/video/upload/so_0,w_640,h_360,c_fill,q_auto,f_jpg/v1234/abc123.jpg
 */

const CLOUDINARY_BASE = 'res.cloudinary.com'

/**
 * Given a Cloudinary video URL, return a thumbnail image URL.
 * Returns null if the source is not a Cloudinary URL (graceful fallback).
 */
export function getCloudinaryThumbnail(source: string | null | undefined): string | null {
  if (!source) return null

  try {
    const url = new URL(source)
    if (!url.hostname.includes(CLOUDINARY_BASE)) return null

    // Transform: /video/upload/<optional_version>/<public_id>.ext
    // → /video/upload/<transforms>/<optional_version>/<public_id>.jpg
    const transformed = url.pathname.replace(
      '/video/upload/',
      '/video/upload/so_0,w_640,h_360,c_fill,q_auto,f_jpg/'
    )

    // Strip the original extension and replace with .jpg
    const withoutExt = transformed.replace(/\.[^/.]+$/, '')
    return `${url.protocol}//${url.hostname}${withoutExt}.jpg`
  } catch {
    return null
  }
}

/**
 * Given a Cloudinary video URL, return a higher-res poster image URL
 * suitable for the video detail page hero area.
 */
export function getCloudinaryPoster(source: string | null | undefined): string | null {
  if (!source) return null

  try {
    const url = new URL(source)
    if (!url.hostname.includes(CLOUDINARY_BASE)) return null

    const transformed = url.pathname.replace(
      '/video/upload/',
      '/video/upload/so_0,w_1280,h_720,c_fill,q_auto,f_jpg/'
    )

    const withoutExt = transformed.replace(/\.[^/.]+$/, '')
    return `${url.protocol}//${url.hostname}${withoutExt}.jpg`
  } catch {
    return null
  }
}
