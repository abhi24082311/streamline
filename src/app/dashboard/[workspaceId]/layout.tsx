import { onAuthenticateUser } from '@/actions/user'
import { getAllUserVideos, getNotifications, getWorkspaceFolders, getWorkSpaces, verifyAccessToWorkspace } from '@/actions/workspace'
import { redirect } from 'next/navigation'
import React from 'react'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import Sidebar from '@/components/global/sidebar'

type Props = {
  params: Promise<{
    workspaceId: string
  }>
  children: React.ReactNode
}

const Layout = async ({ params, children }: Props) => {
  const { workspaceId } = await params
  const auth = await onAuthenticateUser()
  if (!auth.user?.workSpace || !auth.user.workSpace.length) redirect('/auth/sign-in')
  const hasAccess = await verifyAccessToWorkspace(workspaceId)

  if (hasAccess.status != 200) {
    redirect(`/dashboard/${auth?.user?.workSpace?.[0].id}`)
  }

  if (!hasAccess.data?.workspace) {
    return null
  }

  const query = new QueryClient()
  
  await Promise.all([
    query.prefetchQuery({
      queryKey: ['workspace-folders'],
      queryFn: () => getWorkspaceFolders(workspaceId),
    }),
    query.prefetchQuery({
      queryKey: ['user-videos'],
      queryFn: () => getAllUserVideos(workspaceId),
    }),
    query.prefetchQuery({
      queryKey: ['user-workspaces'],
      queryFn: () => getWorkSpaces(),
    }),
    query.prefetchQuery({
      queryKey: ['user-notifications'],
      queryFn: () => getNotifications(),
    }),
  ])

  return <HydrationBoundary state={dehydrate(query)}>
    <div className="flex h-screen w-screen">
      <Sidebar activeWorkspaceId={workspaceId} />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  </HydrationBoundary>
}

export default Layout
