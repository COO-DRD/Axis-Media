'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { FibonacciCursor } from '@/components/fibonacci-cursor'
import { SpiralNav } from '@/components/spiral-nav'
import { GoldenFooter } from '@/components/golden-footer'

const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]

const projects = [
  {
    id: 'prideofafrica',
    number: '01',
    client: 'PrideofAfrica-Diaspora Awards',
    industry: 'Events & Recognition',
    year: '2024',
    result: '45+',
    resultLabel: 'Countries Reached',
    brief: 'Digital platform for annual awards celebrating excellence across the African diaspora. Global audience engagement infrastructure.',
    challenge: 'Coordinating awards across 45+ countries with different time zones. Manual nomination and voting processes. Limited global visibility.',
    solution: 'Custom awards platform with multi-region support. Online nomination and judging system. Live streaming integration for global audience.',
    stack: ['Next.js', 'Supabase', 'Vercel', 'Streaming API'],
    metrics: [
      { value: '45+', label: 'Countries' },
      { value: '10K+', label: 'Nominations' },
      { value: 'Live', label: 'Streaming' },
    ],
  },
  {
    id: 'sokofresh',
    number: '02',
    client: 'Soko Fresh Mombasa',
    industry: 'Agriculture & Commerce',
    year: '2024',
    result: '200+',
    resultLabel: 'Farmers Connected',
    brief: 'E-commerce platform connecting coastal farmers directly to consumers. Supply chain tracking and mobile-first ordering.',
    challenge: 'Farmers losing 40% income to middlemen. No digital record of transactions. Limited market access beyond local area.',
    solution: 'Direct marketplace with M-Pesa integration. Supply chain tracking from farm to consumer. Mobile app for farmer inventory management.',
    stack: ['Next.js', 'M-Pesa API', 'Supabase', 'Mobile App'],
    metrics: [
      { value: '200+', label: 'Farmers' },
      { value: '40%', label: 'Income increase' },
      { value: 'M-Pesa', label: 'Integrated' },
    ],
  },
  {
    id: 'drdullu',
    number: '03',
    client: 'DR.DULLU',
    industry: 'Business Consulting & Strategy',
    year: '2024',
    result: '98%',
    resultLabel: 'Client Retention',
    brief: 'Corporate consulting firm helping businesses optimize operations, strategy, and digital transformation across East Africa.',
    challenge: 'Manual client management processes. Scattered data across spreadsheets. Limited visibility into project profitability and team capacity.',
    solution: 'Integrated business management platform. Client portal with real-time project tracking. Automated reporting and analytics dashboard.',
    stack: ['Next.js', 'Supabase', 'Analytics', 'CRM Integration'],
    metrics: [
      { value: '98%', label: 'Retention' },
      { value: '150+', label: 'Projects' },
      { value: '3.5x', label: 'Growth' },
    ],
  },
  {
    id: 'robi',
    number: '04',
    client: 'Robi Interactive',
    industry: 'Digital Media & Technology',
    year: '2024',
    result: '1M+',
    resultLabel: 'Users Engaged',
    brief: 'Interactive media platform creating engaging digital experiences, games, and educational content for the African market.',
    challenge: 'Creating scalable infrastructure for millions of users. Content delivery across Africa with varying connection speeds.',
    solution: 'Edge-deployed interactive platform. Optimized content delivery for low-bandwidth. Gamified learning management system.',
    stack: ['Next.js', 'Edge Network', 'Game Engine', 'Supabase'],
    metrics: [
      { value: '1M+', label: 'Users' },
      { value: '50+', label: 'Games' },
      { value: 'EdTech', label: 'Platform' },
    ],
  },
]

