import { client } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { start } from 'repl'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const body = await req.json()
        const { id } = await params

  const personalworkspaceId = await client.user.findUnique({
    where: {
      id,
    },
    select: {
      workSpace: {
        where: {
          type: 'PERSONAL',
        },
        select: {
          id: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })
  const workspaceId = personalworkspaceId?.workSpace?.[0]?.id;
  if (!workspaceId) {
      return NextResponse.json({ status: 400, message: "Workspace not found" })
  }

  const startProcesingVideo = await client.workSpace.update({
    where: {
        id: workspaceId,
    },
    data: {
        videos:{
            create: {
                source: body.filename,
                userId: id,
            },
        },
    },
    select: {
        User: {
            select: {
                subscription: {
                    select: {
                        plan: true,
                    },
                },
            },
        },
    },
  })

  if(startProcesingVideo){
    return NextResponse.json({
        status:200,
        plan: startProcesingVideo.User?.subscription?.[0]?.plan || 'FREE',
    })

  }
  return NextResponse.json({status:400})
    } catch (error: any) {
        console.log('Error in processing video',error)
        return NextResponse.json({ status: 500, message: error.message || "Internal server error" })
    }


}
