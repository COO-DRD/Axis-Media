'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'

export function ProofBand() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const results = [
    { company: 'Tuma Logistics', metric: 'KES 840K', detail: 'automated in 90 days' },
    { company: 'MSA Legal', metric: '47%', detail: 'lead recovery rate' },
    { company: 'Pwani Pharma', metric: '3.1×', detail: 'return on infrastructure' },
    { company: 'Coastal Properties', metric: '100%', detail: 'payment automation' },
  ]

  return (
    <section ref={ref} className="w-full bg-paper border-y border-ink-faint py-8">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {results.map((result, index) => (
            <div 
              key={result.company}
              className="flex flex-col gap-1"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0)' : 'translateY(16px)',
                transition: `all 480ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 120}ms`
              }}
            >
              <span className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] text-ink-muted">
                {result.company}
              </span>
              <span className="font-mono text-lg font-medium text-ink">
                {result.metric}
              </span>
              <span className="font-sans text-[0.82rem] text-ink-muted">
                {result.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
