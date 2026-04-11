'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

const projects = [
  {
    id: 'makini',
    client: 'Makini Logistics',
    industry: 'Freight & Logistics',
    metric: '+KES 1.8M',
    metricLabel: 'recovered revenue',
    description: 'Rebuilt their entire booking system with M-Pesa integration. Automated 80% of invoice follow-ups.',
    tags: ['Payment Infra', 'Automation'],
    year: '2024',
  },
  {
    id: 'pwani',
    client: 'Pwani Fresh',
    industry: 'FMCG Distribution',
    metric: '340%',
    metricLabel: 'lead increase',
    description: 'Authority website with dealer portal. Now the #1 Google result for "fresh produce Mombasa."',
    tags: ['Authority Site', 'SEO'],
    year: '2024',
  },
  {
    id: 'nyali',
    client: 'Nyali Medical',
    industry: 'Healthcare',
    metric: '2.1s',
    metricLabel: 'page load time',
    description: 'Patient booking system with AI triage assistant. Reduced admin workload by 60%.',
    tags: ['AI Ops', 'Web App'],
    year: '2025',
  },
]

export function ProjectShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <section ref={containerRef} className="relative py-32">
      {/* Section header */}
      <motion.div style={{ opacity }} className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-xs text-signal uppercase tracking-widest mb-4 block">
              Deployments
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-text-primary">
              Systems in production.
            </h2>
          </div>
          <Link 
            href="/work"
            className="inline-flex items-center gap-2 font-mono text-sm text-signal hover:text-text-primary transition-colors group"
          >
            View all projects
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 transition-transform group-hover:translate-x-1">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </motion.div>

      {/* Horizontal scroll track */}
      <div className="relative">
        <div className="overflow-x-auto horizontal-scroll pb-8">
          <div className="flex gap-6 px-6 md:px-[calc((100vw-1280px)/2+24px)] min-w-max">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group w-[400px] md:w-[500px] shrink-0"
              >
                <div className="relative h-full bg-surface border border-border-dim hover:border-signal/30 transition-colors">
                  {/* Project image placeholder - abstract pattern */}
                  <div className="relative h-48 bg-ink overflow-hidden">
                    <div className="absolute inset-0 grid-pattern opacity-30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-mono text-6xl font-bold text-border-subtle">
                        0{i + 1}
                      </span>
                    </div>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-8 space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-xl font-medium text-text-primary mb-1">
                          {project.client}
                        </h3>
                        <p className="font-mono text-xs text-text-tertiary uppercase">
                          {project.industry}
                        </p>
                      </div>
                      <span className="font-mono text-xs text-text-tertiary">
                        {project.year}
                      </span>
                    </div>

                    {/* Metric */}
                    <div className="py-4 border-y border-border-dim">
                      <div className="font-mono text-3xl text-signal font-medium">
                        {project.metric}
                      </div>
                      <div className="text-sm text-text-secondary mt-1">
                        {project.metricLabel}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="px-3 py-1 bg-ink border border-border-dim font-mono text-xs text-text-tertiary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-[400px] md:w-[500px] shrink-0"
            >
              <Link 
                href="/diagnostic"
                className="group relative h-full flex flex-col items-center justify-center p-8 bg-signal/5 border border-signal/30 hover:bg-signal/10 transition-colors min-h-[400px]"
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto flex items-center justify-center border border-signal text-signal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                      <path d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl font-medium text-text-primary">
                    Your project here
                  </h3>
                  <p className="text-text-secondary text-sm max-w-xs">
                    Start with a free infrastructure diagnostic. 
                    We&apos;ll map your gaps and opportunities.
                  </p>
                  <span className="inline-flex items-center gap-2 font-mono text-sm text-signal group-hover:gap-3 transition-all">
                    Begin diagnostic
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-2 pointer-events-none">
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-8 h-px bg-gradient-to-r from-transparent to-signal"
          />
        </div>
      </div>
    </section>
  )
}
