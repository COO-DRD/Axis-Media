import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full bg-paper border-t border-ink-faint py-12">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <Link href="/" className="font-display text-lg font-bold text-ink">
              DRD Digital
            </Link>
            <p className="mt-1 font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] text-ink-muted">
              Mombasa, Kenya · Serving East Africa
            </p>
          </div>

          <nav className="flex items-center gap-6">
            <Link 
              href="/work" 
              className="font-sans text-[0.92rem] text-ink-muted transition-colors duration-200 hover:text-ink"
            >
              Work
            </Link>
            <Link 
              href="/research" 
              className="font-sans text-[0.92rem] text-ink-muted transition-colors duration-200 hover:text-ink"
            >
              Research
            </Link>
            <Link 
              href="/diagnostic" 
              className="font-sans text-[0.92rem] text-ink-muted transition-colors duration-200 hover:text-ink"
            >
              Diagnostic
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-ink-faint">
          <p className="font-sans text-[0.75rem] text-ink-muted">
            No spam · Unsubscribe anytime · Built for serious operators
          </p>
          <p className="mt-2 font-sans text-[0.75rem] text-ink-muted">
            © {new Date().getFullYear()} DRD Digital · DR.DULLU Brand · Dullu Group
          </p>
        </div>
      </div>
    </footer>
  )
}
