'use client'

import React, { useState } from 'react'
import { acceptWorkspaceInvite } from '@/actions/workspace'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { User, Loader2, ArrowRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface InviteCardProps {
  inviteId: string
  senderName: string
  senderImage: string | null
  workspaceName: string
}

export default function InviteCard({
  inviteId,
  senderName,
  senderImage,
  workspaceName,
}: InviteCardProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleJoin = async () => {
    try {
      setIsPending(true)
      const res = await acceptWorkspaceInvite(inviteId)
      if (res.status === 200) {
        toast.success(res.data)
        router.push(`/dashboard/${res.workspaceId}`)
        router.refresh()
      } else {
        toast.error(res.data as string || 'Failed to join workspace')
      }
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="relative w-full max-w-md">
      {/* Decorative gradient glow in background */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-xl transition duration-1000" />
      
      {/* Card container */}
      <div className="relative flex flex-col items-center rounded-2xl border border-[#2a2a2a] bg-[#1D1D1D]/75 p-8 text-center shadow-2xl backdrop-blur-xl">
        {/* Inviter Avatar */}
        <div className="relative mb-6">
          <Avatar className="h-20 w-20 border-2 border-indigo-500/30">
            {senderImage && <AvatarImage src={senderImage} />}
            <AvatarFallback className="bg-neutral-800">
              <User className="h-8 w-8 text-indigo-400" />
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 rounded-full bg-indigo-600 p-1 text-white shadow-md">
            <ArrowRight size={14} />
          </span>
        </div>

        {/* Headline */}
        <h2 className="mb-2 text-2xl font-bold bg-gradient-to-r from-indigo-200 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Workspace Invitation
        </h2>
        
        {/* Context description */}
        <p className="mb-6 text-sm text-neutral-400 leading-relaxed">
          <span className="font-semibold text-neutral-200">{senderName}</span> has invited you to join the workspace
        </p>

        {/* Workspace Name Badge */}
        <div className="mb-8 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-6 py-4">
          <span className="text-lg font-bold text-indigo-300 capitalize">
            {workspaceName}
          </span>
        </div>

        {/* CTAs */}
        <div className="flex w-full flex-col gap-3">
          <Button
            onClick={handleJoin}
            disabled={isPending}
            className="w-full font-bold bg-indigo-600 hover:bg-indigo-600/90 text-white py-6 rounded-xl relative transition-all"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Joining...
              </span>
            ) : (
              'Accept Invitation'
            )}
          </Button>

          <Button
            variant="ghost"
            disabled={isPending}
            onClick={() => router.push('/dashboard')}
            className="w-full text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40 rounded-xl py-6"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
