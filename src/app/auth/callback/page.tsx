import { onAuthenticateUser } from '@/actions/user'
import { redirect } from 'next/navigation'

const AuthCallbackPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ retry?: string }>
}) => {
  const { retry } = await searchParams
  const retryCount = parseInt(retry || '0')

  const auth = await onAuthenticateUser()
  console.log('AUTH CALLBACK RESULT:', auth.status, 'retry:', retryCount)

  if (auth.status === 200 || auth.status === 201) {
    return redirect(`/dashboard/${auth.user?.workSpace[0].id}`)
  }

  // Give up after 5 retries — show error
  if (retryCount >= 5) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl font-bold">Authentication failed</h1>
        <p className="text-muted-foreground">Status: {auth.status}</p>
        <a href="/auth/sign-in" className="text-blue-500 underline">Try signing in again</a>
      </div>
    )
  }

  // Retry by redirecting to self (not to sign-in)
  return redirect(`/auth/callback?retry=${retryCount + 1}`)
}

export default AuthCallbackPage