'use client'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function WorkspaceError({ error, reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
        <span className="text-2xl">⚠️</span>
      </div>
      <h2 className="text-lg font-semibold text-white">Something went wrong</h2>
      <p className="text-neutral-400 text-sm max-w-md">
        {error.message ?? 'An unexpected error occurred loading your workspace.'}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
