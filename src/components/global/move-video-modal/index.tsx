'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { moveVideoToWorkspace } from '@/actions/workspace'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Loader2, FolderOpen, Check } from 'lucide-react'
import { WorkspaceProps } from '@/types/index.type'

interface Props {
  open: boolean
  onClose: () => void
  videoId: string
  currentWorkspaceId: string
}

const MoveVideoModal = ({ open, onClose, videoId, currentWorkspaceId }: Props) => {
  const queryClient = useQueryClient()
  const [moving, setMoving] = useState<string | null>(null)

  // Read workspace list from the already-cached query
  const workspacesData = queryClient.getQueryData<WorkspaceProps>(['user-workspaces'])
  
  const ownedWorkspaces = workspacesData?.data?.workSpace ?? []
  const memberWorkspaces = workspacesData?.data?.members
    ?.map((m: any) => m.WorkSpace)
    .filter(Boolean) ?? []

  const allWorkspaces = [
    ...ownedWorkspaces,
    ...memberWorkspaces,
  ].filter((ws: any) => ws.id !== currentWorkspaceId)

  const handleMove = async (targetId: string, targetName: string) => {
    setMoving(targetId)
    const res = await moveVideoToWorkspace(videoId, targetId)
    setMoving(null)

    if (res.status === 200) {
      toast.success(`Moved to "${targetName}"`)
      await queryClient.invalidateQueries({ queryKey: ['user-videos'] })
      onClose()
    } else {
      toast.error(res.data as string || 'Could not move video')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#1D1D1D] border border-[#2a2a2a] text-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Move to Workspace</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-y-2 mt-2">
          {allWorkspaces.length === 0 ? (
            <p className="text-neutral-500 text-sm text-center py-4">
              No other workspaces available.
            </p>
          ) : (
            allWorkspaces.map((ws: any) => (
              <button
                key={ws.id}
                onClick={() => handleMove(ws.id, ws.name)}
                disabled={!!moving}
                className="flex items-center gap-x-3 px-3 py-3 rounded-xl hover:bg-[#2a2a2a] transition-colors text-left group disabled:opacity-60"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <FolderOpen size={14} className="text-indigo-400" />
                </div>
                <span className="text-sm text-neutral-200 flex-1">{ws.name}</span>
                {moving === ws.id ? (
                  <Loader2 size={14} className="animate-spin text-indigo-400" />
                ) : (
                  <Check size={14} className="opacity-0 group-hover:opacity-100 text-indigo-400 transition-opacity" />
                )}
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MoveVideoModal
