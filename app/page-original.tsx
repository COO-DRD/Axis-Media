import { FibonacciCursor } from '@/components/fibonacci-cursor'
import { SpiralNav } from '@/components/spiral-nav'
import { SpiralHero } from '@/components/spiral-hero'
import { ProblemSpiral } from '@/components/problem-spiral'
import { SolutionUnfold } from '@/components/solution-unfold'
import { CaseStudyRiver } from '@/components/case-study-river'
import { SpiralCTA } from '@/components/spiral-cta'
import { GoldenFooter } from '@/components/golden-footer'

export default function Home() {
  return (
    <main className="relative grain">
      <FibonacciCursor />
      <SpiralNav />
      <SpiralHero />
      <ProblemSpiral />
      <SolutionUnfold />
      <CaseStudyRiver />
      <SpiralCTA />
      <GoldenFooter />
    </main>
  )
}
