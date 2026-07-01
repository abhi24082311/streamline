'use server'

import { getAuthUser } from "@/lib/auth"
import { client } from "@/lib/prisma"

export const onAuthenticateUser = async () => {
    try {
        const user = await getAuthUser()
        if (!user) {
            return { status: 403 }
        }

        // Look up by clerkId first (normal path)
        const userExist = await client.user.findUnique({
            where: { clerkId: user.id },
            include: {
                workSpace: true,
                subscription: { select: { plan: true } },
                members: { select: { WorkSpace: { select: { id: true, name: true, type: true } } } },
                notification: { select: { id: true, content: true, read: true, userId: true } },
                _count: { select: { notification: true } },
            },
        })
        if (userExist) {
            return { status: 200, user: userExist }
        }

        // Not found by clerkId — check if the email already exists
        // (happens when a user signed up via a different Clerk strategy)
        const existingByEmail = await client.user.findUnique({
            where: { email: user.emailAddresses[0].emailAddress },
            include: {
                workSpace: true,
                subscription: { select: { plan: true } },
                members: { select: { WorkSpace: { select: { id: true, name: true, type: true } } } },
                notification: { select: { id: true, content: true, read: true, userId: true } },
                _count: { select: { notification: true } },
            },
        })
        if (existingByEmail) {
            // Re-link the clerkId to this existing account
            const updated = await client.user.update({
                where: { email: user.emailAddresses[0].emailAddress },
                data: { clerkId: user.id },
                include: {
                    workSpace: true,
                    subscription: { select: { plan: true } },
                    members: { select: { WorkSpace: { select: { id: true, name: true, type: true } } } },
                    notification: { select: { id: true, content: true, read: true, userId: true } },
                    _count: { select: { notification: true } },
                },
            })
            return { status: 200, user: updated }
        }

        // Truly new user — create from scratch
        const newUser = await client.user.create({
            data: {
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.imageUrl,
                studio: { create: {} },
                subscription: { create: {} },
                workSpace: {
                    create: {
                        name: `${user.firstName}'s Workspace`,
                        type: 'PERSONAL',
                    },
                },
            },
            include: {
                workSpace: true,
                subscription: { select: { plan: true } },
                members: { select: { WorkSpace: { select: { id: true, name: true, type: true } } } },
                notification: { select: { id: true, content: true, read: true, userId: true } },
                _count: { select: { notification: true } },
            },
        })
        if (newUser) {
            return { status: 201, user: newUser }
        }
        return { status: 400 }
    } catch (error: any) {
        // P2002 = unique constraint violation — should be handled above
        // but guard here as a last resort
        if (error?.code === 'P2002') {
            console.error('Unique constraint race condition in onAuthenticateUser:', error)
            return { status: 409 }
        }
        console.error('Error in onAuthenticateUser:', error)
        return { status: 500 }
    }
}

export const searchUsers = async (query: string) => {
    try {
        const user = await getAuthUser()
        if (!user) return { status: 404, data: [] }

        const users = await client.user.findMany({
            where: {
                OR: [
                    { firstName: { contains: query } },
                    { email: { contains: query} },
                    { lastName: { contains: query} },
                ],
                NOT: [
                    { clerkId: user.id }
                ],
            },
            select: {
                id: true,
                subscription: {
                    select: {
                        plan: true,
                    },
                },
                firstName: true,
                lastName: true,
                image: true,
                email: true,
            },
        })

        if (users && users.length > 0) {
            return { status: 200, data: users }
        }
        return { status: 404, data: undefined }
    } catch (error) {
        
        return { status: 500, data: undefined }
    }
}
