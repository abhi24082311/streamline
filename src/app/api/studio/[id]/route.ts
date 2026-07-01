import { client } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('CALLED')
  const { id } = await params
  if (!id) {
    return NextResponse.json({ status: 400, message: 'Missing user id' })
  }
  const body = await req.json()

  const studio = await client.user.update({
    where: {
      id,
    },
    data: {
      studio: {
        update: {
          screen: body.screen,
          mic: body.audio,
          preset: body.preset,
        },
      },
    },
  })

  if (studio) {
    return NextResponse.json({ status: 200, message: 'Studio updated!' })
  }

  return NextResponse.json({ status: 400, message: 'Could not update studio' })
}
