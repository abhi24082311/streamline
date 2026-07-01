'use client'
import React, { useState } from 'react'
import { updateVideo } from '@/actions/video'
import { Pencil, Check, X } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  videoId: string
  initialTitle: string
  initialDescription: string
}

const VideoTitleEditor = ({ videoId, initialTitle, initialDescription }: Props) => {
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingDesc, setEditingDesc] = useState(false)
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [isPending, setIsPending] = useState(false)

  const save = async () => {
    setIsPending(true)
    const res = await updateVideo(videoId, title, description)
    setIsPending(false)
    if (res.status === 200) {
      toast.success('Video updated')
      setEditingTitle(false)
      setEditingDesc(false)
    } else {
      toast.error('Could not save changes')
    }
  }

  const cancel = () => {
    setTitle(initialTitle)
    setDescription(initialDescription)
    setEditingTitle(false)
    setEditingDesc(false)
  }

  return (
    <div className="flex flex-col gap-y-2">
      {/* Title */}
      <div className="flex items-start gap-2 group">
        {editingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-[#1a1a1a] border border-indigo-500 rounded-lg px-3 py-1.5 text-xl font-bold text-white outline-none"
          />
        ) : (
          <h1 className="flex-1 text-xl font-bold text-white">{title}</h1>
        )}
        {!editingTitle && (
          <button
            onClick={() => setEditingTitle(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#1D1D1D] rounded"
          >
            <Pencil size={14} className="text-neutral-400" />
          </button>
        )}
      </div>

      {/* Description */}
      <div className="flex items-start gap-2 group">
        {editingDesc ? (
          <textarea
            autoFocus
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="flex-1 bg-[#1a1a1a] border border-indigo-500 rounded-lg px-3 py-2 text-sm text-neutral-300 outline-none resize-none"
          />
        ) : (
          <p className="flex-1 text-sm text-neutral-400">
            {description || 'No description'}
          </p>
        )}
        {!editingDesc && (
          <button
            onClick={() => setEditingDesc(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#1D1D1D] rounded mt-0.5"
          >
            <Pencil size={14} className="text-neutral-400" />
          </button>
        )}
      </div>

      {/* Save / Cancel */}
      {(editingTitle || editingDesc) && (
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={save}
            disabled={isPending}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <Check size={13} /> Save
          </button>
          <button
            onClick={cancel}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#1D1D1D] hover:bg-[#2a2a2a] text-neutral-400 text-xs rounded-lg transition-colors"
          >
            <X size={13} /> Cancel
          </button>
        </div>
      )}
    </div>
  )
}

export default VideoTitleEditor
