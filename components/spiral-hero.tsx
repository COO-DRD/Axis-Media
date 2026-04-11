'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]
const GOLDEN_RATIO = 1.618033988749

// Counter component with Fibonacci easing
function FibCounter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return
    
    const duration = 2618 // Golden ratio * 1000
    const steps = 89 // Fibonacci number
    const stepDuration = duration / steps
    let step = 0

    const timer = setInterval(() => {
      step++
      // Fibonacci-inspired easing
      const progress = step / steps
      const easedProgress = 1 - Math.pow(1 - progress, GOLDEN_RATIO)
      setCount(Math.floor(easedProgress * end))
      
      if (step >= steps) {
        setCount(end)
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [isVisible, end])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

export function SpiralHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  const spiralRotate = useTransform(scrollYProgress, [0, 1], [0, 137.5])
  const spiralScale = useTransform(scrollYProgress, [0, 1], [1, 0.618])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Fibonacci grid background */}
      <div className="absolute inset-0 golden-grid" />
      
      {/* Animated Fibonacci spiral - large background element */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ rotate: spiralRotate, scale: spiralScale, opacity }}
      >
        <svg
          viewBox="0 0 610 377"
          className="w-[90vw] max-w-5xl h-auto"
          fill="none"
        >
          {/* Golden rectangle divisions with Fibonacci spiral */}
          <motion.rect
            x="0" y="0" width="377" height="377"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-border-medium"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.618, delay: 0.21 }}
          />
          <motion.rect
            x="377" y="0" width="233" height="233"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-border-medium"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.618, delay: 0.34 }}
          />
          <motion.rect
            x="377" y="233" width="144" height="144"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-border-medium"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.618, delay: 0.55 }}
          />
          <motion.rect
            x="521" y="233" width="89" height="89"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-border-medium"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.618, delay: 0.89 }}
          />
          
          {/* The spiral path */}
          <motion.path
            d="M377 377 
               Q377 0, 0 0
               M377 377
               Q377 144, 610 144
               M377 377
               Q377 521, 233 521
               M377 377
               Q377 322, 432 322"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-accent"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.618, ease: [0.34, 1.56, 0.64, 1] }}
          />
          
          {/* Accent dots at Fibonacci points */}
          {[
            { cx: 0, cy: 0 },
            { cx: 610, cy: 144 },
            { cx: 233, cy: 377 },
            { cx: 377, cy: 377 },
          ].map((point, i) => (
            <motion.circle
              key={i}
              cx={point.cx}
              cy={point.cy}
              r="4"
              className="fill-accent"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.89 + i * 0.21, duration: 0.5 }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Main content - positioned using golden ratio */}
      <motion.div 
        className="relative z-10 max-w-6xl mx-auto px-8"
        style={{ y: textY }}
      >
        <div className="grid lg:grid-cols-[1fr_0.618fr] gap-21 items-center">
          {/* Left column - Main message */}
          <div>
            {/* Label */}
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, x: -34 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.809, delay: 0.13 }}
            >
              <div className="w-8 h-px bg-accent" />
              <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                Digital Infrastructure
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] text-text-primary"
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.809, delay: 0.21 }}
            >
              <span className="block">We build the</span>
              <span className="block text-accent">digital backbone</span>
              <span className="block">African enterprises</span>
              <span className="block text-text-secondary text-4xl md:text-5xl lg:text-6xl">deserve.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="mt-8 text-lg text-text-secondary max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 21 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.809, delay: 0.34 }}
            >
              Authority websites. Payment automation. AI-powered systems. 
              We close the infrastructure gap that costs East African businesses 
              revenue, leads, and market position.
            </motion.p>

            {/* CTA */}
            <motion.div
              className="mt-13 flex flex-wrap gap-5"
              initial={{ opacity: 0, y: 21 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.809, delay: 0.55 }}
            >
              <Link
                href="/diagnostic"
                className="group relative inline-flex items-center gap-3 bg-accent text-primary-foreground px-8 py-4 font-medium overflow-hidden"
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
                href="/work"
                className="group inline-flex items-center gap-3 border border-border-medium px-8 py-4 font-medium text-text-primary hover:border-accent transition-colors duration-500"
                data-hover
              >
                View Work
                <span className="text-accent">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Right column - Stats in Fibonacci proportions */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.309, delay: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className="relative">
              {/* Stats arranged in golden spiral pattern */}
              <div className="space-y-8">
                {[
                  { value: 127, suffix: 'M+', label: 'KES Revenue Influenced', delay: 0.13 },
                  { value: 340, suffix: '%', label: 'Average Traffic Increase', delay: 0.21 },
                  { value: 73, suffix: '%', label: 'Sites Losing to Broken Infrastructure', delay: 0.34 },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    className="relative pl-8 border-l border-border-subtle hover:border-accent transition-colors duration-500"
                    initial={{ opacity: 0, x: 21 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.89 + stat.delay, duration: 0.809 }}
                  >
                    <div className="font-display text-4xl text-accent">
                      <FibCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="font-mono text-xs uppercase tracking-wider text-text-tertiary mt-2">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Decorative spiral element */}
              <motion.div
                className="absolute -right-8 top-1/2 -translate-y-1/2 w-21 h-21 border border-accent/20"
                style={{ borderRadius: '50%' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 21, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-accent -translate-x-1/2 -translate-y-1/2" style={{ borderRadius: '50%' }} />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: -21 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.309 }}
      >
        <span className="font-mono text-xs text-text-tertiary uppercase tracking-widest">Scroll</span>
        <motion.div
          className="w-px h-13 bg-border-medium relative overflow-hidden"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2.618, repeat: Infinity }}
        >
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-accent"
            animate={{ y: ['0%', '200%'] }}
            transition={{ duration: 1.618, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
