'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'

const systems = [
  {
    id: 1,
    name: 'Authority Website',
    description: 'Custom-built to convert visitors into clients. Not a template.',
  },
  {
    id: 2,
    name: 'Payment Automation',
    description: 'M-Pesa STK Push, automated receipts, instant reconciliation.',
  },
  {
    id: 3,
    name: 'AI Integration',
    description: 'Lead qualification, automated follow-ups, Tier 1 support.',
  },
  {
    id: 4,
    name: 'Lead Capture System',
    description: 'Every enquiry captured, every channel covered, automated response.',
  },
  {
    id: 5,
    name: 'Custom Software',
    description: 'Bespoke solutions for operations off-the-shelf tools cannot solve.',
  },
]

export function SystemDiagram() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.2 })

  return (
    <section className="w-full bg-paper py-16 md:py-24">
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
            The Infrastructure
          </span>
          <h2 className="mt-4 font-display text-[clamp(1.2rem,2.5vw,1.8rem)] font-semibold text-ink">
            Five systems. One operation. Each one compounds the others.
          </h2>
        </div>

        <div ref={containerRef} className="relative">
          {/* Spine line */}
          <div 
            className="absolute left-4 md:left-6 top-0 w-px bg-signal"
            style={{
              height: isInView ? '100%' : '0%',
              transition: 'height 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transformOrigin: 'top',
            }}
          />

          <div className="space-y-8">
            {systems.map((system, index) => (
              <SystemNode 
                key={system.id} 
                system={system} 
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SystemNode({ 
  system, 
  index, 
  isInView 
}: { 
  system: typeof systems[0]
  index: number
  isInView: boolean
}) {
  return (
    <div 
      className="relative pl-12 md:pl-16"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(12px)',
        transition: `all 480ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 160}ms`
      }}
    >
      {/* Node dot */}
      <div className="absolute left-2 md:left-4 top-1 w-4 h-4 border-2 border-signal bg-paper" />
      
      <div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] text-ink-muted">
            0{system.id}
          </span>
          <h3 className="font-display text-lg font-semibold text-ink">
            {system.name}
          </h3>
        </div>
        <p className="mt-1 font-sans text-[0.92rem] leading-relaxed text-ink-muted max-w-md">
          {system.description}
        </p>
      </div>
    </div>
  )
}
