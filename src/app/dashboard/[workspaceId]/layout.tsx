import { onAuthenticateUser } from '@/actions/user'
import { getWorkspaceFolders, getAllUserVideos } from '@/actions/workspace'
import { redirect } from 'next/navigation'
import React from 'react'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import Sidebar from '@/components/global/sidebar'
import Header from '@/components/global/header'

type Props = {
  params: Promise<{ workspaceId: string }>
  children: React.ReactNode
}

const Layout = async ({ params, children }: Props) => {
  const { workspaceId } = await params

  // Fire all data fetches in ONE parallel wave.
  // getAuthUser() uses React cache() so Clerk is called only once
  // even though both onAuthenticateUser + getAllUserVideos call it.
  const [auth, folders, videos] = await Promise.all([
    onAuthenticateUser(),
    getWorkspaceFolders(workspaceId),
    getAllUserVideos(workspaceId),
  ])

  if (!auth.user?.workSpace?.length) redirect('/auth/sign-in')

  // Verify workspace access from the data already in memory
  const user = auth.user
  const hasAccess =
    user.workSpace.some((w: any) => w.id === workspaceId) ||
    user.members?.some((m: any) => m.WorkSpace?.id === workspaceId)

  if (!hasAccess) redirect(`/dashboard/${user.workSpace[0].id}`)

  // Seed all data into one QueryClient → one HydrationBoundary for the whole tree
  const query = new QueryClient()
  query.setQueryData(['workspace-folders'], folders)
  query.setQueryData(['user-videos'], videos)
  query.setQueryData(['user-workspaces'], {
    status: 200,
    data: {
      subscription: user.subscription,
      workSpace: user.workSpace,
      members: user.members,
      notification: user.notification,
      _count: user._count,
    },
  })
  query.setQueryData(['user-notifications'], {
    status: 200,
    data: {
      notification: user.notification ?? [],
      _count: user._count,
    },
  })

  return (
    <HydrationBoundary state={dehydrate(query, { shouldDehydrateQuery: () => true })}>
      <div className="flex h-screen w-screen">
        <Sidebar activeWorkspaceId={workspaceId} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header workspaceId={workspaceId} />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </HydrationBoundary>
  )
}

export default Layout
