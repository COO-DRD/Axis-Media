'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const problems = [
  {
    metric: '73%',
    title: 'Revenue leakage',
    description: 'East African SMEs lose to poor digital infrastructure',
  },
  {
    metric: '40%',
    title: 'Cart abandonment',
    description: 'From broken payment flows and slow page loads',
  },
  {
    metric: '60%',
    title: 'Lead loss',
    description: 'Due to missing follow-up automation systems',
  },
]

export function ProblemViz() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-1/2 bg-gradient-to-b from-transparent via-signal/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Text */}
          <div className="lg:sticky lg:top-32 space-y-6">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block font-mono text-xs text-signal uppercase tracking-widest"
            >
              The Problem
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl md:text-4xl font-medium text-text-primary leading-tight"
            >
              Broken infrastructure
              <br />
              <span className="text-text-secondary">is invisible until</span>
              <br />
              the revenue stops.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-text-secondary max-w-md"
            >
              Most businesses don&apos;t see the leak. They see the symptoms: low conversions, 
              missed opportunities, competitors winning despite inferior products.
            </motion.p>
          </div>

          {/* Right: Metrics */}
          <div className="space-y-6">
            {problems.map((problem, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                className="group relative"
              >
                <div className="relative p-8 bg-surface border border-border-dim hover:border-signal/30 transition-colors">
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-signal/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative flex items-start gap-8">
                    {/* Metric */}
                    <div className="shrink-0">
                      <span className="font-mono text-5xl md:text-6xl font-medium text-signal">
                        {problem.metric}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="pt-2">
                      <h3 className="font-display text-xl font-medium text-text-primary mb-2">
                        {problem.title}
                      </h3>
                      <p className="text-text-secondary">
                        {problem.description}
                      </p>
                    </div>
                  </div>

                  {/* Index */}
                  <div className="absolute top-4 right-4 font-mono text-xs text-text-tertiary">
                    0{i + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
