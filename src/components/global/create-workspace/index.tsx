'use client'
import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import Modal from '@/components/global/modal'
import { useMutationData } from '@/hooks/useMutationData'
import { createWorkspace } from '@/actions/workspace'
import Loader from '@/components/global/loader'

const CreateWorkspaceButton = () => {
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutationData(
    ['create-workspace'],
    () => createWorkspace(name),
    () => {
      setName('')
      setOpen(false)
    },
    'user-workspaces'
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    mutate({})
  }

  return (
    <Modal
      trigger={
        <button className="flex items-center gap-2 w-full px-3 py-2 mt-2 text-sm text-neutral-400 hover:text-neutral-200 hover:bg-[#1D1D1D] rounded-lg transition-colors">
          <Plus size={15} />
          New Workspace
        </button>
      }
      title="Create Workspace"
      description="Start a new shared workspace for your team."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Workspace name…"
          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="submit"
          disabled={isPending || !name.trim()}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Loader state={isPending} color="#fff">
            Create Workspace
          </Loader>
        </button>
      </form>
    </Modal>
  )
}

export default CreateWorkspaceButton
