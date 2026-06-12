'use server'

import { currentUser } from "@clerk/nextjs/server"
import { client } from "@/lib/prisma"

export const onAuthenticateUser = async () => {
    try {
        const user = await currentUser()
        if (!user) {
            return { status: 403 }
        }

        const userExist = await client.user.findUnique({
            where: {
                clerkId: user.id
            },
            include: {
                workSpace: true,
                subscription: {
                    select: {
                        plan: true,
                    },
                },
            },
        })
        if (userExist) {
            return { status: 200, user: userExist }
        }
        const newUser = await client.user.create({
            data: {
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.imageUrl,
                studio: {
                    create: {},
                },
                subscription: {
                    create: {},
                },
                workSpace: {
                    create: {
                        name: `${user.firstName}'s Workspace`,
                        type: 'PERSONAL',
                    },
                },
            },
            include: {
                workSpace: true,
                subscription: {
                    select: {
                        plan: true,
                    },
                },
            },
        })
        if (newUser) {
            return { status: 201, user: newUser }
        }
        return { status: 400 }
    } catch (error) {
        console.error("Error in onAuthenticateUser:", error)
        return { status: 500 }
    }
}

export const searchUsers = async (query: string) => {
    try {
        const user = await currentUser()
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
