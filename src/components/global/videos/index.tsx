'use client'
import React from 'react'
import { useQueryData } from '@/hooks/userQueryData'
import { getAllUserVideos } from '@/actions/workspace'
import { VideosProps } from '@/types/index.type'
import VideoCard from '@/components/global/video-card'

type Props = {
  workspaceId: string
}

const Videos = ({ workspaceId }: Props) => {
  const { data } = useQueryData(
    ['user-videos'],
    () => getAllUserVideos(workspaceId)
  )

  const videos = data as VideosProps | undefined

  if (!videos?.data || videos.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-[#1D1D1D] flex items-center justify-center mb-4">
          <span className="text-2xl">🎬</span>
        </div>
        <p className="text-neutral-400 font-medium">No videos yet</p>
        <p className="text-neutral-600 text-sm mt-1">
          Videos you record will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      <h2 className="text-[#BDBDBD] font-semibold text-sm">Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.data.map((video) => (
          <VideoCard
            key={video.id}
            id={video.id}
            title={video.title}
            createdAt={new Date(video.createdAt).toISOString()}
            source={video.source}
            processing={video.processing}
            thumbnail={video.thumbnail}
            workspaceId={workspaceId}
            workspaceName={video.WorkSpace?.name ?? null}
            User={video.User}
            Folder={video.Folder}
          />
        ))}
      </div>
    </div>
  )
}

export default Videos
