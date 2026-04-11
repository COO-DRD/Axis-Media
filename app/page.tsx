// ============================================================================
// Optimized Home Page
// Code-splitting, lazy loading, and reduced motion for 1000+ users
// ============================================================================

import { Suspense, lazy } from 'react'

// Eager load above-fold components
import { SpiralNav } from '@/components/spiral-nav'
import { SpiralHero } from '@/components/spiral-hero-optimized'
import { FibonacciCursorClient } from '@/components/fibonacci-cursor-client'
import { PartnerLogos } from '@/components/partner-logos'

// Lazy load below-fold components
const ProblemSpiral = lazy(() => import('@/components/problem-spiral').then(m => ({ default: m.ProblemSpiral })))
const SolutionUnfold = lazy(() => import('@/components/solution-unfold-optimized').then(m => ({ default: m.SolutionUnfold })))
const CaseStudyRiver = lazy(() => import('@/components/case-study-river').then(m => ({ default: m.CaseStudyRiver })))
const SpiralCTA = lazy(() => import('@/components/spiral-cta').then(m => ({ default: m.SpiralCTA })))
const GoldenFooter = lazy(() => import('@/components/golden-footer').then(m => ({ default: m.GoldenFooter })))

// Loading placeholder
function SectionLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
    </div>
  )
}

export default function Home() {
  return (
    <main className="relative grain">
      {/* Cursor - client only */}
      <FibonacciCursorClient />
      
      {/* Navigation - always visible */}
      <SpiralNav />
      
      {/* Hero - above fold, eager load */}
      <SpiralHero />
      
      {/* Below fold - lazy loaded with suspense */}
      <Suspense fallback={<SectionLoader />}>
        <ProblemSpiral />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <SolutionUnfold />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <CaseStudyRiver />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <SpiralCTA />
      </Suspense>
      
      {/* Partner logos strip */}
      <PartnerLogos />
      
      <Suspense fallback={<SectionLoader />}>
        <GoldenFooter />
      </Suspense>
    </main>
  )
}
