'use client'
import React, { useOptimistic, useState } from 'react'
import Link from 'next/link'
import { Folder, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { useMutationData } from '@/hooks/useMutationData'
import { deleteFolder, renameFolder } from '@/actions/workspace'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Loader from '@/components/global/loader'

type Props = {
  id: string
  name: string | null
  workspaceId: string
  videoCount: number
}

const FolderCard = ({ id, name, workspaceId, videoCount }: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [folderName, setFolderName] = useState(name ?? 'Untitled Folder')

  const { mutate: rename, isPending: isRenaming } = useMutationData(
    ['rename-folder'],
    (data: { name: string }) => renameFolder(id, data.name),
    () => setIsEditing(false),
    'workspace-folders'
  )

  const { mutate: remove, isPending: isDeleting } = useMutationData(
    ['delete-folder'],
    () => deleteFolder(id),
    () => {},
    'workspace-folders'
  )

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    rename({ name: folderName })
  }

  return (
    <div className="group relative flex flex-col gap-y-2 cursor-pointer bg-[#1D1D1D] hover:bg-[#252525] border border-[#2a2a2a] rounded-xl p-4 transition-all duration-200">
      {/* Actions dropdown */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded-md hover:bg-[#333] text-neutral-400">
              <MoreVertical size={14} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#1a1a1a] border-[#333] text-neutral-200">
            <DropdownMenuItem
              className="gap-2 cursor-pointer hover:bg-[#2a2a2a]"
              onClick={() => setIsEditing(true)}
            >
              <Pencil size={13} /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer text-red-400 hover:bg-[#2a2a2a] hover:text-red-400"
              onClick={() => remove({})}
            >
              <Loader state={isDeleting} color="#f87171">
                <>
                  <Trash2 size={13} /> Delete
                </>
              </Loader>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Link href={`/dashboard/${workspaceId}/folder/${id}`} className="flex flex-col gap-y-2">
        <Folder size={36} className="text-indigo-400 fill-indigo-400/20" />
        {isEditing ? (
          <form onSubmit={handleRenameSubmit} onClick={(e) => e.preventDefault()}>
            <input
              autoFocus
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onBlur={() => rename({ name: folderName })}
              className="bg-[#111] border border-indigo-500 rounded px-2 py-0.5 text-sm text-white w-full outline-none"
            />
          </form>
        ) : (
          <p className="text-sm font-medium text-neutral-200 truncate pr-6">
            {folderName}
          </p>
        )}
        <p className="text-xs text-neutral-500">
          {videoCount} {videoCount === 1 ? 'video' : 'videos'}
        </p>
      </Link>
    </div>
  )
}

export default FolderCard
