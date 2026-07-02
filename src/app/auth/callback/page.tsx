import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'

const AuthCallbackPage = () => {
  return <AuthenticateWithRedirectCallback signInFallbackRedirectUrl="/dashboard" />
}

export default AuthCallbackPage
