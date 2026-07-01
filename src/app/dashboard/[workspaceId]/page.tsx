import { Suspense } from 'react'
import Folders from '@/components/global/folders'
import Videos from '@/components/global/videos'
import { Skeleton } from '@/components/ui/skeleton'
import CreateFolderButton from '@/components/global/create-folder-button'

interface Props {
  params: Promise<{ workspaceId: string }>
}

export default async function WorkspacePage({ params }: Props) {
  const { workspaceId } = await params

  return (
    <div className="p-6 flex flex-col gap-y-8">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Library</h1>
          <p className="text-neutral-500 text-sm mt-1">
            All your folders and videos in one place
          </p>
        </div>
        <CreateFolderButton workspaceId={workspaceId} />
      </div>

      {/* Folders section */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl bg-[#1D1D1D]" />
            ))}
          </div>
        }
      >
        <Folders workspaceId={workspaceId} />
      </Suspense>

      {/* Videos section */}
      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl bg-[#1D1D1D]" />
            ))}
          </div>
        }
      >
        <Videos workspaceId={workspaceId} />
      </Suspense>
    </div>
  )
}

