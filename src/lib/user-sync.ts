import type { User as ClerkUser } from '@clerk/backend'
import { client } from '@/lib/prisma'

const userInclude = {
  workSpace: true,
  subscription: { select: { plan: true } },
  members: {
    select: { WorkSpace: { select: { id: true, name: true, type: true } } },
  },
  notification: { select: { id: true, content: true, read: true, userId: true } },
  _count: { select: { notification: true } },
} as const

export const syncClerkUser = async (user: ClerkUser) => {
  const email = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress

  if (!email) {
    return { status: 400 }
  }

  const userExist = await client.user.findUnique({
    where: { clerkId: user.id },
    include: userInclude,
  })

  if (userExist) {
    return { status: 200, user: userExist }
  }

  const existingByEmail = await client.user.findUnique({
    where: { email },
    include: userInclude,
  })

  if (existingByEmail) {
    const updated = await client.user.update({
      where: { email },
      data: { clerkId: user.id },
      include: userInclude,
    })

    return { status: 200, user: updated }
  }

  const newUser = await client.user.create({
    data: {
      clerkId: user.id,
      email,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.imageUrl,
      studio: { create: {} },
      subscription: { create: {} },
      workSpace: {
        create: {
          name: `${user.firstName ?? 'My'}'s Workspace`,
          type: 'PERSONAL',
        },
      },
    },
    include: userInclude,
  })

  if (newUser) {
    return { status: 201, user: newUser }
  }

  return { status: 400 }
}
