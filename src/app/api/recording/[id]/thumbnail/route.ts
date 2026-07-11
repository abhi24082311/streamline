import { client } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const body = await req.json()
    const { id } = await params

    const updated = await client.video.update({
      where: {
        userId: id,
        source: body.filename,
      },
      data: {
        thumbnail: body.thumbnail,
      },
    })

    if (updated) {
      console.log('🟢 Thumbnail saved:', body.thumbnail)
      return NextResponse.json({ status: 200 })
    }
    return NextResponse.json({ status: 400 })
  } catch (error: any) {
    console.error('❌ Error saving thumbnail:', error)
    return NextResponse.json({ status: 500, message: error.message || 'Internal server error' })
  }
}
