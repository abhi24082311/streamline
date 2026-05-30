import { Spinner } from './spinner'
import React from 'react'

type Props = {
    state:boolean
    className?:string
    color?:string
    children?:React.ReactNode
}

const Loader = ({state,className,color,children}: Props) => {
    if(state) return <Spinner color={color} />
    return <>{children}</>
  
}

export default Loader