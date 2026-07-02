import { SignIn } from '@clerk/nextjs'

type Props = {
  searchParams: Promise<{ redirect_url?: string }>
}

const SignInPage = async ({ searchParams }: Props) => {
  const { redirect_url } = await searchParams
  return <SignIn fallbackRedirectUrl={redirect_url || '/dashboard'} />
}

export default SignInPage