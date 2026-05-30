import { Spinner } from '@/components/global/loader/spinner'
import React from 'react'

type Props = {children: React.ReactNode}

const AuthLoading = (props: Props) => {
  return <div className="flex h-screen w-full items-center justify-center">
    <Spinner />
  </div>
  
}

export default AuthLoading