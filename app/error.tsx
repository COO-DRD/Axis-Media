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
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <div className="text-center max-w-xl mx-auto px-6">
        {/* Error indicator */}
        <svg 
          viewBox="0 0 55 34" 
          className="w-24 h-16 mx-auto mb-8 text-signal opacity-50"
          fill="none"
        >
          <circle cx="27" cy="17" r="13" stroke="currentColor" strokeWidth="2"/>
          <path d="M27 10v7M27 21h.01" stroke="currentColor" strokeWidth="2"/>
        </svg>
        
        <h1 className="font-display text-5xl font-bold text-ink mb-4">
          Something went wrong
        </h1>
        <p className="font-sans text-ink-muted mb-8 max-w-md mx-auto">
          We encountered an error while processing your request. 
          Our team has been notified and we're working to fix it.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={reset}
            className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3 font-sans text-sm font-medium hover:bg-accent transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 8c0 3.314-2.686 6-6 6S2 11.314 2 8s2.686-6 6-6" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 2v4l3-2" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Try Again
          </button>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 border border-ink px-6 py-3 font-sans text-sm font-medium text-ink hover:bg-ink hover:text-paper transition-colors"
          >
            Back to Home
          </Link>
        </div>
        
        {/* Error digest for support */}
        {error.digest && (
          <p className="mt-8 font-mono text-xs text-ink-muted">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
