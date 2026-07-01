import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type Props = {
    icon: React.ReactNode;
    title: string;
    href: string;
    selected: boolean;
    notifications?: number;
    children?: React.ReactNode;
}

const SidebarItem = ({ href, icon, selected, title, notifications, children }: Props) => {
  return (
    <li className="cursor-pointer my-[5px]">
      <Link
        href={href}
        className={cn(
          'flex items-center justify-between group rounded-lg hover:bg-[#1D1D1D] px-1',
          selected ? 'bg-[#1D1D1D]' : ''
        )}
      >
        <div className="flex items-center gap-2 transition-all p-[5px] cursor-pointer min-w-0">
          {icon}
          <span
            className={cn(
              'font-medium group-hover:text-[#9D9D9D] transition-all truncate w-32',
              selected ? 'text-[#9D9D9D]' : 'text-[#545454]'
            )}
          >
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1 pr-1 flex-shrink-0">
          {!!notifications && notifications > 0 && (
            <span className="bg-indigo-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {notifications > 99 ? '99+' : notifications}
            </span>
          )}
          {children}
        </div>
      </Link>
    </li>
  )
}

export default SidebarItem;
