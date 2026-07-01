'use client'
import React, { useState } from 'react'
import { markNotificationRead } from '@/actions/video'
import { Bell, Check } from 'lucide-react'
import { toast } from 'sonner'

interface Notification {
  id: string
  content: string
  read: boolean
  userId: string | null
}

interface Props {
  initialNotifications: Notification[]
}

const NotificationsClient = ({ initialNotifications }: Props) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const handleMarkRead = async (id: string) => {
    const res = await markNotificationRead(id)
    if (res.status === 200) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
    } else {
      toast.error('Could not update notification')
    }
  }

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.read)
    await Promise.all(unread.map((n) => markNotificationRead(n.id)))
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-[#1D1D1D] flex items-center justify-center">
          <Bell size={22} className="text-neutral-500" />
        </div>
        <p className="text-neutral-400 font-medium">All caught up!</p>
        <p className="text-neutral-600 text-sm">No new notifications</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-4">
      {unreadCount > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-400">
            {unreadCount} unread
          </span>
          <button
            onClick={markAllRead}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Mark all as read
          </button>
        </div>
      )}

      <div className="flex flex-col gap-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
              notification.read
                ? 'bg-[#111] border-[#1D1D1D] opacity-60'
                : 'bg-[#1D1D1D] border-[#2a2a2a]'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
              <Bell size={14} className="text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-neutral-300">{notification.content}</p>
            </div>
            {!notification.read && (
              <button
                onClick={() => handleMarkRead(notification.id)}
                className="flex-shrink-0 p-1.5 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                title="Mark as read"
              >
                <Check size={14} className="text-emerald-400" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationsClient
