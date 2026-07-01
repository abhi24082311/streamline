'use client'
import React from 'react'
import { FolderPlus } from 'lucide-react'
import { useMutationData } from '@/hooks/useMutationData'
import { createFolder } from '@/actions/workspace'
import Loader from '@/components/global/loader'

interface Props {
  workspaceId: string
}

const CreateFolderButton = ({ workspaceId }: Props) => {
  const { mutate, isPending } = useMutationData(
    ['create-folder'],
    () => createFolder(workspaceId),
    () => {},
    'workspace-folders'
  )

  return (
    <button
      onClick={() => mutate({})}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
    >
      <Loader state={isPending} color="#fff">
        <>
          <FolderPlus size={16} />
          New Folder
        </>
      </Loader>
    </button>
  )
}

export default CreateFolderButton
