import { Home, Bell, Settings } from "lucide-react";
import { FileDuoToneBlack } from "@/components/global/icons/file-duotone-black";
import React from "react";

export const MENU_ITEMS = (
  workspaceId: string
): { title: string; href: string; icon: React.ReactNode }[] => [
  { title: 'Home', href: `/dashboard/${workspaceId}/home`, icon: <Home /> },
  {
    title: 'My Library',
    href: `/dashboard/${workspaceId}`,
    icon: <FileDuoToneBlack />,
  },
  {
    title: 'Notifications',
    href: `/dashboard/${workspaceId}/notifications`,
    icon: <Bell />,
  },
  {
    title: 'Settings',
    href: `/dashboard/${workspaceId}/settings`,
    icon: <Settings />,
  },
]

