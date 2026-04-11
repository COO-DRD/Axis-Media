import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <div className="text-center max-w-xl mx-auto px-6">
        {/* Golden spiral decoration */}
        <svg 
          viewBox="0 0 89 55" 
          className="w-32 h-20 mx-auto mb-8 text-accent opacity-30"
          fill="none"
        >
          <path
            d="M55 55 Q55 0 0 0 Q89 0 89 34"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
        
        <h1 className="font-display text-8xl font-bold text-ink mb-4">404</h1>
        <p className="font-display text-2xl text-ink mb-6">Page not found</p>
        <p className="font-sans text-ink-muted mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. 
          Check the URL or navigate back to our main pages.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3 font-sans text-sm font-medium hover:bg-accent transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 12V4M8 4L4 8M8 4L12 8" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            Back to Home
          </Link>
          <Link 
            href="/work"
            className="inline-flex items-center gap-2 border border-ink px-6 py-3 font-sans text-sm font-medium text-ink hover:bg-ink hover:text-paper transition-colors"
          >
            View Work
          </Link>
        </div>
        
        {/* Fibonacci number reference */}
        <p className="mt-12 font-mono text-xs text-ink-muted uppercase tracking-widest">
          Error Code: 1.618.404
        </p>
      </div>
    </div>
  )
}
