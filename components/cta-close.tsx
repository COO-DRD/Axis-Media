'use client'

import { useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import Link from 'next/link'

export function CTAClose() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [email, setEmail] = useState('')
  const [isValid, setIsValid] = useState(false)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setIsValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
  }

  return (
    <section ref={ref} className="w-full bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div 
            className="flex items-center justify-center gap-2 mb-6"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 480ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            <span className="inline-block w-2 h-2 bg-[#ef4444]" />
            <span className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] text-ink-muted">
              2 slots remaining this month
            </span>
          </div>

          <h2 
            className="font-display text-[clamp(1.5rem,3.5vw,2.2rem)] font-bold text-ink text-balance"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 480ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 120ms'
            }}
          >
            Find out exactly where your revenue is leaking.
          </h2>

          <p 
            className="mt-4 font-sans text-[0.92rem] leading-relaxed text-ink-muted"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 480ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 240ms'
            }}
          >
            Three questions. We diagnose the infrastructure gaps and show you what to fix first. No cost. No obligation. No pitch call unless you want one.
          </p>

          <form 
            className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 480ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 360ms'
            }}
            onSubmit={(e) => {
              e.preventDefault()
              if (isValid) {
                window.location.href = `/diagnostic?email=${encodeURIComponent(email)}`
              }
            }}
          >
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="your@business.com"
                className="w-full border border-ink-faint bg-paper px-4 py-3 font-sans text-[0.92rem] text-ink placeholder:text-ink-muted focus:border-ink-medium focus:outline-none transition-colors duration-150"
              />
              {isValid && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-signal opacity-0 animate-[fadeIn_200ms_forwards]">
                  ✓
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={!isValid}
              className="bg-ink px-6 py-3 font-sans text-[0.82rem] font-medium tracking-[0.02em] text-paper transition-all duration-200 hover:bg-signal hover:text-ink active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-ink disabled:hover:text-paper"
            >
              Start Diagnostic →
            </button>
          </form>

          <p 
            className="mt-8 font-sans text-[0.75rem] text-ink-muted"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 480ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 480ms'
            }}
          >
            Or <Link href="/diagnostic" className="underline hover:text-ink transition-colors duration-200">start the full diagnostic</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </section>
  )
}
