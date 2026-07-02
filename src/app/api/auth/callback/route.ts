import { onAuthenticateUser } from '@/actions/user'
import { syncClerkUser } from '@/lib/user-sync'
import { clerkClient, verifyToken } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

type ClerkSessionClaims = {
  sub?: string
}

export async function GET(request: Request) {
  const bearerToken = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')

  if (bearerToken) {
    const verifiedToken = await verifyToken(bearerToken, {
      secretKey: process.env.CLERK_SECRET_KEY,
      authorizedParties: [new URL(request.url).origin],
      clockSkewInMs: 60000,
    })

    const claims = verifiedToken as ClerkSessionClaims | undefined

    if (claims?.sub) {
      const clerk = await clerkClient()
      const user = await clerk.users.getUser(claims.sub)
      const synced = await syncClerkUser(user)

      return NextResponse.json({
        status: synced.status,
        workspaceId: synced.user?.workSpace[0]?.id,
      })
    }

    return NextResponse.json({ status: 401 })
  }

  const auth = await onAuthenticateUser()
  if (auth.status === 200 || auth.status === 201) {
    return NextResponse.json({
      status: auth.status,
      workspaceId: auth.user?.workSpace[0]?.id,
    })
  }

  return NextResponse.json({ status: auth.status })
}