export default function WorkPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true })

  return (
    <main className="relative min-h-screen grain bg-paper">
      <FibonacciCursor />
      <SpiralNav />

      <div className="pt-34 pb-21">
        <div className="max-w-6xl mx-auto px-8">
          {/* Header with Fibonacci spiral decoration */}
          <div ref={headerRef} className="relative mb-21">
            {/* Decorative spiral */}
            <motion.svg
              viewBox="0 0 144 89"
              className="absolute -left-21 top-0 w-34 h-21 opacity-10"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={isHeaderInView ? { opacity: 0.1, pathLength: 1 } : {}}
              transition={{ duration: 2.618 }}
            >
              <path
                d="M0 89 Q0 0 89 0 Q144 0 144 55"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-accent"
              />
            </motion.svg>

            <motion.div
              className="flex items-center gap-3 mb-5"
              initial={{ opacity: 0, x: -21 }}
              animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.809 }}
            >
              <div className="w-8 h-px bg-accent" />
              <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                Selected Work
              </span>
            </motion.div>

            <motion.h1
              className="font-display text-5xl md:text-6xl tracking-tight text-text-primary leading-tight"
              initial={{ opacity: 0, y: 34 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.809, delay: 0.13 }}
            >
              Systems in{' '}
              <span className="text-accent">production</span>
            </motion.h1>

            <motion.p
              className="mt-5 text-lg text-text-secondary max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 21 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.809, delay: 0.21 }}
            >
              Every project ships with measurable impact. Real clients. 
              Real infrastructure. Real results.
            </motion.p>
          </div>

          {/* Projects - Expandable cards with golden ratio proportions */}
          <div className="space-y-5">
            {projects.map((project, index) => {
              const isExpanded = expandedId === project.id
              const fibDelay = FIBONACCI[index + 1] * 0.05

              return (
                <motion.article
                  key={project.id}
                  className="group"
                  initial={{ opacity: 0, y: 34 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.809, delay: fibDelay }}
                  viewport={{ once: true }}
                >
                  {/* Main card */}
                  <motion.div
                    className={`
                      relative bg-surface border transition-all duration-500 cursor-pointer
                      ${isExpanded ? 'border-accent' : 'border-border-subtle hover:border-accent/50'}
                    `}
                    onClick={() => setExpandedId(isExpanded ? null : project.id)}
                    data-hover
                  >
                    <div className="p-8">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        {/* Left: Client info */}
                        <div className="flex items-start gap-8">
                          <span className="font-mono text-sm text-text-tertiary mt-1">
                            {project.number}
                          </span>
                          <div>
                            <h2 className="font-display text-2xl md:text-3xl text-text-primary mb-1">
                              {project.client}
                            </h2>
                            <div className="flex items-center gap-3 text-text-tertiary">
                              <span className="font-mono text-xs uppercase">{project.industry}</span>
                              <span className="w-1 h-1 bg-text-tertiary rounded-full" />
                              <span className="font-mono text-xs">{project.year}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Key result + toggle */}
                        <div className="flex items-center gap-13">
                          <div className="text-right hidden md:block">
                            <div className="font-display text-3xl text-accent">
                              {project.result}
                            </div>
                            <div className="font-mono text-xs text-text-tertiary uppercase">
                              {project.resultLabel}
                            </div>
                          </div>

                          <motion.div
                            className="w-13 h-13 flex items-center justify-center border border-border-subtle"
                            animate={{ rotate: isExpanded ? 45 : 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" className="text-accent">
                              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    {/* Accent line */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: isExpanded ? '100%' : 0 }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.div>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="bg-paper-warm border-x border-b border-border-subtle">
                          <div className="p-8 grid lg:grid-cols-[1.618fr_1fr] gap-13">
                            {/* Left: Details */}
                            <div className="space-y-8">
                              <p className="text-lg text-text-secondary leading-relaxed">
                                {project.brief}
                              </p>

                              <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                  <span className="font-mono text-xs text-text-tertiary uppercase tracking-wider block mb-3">
                                    Challenge
                                  </span>
                                  <p className="text-text-secondary leading-relaxed">
                                    {project.challenge}
                                  </p>
                                </div>
                                <div>
                                  <span className="font-mono text-xs text-text-tertiary uppercase tracking-wider block mb-3">
                                    Solution
                                  </span>
                                  <p className="text-text-secondary leading-relaxed">
                                    {project.solution}
                                  </p>
                                </div>
                              </div>

                              {/* Stack */}
                              <div>
                                <span className="font-mono text-xs text-text-tertiary uppercase tracking-wider block mb-3">
                                  Stack
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {project.stack.map((tech, i) => (
                                    <motion.span
                                      key={tech}
                                      className="px-4 py-2 bg-surface border border-accent/20 font-mono text-xs text-accent"
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: i * 0.089 }}
                                    >
                                      {tech}
                                    </motion.span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Right: Metrics */}
                            <div className="space-y-5">
                              <span className="font-mono text-xs text-text-tertiary uppercase tracking-wider block">
                                Results
                              </span>
                              {project.metrics.map((metric, i) => (
                                <motion.div
                                  key={i}
                                  className="p-5 bg-surface border border-border-subtle"
                                  initial={{ opacity: 0, x: 21 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.21 + i * 0.089 }}
                                >
                                  <div className="font-display text-3xl text-accent">
                                    {metric.value}
                                  </div>
                                  <div className="font-mono text-xs text-text-tertiary uppercase mt-1">
                                    {metric.label}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              )
            })}
          </div>

          {/* Fibonacci visual break */}
          <motion.div
            className="my-21 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <svg width="233" height="144" viewBox="0 0 233 144" className="opacity-10">
              <path
                d="M0 144 Q0 0 144 0 Q233 0 233 89 M144 144 Q144 89 89 89 Q89 144 144 144"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-accent"
              />
            </svg>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.809 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display text-3xl text-text-primary mb-5">
              Ready to build your{' '}
              <span className="text-accent">infrastructure</span>?
            </h3>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              Start with a diagnostic to understand where you stand and what&apos;s possible.
            </p>
            <a
              href="/diagnostic"
              className="inline-flex items-center gap-3 bg-accent text-primary-foreground px-8 py-4 font-medium"
              data-hover
            >
              Start Diagnostic
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>

      <GoldenFooter />
    </main>
  )
}
