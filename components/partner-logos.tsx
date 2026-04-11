'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

const partners = [
  { id: 'prideofafrica', name: 'PrideofAfrica-Diaspora Awards', shortName: 'PADA' },
  { id: 'sokofresh', name: 'Soko Fresh Mombasa', shortName: 'SFM' },
  { id: 'drdullu', name: 'DR.DULLU', shortName: 'DRD' },
  { id: 'robi', name: 'Robi Interactive', shortName: 'RI' },
]

export function PartnerLogos() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-50px' })

  return (
    <section ref={containerRef} className="relative py-16 bg-paper border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* Label */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-accent" />
            <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
              Partners
            </span>
          </div>

          {/* Partner logos */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href="/partners"
                  className="group flex items-center gap-3 px-5 py-3 bg-surface border border-border-subtle hover:border-accent transition-all duration-300"
                  data-hover
                >
                  {/* Logo placeholder */}
                  <div className="w-10 h-10 bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <span className="font-display text-sm text-accent font-medium">
                      {partner.shortName}
                    </span>
                  </div>
                  <span className="font-sans text-sm text-text-secondary group-hover:text-accent transition-colors duration-300 hidden sm:block">
                    {partner.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* View all link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              href="/partners"
              className="inline-flex items-center gap-2 font-mono text-xs text-text-tertiary hover:text-accent transition-colors duration-300"
            >
              View All
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 8h8M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
