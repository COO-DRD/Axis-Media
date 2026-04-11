'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'

export function SpiralCTA() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <section ref={containerRef} className="relative py-34 bg-text-primary overflow-hidden">
      {/* Inverted Fibonacci pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg viewBox="0 0 610 377" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <path
            d="M377 377 Q377 0, 0 0 M377 377 Q377 144, 610 144 M377 377 Q377 521, 233 521"
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto px-8 text-center">
        {/* Fibonacci spiral animation */}
        <motion.div
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] pointer-events-none"
          initial={{ opacity: 0, scale: 0, rotate: -90 }}
          animate={isInView ? { opacity: 0.1, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 2.618, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <motion.path
              d="M50 50 Q50 10 90 10 Q90 50 50 50 Q50 75 25 75 Q25 50 50 50"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: 2.618, delay: 0.34 }}
            />
          </svg>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.809 }}
        >
          <span className="font-mono text-xs uppercase tracking-widest text-white/40 block mb-8">
            Next Step
          </span>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-tight mb-8">
            Ready to close the{' '}
            <span className="text-accent">infrastructure gap</span>?
          </h2>

          <p className="text-lg text-white/60 max-w-xl mx-auto mb-13 leading-relaxed">
            Start with a 3-question diagnostic. No commitment. 
            You&apos;ll get a clear picture of where you stand and what&apos;s possible.
          </p>

          <motion.div
            className="flex flex-col sm:flex-row gap-5 justify-center"
            initial={{ opacity: 0, y: 21 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.809, delay: 0.21 }}
          >
            <Link
              href="/diagnostic"
              className="group relative inline-flex items-center justify-center gap-3 bg-accent text-white px-8 py-4 font-medium overflow-hidden"
              data-hover
            >
              <span className="relative z-10">Start Diagnostic</span>
              <motion.span
                className="relative z-10"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.618, repeat: Infinity }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </motion.span>
              <motion.div
                className="absolute inset-0 bg-accent-light"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.5 }}
              />
            </Link>

            <Link
              href="/research"
              className="group inline-flex items-center justify-center gap-3 border border-white/20 px-8 py-4 font-medium text-white hover:border-accent hover:text-accent transition-colors duration-500"
              data-hover
            >
              Read Research
            </Link>
          </motion.div>
        </motion.div>

        {/* Bottom flourish */}
        <motion.div
          className="mt-21 flex justify-center items-center gap-5"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.55 }}
        >
          {[13, 21, 34, 21, 13].map((size, i) => (
            <motion.div
              key={i}
              className="bg-white/10"
              style={{ 
                width: size / 3, 
                height: size / 3,
                borderRadius: '50%',
              }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ 
                duration: 2.618, 
                repeat: Infinity,
                delay: i * 0.21,
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
