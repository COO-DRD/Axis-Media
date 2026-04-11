'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const GOLDEN_ANGLE = 137.5

const problems = [
  {
    stat: '73%',
    title: 'Broken Infrastructure',
    description: 'East African corporate websites fail basic performance, security, or mobile standards.',
  },
  {
    stat: '2.7s',
    title: 'Load Time Gap',
    description: 'Average load time vs 1.5s global benchmark. Every second costs 7% conversions.',
  },
  {
    stat: '41%',
    title: 'No Payment Integration',
    description: 'Enterprise sites without M-Pesa or card processing. Revenue left on the table.',
  },
  {
    stat: '0%',
    title: 'AI Adoption',
    description: 'Most competitors lack AI-powered lead capture, routing, or automation.',
  },
]

export function ProblemSpiral() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <section ref={containerRef} className="relative py-34 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 fibonacci-pattern opacity-50" />
      
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
              The Problem
            </span>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-text-primary leading-tight">
            The infrastructure gap is{' '}
            <span className="text-accent">costing you</span>
          </h2>
          
          <p className="mt-5 text-lg text-text-secondary leading-relaxed">
            While global enterprises operate with seamless digital systems, 
            East African businesses fight with broken tools and missed opportunities.
          </p>
        </motion.div>

        {/* Problems in spiral/organic layout */}
        <div className="relative">
          {/* Large spiral decoration */}
          <motion.svg
            viewBox="0 0 500 500"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
            initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
            animate={isInView ? { opacity: 0.05, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 2.618 }}
          >
            <path
              d="M250 250 
                 Q250 50 450 50 
                 Q450 250 250 250 
                 Q250 375 125 375 
                 Q125 250 250 250
                 Q250 175 325 175
                 Q325 250 250 250
                 Q250 296 204 296
                 Q204 250 250 250"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-accent"
            />
          </motion.svg>

          {/* Problem cards positioned along spiral path */}
          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            {problems.map((problem, index) => {
              // Calculate spiral-inspired positioning offset
              const angle = (index * GOLDEN_ANGLE * Math.PI) / 180
              const offset = index % 2 === 0 ? 0 : 34

              return (
                <motion.div
                  key={index}
                  className="group relative"
                  style={{ marginTop: offset }}
                  initial={{ opacity: 0, y: 55, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ 
                    duration: 0.809, 
                    delay: index * 0.13,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                >
                  <div className="relative bg-surface border border-border-subtle p-8 hover:border-accent transition-all duration-500 overflow-hidden">
                    {/* Background number */}
                    <div className="absolute -right-4 -top-8 font-display text-[120px] leading-none text-paper-warm select-none pointer-events-none group-hover:text-accent-soft transition-colors duration-500">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="font-display text-5xl text-accent mb-4">
                        {problem.stat}
                      </div>
                      
                      <h3 className="font-display text-xl text-text-primary mb-3">
                        {problem.title}
                      </h3>
                      
                      <p className="text-text-secondary leading-relaxed">
                        {problem.description}
                      </p>
                    </div>

                    {/* Fibonacci corner accent */}
                    <motion.div
                      className="absolute bottom-0 right-0 w-13 h-8 bg-accent"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.5 }}
                      style={{ transformOrigin: 'right' }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Bottom statement */}
        <motion.div
          className="mt-21 text-center"
          initial={{ opacity: 0, y: 21 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.809, delay: 0.55 }}
        >
          <p className="font-display text-2xl md:text-3xl text-text-primary max-w-3xl mx-auto leading-relaxed">
            Your competitors are closing the gap.{' '}
            <span className="text-accent">The question is whether you&apos;ll lead or follow.</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
