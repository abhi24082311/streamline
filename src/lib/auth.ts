import { currentUser } from '@clerk/nextjs/server'
import { cache } from 'react'

/**
 * Wrap Clerk's currentUser() with React's cache() so that multiple server
 * actions/components calling this within the same request share one HTTP
 * round-trip to Clerk instead of each making their own.
 *
 * React cache() deduplicates calls per request (similar to React Query but
 * for server-side). This is safe to use in Server Components and Server Actions.
 */
export const getAuthUser = cache(async () => {
  return currentUser()
})
