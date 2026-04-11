'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const solutions = [
  {
    id: 'authority',
    number: '01',
    title: 'Authority Website',
    brief: 'Your digital flagship',
    description: 'Built with Next.js, globally distributed via Vercel, optimized for both humans and AI discovery. Sub-2s load times, perfect Core Web Vitals, and architecture that scales.',
    features: ['Next.js / React', 'Edge deployment', 'SEO + GEO optimized', 'CMS integration'],
    metric: '340% average traffic increase',
  },
  {
    id: 'payments',
    number: '02',
    title: 'Payment Automation',
    brief: 'Revenue on autopilot',
    description: 'M-Pesa Daraja API, card processing, automated invoicing, and real-time reconciliation. Stop chasing payments. Start scaling.',
    features: ['M-Pesa integration', 'Card processing', 'Auto-reconciliation', 'Revenue dashboards'],
    metric: '127M+ KES processed',
  },
  {
    id: 'ai',
    number: '03',
    title: 'AI Systems',
    brief: 'Intelligence built in',
    description: 'Lead capture that thinks. Customer service that scales. Internal tools that learn. We integrate AI where it creates leverage, not gimmicks.',
    features: ['AI lead routing', 'Automated responses', 'Document processing', 'Custom models'],
    metric: '89% automation rate',
  },
]

export function SolutionUnfold() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <section ref={containerRef} className="relative py-34 bg-paper-warm">
      {/* Golden grid background */}
      <div className="absolute inset-0 golden-grid" />
      
      <div className="relative max-w-7xl mx-auto px-8">
        {/* Section header */}
        <motion.div
          className="max-w-2xl mb-21"
          initial={{ opacity: 0, y: 34 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.809 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-accent" />
            <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
              The Solution
            </span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-text-primary leading-tight">
            Three pillars of{' '}
            <span className="text-accent">digital infrastructure</span>
          </h2>
        </motion.div>

        {/* Solutions - Accordion style with reveal animations */}
        <div className="space-y-3">
          {solutions.map((solution, index) => {
            const isActive = activeId === solution.id
            
            return (
              <motion.div
                key={solution.id}
                className="group"
                initial={{ opacity: 0, x: -34 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.809, delay: index * 0.13 }}
              >
                <motion.button
                  onClick={() => setActiveId(isActive ? null : solution.id)}
                  className="w-full text-left bg-surface border border-border-subtle hover:border-accent transition-colors duration-500"
                  data-hover
                >
                  <div className="flex items-center justify-between p-8">
                    <div className="flex items-center gap-8">
                      {/* Number */}
                      <span className={`font-mono text-sm transition-colors duration-500 ${isActive ? 'text-accent' : 'text-text-tertiary'}`}>
                        {solution.number}
                      </span>
                      
                      {/* Title */}
                      <div>
                        <h3 className="font-display text-2xl md:text-3xl text-text-primary">
                          {solution.title}
                        </h3>
                        <span className="text-text-secondary">{solution.brief}</span>
                      </div>
                    </div>

                    {/* Toggle indicator */}
                    <motion.div
                      className="w-8 h-8 flex items-center justify-center border border-border-subtle"
                      animate={{ rotate: isActive ? 45 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" className="text-accent">
                        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </motion.div>
                  </div>
                </motion.button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="bg-surface border-x border-b border-border-subtle p-8 pt-0">
                        <div className="grid md:grid-cols-[1.618fr_1fr] gap-13 pt-8 border-t border-border-subtle">
                          {/* Description */}
                          <div>
                            <p className="text-lg text-text-secondary leading-relaxed mb-8">
                              {solution.description}
                            </p>
                            
                            {/* Features */}
                            <div className="flex flex-wrap gap-3">
                              {solution.features.map((feature, i) => (
                                <motion.span
                                  key={i}
                                  className="px-4 py-2 bg-paper-warm border border-border-subtle font-mono text-xs text-text-secondary"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: i * 0.089 }}
                                >
                                  {feature}
                                </motion.span>
                              ))}
                            </div>
                          </div>

                          {/* Metric highlight */}
                          <div className="flex items-center justify-center">
                            <motion.div
                              className="text-center p-8 border border-accent/20 bg-accent-soft"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.21 }}
                            >
                              <div className="font-display text-3xl text-accent mb-2">
                                {solution.metric.split(' ')[0]}
                              </div>
                              <div className="font-mono text-xs uppercase tracking-wider text-text-tertiary">
                                {solution.metric.split(' ').slice(1).join(' ')}
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Fibonacci visual connector */}
        <motion.div
          className="mt-21 flex justify-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.55 }}
        >
          <svg width="89" height="55" viewBox="0 0 89 55" className="text-accent opacity-30">
            <path
              d="M0 55 Q0 0 55 0 Q89 0 89 34"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  )
}
