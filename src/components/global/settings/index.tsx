'use client'
import React, { useState } from 'react'
import { renameWorkspace } from '@/actions/workspace'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Building2, User, Pencil, Check } from 'lucide-react'

interface Props {
  userId: string
  firstName: string
  lastName: string
  email: string
  image: string
  workspaceId: string
  workspaceName: string
  workspaceType: 'PUBLIC' | 'PERSONAL'
}

const SettingsClient = ({
  userId,
  firstName,
  lastName,
  email,
  image,
  workspaceId,
  workspaceName,
  workspaceType,
}: Props) => {
  const [wsName, setWsName] = useState(workspaceName)
  const [editingWs, setEditingWs] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const saveWorkspaceName = async () => {
    if (!wsName.trim()) return
    setIsSaving(true)
    const res = await renameWorkspace(workspaceId, wsName)
    setIsSaving(false)
    if (res.status === 200) {
      toast.success('Workspace renamed')
      setEditingWs(false)
    } else {
      toast.error('Could not rename workspace')
    }
  }

  return (
    <div className="flex flex-col gap-y-8">
      {/* Profile section */}
      <section className="flex flex-col gap-y-4">
        <div className="flex items-center gap-2 mb-1">
          <User size={16} className="text-indigo-400" />
          <h2 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider">
            Profile
          </h2>
        </div>
        <Separator className="bg-[#1D1D1D]" />

        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={image} />
            <AvatarFallback className="bg-indigo-700 text-lg">
              {firstName?.[0] ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-white font-medium text-lg">
              {firstName} {lastName}
            </p>
            <p className="text-neutral-400 text-sm">{email}</p>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
          <p className="text-xs text-neutral-500 mb-1">
            Profile updates are managed through your Clerk account settings.
          </p>
          <a
            href="https://accounts.clerk.dev/user"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Edit profile on Clerk →
          </a>
        </div>
      </section>

      {/* Workspace section */}
      <section className="flex flex-col gap-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Building2 size={16} className="text-indigo-400" />
          <h2 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider">
            Workspace
          </h2>
        </div>
        <Separator className="bg-[#1D1D1D]" />

        <div className="flex flex-col gap-y-3">
          <label className="text-xs text-neutral-500 font-medium">Workspace Name</label>
          <div className="flex items-center gap-2">
            {editingWs ? (
              <input
                autoFocus
                value={wsName}
                onChange={(e) => setWsName(e.target.value)}
                className="flex-1 bg-[#1a1a1a] border border-indigo-500 rounded-lg px-3 py-2 text-sm text-white outline-none"
              />
            ) : (
              <p className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white">
                {wsName}
              </p>
            )}
            {editingWs ? (
              <button
                onClick={saveWorkspaceName}
                disabled={isSaving}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors"
              >
                <Check size={16} className="text-white" />
              </button>
            ) : (
              <button
                onClick={() => setEditingWs(true)}
                className="p-2 bg-[#1D1D1D] hover:bg-[#252525] rounded-lg transition-colors"
              >
                <Pencil size={16} className="text-neutral-400" />
              </button>
            )}
          </div>

          <div>
            <label className="text-xs text-neutral-500 font-medium">Workspace Type</label>
            <p className="mt-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-neutral-300">
              {workspaceType === 'PUBLIC' ? '🌐 Public' : '🔒 Personal'}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SettingsClient
