import { searchUsers } from '@/actions/user'
import { useEffect, useState } from 'react'
import { useQueryData } from './userQueryData'

export const useSearch = (key: string, type: 'WORKSPACE') => {
    const [query, setQuery] = useState('')
    const [debounce, setDebounce] = useState('')
    const [onUsers, setOnUsers] = useState<
        | {
            id: string
            subscription: {
                plan: 'PRO' | 'FREE'
            }[]
            firstName: string | null
            lastName: string | null
            image: string | null
            email: string | null
        }[]
        | undefined
    >(undefined)

    const onSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }

    useEffect(() => {
        const delayInputTimeoutId = setTimeout(() => {
            setDebounce(query)
        }, 1000)

        return () => clearTimeout(delayInputTimeoutId)
    }, [query])

    const { refetch, isFetching } = useQueryData(
        [key, debounce],
        async ({ queryKey }: any) => {
            if (type === 'WORKSPACE') {
                const users = await searchUsers(queryKey[1] as string)
                if (users.status === 200 && users.data) {
                    setOnUsers(users.data as any)
                } else {
                    setOnUsers(undefined)
                }
                return users
            }
            return { status: 200, data: [] }
        },
        false
    )

    useEffect(() => {
        if (debounce) {
            refetch()
        } else {
            setOnUsers(undefined)
        }
    }, [debounce])

    return { onSearchQuery, query, isFetching, onUsers }
}
