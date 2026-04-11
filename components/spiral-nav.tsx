'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const GOLDEN_ANGLE = 137.5077640500378
const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]

const navItems = [
  { label: 'Home', href: '/', key: 'H' },
  { label: 'Work', href: '/work', key: 'W' },
  { label: 'Research', href: '/research', key: 'R' },
  { label: 'Diagnostic', href: '/diagnostic', key: 'D' },
]

export function SpiralNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
      if (e.metaKey || e.ctrlKey) {
        const item = navItems.find(i => i.key.toLowerCase() === e.key.toLowerCase())
        if (item) {
          e.preventDefault()
          window.location.href = item.href
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const isScrolled = scrollY > 50

  return (
    <>
      {/* Floating trigger - positioned like a seed that grows */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 flex items-center justify-center bg-surface border border-border-subtle"
        data-hover
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          top: isScrolled ? 24 : 40,
          right: isScrolled ? 24 : 40,
          width: isScrolled ? 48 : 56,
          height: isScrolled ? 48 : 56,
        }}
        transition={{ 
          type: 'spring',
          damping: 21,
          stiffness: 89,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="relative"
          animate={{ rotate: isOpen ? 137.5 : 0 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {/* Fibonacci spiral icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <motion.path
              d="M12 12 Q12 4 20 4 Q20 12 12 12 Q12 17 7 17 Q7 12 12 12"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isOpen ? 1 : 0.6 }}
              transition={{ duration: 0.809 }}
            />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
        </motion.div>
      </motion.button>

      {/* Logo - top left, minimal */}
      <motion.div
        className="fixed top-8 left-8 z-50"
        initial={{ opacity: 0, x: -21 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.21, duration: 0.809 }}
      >
        <Link href="/" className="group" data-hover>
          <span className="font-display text-lg tracking-tight text-text-primary">
            DRD
          </span>
          <span className="font-display text-lg tracking-tight text-accent ml-1">
            Digital
          </span>
          <motion.span
            className="block h-px bg-accent mt-1 origin-left"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
          />
        </Link>
      </motion.div>

      {/* Full screen spiral navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-paper/98 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Background Fibonacci spiral */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <motion.svg
                viewBox="0 0 500 500"
                className="w-[150vh] h-[150vh] opacity-[0.03]"
                initial={{ rotate: 0, scale: 0.8 }}
                animate={{ rotate: 360, scale: 1 }}
                transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
              >
                <motion.path
                  d="M250 250 
                     Q250 50 450 50 
                     Q450 250 250 250 
                     Q250 375 125 375 
                     Q125 250 250 250
                     Q250 175 325 175
                     Q325 250 250 250
                     Q250 296 204 296
                     Q204 250 250 250"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-accent"
                />
              </motion.svg>
            </div>

            {/* Nav items positioned in spiral pattern */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative" style={{ width: 400, height: 400 }}>
                {navItems.map((item, index) => {
                  const angle = (index * GOLDEN_ANGLE * Math.PI) / 180
                  const radius = 89 + index * 34 // Fibonacci-based radius
                  const x = Math.cos(angle) * radius
                  const y = Math.sin(angle) * radius
                  const isActive = pathname === item.href

                  return (
                    <motion.div
                      key={item.href}
                      className="absolute"
                      style={{ 
                        left: '50%', 
                        top: '50%',
                      }}
                      initial={{ 
                        x: 0, 
                        y: 0, 
                        opacity: 0,
                        scale: 0 
                      }}
                      animate={{ 
                        x, 
                        y, 
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{ 
                        x: 0, 
                        y: 0, 
                        opacity: 0,
                        scale: 0 
                      }}
                      transition={{ 
                        delay: index * 0.089,
                        duration: 0.809,
                        type: 'spring',
                        damping: 21,
                        stiffness: 89,
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="group block -translate-x-1/2 -translate-y-1/2"
                        data-hover
                      >
                        <motion.div
                          className={`
                            relative px-8 py-4 text-center
                            ${isActive ? 'text-accent' : 'text-text-primary'}
                          `}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* Fibonacci rectangle background */}
                          <motion.div
                            className="absolute inset-0 border border-border-subtle bg-surface"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            style={{ 
                              // Golden rectangle proportions
                              aspectRatio: '1.618 / 1',
                            }}
                          />
                          
                          <span className="relative font-display text-2xl tracking-tight">
                            {item.label}
                          </span>
                          
                          <span className="relative block font-mono text-xs text-text-tertiary mt-1">
                            CMD + {item.key}
                          </span>

                          {isActive && (
                            <motion.div
                              className="absolute -bottom-1 left-1/2 w-8 h-0.5 bg-accent -translate-x-1/2"
                              layoutId="nav-indicator"
                            />
                          )}
                        </motion.div>
                      </Link>
                    </motion.div>
                  )
                })}

                {/* Center point */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.34 }}
                >
                  <div className="w-3 h-3 bg-accent" style={{ borderRadius: '50%' }} />
                  <motion.div
                    className="absolute inset-0 border border-accent"
                    style={{ borderRadius: '50%' }}
                    animate={{ scale: [1, 1.618, 1] }}
                    transition={{ duration: 2.618, repeat: Infinity }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Footer info */}
            <motion.div
              className="absolute bottom-8 left-8 right-8 flex justify-between items-end font-mono text-xs text-text-tertiary"
              initial={{ opacity: 0, y: 21 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <span>Mombasa, Kenya</span>
              <span>Digital Infrastructure</span>
              <span>Press ESC to close</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
