'use client'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import { useQueryData } from '@/hooks/userQueryData'
import { NotificationProps, WorkspaceProps } from '@/types/index.type'
import Modal from '../modal'
import { PlusCircle, Lock, Globe } from 'lucide-react'
import Search from '../search-workspace'
import { MENU_ITEMS } from '@/constants'
import SidebarItem from './sidebar-item'
import WorkspacePlaceholder from './workspace-placeholder'
import CreateWorkspaceButton from '@/components/global/create-workspace'

type Props = {
  activeWorkspaceId: string
}

const Sidebar = ({ activeWorkspaceId }: Props) => {
  const router = useRouter()
  const pathName = usePathname()

  // These queries are always pre-seeded by the server layout via HydrationBoundary.
  // Passing a no-op queryFn prevents any client-side server action calls.
  const { data: notifications } = useQueryData(['user-notifications'], () => null as any)
  const { data: workspaces } = useQueryData(['user-workspaces'], () => null as any)
  
  const notificationData = notifications as NotificationProps | undefined
  const count = notificationData?.data
  
  const menuItems = MENU_ITEMS(activeWorkspaceId)
  const workspacesData = workspaces as WorkspaceProps | undefined

  const onChangeActiveWorkspace = (value: string) => {
    router.push(`/dashboard/${value}`)
  }

  const currentWorkspace = workspacesData?.data?.workSpace?.find((s) => s.id === activeWorkspaceId)

  return (
    <div className="bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col gap-4 items-center overflow-hidden ">
      <div className="bg-[#111111] p-4 flex gap-2 justify-center items-center mb-4 absolute top-0 left-0 right-0 ">
        <Image
          src="/opal-logo.svg"
          height={40}
          width={40}
          alt="logo"
        />
        <p className="text-2xl">Streamline</p>
      </div>
      <Select
        defaultValue={activeWorkspaceId}
        onValueChange={onChangeActiveWorkspace}
      >
        <SelectTrigger className="mt-16  text-neutral-400 bg-transparent">
          <SelectValue placeholder="Select a workspace"></SelectValue>
        </SelectTrigger>
        <SelectContent className='bg-[#111111] backdrop-blur-xl'>
          <SelectGroup>
            <SelectLabel>Workspaces</SelectLabel>
            <Separator />
            {workspacesData?.data?.workSpace?.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.name}
              </SelectItem>
            ))}
            {workspacesData?.data?.members && workspacesData.data.members.length > 0 &&
              workspacesData.data.members.map(
                (m) =>
                  m.WorkSpace && (
                    <SelectItem
                      value={m.WorkSpace.id}
                      key={m.WorkSpace.id}
                    >
                      {m.WorkSpace.name}
                    </SelectItem>
                  )
              )}
          </SelectGroup>
        </SelectContent>
      </Select>

      {currentWorkspace?.type === 'PUBLIC' && (
        <Modal
          trigger={<span className="text-sm cursor-pointer flex items-center justify-center bg-neutral-800/90 hover:bg-neutral-800/60 w-full rounded-sm p-[5px] gap-2">
            <PlusCircle size={15} className='text-neutral-800/90 fill-neutral-500'
            />
            <span className='text-neutral-400 font-semibold text-xs'>
              Invite To Workspace
            </span>
          </span>}
          title="Invite To Workspace"
          description="Invite other users to your workspace"
        >
          <Search workspaceId={activeWorkspaceId} />
        </Modal>
      )}

      <p className="w-full text-[#909090] font-bold mt-4"> Menu</p>
      <nav className="w-full">
        <ul>
          {menuItems.map((item) => (
            <SidebarItem
              href={item.href}
              icon={item.icon}
              selected={pathName === item.href}
              title={item.title}
              key={item.title}
              notifications={
                (item.title === 'Notifications' &&
                  count?._count &&
                  count?._count.notification
                ) || 0
              }
            ></SidebarItem>
          ))}
        </ul>
      </nav>

      <Separator className="w-4/5" />
      <p className="w-full text-[#909090] font-bold mt-4">Workspaces</p>
      <nav className="w-full">
        <ul className="h-[150px] overflow-auto overflow-x-hidden fade-layer">
          {workspacesData?.data?.workSpace &&
            workspacesData.data.workSpace.length > 0 &&
            workspacesData.data.workSpace.map((item) => (
              <SidebarItem
                key={item.id}
                href={`/dashboard/${item.id}`}
                selected={pathName === `/dashboard/${item.id}`}
                title={item.name}
                icon={
                  <WorkspacePlaceholder>
                    {item.name.charAt(0).toUpperCase()}
                  </WorkspacePlaceholder>
                }
                notifications={0}
              >
                {item.type === 'PERSONAL' ? (
                  <Lock size={12} className="text-neutral-500 ml-auto flex-shrink-0" />
                ) : (
                  <Globe size={12} className="text-indigo-400 ml-auto flex-shrink-0" />
                )}
              </SidebarItem>
            ))
          }
          {workspacesData?.data?.members &&
            workspacesData.data.members.length > 0 &&
            workspacesData.data.members.map(
              (item) =>
                item.WorkSpace && (
                  <SidebarItem
                    key={item.WorkSpace.id}
                    href={`/dashboard/${item.WorkSpace.id}`}
                    selected={pathName === `/dashboard/${item.WorkSpace.id}`}
                    title={item.WorkSpace.name}
                    icon={
                      <WorkspacePlaceholder>
                        {item.WorkSpace.name.charAt(0).toUpperCase()}
                      </WorkspacePlaceholder>
                    }
                    notifications={0}
                  />
                )
            )
          }
          {!workspacesData?.data?.workSpace?.length &&
            !workspacesData?.data?.members?.length && (
              <div className="w-full h-full flex justify-center items-center">
                <p className="text-[#9D9D9D] font-medium text-sm">No workspaces</p>
              </div>
            )
          }
        </ul>
      </nav>
      <CreateWorkspaceButton />
</div>
  )
}

export default Sidebar
