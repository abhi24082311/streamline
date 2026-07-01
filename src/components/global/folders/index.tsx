'use client'
import React from 'react'
import { useQueryData } from '@/hooks/userQueryData'
import { getWorkspaceFolders } from '@/actions/workspace'
import { FolderProps } from '@/types/index.type'
import FolderCard from '@/components/global/folder-card'

type Props = {
  workspaceId: string
}

const Folders = ({ workspaceId }: Props) => {
  const { data } = useQueryData(
    ['workspace-folders'],
    () => getWorkspaceFolders(workspaceId)
  )

  const folders = data as FolderProps | undefined

  if (!folders?.data || folders.data.length === 0) return null

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[#BDBDBD] font-semibold text-sm">Folders</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {folders.data.map((folder) => (
          <FolderCard
            key={folder.id}
            id={folder.id}
            name={folder.name}
            workspaceId={workspaceId}
            videoCount={folder._count.videos}
          />
        ))}
      </div>
    </div>
  )
}

export default Folders
