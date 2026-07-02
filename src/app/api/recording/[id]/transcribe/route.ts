import { client } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const body = await req.json()
  const { id } = await params

  const content = JSON.parse(body.content)

  const transcribed = await client.video.update({
    where: {
      source: body.filename,
    },
    data: {
      title: content.title,
      description: content.summary,
      summary: body.transcript,
    },
  })
    if(transcribed){
        console.log('🟢transcribed')
        return NextResponse.json({status: 200})
    }
}
