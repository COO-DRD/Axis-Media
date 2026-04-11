'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'
import Link from 'next/link'

const cases = [
  {
    client: 'Tuma Logistics',
    location: 'Mombasa',
    challenge: 'Manual invoicing eating 15+ hours weekly. Payment delays averaging 12 days.',
    solution: 'Authority website with M-Pesa automation, instant payment confirmation, automated invoice generation.',
    result: 'KES 840,000 automated revenue in first 90 days',
    metric: '840K',
    timeframe: '90 days',
  },
  {
    client: 'MSA Legal Advocates',
    location: 'Mombasa',
    challenge: '60% of qualified leads never received a follow-up. No system for tracking enquiries.',
    solution: 'Lead capture system with AI qualification, automated response within 2 minutes, CRM integration.',
    result: '47% lead recovery rate from previously lost enquiries',
    metric: '47%',
    timeframe: '60 days',
  },
]

export function CaseStudies() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section ref={ref} className="w-full bg-paper py-16 md:py-24 border-t border-ink-faint">
      <div className="mx-auto max-w-[1100px] px-6">
        <div 
          className="mb-12"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 480ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          <span className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] text-signal">
            Case Studies
          </span>
          <h2 className="mt-4 font-display text-[clamp(1.2rem,2.5vw,1.8rem)] font-semibold text-ink">
            Infrastructure in the wild.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {cases.map((caseStudy, index) => (
            <CaseCard 
              key={caseStudy.client} 
              caseStudy={caseStudy} 
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        <div 
          className="mt-12"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 480ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 400ms'
          }}
        >
          <Link 
            href="/work"
            className="inline-flex items-center font-sans text-[0.92rem] text-ink-muted transition-colors duration-200 hover:text-ink"
          >
            View all case studies →
          </Link>
        </div>
      </div>
    </section>
  )
}

function CaseCard({ 
  caseStudy, 
  index, 
  isInView 
}: { 
  caseStudy: typeof cases[0]
  index: number
  isInView: boolean
}) {
  return (
    <article 
      className="border border-ink-faint p-6 md:p-8"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(16px)',
        transition: `all 480ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${(index + 1) * 120}ms`
      }}
    >
      <div className="flex items-baseline justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">
            {caseStudy.client}
          </h3>
          <span className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] text-ink-muted">
            {caseStudy.location}
          </span>
        </div>
        <span className="font-mono text-2xl font-bold text-signal">
          {caseStudy.metric}
        </span>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <span className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] text-ink-muted">
            Challenge
          </span>
          <p className="mt-1 font-sans text-[0.92rem] leading-relaxed text-ink-muted">
            {caseStudy.challenge}
          </p>
        </div>

        <div>
          <span className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] text-ink-muted">
            Solution
          </span>
          <p className="mt-1 font-sans text-[0.92rem] leading-relaxed text-ink-muted">
            {caseStudy.solution}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-ink-faint">
        <span className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] text-signal">
          Result · {caseStudy.timeframe}
        </span>
        <p className="mt-1 font-sans text-[0.92rem] font-medium text-ink">
          {caseStudy.result}
        </p>
      </div>
    </article>
  )
}
