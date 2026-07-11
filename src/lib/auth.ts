import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import { cache } from 'react'

// cache() deduplicates concurrent calls within a single server request,
// so parallel server-actions in the layout only hit Clerk once.
export const getAuthUser = cache(async () => {
  const user = await currentUser({ treatPendingAsSignedOut: false })
  if (user) return user

  const { userId } = await auth()
  if (!userId) return null

  const client = await clerkClient()
  return client.users.getUser(userId) as any
})
