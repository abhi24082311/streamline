import { getUserSettings } from '@/actions/video'
import SettingsClient from '@/components/global/settings'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings — Streamline',
  description: 'Manage your profile and workspace settings.',
}

interface Props {
  params: Promise<{ workspaceId: string }>
}

export default async function SettingsPage({ params }: Props) {
  const { workspaceId } = await params
  const res = await getUserSettings()

  if (res.status !== 200 || !res.data) notFound()

  const user = res.data
  const currentWorkspace = user.workSpace.find((w: any) => w.id === workspaceId)

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Manage your profile and workspace preferences
        </p>
      </div>
      <SettingsClient
        userId={user.id}
        firstName={user.firstName ?? ''}
        lastName={user.lastName ?? ''}
        email={user.email}
        image={user.image ?? ''}
        workspaceId={workspaceId}
        workspaceName={currentWorkspace?.name ?? ''}
        workspaceType={currentWorkspace?.type ?? 'PERSONAL'}
      />
    </div>
  )
}
