import { notFound } from 'next/navigation'
import { getWorkspaceFolders, getAllUserVideos } from '@/actions/workspace'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import Videos from '@/components/global/videos'
import { client } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { Folder } from 'lucide-react'

interface Props {
  params: Promise<{ workspaceId: string; folderId: string }>
}

export default async function FolderPage({ params }: Props) {
  const { workspaceId, folderId } = await params
  const user = await currentUser()
  if (!user) notFound()

  const folder = await client.folder.findUnique({
    where: { id: folderId },
    select: { id: true, name: true, workSpaceId: true },
  })

  if (!folder || folder.workSpaceId !== workspaceId) notFound()

  const query = new QueryClient()
  await query.prefetchQuery({
    queryKey: ['user-videos'],
    queryFn: () => getAllUserVideos(folderId),
  })

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="p-6 flex flex-col gap-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Folder size={20} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {folder.name ?? 'Untitled Folder'}
            </h1>
            <p className="text-neutral-500 text-sm mt-0.5">Folder contents</p>
          </div>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl bg-[#1D1D1D]" />
              ))}
            </div>
          }
        >
          <Videos workspaceId={folderId} />
        </Suspense>
      </div>
    </HydrationBoundary>
  )
}
