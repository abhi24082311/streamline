'use client'
import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

type Props = { children: React.ReactNode }

const ReactQueryProvider = ({ children }: Props) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,    // 5 min — SSR data stays fresh
            gcTime: 10 * 60 * 1000,      // 10 min — keep in memory between navigations
            refetchOnWindowFocus: false,
            refetchOnMount: false,        // Don't refetch if data is still fresh
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default ReactQueryProvider