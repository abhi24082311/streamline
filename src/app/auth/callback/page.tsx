import { onAuthenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

const AuthCallbackPage = async (props: Props) => {
  // Authentication
  const auth = await onAuthenticateUser()
  if (auth.status === 200 || auth.status === 201) {
    return redirect(`/dashboard/${auth.user?.workSpace[0].id}`)
  }

  // If authentication failed, expired, or returned any error status, redirect to sign-in
  return redirect('/auth/sign-in')
}

export default AuthCallbackPage