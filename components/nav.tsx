'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Nav() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  return (
    <nav className="w-full bg-paper">
      <div className="mx-auto max-w-[1100px] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold text-ink">
          DRD Digital
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <NavLink 
            href="/work" 
            isHovered={hoveredLink === 'work'}
            onHover={() => setHoveredLink('work')}
            onLeave={() => setHoveredLink(null)}
          >
            Work
          </NavLink>
          <NavLink 
            href="/research" 
            isHovered={hoveredLink === 'research'}
            onHover={() => setHoveredLink('research')}
            onLeave={() => setHoveredLink(null)}
          >
            Research
          </NavLink>
          <Link 
            href="/diagnostic"
            className="bg-signal px-5 py-2.5 font-sans text-[0.82rem] font-medium tracking-[0.02em] text-ink transition-colors duration-200 hover:bg-ink hover:text-paper"
          >
            Free Diagnostic
          </Link>
        </div>

        <Link 
          href="/diagnostic"
          className="md:hidden bg-signal px-4 py-2 font-sans text-[0.82rem] font-medium tracking-[0.02em] text-ink"
        >
          Free Diagnostic
        </Link>
      </div>
    </nav>
  )
}

function NavLink({ 
  href, 
  children, 
  isHovered, 
  onHover, 
  onLeave 
}: { 
  href: string
  children: React.ReactNode
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}) {
  return (
    <Link 
      href={href}
      className="relative font-sans text-[0.92rem] text-ink-muted transition-colors duration-200 hover:text-ink"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {children}
      <span 
        className="absolute -bottom-1 left-0 h-px bg-signal transition-all duration-300 ease-out"
        style={{ 
          width: isHovered ? '100%' : '0%',
        }}
      />
    </Link>
  )
}
