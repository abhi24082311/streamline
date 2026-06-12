import React from 'react'

type Props = {
  params: Promise<{
    workspaceId: string
  }>
}

const WorkspacePage = async ({ params }: Props) => {
  const { workspaceId } = await params
  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-neutral-400 mt-2">Workspace: {workspaceId}</p>
    </div>
  )
}

export default WorkspacePage
