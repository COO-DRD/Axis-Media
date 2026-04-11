'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Work', href: '/work', num: '01' },
  { label: 'Research', href: '/research', num: '02' },
  { label: 'Diagnostic', href: '/diagnostic', num: '03' },
  { label: 'Contact', href: '/partners', num: '04' },
]

export function UnconventionalNav() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Show nav after scrolling a bit
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Floating Logo - Bottom Center (unconventional) */}
      <motion.div
        className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link 
          href="/"
          className="group flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-[var(--border)] shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {/* Animated logo mark */}
          <motion.div 
            className="relative w-10 h-10 flex items-center justify-center"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="18" fill="none" stroke="url(#logoGrad)" strokeWidth="2" />
              <text x="20" y="25" textAnchor="middle" fontSize="14" fontWeight="800" fill="#1e293b">D</text>
            </svg>
          </motion.div>
          
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[var(--text)] tracking-tight">DRD</span>
            <span className="text-[10px] text-[var(--grey)] uppercase tracking-widest">Digital</span>
          </div>
        </Link>
      </motion.div>

      {/* Radial Navigation - Orbiting dots */}
      <AnimatePresence>
        {isVisible && (
          <motion.nav
            className="fixed bottom-28 left-1/2 z-40 -translate-x-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="flex items-center gap-1 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-[var(--border)]">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <Link
                    href={item.href}
                    className={`
                      group flex items-center gap-2 px-4 py-2 rounded-full
                      transition-all duration-300
                      ${pathname === item.href 
                        ? 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white' 
                        : 'hover:bg-[var(--blue-xs)]'
                      }
                    `}
                  >
                    <span className={`
                      text-[10px] font-mono transition-colors duration-300
                      ${pathname === item.href ? 'text-white/70' : 'text-[var(--blue-md)]'}
                    `}>
                      {item.num}
                    </span>
                    <span className={`
                      text-xs font-medium tracking-wide transition-colors duration-300
                      ${pathname === item.href ? 'text-white' : 'text-[var(--text)]'}
                    `}>
                      {item.label}
                    </span>
                  </Link>
                  
                  {/* Hover indicator dot */}
                  <AnimatePresence>
                    {activeIndex === i && pathname !== item.href && (
                      <motion.div
                        className="absolute -bottom-1 left-1/2 w-1 h-1 rounded-full bg-[#8b5cf6]"
                        initial={{ scale: 0, x: '-50%' }}
                        animate={{ scale: 1, x: '-50%' }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Side indicator - Scroll progress */}
      <motion.div 
        className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        {navItems.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-3"
          >
            <motion.div
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${pathname === item.href 
                  ? 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] scale-125' 
                  : 'bg-[var(--border)] group-hover:bg-[var(--blue-md)]'
                }
              `}
              whileHover={{ scale: 1.3 }}
            />
            <span className="text-[10px] text-[var(--grey)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0">
              {item.label}
            </span>
          </Link>
        ))}
      </motion.div>

      {/* Top bar - Minimal info */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-30 px-8 py-4 flex justify-between items-center pointer-events-none"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="text-[10px] text-[var(--grey)] uppercase tracking-widest pointer-events-auto">
          Nairobi, Kenya
        </div>
        <div className="text-[10px] text-[var(--grey)] uppercase tracking-widest pointer-events-auto">
          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Nairobi' })} EAT
        </div>
      </motion.div>
    </>
  )
}
