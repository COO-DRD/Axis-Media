'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const solutions = [
  {
    id: 'authority',
    title: 'Authority Websites',
    tagline: 'Your digital headquarters',
    description: 'High-performance marketing sites built for East African markets. Fast loads, mobile-first, conversion-optimized.',
    features: ['Sub-2s load times', 'SEO architecture', 'Lead capture systems', 'Analytics integration'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8">
        <rect x="3" y="3" width="18" height="18" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    id: 'ai',
    title: 'AI Operations',
    tagline: 'Intelligence at scale',
    description: 'Custom AI agents and automation systems that handle repetitive work while you focus on growth.',
    features: ['Custom chatbots', 'Document processing', 'Lead qualification', 'Workflow automation'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
  },
  {
    id: 'payments',
    title: 'Payment Infrastructure',
    tagline: 'Revenue flows, finally',
    description: 'M-Pesa, cards, and mobile money integrations that actually work. Stop losing sales to broken checkout.',
    features: ['M-Pesa STK Push', 'Multi-currency', 'Subscription billing', 'Real-time reconciliation'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
]

export function SolutionGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeCard, setActiveCard] = useState<string | null>(null)

  return (
    <section ref={ref} className="relative py-32">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between"
        >
          <div>
            <span className="font-mono text-xs text-signal uppercase tracking-widest mb-4 block">
              Infrastructure Stack
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-text-primary">
              Three systems.
              <br />
              <span className="text-text-secondary">One integrated stack.</span>
            </h2>
          </div>
          <div className="hidden md:block font-mono text-xs text-text-tertiary">
            [ Hover to explore ]
          </div>
        </motion.div>
      </div>

      {/* Cards grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-px bg-border-dim">
          {solutions.map((solution, i) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              onMouseEnter={() => setActiveCard(solution.id)}
              onMouseLeave={() => setActiveCard(null)}
              className="group relative bg-ink"
            >
              <div className={`
                relative h-full p-8 transition-all duration-500
                ${activeCard === solution.id ? 'bg-surface' : 'bg-ink'}
              `}>
                {/* Top accent line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: activeCard === solution.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-0 left-0 right-0 h-px bg-signal origin-left"
                />

                {/* Icon */}
                <div className={`
                  mb-8 transition-colors duration-300
                  ${activeCard === solution.id ? 'text-signal' : 'text-text-tertiary'}
                `}>
                  {solution.icon}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display text-xl font-medium text-text-primary mb-1">
                      {solution.title}
                    </h3>
                    <p className="font-mono text-xs text-signal">
                      {solution.tagline}
                    </p>
                  </div>

                  <p className="text-text-secondary text-sm leading-relaxed">
                    {solution.description}
                  </p>

                  {/* Features - revealed on hover */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: activeCard === solution.id ? 'auto' : 0,
                      opacity: activeCard === solution.id ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <ul className="pt-4 space-y-2 border-t border-border-dim">
                      {solution.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-text-secondary">
                          <span className="w-1 h-1 bg-signal" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Index */}
                <div className="absolute top-8 right-8 font-mono text-xs text-text-tertiary">
                  0{i + 1}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
