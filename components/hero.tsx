'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

function useCountUp(target: number, duration: number = 1800, delay: number = 400) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setHasStarted(true)
      const startTime = performance.now()
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // easeOutCubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.floor(eased * target))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(target)
        }
      }
      
      requestAnimationFrame(animate)
    }, delay)

    return () => clearTimeout(delayTimer)
  }, [target, duration, delay])

  return { count, hasStarted }
}

export function Hero() {
  const { count: revenue } = useCountUp(3200000, 1800, 400)
  const { count: systems } = useCountUp(47, 1800, 400)
  const { count: multiplier } = useCountUp(31, 1800, 400) // 3.1 * 10
  const { count: uptime } = useCountUp(100, 1800, 400)

  const formatRevenue = (value: number) => {
    if (value >= 1000000) {
      return `KES ${(value / 1000000).toFixed(1)}M`
    }
    return `KES ${value.toLocaleString()}`
  }

  return (
    <section className="w-full bg-paper pt-20 pb-16">
      <div className="mx-auto max-w-[1100px] px-6">
        <p className="font-sans text-[0.92rem] leading-relaxed text-ink-muted max-w-2xl mb-8">
          DRD Digital is a Mombasa-based digital infrastructure firm that builds authority websites, AI-powered business systems, and payment automation for corporate enterprises across Kenya and East Africa. Founded under the DR.DULLU brand by Ian Dullu, DRD Digital specialises in closing the infrastructure gap that causes East African businesses to lose revenue, leads, and market authority.
        </p>

        <h1 className="font-display text-[clamp(2.2rem,4.5vw,3.4rem)] font-bold leading-[1.1] text-ink max-w-4xl text-balance">
          Your business isn&apos;t failing the market. It&apos;s failing the infrastructure.
        </h1>
        
        <p className="mt-6 font-sans text-[0.92rem] leading-relaxed text-ink-muted max-w-2xl">
          We build the systems that let African enterprises collect money without friction, capture leads without chasing, and project authority without apology.
        </p>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <Counter label="Revenue automated" value={formatRevenue(revenue)} />
          <Counter label="Systems deployed" value={systems.toString()} />
          <Counter label="Average ROI" value={`${(multiplier / 10).toFixed(1)}×`} />
          <Counter label="System uptime" value={`${uptime}%`} />
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link 
            href="/diagnostic"
            className="inline-flex items-center justify-center bg-ink px-6 py-3 font-sans text-[0.82rem] font-medium tracking-[0.02em] text-paper transition-all duration-200 hover:bg-signal hover:text-ink active:scale-[0.97]"
          >
            Diagnose My Business — Free
          </Link>
          <Link 
            href="/work"
            className="inline-flex items-center justify-center border border-ink-faint px-6 py-3 font-sans text-[0.82rem] font-medium tracking-[0.02em] text-ink transition-all duration-200 hover:border-ink-medium"
          >
            See the Evidence →
          </Link>
        </div>
      </div>
    </section>
  )
}

function Counter({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </span>
      <span className="font-display text-2xl font-bold text-ink">
        {value}
      </span>
    </div>
  )
}
