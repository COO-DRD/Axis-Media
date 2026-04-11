'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

export function ClosingCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-void via-transparent to-void" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <span className="inline-block font-mono text-xs text-signal uppercase tracking-widest">
            Ready to build
          </span>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-text-primary leading-tight">
            Stop losing revenue to
            <br />
            <span className="text-signal">broken infrastructure.</span>
          </h2>

          <p className="text-lg text-text-secondary max-w-xl mx-auto">
            Book a free 20-minute diagnostic call. We&apos;ll map your current system, 
            identify the gaps, and show you exactly what&apos;s possible.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/diagnostic"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-signal text-void font-medium transition-all hover:bg-signal/90"
            >
              <span>Run Infrastructure Diagnostic</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 transition-transform group-hover:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              {/* Animated border */}
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 border border-signal pointer-events-none"
              />
            </Link>

            <span className="text-text-tertiary text-sm">or</span>

            <a
              href="mailto:hello@dullugroup.co.ke"
              className="font-mono text-sm text-text-secondary hover:text-signal transition-colors"
            >
              hello@dullugroup.co.ke
            </a>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        >
          <div className="absolute inset-0 border border-border-dim rotate-45 opacity-20" />
          <div className="absolute inset-8 border border-border-dim rotate-45 opacity-10" />
        </motion.div>
      </div>
    </section>
  )
}
