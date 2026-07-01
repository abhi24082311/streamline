import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-[#1D1D1D] flex items-center justify-center">
        <span className="text-2xl">🔍</span>
      </div>
      <h2 className="text-lg font-semibold text-white">Page not found</h2>
      <p className="text-neutral-400 text-sm">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/dashboard"
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  )
}
