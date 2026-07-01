import { getAllNotifications } from '@/actions/video'
import NotificationsClient from '@/components/global/notifications-list'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notifications — Streamline',
  description: 'Your workspace notifications and invitations.',
}

interface Props {
  params: Promise<{ workspaceId: string }>
}

export default async function NotificationsPage({ params }: Props) {
  const res = await getAllNotifications()
  const notifications = res.status === 200 ? res.data : []

  return (
    <div className="p-6 flex flex-col gap-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Workspace invites and activity alerts
        </p>
      </div>
      <NotificationsClient initialNotifications={notifications} />
    </div>
  )
}
