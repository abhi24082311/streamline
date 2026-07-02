'use client'
import React, { useEffect, useRef } from 'react'
import { incrementVideoViews } from '@/actions/video'
import { Film } from 'lucide-react'

interface Props {
  videoId: string
  source: string
  processing: boolean
}

const VideoPlayer = ({ videoId, source, processing }: Props) => {
  const hasTracked = useRef(false)

  // Build the full video URL: if source is already a full URL use it as-is,
  // otherwise prepend the CloudFront stream base URL.
  const videoUrl = source.startsWith('http')
    ? source
    : `${process.env.NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL}/${source}`

  useEffect(() => {
    if (!hasTracked.current && !processing) {
      hasTracked.current = true
      incrementVideoViews(videoId)
    }
  }, [videoId, processing])

  if (processing) {
    return (
      <div className="w-full aspect-video bg-[#111] rounded-xl flex flex-col items-center justify-center gap-3 border border-[#2a2a2a]">
        <Film size={36} className="text-neutral-600 animate-pulse" />
        <p className="text-neutral-500 text-sm">Video is still processing…</p>
        <p className="text-neutral-600 text-xs">Check back in a moment</p>
      </div>
    )
  }

  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-[#2a2a2a]">
      <video
        controls
        autoPlay={false}
        className="w-full h-full object-contain"
        src={videoUrl}
        preload="metadata"
      >
        Your browser does not support the video element.
      </video>
    </div>
  )
}

export default VideoPlayer
