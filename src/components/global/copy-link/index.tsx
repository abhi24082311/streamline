'use client'
import React, { useState } from 'react'
import { Link2, Check } from 'lucide-react'

interface Props {
  videoId: string
  workspaceId: string
}

const CopyLink = ({ videoId, workspaceId }: Props) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const url = `${window.location.origin}/dashboard/${workspaceId}/video/${videoId}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1.5 bg-[#1D1D1D] hover:bg-[#252525] border border-[#2a2a2a] text-sm text-neutral-300 rounded-lg transition-colors"
    >
      {copied ? (
        <>
          <Check size={14} className="text-emerald-400" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <Link2 size={14} />
          Copy Link
        </>
      )}
    </button>
  )
}

export default CopyLink
