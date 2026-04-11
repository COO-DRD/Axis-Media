'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'

export function ProblemSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section ref={ref} className="w-full bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <div 
          className="max-w-3xl"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 480ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          <span className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] text-signal">
            The Research
          </span>
          
          <p 
            className="mt-4 font-display text-[clamp(3rem,8vw,5rem)] font-bold leading-[1] text-ink"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 480ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 120ms'
            }}
          >
            73%
          </p>
          
          <p 
            className="mt-2 font-sans text-[0.92rem] leading-relaxed text-ink-muted"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 480ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 240ms'
            }}
          >
            of African startups fail not because of product-market fit, but because of infrastructure failure — broken payment systems, manual lead capture, websites that repel instead of convert.
          </p>
        </div>

        <div className="mt-16 max-w-2xl">
          <h2 
            className="font-display text-[clamp(1.2rem,2.5vw,1.8rem)] font-semibold text-ink"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 480ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 360ms'
            }}
          >
            The product is rarely the problem. The infrastructure always is.
          </h2>
          
          <div 
            className="mt-6 space-y-4"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 480ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 480ms'
            }}
          >
            <p className="font-sans text-[0.92rem] leading-relaxed text-ink-muted">
              Your competitors aren&apos;t outworking you. They&apos;re out-infrastructuring you. While you chase leads manually, their systems capture and qualify while they sleep. While you invoice and wait, their payments clear automatically. While your website sits static, theirs projects the authority that closes deals before the first call.
            </p>
            <p className="font-sans text-[0.92rem] leading-relaxed text-ink-muted">
              This is not about having a website. Every business has a website. This is about having infrastructure that compounds — where every visitor, every enquiry, and every transaction strengthens your position in the market.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
