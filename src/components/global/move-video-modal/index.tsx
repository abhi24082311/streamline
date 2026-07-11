'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { moveVideoToWorkspace, moveVideoToFolder } from '@/actions/workspace'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2, FolderOpen, Check, ArrowRightLeft, FolderInput, CornerLeftUp } from 'lucide-react'
import { WorkspaceProps, FolderProps } from '@/types/index.type'

type Tab = 'folders' | 'workspaces'

interface Props {
  open: boolean
  onClose: () => void
  videoId: string
  currentWorkspaceId: string
  currentFolderId?: string | null
  initialTab?: Tab
}

const MoveVideoModal = ({
  open,
  onClose,
  videoId,
  currentWorkspaceId,
  currentFolderId,
  initialTab = 'folders',
}: Props) => {
  const queryClient = useQueryClient()
  const [moving, setMoving] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>(initialTab)

  // Read workspace list from cache
  const workspacesData = queryClient.getQueryData<WorkspaceProps>(['user-workspaces'])
  const ownedWorkspaces = workspacesData?.data?.workSpace ?? []
  const memberWorkspaces = workspacesData?.data?.members
    ?.map((m: any) => m.WorkSpace)
    .filter(Boolean) ?? []

  const allWorkspaces = [
    ...ownedWorkspaces,
    ...memberWorkspaces,
  ].filter((ws: any) => ws.id !== currentWorkspaceId)

  // Read folders from cache
  const foldersData = queryClient.getQueryData<FolderProps>(['workspace-folders'])
  const allFolders = (foldersData?.data ?? []).filter(
    (f: any) => f.id !== currentFolderId
  )

  // Reset tab when modal opens
  React.useEffect(() => {
    if (open) setActiveTab(initialTab)
  }, [open, initialTab])

  const handleMoveToWorkspace = async (targetId: string, targetName: string) => {
    setMoving(targetId)
    const res = await moveVideoToWorkspace(videoId, targetId)
    setMoving(null)

    if (res.status === 200) {
      toast.success(`Moved to "${targetName}"`)
      await queryClient.invalidateQueries({ queryKey: ['user-videos'] })
      await queryClient.invalidateQueries({ queryKey: ['workspace-folders'] })
      onClose()
    } else {
      toast.error(res.data as string || 'Could not move video')
    }
  }

  const handleMoveToFolder = async (targetId: string | null, targetName: string) => {
    const key = targetId ?? '__root__'
    setMoving(key)
    const res = await moveVideoToFolder(videoId, targetId)
    setMoving(null)

    if (res.status === 200) {
      toast.success(targetId ? `Moved to "${targetName}"` : 'Removed from folder')
      await queryClient.invalidateQueries({ queryKey: ['user-videos'] })
      await queryClient.invalidateQueries({ queryKey: ['workspace-folders'] })
      onClose()
    } else {
      toast.error(res.data as string || 'Could not move video')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#1D1D1D] border border-[#2a2a2a] text-white max-w-sm p-0 gap-0">
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="text-base font-semibold">Move Video</DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-3 pb-0">
          <button
            onClick={() => setActiveTab('folders')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
              ${activeTab === 'folders'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-[#2a2a2a] border border-transparent'
              }`}
          >
            <FolderInput size={12} />
            Folders
          </button>
          <button
            onClick={() => setActiveTab('workspaces')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
              ${activeTab === 'workspaces'
                ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-[#2a2a2a] border border-transparent'
              }`}
          >
            <ArrowRightLeft size={12} />
            Workspaces
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-y-1 px-3 py-3 max-h-[320px] overflow-y-auto">
          {activeTab === 'folders' && (
            <>
              {/* "Remove from folder" option — only when video is already in a folder */}
              {currentFolderId && (
                <>
                  <button
                    onClick={() => handleMoveToFolder(null, '')}
                    disabled={!!moving}
                    className="flex items-center gap-x-3 px-3 py-2.5 rounded-xl hover:bg-[#2a2a2a] transition-colors text-left group disabled:opacity-60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <CornerLeftUp size={14} className="text-amber-400" />
                    </div>
                    <span className="text-sm text-neutral-300 flex-1">
                      Move to workspace root
                    </span>
                    {moving === '__root__' ? (
                      <Loader2 size={14} className="animate-spin text-amber-400" />
                    ) : (
                      <Check size={14} className="opacity-0 group-hover:opacity-100 text-amber-400 transition-opacity" />
                    )}
                  </button>
                  <div className="border-t border-[#2a2a2a] mx-2 my-1" />
                </>
              )}

              {allFolders.length === 0 ? (
                <p className="text-neutral-500 text-sm text-center py-4">
                  {currentFolderId
                    ? 'No other folders available.'
                    : 'No folders in this workspace. Create a folder first.'}
                </p>
              ) : (
                allFolders.map((folder: any) => (
                  <button
                    key={folder.id}
                    onClick={() => handleMoveToFolder(folder.id, folder.name ?? 'Untitled Folder')}
                    disabled={!!moving}
                    className="flex items-center gap-x-3 px-3 py-2.5 rounded-xl hover:bg-[#2a2a2a] transition-colors text-left group disabled:opacity-60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                      <FolderInput size={14} className="text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-neutral-200 block truncate">
                        {folder.name ?? 'Untitled Folder'}
                      </span>
                      <span className="text-[10px] text-neutral-600">
                        {folder._count?.videos ?? 0} video{(folder._count?.videos ?? 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {moving === folder.id ? (
                      <Loader2 size={14} className="animate-spin text-indigo-400" />
                    ) : (
                      <Check size={14} className="opacity-0 group-hover:opacity-100 text-indigo-400 transition-opacity" />
                    )}
                  </button>
                ))
              )}
            </>
          )}

          {activeTab === 'workspaces' && (
            <>
              {allWorkspaces.length === 0 ? (
                <p className="text-neutral-500 text-sm text-center py-4">
                  No other workspaces available.
                </p>
              ) : (
                allWorkspaces.map((ws: any) => (
                  <button
                    key={ws.id}
                    onClick={() => handleMoveToWorkspace(ws.id, ws.name)}
                    disabled={!!moving}
                    className="flex items-center gap-x-3 px-3 py-2.5 rounded-xl hover:bg-[#2a2a2a] transition-colors text-left group disabled:opacity-60"
                  >
                    <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                      <FolderOpen size={14} className="text-violet-400" />
                    </div>
                    <span className="text-sm text-neutral-200 flex-1">{ws.name}</span>
                    {moving === ws.id ? (
                      <Loader2 size={14} className="animate-spin text-violet-400" />
                    ) : (
                      <Check size={14} className="opacity-0 group-hover:opacity-100 text-violet-400 transition-opacity" />
                    )}
                  </button>
                ))
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MoveVideoModal
