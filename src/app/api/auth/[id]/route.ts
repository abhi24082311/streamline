import { client } from '@/lib/prisma'
import { clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    console.log('Endpoint hit👍')
    try{const userProfile = await client.user.findUnique({
    where: {
      clerkId: id,
    },
    include: {
      studio: true,
      subscription: {
        select: {
          plan: true,
        },
      },
    },
  })
  if (userProfile) return NextResponse.json({ status: 200, user: userProfile })
    const clerkClientInstance = await clerkClient()
    const clerkUserInstance = await clerkClientInstance.users.getUser(id)
  const createUser = await client.user.create({
    data: {
      clerkId: id,
      email: clerkUserInstance.emailAddresses[0].emailAddress,
      firstName: clerkUserInstance.firstName,
      lastName: clerkUserInstance.lastName,
      studio: {
        create: {},
      },
      workSpace: {
        create: {
          name: `${clerkUserInstance.firstName}'s Workspace`,
          type: 'PERSONAL',
        },
      },
      subscription: {
        create: {},
      },
    },
    include: {
      subscription: {
        select: {
          plan: true,
        },
      },
    },
  })

  if (createUser) return NextResponse.json({ status: 201, user: createUser })
  console.log("ERROR")
    return NextResponse.json({ status: 400})}
    catch(error){
      
      return NextResponse.json({ status: 400})
    }
}
