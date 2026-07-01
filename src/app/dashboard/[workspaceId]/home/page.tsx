import { getRecentVideos } from '@/actions/video'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { Eye, Film } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home — Streamline',
  description: 'Your recent activity and videos across all workspaces.',
}

interface Props {
  params: Promise<{ workspaceId: string }>
}

export default async function HomePage({ params }: Props) {
  const { workspaceId } = await params
  const res = await getRecentVideos()
  const videos = res.status === 200 ? res.data : []

  return (
    <div className="p-6 flex flex-col gap-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Home</h1>
        <p className="text-neutral-500 text-sm mt-1">Your most recent videos across all workspaces</p>
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#1D1D1D] flex items-center justify-center">
            <Film size={28} className="text-neutral-500" />
          </div>
          <p className="text-neutral-400 font-medium">No videos yet</p>
          <p className="text-neutral-600 text-sm">Videos you record will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {videos.map((video) => (
            <Link
              key={video.id}
              href={`/dashboard/${video.WorkSpace?.id ?? workspaceId}/video/${video.id}`}
              className="group flex flex-col gap-y-2 bg-[#1D1D1D] hover:bg-[#252525] border border-[#2a2a2a] rounded-xl overflow-hidden transition-all duration-200"
            >
              {/* Thumbnail */}
              <div className="relative w-full aspect-video bg-[#111] flex items-center justify-center">
                {video.processing ? (
                  <div className="flex flex-col items-center gap-2 text-neutral-500">
                    <Film size={24} className="animate-pulse" />
                    <span className="text-xs">Processing…</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-indigo-900/30 to-violet-900/20">
                    <Film size={32} className="text-indigo-400 opacity-60" />
                  </div>
                )}
              </div>

              <div className="p-3 flex flex-col gap-y-1">
                <p className="text-sm font-medium text-neutral-200 truncate">
                  {video.title ?? 'Untitled Video'}
                </p>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Eye size={12} /> {video.views}
                  </span>
                  <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
                </div>
                {video.WorkSpace && (
                  <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full w-fit mt-1">
                    {video.WorkSpace.name}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
