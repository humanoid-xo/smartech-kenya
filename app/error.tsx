'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="min-h-screen bg-navy-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md bg-white rounded-2xl p-10 shadow border border-navy-100">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="font-heading text-2xl font-bold text-navy-900 mb-2">Something went wrong</h2>
        <p className="text-navy-500 mb-8 text-sm">
          An unexpected error occurred. You can try again or return to the homepage.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
          <Link href="/" className="px-6 py-3 bg-white border border-navy-200 text-navy-700 font-bold rounded-xl hover:border-primary-300 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
