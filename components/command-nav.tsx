'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { 
    href: '/', 
    label: 'System', 
    shortcut: 'S',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    )
  },
  { 
    href: '/work', 
    label: 'Projects', 
    shortcut: 'P',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    )
  },
  { 
    href: '/research', 
    label: 'Insights', 
    shortcut: 'I',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  { 
    href: '/diagnostic', 
    label: 'Diagnose', 
    shortcut: 'D',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
]

export function CommandNav() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        const item = navItems.find(i => i.shortcut.toLowerCase() === e.key.toLowerCase())
        if (item) {
          e.preventDefault()
          window.location.href = item.href
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {/* Top brand mark */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 border border-border-subtle" />
            <span className="font-mono text-signal text-sm font-medium">DRD</span>
          </div>
          <div className="hidden md:block">
            <span className="text-xs font-mono text-text-tertiary uppercase tracking-widest">Digital Infrastructure</span>
          </div>
        </Link>
      </motion.div>

      {/* Command dock */}
      <motion.nav
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => {
          setIsExpanded(false)
          setHoveredItem(null)
        }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="relative">
          {/* Glow effect behind */}
          <div className="absolute inset-0 bg-signal/5 blur-2xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Main dock */}
          <motion.div 
            layout
            className="relative flex items-center gap-1 px-2 py-2 bg-surface/80 backdrop-blur-xl border border-border-subtle"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const isHovered = hoveredItem === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="relative group"
                >
                  <motion.div
                    layout
                    className={`
                      relative flex items-center gap-2 px-3 py-2 transition-colors duration-200
                      ${isActive ? 'text-signal' : 'text-text-secondary hover:text-text-primary'}
                    `}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-signal/10 border border-signal/30"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    {/* Hover indicator */}
                    <AnimatePresence>
                      {isHovered && !isActive && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-surface-elevated"
                        />
                      )}
                    </AnimatePresence>
                    
                    <span className="relative z-10">{item.icon}</span>
                    
                    <AnimatePresence>
                      {(isExpanded || isActive) && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="relative z-10 text-sm font-medium whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    
                    {/* Keyboard shortcut hint */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="relative z-10 ml-1 text-[10px] font-mono text-text-tertiary bg-ink px-1.5 py-0.5"
                        >
                          {'\u2318'}{item.shortcut}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              )
            })}

            {/* Separator */}
            <div className="w-px h-6 bg-border-subtle mx-1" />

            {/* Action button */}
            <Link
              href="/diagnostic"
              className="relative flex items-center gap-2 px-4 py-2 bg-signal text-void font-medium text-sm transition-all hover:bg-signal/90 group"
            >
              <span>Start</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 transition-transform group-hover:translate-x-0.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Right side info */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="fixed top-6 right-6 z-50 hidden lg:flex items-center gap-6"
      >
        <div className="flex items-center gap-2 text-xs font-mono text-text-tertiary">
          <span className="w-1.5 h-1.5 bg-signal animate-pulse" />
          <span>MSA, KENYA</span>
        </div>
      </motion.div>
    </>
  )
}
