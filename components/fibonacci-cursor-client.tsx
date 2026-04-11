'use client'

import dynamic from 'next/dynamic'

// Dynamic import cursor with SSR disabled - must be in client component
const FibonacciCursor = dynamic(
  () => import('@/components/fibonacci-cursor').then(m => ({ default: m.FibonacciCursor })),
  { ssr: false }
)

export function FibonacciCursorClient() {
  return <FibonacciCursor />
}
