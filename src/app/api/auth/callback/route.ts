import { onAuthenticateUser } from '@/actions/user'
import { NextResponse } from 'next/server'

export async function GET() {
  const auth = await onAuthenticateUser()
  if (auth.status === 200 || auth.status === 201) {
    return NextResponse.json({
      status: auth.status,
      workspaceId: auth.user?.workSpace[0]?.id,
    })
  }
  return NextResponse.json({ status: auth.status })
}
