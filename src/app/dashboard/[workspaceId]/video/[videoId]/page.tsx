import { notFound } from 'next/navigation'
import { getVideoInfo } from '@/actions/video'
import VideoPlayer from '@/components/global/video-player'
import VideoTitleEditor from '@/components/global/video-title-editor'
import VideoTabs from '@/components/global/video-tabs'
import CopyLink from '@/components/global/copy-link'
import { Eye, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ workspaceId: string; videoId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { videoId } = await params
  const res = await getVideoInfo(videoId)
  if (res.status !== 200 || !res.data) return { title: 'Video' }
  return {
    title: res.data.title ?? 'Untitled Video',
    description: res.data.description ?? undefined,
  }
}

export default async function VideoPage({ params }: Props) {
  const { workspaceId, videoId } = await params
  const res = await getVideoInfo(videoId)

  if (res.status !== 200 || !res.data) notFound()

  const video = res.data

  const initialComments = (video.comments ?? []).map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }))

  return (
    <div className="flex flex-col lg:flex-row gap-0 min-h-full">
      {/* Left: player + meta */}
      <div className="flex-1 flex flex-col gap-y-5 min-w-0 p-6 lg:pr-3">
        <VideoPlayer
          videoId={videoId}
          source={video.source}
          processing={video.processing}
        />

        <div className="flex flex-col gap-y-3">
          <VideoTitleEditor
            videoId={videoId}
            initialTitle={video.title ?? 'Untitled Video'}
            initialDescription={video.description ?? ''}
          />

          <div className="flex items-center gap-x-4 text-sm text-neutral-500">
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {video.views} views
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={video.User?.image ?? ''} />
                <AvatarFallback className="bg-indigo-700 text-xs">
                  {video.User?.firstName?.[0] ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-neutral-300">
                {video.User?.firstName} {video.User?.lastName}
              </span>
            </div>
            <CopyLink videoId={videoId} workspaceId={workspaceId} />
          </div>

          {video.description && video.description !== 'No Description' && (
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
              <p className="text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Description</p>
              <p className="text-sm text-neutral-300 leading-relaxed">{video.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: tabbed panel */}
      <div className="w-full lg:w-[380px] flex-shrink-0 border-l border-[#2a2a2a] p-4 flex flex-col min-h-0 lg:min-h-screen">
        <VideoTabs
          videoId={videoId}
          initialComments={initialComments}
          summary={video.summary}
        />
      </div>
    </div>
  )
}
