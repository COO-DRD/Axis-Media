// ============================================================================
// Optimized Spiral Hero
// Uses CSS scroll-driven animations instead of Framer Motion useScroll
// Much more performant for 1000+ simultaneous users
// ============================================================================

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Simple counter without complex easing
function OptimizedCounter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          // Simple linear animation - 1.5s duration
          const duration = 1500
          const steps = 30
          const stepDuration = duration / steps
          let step = 0

          const timer = setInterval(() => {
            step++
            const progress = step / steps
            setCount(Math.floor(progress * end))
            
            if (step >= steps) {
              setCount(end)
              clearInterval(timer)
            }
          }, stepDuration)

          observer.disconnect()
        }
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, hasAnimated])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

export function SpiralHero() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Respect user's motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Static content for reduced motion or initial render
  const staticSpiral = prefersReducedMotion ? {} : undefined

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        // CSS scroll-driven animation for background
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Fibonacci grid background - CSS only */}
      <div className="absolute inset-0 golden-grid opacity-50" />
      
      {/* Simplified spiral background - CSS animation instead of scroll-linked */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          animation: prefersReducedMotion ? 'none' : 'spiralPulse 20s ease-in-out infinite',
        }}
      >
        <svg
          viewBox="0 0 610 377"
          className="w-[90vw] max-w-5xl h-auto"
          fill="none"
          style={{ opacity: 0.6 }}
        >
          {/* Simplified golden rectangles - static paths */}
          <rect
            x="0" y="0" width="377" height="377"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-border-medium"
            fill="none"
          />
          <rect
            x="377" y="0" width="233" height="233"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-border-medium"
            fill="none"
          />
          <rect
            x="377" y="233" width="144" height="144"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-border-medium"
            fill="none"
          />
          <rect
            x="521" y="233" width="89" height="89"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-border-medium"
            fill="none"
          />
          
          {/* Simplified spiral path */}
          <path
            d="M377 377 Q377 0, 0 0 M377 377 Q377 144, 610 144 M377 377 Q377 521, 233 521 M377 377 Q377 322, 432 322"
            stroke="currentColor"
            strokeWidth="1"
            className="text-accent"
            fill="none"
            style={{ opacity: 0.8 }}
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-8">
        <div className="grid lg:grid-cols-[1fr_0.618fr] gap-21 items-center">
          {/* Left column */}
          <div>
            {/* Label */}
            <motion.div
              className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-8 h-px bg-accent" />
              <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
                Digital Infrastructure
              </span>
            </motion.div>

            {/* Headline - staggered reveal */}
            <motion.h1
              className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] text-text-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="block">We build the</span>
              <span className="block text-accent">digital backbone</span>
              <span className="block">African enterprises</span>
              <span className="block text-text-secondary text-4xl md:text-5xl lg:text-6xl">deserve.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="mt-8 text-lg text-text-secondary max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Authority websites. Payment automation. AI-powered systems. 
              We close the infrastructure gap that costs East African businesses 
              revenue, leads, and market position.
            </motion.p>

            {/* CTA Buttons - optimized, no infinite animations */}
            <motion.div
              className="mt-13 flex flex-wrap gap-5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link
                href="/diagnostic"
                className="group relative inline-flex items-center gap-3 bg-accent text-primary-foreground px-8 py-4 font-medium overflow-hidden hover:bg-accent-light transition-colors duration-300"
                data-hover
              >
                <span>Start Diagnostic</span>
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  fill="none"
                  className="group-hover:translate-x-1 transition-transform duration-300"
                >
                  <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </Link>

              <Link
                href="/work"
                className="group inline-flex items-center gap-3 border border-border-medium px-8 py-4 font-medium text-text-primary hover:border-accent transition-colors duration-300"
                data-hover
              >
                View Work
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20" 
                  fill="none"
                  className="text-accent group-hover:translate-x-1 transition-transform duration-300"
                >
                  <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </Link>
            </motion.div>
          </div>

          {/* Right column - Stats with Image */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative">
              {/* Architectural image */}
              <div className="relative mb-8 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80"
                  alt="Nairobi Kenya modern architecture skyline glass towers business district"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-paper/60 to-transparent" />
              </div>

              <div className="space-y-8">
                {[
                  { value: 127, suffix: 'M+', label: 'KES Revenue Influenced' },
                  { value: 340, suffix: '%', label: 'Average Traffic Increase' },
                  { value: 73, suffix: '%', label: 'Sites Losing to Broken Infrastructure' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    className="relative pl-8 border-l border-border-subtle hover:border-accent transition-colors duration-300"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                  >
                    <div className="font-display text-4xl text-accent">
                      <OptimizedCounter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="font-mono text-xs uppercase tracking-wider text-text-tertiary mt-2">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Static decorative element instead of rotating */}
              <div
                className="absolute -right-8 top-1/2 -translate-y-1/2 w-21 h-21 border border-accent/20 rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - CSS only */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{
          animation: prefersReducedMotion ? 'none' : 'fadeInUp 0.5s ease-out 1s both',
        }}
      >
        <span className="font-mono text-xs text-text-tertiary uppercase tracking-widest">Scroll</span>
        <div className="w-px h-13 bg-border-medium relative overflow-hidden">
          <div 
            className="absolute inset-x-0 top-0 h-1/2 bg-accent"
            style={{
              animation: prefersReducedMotion ? 'none' : 'scrollIndicator 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      {/* CSS animations */}
      <style jsx global>{`
        @keyframes spiralPulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
          50% { transform: scale(1.05) rotate(2deg); opacity: 0.8; }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scrollIndicator {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(0); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  )
}
