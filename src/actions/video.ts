'use server'

import { client } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export const getVideoInfo = async (videoId: string) => {
  try {
    const user = await getAuthUser()
    if (!user) return { status: 403 }

    const video = await client.video.findUnique({
      where: { id: videoId },
      include: {
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
            email: true,
          },
        },
        comments: {
          include: {
            User: {
              select: {
                firstName: true,
                lastName: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (video) return { status: 200, data: video }
    return { status: 404 }
  } catch (error) {
    console.error(error)
    return { status: 500 }
  }
}

export const updateVideo = async (
  videoId: string,
  title: string,
  description: string
) => {
  try {
    const user = await getAuthUser()
    if (!user) return { status: 403, data: 'Unauthorized' }

    const video = await client.video.update({
      where: { id: videoId },
      data: { title, description },
    })

    if (video) return { status: 200, data: 'Video updated' }
    return { status: 400, data: 'Could not update video' }
  } catch (error) {
    console.error(error)
    return { status: 500, data: 'Something went wrong' }
  }
}

export const incrementVideoViews = async (videoId: string) => {
  try {
    await client.video.update({
      where: { id: videoId },
      data: { views: { increment: 1 } },
    })
    return { status: 200 }
  } catch (error) {
    return { status: 500 }
  }
}

export const addComment = async (
  videoId: string,
  content: string,
  timestamp?: number
) => {
  try {
    const user = await getAuthUser()
    if (!user) return { status: 403, data: 'Unauthorized' }

    const dbUser = await client.user.findUnique({
      where: { clerkId: user.id },
      select: { id: true },
    })
    if (!dbUser) return { status: 404, data: 'User not found' }

    // Comment model now available after prisma generate
    const comment = await client.comment.create({
      data: {
        content,
        timestamp,
        videoId,
        userId: dbUser.id,
      },
    })

    if (comment) return { status: 200, data: 'Comment added' }
    return { status: 400, data: 'Could not add comment' }
  } catch (error) {
    console.error(error)
    return { status: 500, data: 'Something went wrong' }
  }
}

export const deleteComment = async (commentId: string) => {
  try {
    const user = await getAuthUser()
    if (!user) return { status: 403, data: 'Unauthorized' }

    await client.comment.delete({ where: { id: commentId } })
    return { status: 200, data: 'Comment deleted' }
  } catch (error) {
    console.error(error)
    return { status: 500, data: 'Something went wrong' }
  }
}

export const deleteVideo = async (videoId: string) => {
  try {
    const user = await getAuthUser()
    if (!user) return { status: 403, data: 'Unauthorized' }

    await client.video.delete({ where: { id: videoId } })
    return { status: 200, data: 'Video deleted' }
  } catch (error) {
    console.error(error)
    return { status: 500, data: 'Something went wrong' }
  }
}

export const markNotificationRead = async (notificationId: string) => {
  try {
    await client.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })
    return { status: 200 }
  } catch (error) {
    return { status: 500 }
  }
}

export const getAllNotifications = async () => {
  try {
    const user = await getAuthUser()
    if (!user) return { status: 403, data: [] }

    // Single query via the User relation — avoids a second round-trip
    const result = await client.user.findUnique({
      where: { clerkId: user.id },
      select: {
        notification: {
          select: { id: true, content: true, read: true, userId: true },
          orderBy: { id: 'desc' },
        },
      },
    })

    return { status: 200, data: result?.notification ?? [] }
  } catch (error) {
    return { status: 500, data: [] }
  }
}

export const getRecentVideos = async () => {
  try {
    const user = await getAuthUser()
    if (!user) return { status: 403, data: [] }

    // Single query — resolve clerkId and fetch videos in one round-trip
    const result = await client.user.findUnique({
      where: { clerkId: user.id },
      select: {
        videos: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            source: true,
            processing: true,
            thumbnail: true,
            views: true,
            WorkSpace: { select: { id: true, name: true } },
            User: { select: { firstName: true, lastName: true, image: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 12,
        },
      },
    })

    return { status: 200, data: result?.videos ?? [] }
  } catch (error) {
    return { status: 500, data: [] }
  }
}

export const getUserSettings = async () => {
  try {
    const user = await getAuthUser()
    if (!user) return { status: 403 }

    const dbUser = await client.user.findUnique({
      where: { clerkId: user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        workSpace: {
          select: { id: true, name: true, type: true },
        },
      },
    })

    if (dbUser) return { status: 200, data: dbUser }
    return { status: 404 }
  } catch (error) {
    return { status: 500 }
  }
}
