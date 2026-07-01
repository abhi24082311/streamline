'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Play, MoreVertical, ArrowRightLeft, Film } from 'lucide-react'
import { getCloudinaryThumbnail } from '@/lib/cloudinary'
import MoveVideoModal from '@/components/global/move-video-modal'

type Props = {
  id: string
  title: string | null
  createdAt: string  // ISO string
  source: string
  processing: boolean
  workspaceId: string   // current workspace (for routing)
  workspaceName?: string | null   // for the badge
  User: {
    firstName: string | null
    lastName: string | null
    image: string | null
  } | null
  Folder: { id: string; name: string | null } | null
}

const VideoCard = ({
  id,
  title,
  createdAt,
  source,
  processing,
  workspaceId,
  workspaceName,
  User,
  Folder,
}: Props) => {
  const [moveOpen, setMoveOpen] = useState(false)
  const thumbnail = getCloudinaryThumbnail(source)

  return (
    <>
      <div className="group relative flex flex-col bg-[#1D1D1D] hover:bg-[#222] border border-[#2a2a2a] rounded-xl overflow-hidden transition-all duration-200 hover:border-[#3a3a3a] hover:shadow-lg hover:shadow-black/30">
        {/* Thumbnail */}
        <Link href={`/dashboard/${workspaceId}/video/${id}`} className="block relative w-full aspect-video bg-[#111] overflow-hidden">
          {processing ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-neutral-600">
              <Film size={28} className="animate-pulse" />
              <span className="text-xs">Processing…</span>
            </div>
          ) : thumbnail ? (
            <>
              <Image
                src={thumbnail}
                alt={title ?? 'Video thumbnail'}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              {/* Dark overlay + play button on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                  <Play size={20} className="text-white fill-white ml-0.5" />
                </div>
              </div>
            </>
          ) : (
            /* Gradient placeholder with play button */
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-violet-900/30 to-[#111] flex items-center justify-center">
              <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-200 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Play size={20} className="text-white fill-white ml-0.5" />
              </div>
            </div>
          )}

          {/* Duration badge — placeholder, can be wired up later */}
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded px-1.5 py-0.5 text-[10px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            {/* HH:MM could go here */}
          </div>
        </Link>

        {/* Meta */}
        <div className="p-3 flex flex-col gap-y-2">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/dashboard/${workspaceId}/video/${id}`} className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-200 line-clamp-2 leading-snug">
                {title ?? 'Untitled Video'}
              </p>
            </Link>

            {/* Kebab menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1 rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-[#2a2a2a] transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreVertical size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[#1D1D1D] border-[#2a2a2a] text-neutral-200 min-w-[160px]"
              >
                <DropdownMenuItem
                  onClick={() => setMoveOpen(true)}
                  className="flex items-center gap-2 cursor-pointer hover:bg-[#2a2a2a] focus:bg-[#2a2a2a]"
                >
                  <ArrowRightLeft size={13} className="text-indigo-400" />
                  Move to Workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Author row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Avatar className="w-5 h-5">
                <AvatarImage src={User?.image ?? ''} />
                <AvatarFallback className="text-[10px] bg-indigo-700">
                  {User?.firstName?.[0] ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-neutral-500">
                {User?.firstName} {User?.lastName}
              </span>
            </div>
            <span className="text-xs text-neutral-600">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {workspaceName && (
              <span className="text-[10px] text-neutral-500 bg-[#2a2a2a] border border-[#333] px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
                {workspaceName}
              </span>
            )}
            {Folder && (
              <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                {Folder.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Move modal — rendered outside the Link */}
      <MoveVideoModal
        open={moveOpen}
        onClose={() => setMoveOpen(false)}
        videoId={id}
        currentWorkspaceId={workspaceId}
      />
    </>
  )
}

export default VideoCard
