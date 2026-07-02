import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'

export const getAuthUser = async () => {
  const user = await currentUser({ treatPendingAsSignedOut: false })
  if (user) return user

  const { userId } = await auth()
  if (!userId) return null

  const client = await clerkClient()
  return client.users.getUser(userId) as any
}
