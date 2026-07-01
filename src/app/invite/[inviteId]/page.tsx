import { onAuthenticateUser } from '@/actions/user'
import { getInvitationInfo } from '@/actions/workspace'
import { redirect } from 'next/navigation'
import React from 'react'
import InviteCard from './invite-card'

interface Props {
  params: Promise<{ inviteId: string }>
}

export default async function InvitePage({ params }: Props) {
  const { inviteId } = await params

  // 1. Authenticate user and ensure DB record exists
  const auth = await onAuthenticateUser()
  if (auth.status !== 200 || !auth.user) {
    return redirect(`/auth/sign-in?redirect_url=${encodeURIComponent(`/invite/${inviteId}`)}`)
  }

  const dbUser = auth.user

  // 2. Fetch invitation info
  const inviteRes = await getInvitationInfo(inviteId)
  if (inviteRes.status !== 200 || !inviteRes.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#171717] px-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center shadow-2xl backdrop-blur-md">
          <h2 className="text-xl font-bold text-red-400">Invitation Not Found</h2>
          <p className="mt-2 text-sm text-neutral-400">
            This invitation link is invalid, expired, or has been revoked.
          </p>
          <a
            href="/dashboard"
            className="mt-6 inline-block rounded-xl bg-neutral-800 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-700 transition-all w-full"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }

  const invite = inviteRes.data

  // 3. If already accepted, redirect to the workspace
  if (invite.accepted) {
    return redirect(`/dashboard/${invite.workSpaceId}`)
  }

  // 4. Verify user matches receiver
  if (invite.recieverId !== dbUser.id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#171717] px-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-8 text-center shadow-2xl backdrop-blur-md">
          <h2 className="text-xl font-bold text-yellow-400">Access Denied</h2>
          <p className="mt-2 text-sm text-neutral-400">
            This invitation was sent to a different account. Please sign in with the correct account to join.
          </p>
          <div className="mt-4 rounded-lg bg-neutral-900/50 p-3 text-left">
            <span className="text-xs text-neutral-500 block">Signed in as:</span>
            <span className="text-sm font-semibold text-neutral-300 truncate block">{dbUser.email}</span>
          </div>
          <a
            href="/dashboard"
            className="mt-6 inline-block rounded-xl bg-neutral-800 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-700 transition-all w-full"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }

  // 5. Render confirmation card
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#171717] px-4 text-white">
      <InviteCard
        inviteId={inviteId}
        senderName={`${invite.sender?.firstName ?? ''} ${invite.sender?.lastName ?? ''}`.trim() || 'Someone'}
        senderImage={invite.sender?.image || null}
        workspaceName={invite.WorkSpace?.name ?? 'a workspace'}
      />
    </div>
  )
}
